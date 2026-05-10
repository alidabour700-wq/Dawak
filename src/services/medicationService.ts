/**
 * Medication Service
 * خدمة الأدوية
 * 
 * Core service for managing medications, schedules, and doses
 */

import { Medication, MedicationDose, MedicationPeriod } from "@/types/medication";
import { calculateSchedule } from "@/utils/scheduler";
import * as notificationService from "./notificationService";
import * as inventoryService from "./inventoryService";

const MEDICATIONS_DB: Map<string, Medication> = new Map();
const DOSES_DB: Map<string, MedicationDose> = new Map();
const MEDICATION_CALLBACKS: Map<string, Function[]> = new Map();

/**
 * Add a new medication
 * إضافة دواء جديد
 */
export function addMedication(
  name: string,
  dosage: string,
  frequency: number,
  pillsInBox: number,
  periods: MedicationPeriod[]
): Medication {
  const id = `med_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const medication: Medication = {
    id,
    name,
    dosage,
    frequency,
    pillsInBox,
    pillsRemaining: pillsInBox,
    periods,
    reminderEnabled: true,
    status: "active",
    createdAt: new Date(),
  };

  MEDICATIONS_DB.set(id, medication);
  generateScheduleForMedication(medication);

  // Notify caregiver about new medication
  notificationService.notifyCaregiverAlert(
    `💊 دواء جديد تمت إضافته`,
    `تمت إضافة ${name} (${dosage}) - ${frequency}x يومياً`,
    name,
    "info"
  );

  triggerMedicationCallback("medication_added", medication);
  console.log("✅ Medication added:", medication);

  return medication;
}

/**
 * Get all active medications
 */
export function getAllMedications(): Medication[] {
  return Array.from(MEDICATIONS_DB.values()).filter(
    (m) => m.status === "active"
  );
}

/**
 * Get medication by ID
 */
export function getMedicationById(id: string): Medication | undefined {
  return MEDICATIONS_DB.get(id);
}

/**
 * Generate schedule for medication based on frequency
 * توليد جدول زمني للدواء بناءً على التكرار
 */
function generateScheduleForMedication(medication: Medication): void {
  const baseTimes = calculateSchedule(medication.frequency);

  baseTimes.forEach((time) => {
    const dose: MedicationDose = {
      id: `dose_${medication.id}_${time.getTime()}`,
      medicationId: medication.id,
      scheduledTime: time,
      status: "upcoming",
      period: getPeriodForTime(time),
    };

    DOSES_DB.set(dose.id, dose);
  });
}

/**
 * Get period based on time of day
 */
function getPeriodForTime(date: Date): MedicationPeriod {
  const hour = date.getHours();
  if (hour >= 5 && hour < 12) return "morning";
  if (hour >= 12 && hour < 17) return "noon";
  return "night";
}

/**
 * Mark dose as taken
 * تسجيل الجرعة كمأخوذة
 */
export function markDoseAsTaken(
  medicationId: string,
  doseId?: string
): { success: boolean; message: string } {
  const medication = MEDICATIONS_DB.get(medicationId);
  if (!medication) {
    return { success: false, message: "الدواء غير موجود" };
  }

  // If no specific dose, take the next upcoming one
  let dose =
    doseId && DOSES_DB.get(doseId)
      ? DOSES_DB.get(doseId)!
      : getNextScheduledDose(medicationId);

  if (!dose) {
    return { success: false, message: "لا توجد جرعة مقررة" };
  }

  if (dose.status === "taken") {
    return { success: false, message: "تم تسجيل هذه الجرعة مسبقاً" };
  }

  // Mark as taken
  dose.status = "taken";
  dose.actualTime = new Date();

  // Reduce pill count
  medication.pillsRemaining = Math.max(0, medication.pillsRemaining - 1);
  medication.lastTaken = new Date();

  // Log inventory change
  inventoryService.logInventoryChange(
    medicationId,
    medication.pillsRemaining + 1,
    medication.pillsRemaining,
    "taken"
  );

  // Check for low stock
  inventoryService.checkLowStock(medication);

  // Notify caregiver
  notificationService.notifyDoseTaken(medication, "أحمد");

  triggerMedicationCallback("dose_taken", dose);
  console.log("✅ Dose marked as taken:", dose);

  return { success: true, message: "تم تسجيل الجرعة بنجاح" };
}

/**
 * Mark dose as missed
 * تسجيل الجرعة كفائتة
 */
export function markDoseAsMissed(medicationId: string): void {
  const dose = getNextScheduledDose(medicationId);
  if (!dose) return;

  const medication = MEDICATIONS_DB.get(medicationId);
  if (!medication) return;

  dose.status = "missed";
  notificationService.notifyMissedDose(
    medication,
    "أحمد",
    dose.scheduledTime
  );

  triggerMedicationCallback("dose_missed", dose);
}

/**
 * Get next scheduled dose for medication
 */
export function getNextScheduledDose(
  medicationId: string
): MedicationDose | undefined {
  const doses = Array.from(DOSES_DB.values()).filter(
    (d) => d.medicationId === medicationId && d.status !== "taken"
  );

  return doses.sort(
    (a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime()
  )[0];
}

/**
 * Get today's doses
 */
export function getTodaysDoses(): MedicationDose[] {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  return Array.from(DOSES_DB.values())
    .filter((d) => d.scheduledTime >= today && d.scheduledTime < tomorrow)
    .sort((a, b) => a.scheduledTime.getTime() - b.scheduledTime.getTime());
}

/**
 * Get doses for a specific medication today
 */
export function getTodaysDosesForMedication(
  medicationId: string
): MedicationDose[] {
  return getTodaysDoses().filter((d) => d.medicationId === medicationId);
}

/**
 * Get dose by ID
 */
export function getDoseById(doseId: string): MedicationDose | undefined {
  return DOSES_DB.get(doseId);
}

/**
 * Pause medication
 */
export function pauseMedication(medicationId: string): void {
  const med = MEDICATIONS_DB.get(medicationId);
  if (med) {
    med.status = "paused";
    triggerMedicationCallback("medication_paused", med);
  }
}

/**
 * Resume medication
 */
export function resumeMedication(medicationId: string): void {
  const med = MEDICATIONS_DB.get(medicationId);
  if (med) {
    med.status = "active";
    triggerMedicationCallback("medication_resumed", med);
  }
}

/**
 * Refill medication (add pills)
 */
export function refillMedication(
  medicationId: string,
  pillsAdded: number
): { success: boolean; message: string } {
  const med = MEDICATIONS_DB.get(medicationId);
  if (!med) {
    return { success: false, message: "الدواء غير موجود" };
  }

  const previousCount = med.pillsRemaining;
  med.pillsRemaining = Math.min(
    med.pillsRemaining + pillsAdded,
    med.pillsInBox
  );

  inventoryService.logInventoryChange(
    medicationId,
    previousCount,
    med.pillsRemaining,
    "refilled"
  );

  notificationService.notifyCaregiverAlert(
    `🔄 تم تعبئة المخزون`,
    `تمت إعادة تعبئة ${med.name} - الآن: ${med.pillsRemaining} قرص`,
    med.name,
    "info"
  );

  triggerMedicationCallback("medication_refilled", med);

  return { success: true, message: "تم تعبئة المخزون بنجاح" };
}

/**
 * Subscribe to medication changes
 */
export function onMedicationChange(
  event: string,
  callback: Function
): () => void {
  if (!MEDICATION_CALLBACKS.has(event)) {
    MEDICATION_CALLBACKS.set(event, []);
  }

  MEDICATION_CALLBACKS.get(event)!.push(callback);

  return () => {
    const callbacks = MEDICATION_CALLBACKS.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    }
  };
}

function triggerMedicationCallback(event: string, data: any): void {
  const callbacks = MEDICATION_CALLBACKS.get(event);
  if (callbacks) {
    callbacks.forEach((cb) => cb(data));
  }
}
