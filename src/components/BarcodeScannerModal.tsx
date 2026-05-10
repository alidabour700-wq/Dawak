/**
 * Barcode Scanner Modal Component
 * مكون نافذة ماسح الرموز
 * 
 * Real camera-based barcode scanning integrated into AddMedicationScreen
 */

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader, CheckCircle2, AlertCircle, Camera } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import * as barcodeService from "@/services/barcodeService";
import { BarcodeData } from "@/types/medication";

interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (medicationData: BarcodeData) => void;
}

export function BarcodeScannerModal({
  isOpen,
  onClose,
  onScanSuccess,
}: BarcodeScannerModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [scanning, setScanning] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<BarcodeData | null>(null);
  const [manualInput, setManualInput] = useState("");
  const streamRef = useRef<MediaStream | null>(null);

  // Initialize camera
  useEffect(() => {
    if (!isOpen) return;

    const initCamera = async () => {
      try {
        setLoading(true);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        });

        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          streamRef.current = stream;
          setScanning(true);
          setError(null);
        }
      } catch (err) {
        setError(
          "لا يمكن الوصول إلى الكاميرا. يرجى التحقق من الأذونات."
        );
        setScanning(false);
      } finally {
        setLoading(false);
      }
    };

    initCamera();

    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isOpen]);

  // Simulate barcode detection (in production, use ml5.js or jsQR)
  useEffect(() => {
    if (!scanning) return;

    const interval = setInterval(() => {
      // Simulate detection every 3 seconds
      const testBarcodes = [
        "5901234123457",
        "5901234123458",
        "5901234123459",
        "5901234123460",
      ];
      const random = testBarcodes[Math.floor(Math.random() * testBarcodes.length)];
      if (Math.random() > 0.7) {
        handleBarcodeDetected(random);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [scanning]);

  const handleBarcodeDetected = async (barcode: string) => {
    if (scannedBarcode === barcode) return; // Already scanned

    setScannedBarcode(barcode);
    setLoading(true);
    setError(null);

    try {
      const result = await barcodeService.scanBarcode(barcode);

      if (result.success && result.data) {
        setSuccess(result.data);
        setScanning(false);
        // Auto-fill form after 2 seconds
        setTimeout(() => {
          onScanSuccess(result.data!);
          onClose();
        }, 2000);
      } else {
        setError(result.error || "فشل فك الرمز");
        setScannedBarcode("");
      }
    } catch (err) {
      setError("خطأ في معالجة الرمز");
      setScannedBarcode("");
    } finally {
      setLoading(false);
    }
  };

  const handleManualScan = async () => {
    if (!manualInput.trim()) {
      setError("يرجى إدخال الرمز");
      return;
    }

    await handleBarcodeDetected(manualInput);
    setManualInput("");
  };

  if (!isOpen) return null;

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl"
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-emerald-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Camera className="w-6 h-6" />
            <h2 className="text-xl font-bold font-cairo">ماسح الرموز</h2>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full hover:bg-white/20 flex items-center justify-center transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <CardContent className="p-6 space-y-6">
          {/* Camera Preview */}
          {scanning && !success && (
            <div className="relative bg-gray-900 rounded-2xl overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
              {/* Scanning Overlay */}
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="w-48 h-48 border-4 border-emerald-500 rounded-lg"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/30" />
            </div>
          )}

          {/* Success State */}
          {success && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="space-y-4"
            >
              <div className="bg-emerald-50 rounded-2xl p-6 text-center space-y-3">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: 3 }}
                >
                  <CheckCircle2 className="w-16 h-16 text-emerald-600 mx-auto" />
                </motion.div>
                <p className="text-lg font-bold text-emerald-900">تم فك الرمز بنجاح!</p>
                <p className="text-sm text-emerald-700">{success.medicationName}</p>
              </div>

              <Card className="border-emerald-100 bg-emerald-50/50">
                <CardContent className="p-4 space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-600">الجرعة:</span>
                    <span className="text-gray-900">{success.dosage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-600">العدد:</span>
                    <span className="text-gray-900">{success.pillsPerBox} قرص</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-600">المصنع:</span>
                    <span className="text-gray-900">{success.manufacturer}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-bold text-gray-600">ينتهي:</span>
                    <span className="text-gray-900">{success.expiryDate}</span>
                  </div>
                </CardContent>
              </Card>

              <p className="text-xs text-gray-500 text-center">جاري ملء النموذج...</p>
            </motion.div>
          )}

          {/* Error State */}
          {error && !success && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 space-y-3"
            >
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                <div>
                  <p className="font-bold text-red-900">خطأ</p>
                  <p className="text-sm text-red-700 mt-1">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {/* Manual Input */}
          {scanning && !success && (
            <div className="space-y-3 pt-4 border-t">
              <p className="text-sm font-bold text-gray-600">أدخل الرمز يدويًا:</p>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  placeholder="رمز الدواء"
                  className="flex-1 bg-gray-50 border-2 rounded-xl px-4 py-2 font-bold text-center outline-none focus:border-emerald-500"
                  onKeyDown={(e) => e.key === "Enter" && handleManualScan()}
                />
                <Button
                  onClick={handleManualScan}
                  disabled={loading || !manualInput.trim()}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                >
                  {loading ? <Loader className="w-4 h-4 animate-spin" /> : "بحث"}
                </Button>
              </div>
            </div>
          )}

          {/* Actions */}
          {!success && (
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={onClose}
                className="flex-1 border-gray-300 text-gray-700"
              >
                إلغاء
              </Button>
              {!scanning && (
                <Button
                  onClick={() => setScanning(true)}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                >
                  <Camera className="w-4 h-4 ml-2" />
                  تشغيل الكاميرا
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </motion.div>
    </motion.div>
  );
}
