/**
 * Dose Confirmation Widget
 * مكون تأكيد الجرعة
 * 
 * Shows real-time dose confirmation notifications
 */

import { motion } from "framer-motion";
import { CheckCircle2, Bell, User } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface DoseConfirmationWidgetProps {
  medicationName: string;
  patientName: string;
  time: Date;
  type: "patient_confirmed" | "caregiver_notified";
}

export function DoseConfirmationWidget({
  medicationName,
  patientName,
  time,
  type,
}: DoseConfirmationWidgetProps) {
  const timeStr = time.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const isPatientConfirm = type === "patient_confirmed";

  return (
    <motion.div
      initial={{ opacity: 0, x: isPatientConfirm ? 50 : -50, scale: 0.8 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      className="mb-4"
    >
      <Card className={`border-0 shadow-md ${
        isPatientConfirm
          ? "bg-emerald-50 border-l-4 border-l-emerald-500"
          : "bg-blue-50 border-l-4 border-l-blue-500"
      }`}>
        <CardContent className="p-4 flex items-start gap-3">
          {/* Icon */}
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.6, repeat: 3 }}
          >
            {isPatientConfirm ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 mt-0.5 shrink-0" />
            ) : (
              <Bell className="w-6 h-6 text-blue-600 mt-0.5 shrink-0" />
            )}
          </motion.div>

          {/* Content */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className={`font-bold text-sm ${
                isPatientConfirm ? "text-emerald-900" : "text-blue-900"
              }`}>
                {isPatientConfirm ? "✓ تم تأكيد الجرعة" : "📢 تم إخطار المُراقِب"}
              </h3>
              <Badge className={`text-xs font-bold px-2 py-0.5 ${
                isPatientConfirm
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-blue-100 text-blue-700"
              }`}>
                {timeStr}
              </Badge>
            </div>
            <p className={`text-sm font-medium ${
              isPatientConfirm ? "text-emerald-700" : "text-blue-700"
            }`}>
              {medicationName}
            </p>
            <p className={`text-xs font-bold mt-1 ${
              isPatientConfirm ? "text-emerald-600" : "text-blue-600"
            }`}>
              {isPatientConfirm ? (
                <>🎉 شكراً لك على الالتزام!</>
              ) : (
                <>
                  <User className="w-3 h-3 inline mr-1" />
                  {patientName} تناول الدواء
                </>
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
