/**
 * Enhanced AddMedicationScreen with Barcode Scanner
 * 
 * Updated AddMedicationScreen with barcode scanning integrated
 * Maintains exact same UI/UX design
 */

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  ChevronRight,
  Sun,
  Cloud,
  Moon,
  Barcode,
  Loader,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { BarcodeScannerModal } from "@/components/BarcodeScannerModal";
import { useBarcodeScan } from "@/hooks/useBarcodeScan";
import { useMedications } from "@/hooks/useMedications";
import { BarcodeData } from "@/types/medication";

interface AddMedicationScreenEnhancedProps {
  onBack: () => void;
  onMedicationAdded?: (medicationId: string) => void;
}

export function AddMedicationScreenEnhanced({
  onBack,
  onMedicationAdded,
}: AddMedicationScreenEnhancedProps) {
  const scanner = useBarcodeScan();
  const { addMedication, loading: medicationLoading } = useMedications();

  // Form state
  const [medicationName, setMedicationName] = useState("");
  const [dosage, setDosage] = useState("");
  const [frequency, setFrequency] = useState(2);
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>(
    ["morning", "night"]
  );
  const [pillsInBox, setPillsInBox] = useState(30);
  const [reminderEnabled, setReminderEnabled] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  // Fill form when barcode data arrives
  useEffect(() => {
    if (scanner.lastScanned) {
      setMedicationName(scanner.lastScanned.medicationName);
      setDosage(scanner.lastScanned.dosage);
      setPillsInBox(scanner.lastScanned.pillsPerBox);
    }
  }, [scanner.lastScanned]);

  const handleSaveMedication = async () => {
    if (!medicationName.trim() || !dosage.trim()) {
      alert("يرجى ملء جميع الحقول");
      return;
    }

    setSaving(true);
    try {
      const med = addMedication(
        medicationName,
        dosage,
        frequency,
        pillsInBox,
        selectedPeriods as any
      );

      setSuccess(true);
      setTimeout(() => {
        onMedicationAdded?.(med.id);
        onBack();
      }, 1500);
    } finally {
      setSaving(false);
    }
  };

  const togglePeriod = (period: string) => {
    setSelectedPeriods((prev) =>
      prev.includes(period)
        ? prev.filter((p) => p !== period)
        : [...prev, period]
    );
  };

  if (success) {
    return (
      <motion.div
        className="flex flex-col h-[100dvh] bg-white"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="bg-emerald-600 text-white p-4 pt-8 flex items-center gap-4 sticky top-0 z-10 rounded-b-3xl shadow-md">
          <button
            onClick={onBack}
            className="w-12 h-12 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"
          >
            <ChevronRight className="w-8 h-8 rotate-180" />
          </button>
          <h1 className="text-2xl font-bold font-cairo">إضافة دواء جديد</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-6 space-y-6">
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 0.6, repeat: 2 }}
          >
            <CheckCircle2 className="w-24 h-24 text-emerald-600" />
          </motion.div>
          <div className="text-center space-y-2">
            <p className="text-2xl font-bold text-gray-900">تمت الإضافة!</p>
            <p className="text-gray-600 font-medium">{medicationName} تمت إضافته بنجاح</p>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-white">
      <div className="bg-emerald-600 text-white p-4 pt-8 flex items-center gap-4 sticky top-0 z-10 rounded-b-3xl shadow-md">
        <button
          onClick={onBack}
          className="w-12 h-12 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors"
        >
          <ChevronRight className="w-8 h-8 rotate-180" />
        </button>
        <h1 className="text-2xl font-bold font-cairo">إضافة دواء جديد</h1>
      </div>

      <div className="p-6 space-y-8 flex-1 overflow-y-auto pb-32">
        {/* Barcode Scanner Button */}
        <motion.button
          onClick={scanner.openScanner}
          whileTap={{ scale: 0.98 }}
          className="w-full h-16 rounded-2xl border-2 border-dashed border-emerald-500 bg-emerald-50 flex items-center justify-center gap-3 font-bold text-emerald-700 hover:bg-emerald-100 transition-colors"
        >
          <Barcode className="w-6 h-6" />
          ماسح الرموز الضوئية
        </motion.button>

        {/* Scanned Info Card */}
        {scanner.lastScanned && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-emerald-50 border-2 border-emerald-200 rounded-2xl p-4 space-y-2"
          >
            <p className="text-sm font-bold text-emerald-700">✓ تم مسح الرمز</p>
            <p className="text-xs text-emerald-600">
              {scanner.lastScanned.medicationName} - {scanner.lastScanned.dosage}
            </p>
          </motion.div>
        )}

        {/* Medication Name */}
        <div className="space-y-3">
          <label className="text-xl font-bold text-gray-900">اسم الدواء</label>
          <Input
            value={medicationName}
            onChange={(e) => setMedicationName(e.target.value)}
            placeholder="بحث عن دواء... (مثال: بانادول)"
            className="h-16 text-lg font-medium rounded-2xl bg-gray-50 border-2"
          />
        </div>

        {/* Dosage */}
        <div className="space-y-3">
          <label className="text-xl font-bold text-gray-900">الجرعة</label>
          <Input
            value={dosage}
            onChange={(e) => setDosage(e.target.value)}
            placeholder="مثال: حبة واحدة ٥٠٠ مج"
            className="h-16 text-lg font-medium rounded-2xl bg-gray-50 border-2"
          />
        </div>

        {/* Pills in Box */}
        <div className="space-y-3">
          <label className="text-xl font-bold text-gray-900">عدد الأقراص</label>
          <Input
            type="number"
            value={pillsInBox}
            onChange={(e) => setPillsInBox(Math.max(1, parseInt(e.target.value) || 0))}
            min="1"
            className="h-16 text-lg font-medium rounded-2xl bg-gray-50 border-2"
          />
        </div>

        {/* Frequency */}
        <div className="space-y-3">
          <label className="text-xl font-bold text-gray-900">التكرار اليومي</label>
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map((n) => (
              <motion.button
                key={n}
                onClick={() => setFrequency(n)}
                whileTap={{ scale: 0.95 }}
                className={`h-16 rounded-2xl border-2 text-lg font-bold transition-colors ${
                  frequency === n
                    ? "bg-emerald-50 border-emerald-600 text-emerald-700"
                    : "bg-white hover:bg-gray-50 text-gray-600 border-gray-200"
                }`}
              >
                {n}x
              </motion.button>
            ))}
          </div>
        </div>

        {/* Time Periods */}
        <div className="space-y-3">
          <label className="text-xl font-bold text-gray-900">أوقات التذكير</label>
          <div className="grid grid-cols-3 gap-3">
            <motion.button
              onClick={() => togglePeriod("morning")}
              whileTap={{ scale: 0.95 }}
              className={`h-24 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-colors ${
                selectedPeriods.includes("morning")
                  ? "bg-amber-50 border-amber-400 text-amber-700"
                  : "bg-gray-50 border-gray-200 text-gray-400"
              }`}
            >
              <Sun className="w-8 h-8" />
              <span className="font-bold text-sm">الصباح</span>
            </motion.button>
            <motion.button
              onClick={() => togglePeriod("noon")}
              whileTap={{ scale: 0.95 }}
              className={`h-24 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-colors ${
                selectedPeriods.includes("noon")
                  ? "bg-blue-50 border-blue-400 text-blue-700"
                  : "bg-gray-50 border-gray-200 text-gray-400"
              }`}
            >
              <Cloud className="w-8 h-8" />
              <span className="font-bold text-sm">الظهيرة</span>
            </motion.button>
            <motion.button
              onClick={() => togglePeriod("night")}
              whileTap={{ scale: 0.95 }}
              className={`h-24 rounded-2xl border-2 flex flex-col items-center justify-center gap-2 transition-colors ${
                selectedPeriods.includes("night")
                  ? "bg-indigo-50 border-indigo-400 text-indigo-700"
                  : "bg-gray-50 border-gray-200 text-gray-400"
              }`}
            >
              <Moon className="w-8 h-8" />
              <span className="font-bold text-sm">المساء</span>
            </motion.button>
          </div>
        </div>

        {/* Reminder Toggle */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-gray-900">تفعيل التذكير</h4>
            <p className="text-sm font-medium text-gray-500">تلقي إشعارات وقت الدواء</p>
          </div>
          <Switch
            checked={reminderEnabled}
            onCheckedChange={setReminderEnabled}
            className="scale-125"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="p-6 bg-white border-t fixed bottom-0 left-0 right-0 w-full max-w-[390px] mx-auto shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <motion.button
          onClick={handleSaveMedication}
          disabled={saving || medicationLoading}
          whileTap={{ scale: 0.98 }}
          className="w-full h-16 rounded-2xl text-xl font-bold bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white shadow-lg shadow-emerald-200 flex items-center justify-center gap-3 transition-all"
        >
          {saving || medicationLoading ? (
            <>
              <Loader className="w-5 h-5 animate-spin" />
              جاري الحفظ...
            </>
          ) : (
            "حفظ الدواء"
          )}
        </motion.button>
      </div>

      {/* Barcode Scanner Modal */}
      <BarcodeScannerModal
        isOpen={scanner.isModalOpen}
        onClose={scanner.closeScanner}
        onScanSuccess={scanner.handleScanSuccess}
      />
    </div>
  );
}
