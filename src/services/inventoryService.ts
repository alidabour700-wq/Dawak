/**
 * Inventory Service
 * خدمة إدارة المخزون
 * 
 * Manages pill counts, consumption rates, and low stock alerts
 */

import { Medication, InventoryLog, LowStockAlert } from "@/types/medication";
import * as notificationService from "./notificationService";

const INVENTORY_LOGS: InventoryLog[] = [];
const LOW_STOCK_ALERTS: Map<string, LowStockAlert> = new Map();
const INVENTORY_CALLBACKS: Map<string, Function[]> = new Map();

const LOW_STOCK_THRESHOLD = 0.2; // 20% of box
const CRITICAL_STOCK_THRESHOLD = 0.1; // 10% of box

/**
 * Log inventory change
 * تسجيل تغيير المخزون
 */
export function logInventoryChange(
  medicationId: string,
  previousCount: number,
  newCount: number,
  action: "taken" | "refilled" | "scanned",
  notes?: string
): InventoryLog {
  const log: InventoryLog = {
    medicationId,
    previousCount,
    newCount,
    action,
    timestamp: new Date(),
    notes,
  };

  INVENTORY_LOGS.push(log);
  triggerInventoryCallback("inventory_changed", log);

  console.log("📊 Inventory logged:", log);
  return log;
}

/**
 * Check if medication is low in stock
 * فحص إذا كان الدواء ناقصاً في المخزون
 */
export function checkLowStock(medication: Medication): LowStockAlert | null {
  const percentageRemaining =
    (medication.pillsRemaining / medication.pillsInBox) * 100;
  const consumptionRate = calculateConsumptionRate(medication.id);
  const estimatedDepletionDays = Math.ceil(
    medication.pillsRemaining / consumptionRate
  );

  // Determine severity
  let severity: "low" | "medium" | "high" = "low";
  if (percentageRemaining <= CRITICAL_STOCK_THRESHOLD) {
    severity = "high";
  } else if (percentageRemaining <= LOW_STOCK_THRESHOLD) {
    severity = "medium";
  }

  // Only alert if below threshold
  if (percentageRemaining > LOW_STOCK_THRESHOLD) {
    return null;
  }

  // Check if we already alerted today
  const existingAlert = LOW_STOCK_ALERTS.get(medication.id);
  if (
    existingAlert &&
    isToday(existingAlert.alertedAt) &&
    existingAlert.severity === severity
  ) {
    return null; // Already alerted today
  }

  const alert: LowStockAlert = {
    medicationId: medication.id,
    medicationName: medication.name,
    currentPills: medication.pillsRemaining,
    totalPills: medication.pillsInBox,
    percentageRemaining,
    estimatedDepletionDays,
    severity,
    alertedAt: new Date(),
  };

  LOW_STOCK_ALERTS.set(medication.id, alert);

  // Trigger notification
  notificationService.notifyLowStock(alert);
  triggerInventoryCallback("low_stock_alert", alert);

  console.log("⚠️ Low stock alert:", alert);
  return alert;
}

/**
 * Calculate consumption rate (pills per day)
 * حساب معدل الاستهلاك
 */
function calculateConsumptionRate(medicationId: string): number {
  // Get last 7 days of logs
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

  const recentLogs = INVENTORY_LOGS.filter(
    (log) =>
      log.medicationId === medicationId &&
      log.action === "taken" &&
      log.timestamp >= sevenDaysAgo
  );

  if (recentLogs.length === 0) return 1; // Default: 1 pill per day

  const totalConsumed = recentLogs.reduce(
    (sum, log) => sum + (log.previousCount - log.newCount),
    0
  );
  const days = Math.min(7, (Date.now() - sevenDaysAgo.getTime()) / (1000 * 60 * 60 * 24));

  return Math.max(1, Math.ceil(totalConsumed / days));
}

/**
 * Get inventory history for a medication
 */
export function getInventoryHistory(
  medicationId: string,
  days: number = 30
): InventoryLog[] {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - days);

  return INVENTORY_LOGS.filter(
    (log) =>
      log.medicationId === medicationId && log.timestamp >= cutoffDate
  ).sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

/**
 * Get all low stock alerts
 */
export function getLowStockAlerts(): LowStockAlert[] {
  return Array.from(LOW_STOCK_ALERTS.values());
}

/**
 * Get low stock alert for specific medication
 */
export function getLowStockAlert(
  medicationId: string
): LowStockAlert | null {
  return LOW_STOCK_ALERTS.get(medicationId) || null;
}

/**
 * Subscribe to inventory changes
 */
export function onInventoryChange(
  event: string,
  callback: Function
): () => void {
  if (!INVENTORY_CALLBACKS.has(event)) {
    INVENTORY_CALLBACKS.set(event, []);
  }

  INVENTORY_CALLBACKS.get(event)!.push(callback);

  return () => {
    const callbacks = INVENTORY_CALLBACKS.get(event);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    }
  };
}

function triggerInventoryCallback(event: string, data: any): void {
  const callbacks = INVENTORY_CALLBACKS.get(event);
  if (callbacks) {
    callbacks.forEach((cb) => cb(data));
  }
}

function isToday(date: Date): boolean {
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
}
