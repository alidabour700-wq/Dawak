/**
 * Notification Service
 * خدمة الإشعارات
 * 
 * Manages all notifications for patient and caregiver
 */

import {
  MedicationNotification,
  Medication,
  MedicationDose,
  LowStockAlert,
} from "@/types/medication";

const NOTIFICATIONS: MedicationNotification[] = [];
const NOTIFICATION_CALLBACKS: Map<string, Function[]> = new Map();

/**
 * Create and store a notification
 */
function createNotification(
  type: MedicationNotification["type"],
  title: string,
  message: string,
  targetUser: MedicationNotification["targetUser"] = "patient",
  severity: MedicationNotification["severity"] = "info",
  medicationId?: string,
  medicationName?: string
): MedicationNotification {
  const notification: MedicationNotification = {
    id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    title,
    message,
    medicationId,
    medicationName,
    severity,
    createdAt: new Date(),
    read: false,
    targetUser,
  };

  NOTIFICATIONS.push(notification);
  triggerNotificationCallback(type, notification);

  console.log(`📢 Notification created:`, notification);
  return notification;
}

/**
 * Notify when dose is due (for patient)
 * إشعار عندما تكون الجرعة حان موعدها
 */
export function notifyDoseReminder(
  medication: Medication,
  dose: MedicationDose,
  minutesBefore: number = 0
): MedicationNotification {
  const timeStr = dose.scheduledTime.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return createNotification(
    "dose_reminder",
    `💊 تذكير: ${medication.name}`,
    `حان وقت تناول جرعتك من ${medication.name} (${medication.dosage}) في ${timeStr}`,
    "patient",
    "info",
    medication.id,
    medication.name
  );
}

/**
 * Notify when patient takes a dose (for caregiver)
 * إخطار المُراقِب عند تناول المريض للجرعة
 */
export function notifyDoseTaken(
  medication: Medication,
  patientName: string
): MedicationNotification {
  return createNotification(
    "dose_taken",
    `✅ تم تناول الدواء`,
    `${patientName} تناول/تناولت جرعة من ${medication.name} (${medication.dosage})`,
    "caregiver",
    "info",
    medication.id,
    medication.name
  );
}

/**
 * Notify about missed dose
 */
export function notifyMissedDose(
  medication: Medication,
  patientName: string,
  scheduledTime: Date
): MedicationNotification {
  const timeStr = scheduledTime.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return createNotification(
    "missed_dose",
    `⚠️ جرعة فائتة`,
    `${patientName} لم يتناول جرعة ${medication.name} المقررة في ${timeStr}`,
    "both",
    "warning",
    medication.id,
    medication.name
  );
}

/**
 * Notify about low stock (for both)
 * إشعار نقص المخزون
 */
export function notifyLowStock(alert: LowStockAlert): MedicationNotification {
  const message =
    alert.severity === "high"
      ? `🚨 ${alert.medicationName} نفد! متبقي ${alert.currentPills} أقراص فقط. سيكون نافذاً خلال ${alert.estimatedDepletionDays} أيام.`
      : `⚠️ ${alert.medicationName} نفد! متبقي ${alert.currentPills} من ${alert.totalPills} أقراص (${alert.percentageRemaining}%).`;

  return createNotification(
    "low_stock",
    `مخزون منخفض: ${alert.medicationName}`,
    message,
    "both",
    alert.severity === "high" ? "critical" : "warning",
    alert.medicationId,
    alert.medicationName
  );
}

/**
 * Notify caregiver about important event
 */
export function notifyCaregiverAlert(
  title: string,
  message: string,
  medicationName?: string,
  severity: "info" | "warning" | "critical" = "info"
): MedicationNotification {
  return createNotification(
    "caregiver_alert",
    title,
    message,
    "caregiver",
    severity,
    undefined,
    medicationName
  );
}

/**
 * Get all notifications
 */
export function getAllNotifications(): MedicationNotification[] {
  return [...NOTIFICATIONS].sort(
    (a, b) => b.createdAt.getTime() - a.createdAt.getTime()
  );
}

/**
 * Get unread notifications
 */
export function getUnreadNotifications(): MedicationNotification[] {
  return NOTIFICATIONS.filter((n) => !n.read);
}

/**
 * Get notifications for target user
 */
export function getNotificationsFor(
  targetUser: "patient" | "caregiver"
): MedicationNotification[] {
  return NOTIFICATIONS.filter(
    (n) => n.targetUser === targetUser || n.targetUser === "both"
  ).sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
}

/**
 * Mark notification as read
 */
export function markAsRead(notificationId: string): void {
  const notif = NOTIFICATIONS.find((n) => n.id === notificationId);
  if (notif) {
    notif.read = true;
  }
}

/**
 * Clear old notifications (older than X days)
 */
export function clearOldNotifications(daysOld: number = 7): number {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - daysOld);

  const initialLength = NOTIFICATIONS.length;
  const index = NOTIFICATIONS.findIndex((n) => n.createdAt < cutoffDate);

  if (index !== -1) {
    NOTIFICATIONS.splice(0, index);
  }

  return initialLength - NOTIFICATIONS.length;
}

/**
 * Register callback for notification events
 * Subscribe to notification events
 */
export function onNotification(
  type: MedicationNotification["type"],
  callback: (notification: MedicationNotification) => void
): () => void {
  if (!NOTIFICATION_CALLBACKS.has(type)) {
    NOTIFICATION_CALLBACKS.set(type, []);
  }

  NOTIFICATION_CALLBACKS.get(type)!.push(callback);

  // Return unsubscribe function
  return () => {
    const callbacks = NOTIFICATION_CALLBACKS.get(type);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
      }
    }
  };
}

/**
 * Trigger notification callbacks
 */
function triggerNotificationCallback(
  type: MedicationNotification["type"],
  notification: MedicationNotification
): void {
  const callbacks = NOTIFICATION_CALLBACKS.get(type);
  if (callbacks) {
    callbacks.forEach((cb) => cb(notification));
  }
}
