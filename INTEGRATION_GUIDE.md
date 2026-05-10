# Dawak - Implementation Guide

## 🎯 Quick Start

### 1. Basic Medication Management

```typescript
import { useMedications } from "@/hooks/useMedications";

function MedicationDemo() {
  const { medications, addMedication, markDoseAsTaken } = useMedications();

  // Add a new medication
  const handleAddMed = () => {
    const med = addMedication(
      "Metformin",      // name
      "850mg",          // dosage
      2,                // frequency (2x daily)
      30,               // pills in box
      ["morning", "night"] // periods
    );
    console.log("Medication added:", med);
  };

  // Mark dose as taken
  const handleTakeDose = (medId: string) => {
    const result = markDoseAsTaken(medId);
    if (result.success) {
      console.log("✅ Dose recorded");
    }
  };

  return (
    <div>
      <button onClick={handleAddMed}>Add Medication</button>
      {medications.map(med => (
        <button key={med.id} onClick={() => handleTakeDose(med.id)}>
          Take {med.name}
        </button>
      ))}
    </div>
  );
}
```

### 2. Barcode Scanning

```typescript
import { BarcodeScannerModal } from "@/components/BarcodeScannerModal";
import { useBarcodeScan } from "@/hooks/useBarcodeScan";

function BarcodeDemo() {
  const scanner = useBarcodeScan();

  const handleScan = (barcodeData) => {
    console.log("Scanned:", barcodeData.medicationName);
    // Auto-fill form with scanned data
  };

  return (
    <>
      <button onClick={scanner.openScanner}>Scan Barcode</button>
      <BarcodeScannerModal
        isOpen={scanner.isModalOpen}
        onClose={scanner.closeScanner}
        onScanSuccess={handleScan}
      />
    </>
  );
}
```

### 3. Low Stock Alerts

```typescript
import { useInventory } from "@/hooks/useInventory";
import { LowStockAlertWidget } from "@/components/LowStockAlertWidget";

function InventoryDemo() {
  const { alerts } = useInventory();

  return (
    <div>
      {alerts.map(alert => (
        <LowStockAlertWidget key={alert.medicationId} alert={alert} />
      ))}
    </div>
  );
}
```

### 4. Real-time Sync

```typescript
import * as syncService from "@/services/syncService";
import { useEffect } from "react";

function SyncDemo() {
  useEffect(() => {
    // Subscribe to medication events
    const unsubscribe = syncService.onSyncEvent(
      "dose_taken",
      (event) => {
        console.log("Dose confirmed:", event.data);
        // Update caregiver dashboard in real-time
      }
    );

    return unsubscribe;
  }, []);

  return <div>Real-time Sync Active</div>;
}
```

---

## 🔗 Service APIs

### Medication Service

```typescript
// Add medication
const med = medicationService.addMedication(
  name: string,
  dosage: string,
  frequency: number,
  pillsInBox: number,
  periods: MedicationPeriod[]
);

// Get medications
const meds = medicationService.getAllMedications();
const med = medicationService.getMedicationById(id);

// Manage doses
medicationService.markDoseAsTaken(medicationId);
medicationService.markDoseAsMissed(medicationId);
const dose = medicationService.getNextScheduledDose(medicationId);

// Today's doses
const doses = medicationService.getTodaysDoses();
const medDoses = medicationService.getTodaysDosesForMedication(medicationId);
```

### Barcode Service

```typescript
// Scan barcode
const result = await barcodeService.scanBarcode(barcodeValue);
if (result.success) {
  const medicationData = result.data; // BarcodeData
}

// Manual entries
barcodeService.addBarcodeEntry(barcode, barcodeData);
const med = barcodeService.getMedicationByBarcode(barcode);
const all = barcodeService.getAllBarcodes();
```

### Inventory Service

```typescript
// Check stock
const alert = inventoryService.checkLowStock(medication);
const allAlerts = inventoryService.getLowStockAlerts();
const specificAlert = inventoryService.getLowStockAlert(medicationId);

// Refill
inventoryService.refillMedication(medicationId, pillsAdded);

// History
const history = inventoryService.getInventoryHistory(medicationId, days);
const rate = inventoryService.calculateConsumptionRate(medicationId);
```

### Notification Service

```typescript
// Create notifications
notificationService.notifyDoseReminder(medication, dose);
notificationService.notifyDoseTaken(medication, patientName);
notificationService.notifyMissedDose(medication, patientName, time);
notificationService.notifyLowStock(alert);

// Manage
const all = notificationService.getAllNotifications();
const unread = notificationService.getUnreadNotifications();
const forUser = notificationService.getNotificationsFor(targetUser);
notificationService.markAsRead(notificationId);
```

### Sync Service

```typescript
// Emit events
syncService.emitSyncEvent(
  type: SyncEventType,
  userId: string,
  data: Record<string, any>,
  medicationId?: string
);

// Subscribe
syncService.onSyncEvent(type, callback);
syncService.onAnySync(callback);

// History
const history = syncService.getSyncHistory(hours);
const pending = syncService.getPendingSyncEvents();
```

---

## 📱 Component Props

### BarcodeScannerModal

```typescript
interface BarcodeScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (medicationData: BarcodeData) => void;
}
```

### LowStockAlertWidget

```typescript
interface LowStockAlertWidgetProps {
  alert: LowStockAlert;
}
```

### DoseConfirmationWidget

```typescript
interface DoseConfirmationWidgetProps {
  medicationName: string;
  patientName: string;
  time: Date;
  type: "patient_confirmed" | "caregiver_notified";
}
```

---

## 🧪 Testing

### Mock Data for Testing

```typescript
import * as medicationService from "@/services/medicationService";

// Setup test data
const med = medicationService.addMedication(
  "Test Medication",
  "500mg",
  2,
  30,
  ["morning", "night"]
);

// Verify creation
const retrieved = medicationService.getMedicationById(med.id);
console.assert(retrieved?.name === "Test Medication");
```

---

## 🔄 Integration Checklist

- [ ] Replace `AddMedicationScreen` with `AddMedicationScreenEnhanced`
- [ ] Add `LowStockAlertWidget` to home screen
- [ ] Add `useNotifications` hook to notifications page
- [ ] Connect sync service to caregiver dashboard
- [ ] Setup real-time notifications (WebSocket/Firebase)
- [ ] Connect to backend API
- [ ] Setup database persistence
- [ ] Add authentication
- [ ] Test with real barcodes
- [ ] Performance optimization

---

## 🐛 Troubleshooting

**Q: Camera permission denied?**
A: Check browser permissions and ensure HTTPS on production.

**Q: Barcode not scanning?**
A: Use manual input or test with provided barcode codes:
- `5901234123457` - Paracetamol
- `5901234123458` - Amlodipine
- `5901234123459` - Metformin
- `5901234123460` - Atorvastatin

**Q: Sync events not firing?**
A: Ensure callbacks are properly subscribed before events are emitted.

**Q: Low stock alerts not showing?**
A: Check if `checkLowStock()` is called after dose taken.

---

## 📈 Performance Tips

1. Use `useCallback` for event handlers
2. Memoize component lists with `React.memo`
3. Debounce frequent sync events
4. Clear old notifications regularly
5. Optimize barcode detection interval

---

## 🔐 Security Notes

- Validate barcode data before processing
- Sanitize user inputs
- Use environment variables for sensitive data
- Implement rate limiting for API calls
- Add CSRF protection for state mutations

---

For more details, see `DOCUMENTATION_AR.md`
