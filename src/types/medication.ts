/**
 * Types for Medication Management System
 * نوعيات إدارة نظام الأدوية
 */

export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: number; // 1, 2, 3, or 4 times per day
  barcode?: string;
  pillsInBox: number;
  pillsRemaining: number;
  periods: MedicationPeriod[]; // morning, noon, night
  reminderEnabled: boolean;
  status: 'active' | 'completed' | 'paused';
  createdAt: Date;
  lastTaken?: Date;
  nextScheduledTime?: Date;
}

export type MedicationPeriod = 'morning' | 'noon' | 'night';

export interface MedicationDose {
  id: string;
  medicationId: string;
  scheduledTime: Date;
  actualTime?: Date;
  status: 'taken' | 'missed' | 'upcoming';
  period: MedicationPeriod;
}

export interface Barcode {
  code: string;
  format: string;
  rawValue: string;
}

export interface BarcodeData {
  barcode: string;
  medicationName: string;
  dosage: string;
  strength: string;
  pillsPerBox: number;
  manufacturer: string;
  expiryDate: string;
  batchNumber?: string;
}

export interface InventoryLog {
  medicationId: string;
  previousCount: number;
  newCount: number;
  action: 'taken' | 'refilled' | 'scanned';
  timestamp: Date;
  notes?: string;
}

export interface LowStockAlert {
  medicationId: string;
  medicationName: string;
  currentPills: number;
  totalPills: number;
  percentageRemaining: number;
  estimatedDepletionDays: number;
  severity: 'low' | 'medium' | 'high';
  alertedAt: Date;
}

export interface MedicationNotification {
  id: string;
  type: 'dose_reminder' | 'dose_taken' | 'low_stock' | 'caregiver_alert' | 'missed_dose';
  title: string;
  message: string;
  medicationId?: string;
  medicationName?: string;
  severity: 'info' | 'warning' | 'critical';
  createdAt: Date;
  read: boolean;
  targetUser: 'patient' | 'caregiver' | 'both';
}

export interface SyncEvent {
  id: string;
  type: 'medication_added' | 'dose_taken' | 'dose_missed' | 'inventory_updated' | 'alert_triggered';
  medicationId?: string;
  userId: string;
  timestamp: Date;
  data: Record<string, any>;
}
