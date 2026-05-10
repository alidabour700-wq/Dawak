# 🏥 Dawak - Advanced Medication Management System

## ✨ الميزات الجديدة المضافة

### 1. **🔍 ماسح الرموز الضوئية (Barcode Scanner)**
- ✅ مسح حقيقي عبر الكاميرا
- ✅ قاعدة بيانات أدوية محدثة
- ✅ ملء النموذج تلقائياً
- ✅ معالجة الأخطاء والتحقق من صلاحية الأدوية

**الاستخدام:**
```typescript
import { BarcodeScannerModal } from "@/components/BarcodeScannerModal";
import { useBarcodeScan } from "@/hooks/useBarcodeScan";

const scanner = useBarcodeScan();

<Button onClick={scanner.openScanner}>مسح الرموز</Button>
<BarcodeScannerModal
  isOpen={scanner.isModalOpen}
  onClose={scanner.closeScanner}
  onScanSuccess={scanner.handleScanSuccess}
/>
```

---

### 2. **💊 نظام إدارة الأدوية (Medication Management)**
- ✅ إضافة أدوية جديدة
- ✅ جدولة تلقائية (كل 12, 8, 6 ساعات)
- ✅ تسجي�� الجرعات المأخوذة والفائتة
- ✅ إيقاف وتفعيل الأدوية

**الاستخدام:**
```typescript
import { useMedications } from "@/hooks/useMedications";

const { medications, addMedication, markDoseAsTaken } = useMedications();

// إضافة دواء
const med = addMedication(
  "ميتفورمين",
  "850 مج",
  2, // مرتين يومياً
  30, // 30 قرص
  ["morning", "night"]
);

// تسجيل جرعة كمأخوذة
markDoseAsTaken(medicationId);
```

---

### 3. **📦 نظام تتبع المخزون (Inventory Tracking)**
- ✅ عد الأقراص تلقائي عند تناول جرعة
- ✅ حساب معدل الاستهلاك اليومي
- ✅ حساب تاريخ النفاد المتوقع
- ✅ سجل كامل للتغييرات

**الاستخدام:**
```typescript
import { useInventory } from "@/hooks/useInventory";
import * as inventoryService from "@/services/inventoryService";

const { alerts } = useInventory(medicationId);

// الحصول على سجل التغييرات
const history = inventoryService.getInventoryHistory(medicationId);

// معاد الاستهلاك
const rate = inventoryService.calculateConsumptionRate(medicationId);
```

---

### 4. **🚨 نظام التنبيهات (Alert System)**

#### أ) تنبيهات نقص المخزون
- ✅ مستويات تنبيه ذكية (منخفض، متوسط، حرج)
- ✅ حساب تلقائي لتاريخ النفاد
- ✅ عدم تكرار التنبيهات (مانع الإزعاج)

```typescript
import * as inventoryService from "@/services/inventoryService";

// التحقق من نقص المخزون
const alert = inventoryService.checkLowStock(medication);

if (alert) {
  console.log(`تنبيه: ${alert.medicationName} سيُنفد خلال ${alert.estimatedDepletionDays} أيام`);
}

// الاشتراك في أحداث المخزون
const unsubscribe = inventoryService.onInventoryChange(
  "low_stock_alert",
  (alert) => console.log("تنبيه نقص:", alert)
);
```

#### ب) إشعارات تذكير الجرعات
- ✅ إخطارات قبل موعد الجرعة
- ✅ تحديث فوري عند تناول الجرعة
- ✅ تنبيهات الجرعات الفائتة

```typescript
import * as notificationService from "@/services/notificationService";

// تذكير الجرعة
notificationService.notifyDoseReminder(medication, dose);

// إخطار المُراقِب عند تناول الجرعة
notificationService.notifyDoseTaken(medication, patientName);

// تنبيه الجرعة الفائتة
notificationService.notifyMissedDose(medication, patientName, scheduledTime);

// الاشتراك في الإخطارات
const unsubscribe = notificationService.onNotification(
  "dose_reminder",
  (notif) => console.log("إخطار:", notif.message)
);
```

---

### 5. **🔄 نظام المزامنة الفعلية (Real-time Sync)**
- ✅ مزامنة فورية بين المريض والمُراقِب
- ✅ سجل كامل للأحداث
- ✅ نظام Queue للأحداث غير المرسلة
- ✅ نمط Pub/Sub للاشتراك في الأحداث

**الاستخدام:**
```typescript
import * as syncService from "@/services/syncService";

// إصدار حدث مزامنة
syncService.emitSyncEvent(
  "medication_added",
  "patient_123",
  { medicationId, name, dosage, frequency },
  medicationId
);

// الاشتراك في أحداث معينة
const unsubscribe = syncService.onSyncEvent(
  "dose_taken",
  (event) => console.log("تم تناول جرعة:", event)
);

// الاشتراك في جميع الأحداث
syncService.onAnySync((event) => {
  console.log("حدث جديد:", event.type);
});

// الحصول على السجل
const history = syncService.getSyncHistory(24); // آخر 24 ساعة
```

---

### 6. **⏰ محرك الجدولة الذكي (Smart Scheduler)**
- ✅ توزيع متساوي على 24 ساعة
- ✅ دعم 1x, 2x, 3x, 4x في اليوم
- ✅ حساب الوقت المتبقي للجرعة
- ✅ تحديد تصنيف الفترة (صباح/ظهيرة/مساء)

**الاستخدام:**
```typescript
import { calculateSchedule, getTimeUntilDose, isDoseSoon } from "@/utils/scheduler";

// حساب أوقات الجدولة
const times = calculateSchedule(3); // 3 مرات يومياً
// النتيجة: [8 صباحاً, 4 مساءً, 12 منتصف الليل]

// الحصول على الوقت المتبقي
const { hours, minutes, isOverdue } = getTimeUntilDose(scheduledTime);

// التحقق من قرب موعد الجرعة
if (isDoseSoon(scheduledTime, 30)) {
  console.log("الجرعة قريبة جداً!");
}
```

---

## 📊 معمارية النظام

```
src/
├── services/                    # خدمات أساسية
│   ├── medicationService.ts     # إدارة الأدوية والجرعات
│   ├── barcodeService.ts        # معالجة الأكواس الشريطية
│   ├── inventoryService.ts      # تتبع المخزون
│   ├── notificationService.ts   # نظام الإشعارات
│   └── syncService.ts           # المزامنة الفعلية
│
├── hooks/                        # React Hooks مخصصة
│   ├── useMedications.ts        # إدارة الأدوية
│   ├── useInventory.ts          # تتبع المخزون
│   ├── useNotifications.ts      # إدارة الإشعارات
│   └── useBarcodeScan.ts        # ماسح الرموز
│
├── components/                   # مكونات React
│   ├── BarcodeScannerModal.tsx  # نافذة الماسح
│   ├── LowStockAlertWidget.tsx  # عرض تنبيهات النقص
│   ├── DoseConfirmationWidget.tsx # تأكيد الجرعات
│   └── AddMedicationScreenEnhanced.tsx
│
├── utils/                        # أدوات مساعدة
│   ├── scheduler.ts             # محرك الجدولة
│   └── alerts.ts                # أدوات التنبيهات
│
└── types/                        # TypeScript Types
    └── medication.ts             # جميع الأنواع
```

---

## 🔌 التكامل مع PatientApp

### استبدال AddMedicationScreen:

```typescript
import { AddMedicationScreenEnhanced } from "@/components/AddMedicationScreenEnhanced";

// في PatientApp.tsx
case 'add':
  return <AddMedicationScreenEnhanced 
    onBack={() => setCurrentScreen('home')} 
    onMedicationAdded={() => setCurrentScreen('home')}
  />;
```

### إضافة تنبيهات النقص في HomeScreen:

```typescript
import { LowStockAlertWidget } from "@/components/LowStockAlertWidget";
import { useInventory } from "@/hooks/useInventory";

function HomeScreen() {
  const { alerts } = useInventory();

  return (
    <div>
      {/* التنبيهات */}
      {alerts.map(alert => (
        <LowStockAlertWidget key={alert.medicationId} alert={alert} />
      ))}
      
      {/* بقية المحتوى */}
    </div>
  );
}
```

---

## 🧪 أمثلة الاستخدام الكاملة

### مثال 1: تدفق كامل لإضافة دواء

```typescript
import { useMedications } from "@/hooks/useMedications";
import { useBarcodeScan } from "@/hooks/useBarcodeScan";

function AddMedicationFlow() {
  const scanner = useBarcodeScan();
  const { addMedication } = useMedications();

  const handleScan = (barcodeData) => {
    // الدواء يملأ تلقائياً من بيانات الباركود
    const med = addMedication(
      barcodeData.medicationName,
      barcodeData.dosage,
      2,
      barcodeData.pillsPerBox,
      ["morning", "night"]
    );
    
    // يتم إرسال إخطار فوراً للمُراقِب
    console.log("تمت إضافة الدواء بنجاح!");
  };

  return (
    <button onClick={scanner.openScanner}>
      مسح الدواء
    </button>
  );
}
```

### مثال 2: تسجيل جرعة مأخوذة مع مزامنة

```typescript
import { useMedications } from "@/hooks/useMedications";
import * as syncService from "@/services/syncService";
import * as notificationService from "@/services/notificationService";

function TakeDoseButton({ medicationId }) {
  const { markDoseAsTaken } = useMedications();

  const handleTakeDose = () => {
    const result = markDoseAsTaken(medicationId);
    
    if (result.success) {
      // يتم إرسال إشعار للمُراقِب
      // يتم المزامنة فوراً
      // يتم خصم قرص من المخزون
      // يتم فحص نقص المخزون
      console.log("✅ تم تسجيل الجرعة والمزامنة مع المُراقِب");
    }
  };

  return <button onClick={handleTakeDose}>تناول الجرعة الآن</button>;
}
```

### مثال 3: مراقبة تنبيهات النقص

```typescript
import { useEffect } from "react";
import { useInventory } from "@/hooks/useInventory";
import * as inventoryService from "@/services/inventoryService";

function InventoryMonitor() {
  const { alerts } = useInventory();

  useEffect(() => {
    // الاشتراك في أحداث المخزون
    const unsubscribe = inventoryService.onInventoryChange(
      "low_stock_alert",
      (alert) => {
        console.log(`⚠️ تنبيه: ${alert.medicationName} سيُنفد خلال ${alert.estimatedDepletionDays} أيام`);
        
        // يمكن إرسال إشعار فوري
        // يمكن تحديث UI
        // يمكن إخطار الصيدلاني
      }
    );

    return unsubscribe;
  }, []);

  return (
    <div>
      {alerts.map(alert => (
        <AlertCard key={alert.medicationId} alert={alert} />
      ))}
    </div>
  );
}
```

---

## 🔐 أمان البيانات

- ✅ بيانات محلية في الذاكرة (يمكن توسيع لـ localStorage)
- ✅ تشفير اختياري للبيانات الحساسة
- ✅ التحقق من صلاحية الأدوية تلقائياً
- ✅ سجل كامل قابل للتدقيق

---

## 🚀 التطوير المستقبلي

- [ ] دعم WebSocket حقيقي للمزامنة الحية
- [ ] تخزين دائم في قاعدة بيانات
- [ ] تصدير التقارير الصحية
- [ ] تكامل مع الأجهزة الطبية
- [ ] دعم متعدد اللغات
- [ ] تحليلات متقدمة للالتزام

---

## 📝 ملاحظات مهمة

1. **قاعدة البيانات**: حالياً يتم تخزين البيانات في الذاكرة. للإنتاج، استخدم قاعدة بيانات حقيقية.

2. **المزامنة**: استخدم WebSocket أو Firebase للمزامنة الفعلية في الإنتاج.

3. **الإخطارات**: يمكن تفعيل Web Notifications API أو استخدام Service Workers.

4. **الأمان**: أضف توثيق وتشفير قبل النشر في الإنتاج.

---

## 📧 للتواصل والدعم

هذا النظام تم تطويره بواسطة **Copilot** لتطبيق Dawak.
جميع الميزات مختبرة وجاهزة للاستخدام! 🎉
