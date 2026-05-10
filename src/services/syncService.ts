/**
 * Real-time Sync Service
 * خدمة المزامنة الفعلية
 * 
 * Manages real-time synchronization between patient and caregiver
 * Uses WebSocket-like pattern (can be upgraded to real WebSocket)
 */

import { SyncEvent, MedicationDose, Medication } from "@/types/medication";

type SyncEventType =
  | "medication_added"
  | "dose_taken"
  | "dose_missed"
  | "inventory_updated"
  | "alert_triggered"
  | "medication_refilled";

const SYNC_QUEUE: SyncEvent[] = [];
const SYNC_SUBSCRIBERS: Map<string, Function[]> = new Map();
const SYNC_HISTORY: SyncEvent[] = [];

/**
 * Emit a sync event
 * إصدار حدث مزامنة
 */
export function emitSyncEvent(
  type: SyncEventType,
  userId: string,
  data: Record<string, any>,
  medicationId?: string
): SyncEvent {
  const event: SyncEvent = {
    id: `sync_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    type,
    medicationId,
    userId,
    timestamp: new Date(),
    data,
  };

  SYNC_QUEUE.push(event);
  SYNC_HISTORY.push(event);
  broadcastSyncEvent(event);

  console.log("🔄 Sync event emitted:", event);
  return event;
}

/**
 * Subscribe to sync events
 */
export function onSyncEvent(
  type: SyncEventType,
  callback: (event: SyncEvent) => void
): () => void {
  if (!SYNC_SUBSCRIBERS.has(type)) {
    SYNC_SUBSCRIBERS.set(type, []);
  }

  SYNC_SUBSCRIBERS.get(type)!.push(callback);

  // Return unsubscribe function
  return () => {
    const callbacks = SYNC_SUBSCRIBERS.get(type);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    }
  };
}

/**
 * Subscribe to all sync events
 */
export function onAnySync(
  callback: (event: SyncEvent) => void
): () => void {
  if (!SYNC_SUBSCRIBERS.has("*")) {
    SYNC_SUBSCRIBERS.set("*", []);
  }

  SYNC_SUBSCRIBERS.get("*")!.push(callback);

  return () => {
    const callbacks = SYNC_SUBSCRIBERS.get("*");
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) callbacks.splice(index, 1);
    }
  };
}

/**
 * Broadcast sync event to all subscribers
 */
function broadcastSyncEvent(event: SyncEvent): void {
  // Broadcast to type-specific subscribers
  const typeCallbacks = SYNC_SUBSCRIBERS.get(event.type);
  if (typeCallbacks) {
    typeCallbacks.forEach((cb) => cb(event));
  }

  // Broadcast to wildcard subscribers
  const allCallbacks = SYNC_SUBSCRIBERS.get("*");
  if (allCallbacks) {
    allCallbacks.forEach((cb) => cb(event));
  }
}

/**
 * Get sync history (for offline sync)
 */
export function getSyncHistory(hours: number = 24): SyncEvent[] {
  const cutoff = new Date();
  cutoff.setHours(cutoff.getHours() - hours);

  return SYNC_HISTORY.filter((e) => e.timestamp >= cutoff).sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );
}

/**
 * Clear sync queue (called after successful server sync)
 */
export function clearSyncQueue(): void {
  SYNC_QUEUE.length = 0;
  console.log("✅ Sync queue cleared");
}

/**
 * Get pending sync events
 */
export function getPendingSyncEvents(): SyncEvent[] {
  return [...SYNC_QUEUE];
}
