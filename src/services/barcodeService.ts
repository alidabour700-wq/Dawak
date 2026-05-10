/**
 * Barcode Service
 * خدمة الأكواد الشريطية
 * 
 * Handles barcode scanning and medication data lookup
 */

import { BarcodeData } from "@/types/medication";

// Mock database of pharmaceutical barcodes
const BARCODE_DATABASE: Map<string, BarcodeData> = new Map([
  [
    "5901234123457",
    {
      barcode: "5901234123457",
      medicationName: "باراسيتامول",
      dosage: "500 مج",
      strength: "500mg",
      pillsPerBox: 30,
      manufacturer: "فارما إيجيبت",
      expiryDate: "2025-12-31",
      batchNumber: "BAT2026001",
    },
  ],
  [
    "5901234123458",
    {
      barcode: "5901234123458",
      medicationName: "أملوديبين",
      dosage: "5 مج",
      strength: "5mg",
      pillsPerBox: 30,
      manufacturer: "فارما إيجيبت",
      expiryDate: "2026-06-30",
      batchNumber: "BAT2026002",
    },
  ],
  [
    "5901234123459",
    {
      barcode: "5901234123459",
      medicationName: "ميتفورمين",
      dosage: "850 مج",
      strength: "850mg",
      pillsPerBox: 60,
      manufacturer: "فارما إيجيبت",
      expiryDate: "2025-09-30",
      batchNumber: "BAT2026003",
    },
  ],
  [
    "5901234123460",
    {
      barcode: "5901234123460",
      medicationName: "أتورفاستاتين",
      dosage: "40 مج",
      strength: "40mg",
      pillsPerBox: 30,
      manufacturer: "فارما إيجيبت",
      expiryDate: "2026-03-31",
      batchNumber: "BAT2026004",
    },
  ],
  [
    "5901234123461",
    {
      barcode: "5901234123461",
      medicationName: "بانادول إكسترا",
      dosage: "500 مج",
      strength: "500mg + Caffeine",
      pillsPerBox: 20,
      manufacturer: "GlaxoSmithKline",
      expiryDate: "2026-08-31",
    },
  ],
  [
    "5901234123462",
    {
      barcode: "5901234123462",
      medicationName: "بيتادرم",
      dosage: "كريم موضعي",
      strength: "Betamethasone",
      pillsPerBox: 1,
      manufacturer: "فارما إيجيبت",
      expiryDate: "2025-11-30",
    },
  ],
]);

/**
 * Scan and decode barcode
 * فحص وفك شفرة الرمز
 */
export async function scanBarcode(
  barcodeValue: string
): Promise<{ success: boolean; data?: BarcodeData; error?: string }> {
  try {
    // Clean and normalize barcode
    const cleanBarcode = barcodeValue.trim().replace(/[^0-9]/g, "");

    if (cleanBarcode.length === 0) {
      return { success: false, error: "الرمز فارغ" };
    }

    // Lookup in database
    const medicationData = BARCODE_DATABASE.get(cleanBarcode);

    if (!medicationData) {
      return {
        success: false,
        error: `الرمز "${cleanBarcode}" غير موجود في قاعدة البيانات`,
      };
    }

    // Check expiry
    const expiryDate = new Date(medicationData.expiryDate);
    if (expiryDate < new Date()) {
      return {
        success: false,
        error: `الدواء منتهي الصلاحية (${medicationData.expiryDate})`,
      };
    }

    console.log("✅ Barcode scanned:", medicationData);
    return { success: true, data: medicationData };
  } catch (error) {
    return { success: false, error: "خطأ في معالجة الرمز" };
  }
}

/**
 * Add custom medication to barcode database
 * إضافة دواء مخصص لقاعدة بيانات الأكواس
 */
export function addBarcodeEntry(
  barcode: string,
  data: BarcodeData
): { success: boolean; message: string } {
  const cleanBarcode = barcode.trim().replace(/[^0-9]/g, "");

  if (BARCODE_DATABASE.has(cleanBarcode)) {
    return { success: false, message: "هذا الرمز موجود بالفعل" };
  }

  BARCODE_DATABASE.set(cleanBarcode, { ...data, barcode: cleanBarcode });
  console.log("✅ Barcode entry added:", cleanBarcode);
  return { success: true, message: "تمت إضافة الرمز بنجاح" };
}

/**
 * Get medication by barcode
 */
export function getMedicationByBarcode(
  barcode: string
): BarcodeData | undefined {
  const cleanBarcode = barcode.trim().replace(/[^0-9]/g, "");
  return BARCODE_DATABASE.get(cleanBarcode);
}

/**
 * Get all registered barcodes
 */
export function getAllBarcodes(): BarcodeData[] {
  return Array.from(BARCODE_DATABASE.values());
}
