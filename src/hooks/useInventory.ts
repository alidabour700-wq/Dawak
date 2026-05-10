/**
 * useInventory Hook
 * 
 * Custom React hook for inventory tracking
 */

import { useState, useEffect, useCallback } from "react";
import { LowStockAlert } from "@/types/medication";
import * as inventoryService from "@/services/inventoryService";

export function useInventory(medicationId?: string) {
  const [alerts, setAlerts] = useState<LowStockAlert[]>([]);
  const [loading, setLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    refreshAlerts();
  }, []);

  // Subscribe to inventory changes
  useEffect(() => {
    const unsubscribe = inventoryService.onInventoryChange(
      "low_stock_alert",
      () => refreshAlerts()
    );

    return () => unsubscribe();
  }, []);

  const refreshAlerts = useCallback(() => {
    setLoading(true);
    try {
      if (medicationId) {
        const alert = inventoryService.getLowStockAlert(medicationId);
        setAlerts(alert ? [alert] : []);
      } else {
        const allAlerts = inventoryService.getLowStockAlerts();
        setAlerts(allAlerts);
      }
    } finally {
      setLoading(false);
    }
  }, [medicationId]);

  return {
    alerts,
    loading,
    refreshAlerts,
  };
}
