/**
 * Low Stock Alert Widget
 * مكون تنبيه نقص المخزون
 * 
 * Displays low stock alerts inline in the home screen
 */

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, TrendingDown, Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LowStockAlert } from "@/types/medication";
import { calculateDepletionDate } from "@/utils/alerts";

interface LowStockAlertWidgetProps {
  alert: LowStockAlert;
}

export function LowStockAlertWidget({ alert }: LowStockAlertWidgetProps) {
  const depletionDate = calculateDepletionDate(
    alert.currentPills,
    Math.ceil(alert.percentageRemaining / 100) || 1
  );
  const depletionDateStr = depletionDate.toLocaleDateString("ar-EG", {
    month: "short",
    day: "numeric",
  });

  const severityConfig = {
    high: {
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      iconColor: "text-red-600",
      badgeColor: "bg-red-100 text-red-800",
      titleColor: "text-red-900",
    },
    medium: {
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      iconColor: "text-amber-600",
      badgeColor: "bg-amber-100 text-amber-800",
      titleColor: "text-amber-900",
    },
    low: {
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      iconColor: "text-blue-600",
      badgeColor: "bg-blue-100 text-blue-800",
      titleColor: "text-blue-900",
    },
  };

  const config = severityConfig[alert.severity];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <Card className={`${config.bgColor} border-2 ${config.borderColor} shadow-sm`}>
        <CardContent className="p-5 space-y-4">
          {/* Header */}
          <div className="flex items-start gap-3">
            <motion.div
              animate={alert.severity === "high" ? { scale: [1, 1.15, 1] } : {}}
              transition={{ duration: 1.2, repeat: Infinity }}
              className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${config.badgeColor}`}
            >
              <AlertCircle className={`w-5 h-5 ${config.iconColor}`} />
            </motion.div>
            <div className="flex-1">
              <h3 className={`font-bold text-lg ${config.titleColor}`}>
                {alert.severity === "high"
                  ? `🚨 ${alert.medicationName} نفد!`
                  : `⚠️ ${alert.medicationName} ناقص`}
              </h3>
            </div>
            <Badge className={`${config.badgeColor} border-0 font-bold text-xs shrink-0`}>
              {alert.severity === "high" ? "حرج" : "تحذير"}
            </Badge>
          </div>

          {/* Inventory Details */}
          <div className="grid grid-cols-2 gap-4 bg-white/50 rounded-xl p-3">
            {/* Remaining Pills */}
            <div className="space-y-1">
              <p className="text-xs font-bold text-gray-600">متبقي</p>
              <p className={`text-xl font-black ${config.titleColor}`}>
                {alert.currentPills}/{alert.totalPills}
              </p>
              <p className="text-xs font-medium text-gray-600">
                {Math.round(alert.percentageRemaining)}% من الكمية
              </p>
            </div>

            {/* Days Until Depletion */}
            <div className="space-y-1 text-right">
              <p className="text-xs font-bold text-gray-600">الانتهاء</p>
              <p className={`text-xl font-black ${config.titleColor}`}>
                {alert.estimatedDepletionDays}
              </p>
              <p className="text-xs font-medium text-gray-600">أيام تقريباً</p>
            </div>
          </div>

          {/* Action Items */}
          <div className="flex items-center gap-3 pt-2 border-t border-white/30 text-xs font-bold">
            <div className="flex items-center gap-1.5 text-gray-700">
              <Calendar className="w-3.5 h-3.5" />
              <span>{depletionDateStr}</span>
            </div>
            <div className="flex items-center gap-1.5 text-gray-700 ml-auto">
              <TrendingDown className="w-3.5 h-3.5" />
              <span>معدل استهلاك منتظم</span>
            </div>
          </div>

          {/* Recommendation */}
          {alert.severity === "high" && (
            <div className="bg-white rounded-lg p-3">
              <p className="text-xs font-bold text-red-900">
                ✓ يُنصح: شراء عبوة جديدة على الفور لتجنب نقص الدواء
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
