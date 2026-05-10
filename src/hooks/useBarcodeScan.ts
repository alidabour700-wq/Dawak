/**
 * Barcode Scanner Hook
 * 
 * Custom React hook for barcode scanning functionality
 */

import { useState, useCallback } from "react";
import { BarcodeData } from "@/types/medication";
import * as barcodeService from "@/services/barcodeService";

export function useBarcodeScan() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [lastScanned, setLastScanned] = useState<BarcodeData | null>(null);

  const openScanner = useCallback(() => {
    setIsModalOpen(true);
  }, []);

  const closeScanner = useCallback(() => {
    setIsModalOpen(false);
  }, []);

  const handleScanSuccess = useCallback((medicationData: BarcodeData) => {
    setLastScanned(medicationData);
    setIsModalOpen(false);
  }, []);

  return {
    isModalOpen,
    openScanner,
    closeScanner,
    lastScanned,
    handleScanSuccess,
  };
}
