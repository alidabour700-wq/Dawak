/**
 * Alert System Utilities
 * أدوات نظام التنبيهات
 */

import { Medication, LowStockAlert } from "@/types/medication";

/**
 * Calculate estimated depletion date
 * حساب تاريخ النفاد المتوقع
 */
export function calculateDepletionDate(
  currentPills: number,
  dailyConsumption: number
): Date {
  const remainingDays = Math.ceil(currentPills / dailyConsumption);
  const depletionDate = new Date();
  depletionDate.setDate(depletionDate.getDate() + remainingDays);
  return depletionDate;
}

/**
 * Generate alert message (Arabic)
 */
export function generateAlertMessage(
  medication: Medication,
  alert: LowStockAlert
): {
  title: string;
  userMessage: string;
  caregiverMessage: string;
} {
  const percentageStr = Math.round(alert.percentageRemaining) + "%";
  const depletionDate = calculateDepletionDate(
    medication.pillsRemaining,
    Math.ceil(medication.frequency) // Rough estimate
  );
  const depletionStr = depletionDate.toLocaleDateString("ar-EG");

  return {
    title:
      alert.severity === "high"
        ? `🚨 خطر: ${medication.name} نفد!`
        : `⚠️ تحذير: ${medication.name} ناقص`,

    userMessage:
      alert.severity === "high"
        ? `دواء ${medication.name} سينتهي قريباً جداً! متبقي ${alert.currentPills} قرص فقط. الرجاء شراء عبوة جديدة على الفور.`
        : `مخزون ${medication.name} ناقص. متبقي ${alert.currentPills} من ${alert.totalPills} أقراص (${percentageStr}). سينتهي حوالي ${depletionStr}.`,

    caregiverMessage:
      alert.severity === "high"
        ? `🚨 حالة طارئة: مخزون ${medication.name} بالمريض نفد! متبقي ${alert.currentPills} قرص فقط. يحتاج شراء فوراً.`
        : `تنبيه: مخزون ${medication.name} منخفض (${alert.currentPills}/${alert.totalPills}). سينتهي في حوالي ${alert.estimatedDepletionDays} أيام.`,
  };
}

/**
 * Should trigger reminder notification
 * هل يجب تشغيل إخطار التذكير
 */
export function shouldTriggerReminder(
  lastReminderTime?: Date,
  reminderIntervalMinutes: number = 15
): boolean {
  if (!lastReminderTime) return true;

  const now = new Date();
  const minutesSinceLastReminder =
    (now.getTime() - lastReminderTime.getTime()) / (1000 * 60);

  return minutesSinceLastReminder >= reminderIntervalMinutes;
}

/**
 * Check if alert should be suppressed (avoid spam)
 */
export function shouldSuppressAlert(
  lastAlertTime?: Date,
  suppressionMinutes: number = 60
): boolean {
  if (!lastAlertTime) return false;

  const now = new Date();
  const minutesSinceLastAlert =
    (now.getTime() - lastAlertTime.getTime()) / (1000 * 60);

  return minutesSinceLastAlert < suppressionMinutes;
}
