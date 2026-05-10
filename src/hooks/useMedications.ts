/**
 * useMedications Hook
 * 
 * Custom React hook for managing medications
 */

import { useState, useEffect, useCallback } from "react";
import { Medication, MedicationDose } from "@/types/medication";
import * as medicationService from "@/services/medicationService";
import * as syncService from "@/services/syncService";

export function useMedications() {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [todaysDoses, setTodaysDoses] = useState<MedicationDose[]>([]);
  const [loading, setLoading] = useState(false);

  // Load initial data
  useEffect(() => {
    refreshMedications();
  }, []);

  // Subscribe to medication changes
  useEffect(() => {
    const unsubscribeMedAdded = medicationService.onMedicationChange(
      "medication_added",
      () => refreshMedications()
    );
    const unsubscribeDoseTaken = medicationService.onMedicationChange(
      "dose_taken",
      () => refreshMedications()
    );

    return () => {
      unsubscribeMedAdded();
      unsubscribeDoseTaken();
    };
  }, []);

  const refreshMedications = useCallback(() => {
    setLoading(true);
    try {
      const meds = medicationService.getAllMedications();
      const doses = medicationService.getTodaysDoses();
      setMedications(meds);
      setTodaysDoses(doses);
    } finally {
      setLoading(false);
    }
  }, []);

  const addMedication = useCallback(
    (
      name: string,
      dosage: string,
      frequency: number,
      pillsInBox: number,
      periods: any[]
    ) => {
      const med = medicationService.addMedication(
        name,
        dosage,
        frequency,
        pillsInBox,
        periods
      );

      // Emit sync event
      syncService.emitSyncEvent(
        "medication_added",
        "patient_123",
        {
          medicationId: med.id,
          name,
          dosage,
          frequency,
          pillsInBox,
        },
        med.id
      );

      refreshMedications();
      return med;
    },
    []
  );

  const markDoseAsTaken = useCallback((medicationId: string) => {
    const result = medicationService.markDoseAsTaken(medicationId);

    if (result.success) {
      // Emit sync event
      syncService.emitSyncEvent(
        "dose_taken",
        "patient_123",
        { medicationId },
        medicationId
      );

      refreshMedications();
    }

    return result;
  }, []);

  return {
    medications,
    todaysDoses,
    loading,
    addMedication,
    markDoseAsTaken,
    refreshMedications,
  };
}
