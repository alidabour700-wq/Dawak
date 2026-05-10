import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Home as HomeIcon, CalendarDays, Plus, Bell, Settings as SettingsIcon,
  CheckCircle2, Circle, Clock, ChevronRight, MessageCircle, Star,
  ShieldCheck, LogOut, Globe, Phone, Pill, Heart, Watch, Stethoscope, 
  Lock, AlertCircle, UserCircle2, Sun, Cloud, Moon, Battery, X, Send, HeartPulse,
  Bluetooth, RefreshCw, Wifi, Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

type Screen = 'onboarding' | 'login' | 'home' | 'schedule' | 'add' | 'notifications' | 'chat' | 'settings' | 'subscription' | 'devices';

const MOCK_MEDS = [
  { id: 1, name: "باراسيتامول ٥٠٠ مج", time: "٠٨:٠٠ ص", status: 'taken', period: 'morning', type: "pill" },
  { id: 2, name: "أملوديبين ٥ مج", time: "٠٩:٠٠ ص", status: 'taken', period: 'morning', type: "pill" },
  { id: 3, name: "ميتفورمين ٨٥٠ مج", time: "٠٢:٠٠ م", status: 'upcoming', period: 'noon', type: "pill" },
  { id: 4, name: "أميودارون ٢٠٠ مج", time: "٠٨:٠٠ م", status: 'upcoming', period: 'night', type: "pill" },
  { id: 5, name: "أتورفاستاتين ٤٠ مج", time: "١٠:٠٠ م", status: 'missed', period: 'night', type: "pill" },
];

export default function PatientApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('onboarding');
  const [meds, setMeds] = useState(MOCK_MEDS);
  const [language, setLanguage] = useState<'ar' | 'en'>('ar');
  const [isPremium, setIsPremium] = useState(false);
  const [wearableNotif, setWearableNotif] = useState(false);

  const toggleMedStatus = (id: number) => {
    setMeds(meds.map(med => {
      if (med.id === id) {
        let newStatus = med.status;
        if (med.status === 'taken') newStatus = 'upcoming';
        else if (med.status === 'upcoming') { newStatus = 'taken'; }
        else if (med.status === 'missed') { newStatus = 'taken'; }
        if (newStatus === 'taken' && med.status !== 'taken') {
          setWearableNotif(true);
          setTimeout(() => setWearableNotif(false), 3000);
        }
        return { ...med, status: newStatus };
      }
      return med;
    }));
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'onboarding':
        return <OnboardingScreen onNext={() => setCurrentScreen('login')} />;
      case 'login':
        return <LoginScreen onLogin={() => setCurrentScreen('home')} />;
      case 'home':
        return <HomeScreen meds={meds} onToggle={toggleMedStatus} onGoPremium={() => setCurrentScreen('subscription')} />;
      case 'schedule':
        return <ScheduleScreen meds={meds} onToggle={toggleMedStatus} />;
      case 'add':
        return <AddMedicationScreen onBack={() => setCurrentScreen('home')} />;
      case 'notifications':
        return <NotificationsScreen />;
      case 'chat':
        return <DoctorChatScreen onBack={() => setCurrentScreen('home')} isPremium={isPremium} onGoPremium={() => setCurrentScreen('subscription')} />;
      case 'settings':
        return <SettingsScreen language={language} setLanguage={setLanguage} onLogout={() => setCurrentScreen('login')} onGoDevices={() => setCurrentScreen('devices')} />;
      case 'subscription':
        return <SubscriptionScreen onBack={() => setCurrentScreen('home')} onUpgrade={() => { setIsPremium(true); setCurrentScreen('home'); }} />;
      case 'devices':
        return <DevicesScreen onBack={() => setCurrentScreen('settings')} />;
      default:
        return <HomeScreen meds={meds} onToggle={toggleMedStatus} onGoPremium={() => setCurrentScreen('subscription')} onGoChat={() => setCurrentScreen('chat')} onGoDevices={() => setCurrentScreen('devices')} />;
    }
  };

  const showNav = !['onboarding', 'login', 'add', 'chat', 'subscription'].includes(currentScreen);

  return (
    <div className="min-h-[100dvh] w-full bg-gray-100 flex justify-center">
      <div className="w-full max-w-[390px] h-[100dvh] bg-white relative overflow-hidden flex flex-col shadow-2xl" dir={language === 'ar' ? 'rtl' : 'ltr'}>
        <div className="flex-1 overflow-y-auto pb-20 no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentScreen}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              className="min-h-full"
            >
              {renderScreen()}
            </motion.div>
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {wearableNotif && (
            <motion.div
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 60 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className="absolute bottom-24 left-4 right-4 z-50 bg-gray-900 text-white p-4 rounded-2xl flex items-center gap-3 shadow-2xl border border-white/10"
            >
              <span className="text-2xl shrink-0">📳</span>
              <div className="flex-1">
                <p className="font-bold text-sm">تم إرسال تنبيه للسوار الذكي</p>
                <p className="text-gray-400 text-xs font-medium mt-0.5">Wearable notification sent</p>
              </div>
              <Bluetooth className="w-5 h-5 text-blue-400 shrink-0" />
            </motion.div>
          )}
        </AnimatePresence>

        {showNav && (
          <div className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center pb-safe">
            <NavBtn icon={<HomeIcon />} label={language === 'ar' ? 'الرئيسية' : 'Home'} active={currentScreen === 'home'} onClick={() => setCurrentScreen('home')} />
            <NavBtn icon={<CalendarDays />} label={language === 'ar' ? 'الجدول' : 'Schedule'} active={currentScreen === 'schedule'} onClick={() => setCurrentScreen('schedule')} />
            
            <div className="relative -top-6">
              <Button 
                onClick={() => setCurrentScreen('add')}
                className="w-14 h-14 rounded-full bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200 flex items-center justify-center p-0"
                data-testid="nav-add-btn"
              >
                <Plus className="w-6 h-6 text-white" />
              </Button>
            </div>

            <NavBtn icon={<Bell />} label={language === 'ar' ? 'الإشعارات' : 'Alerts'} active={currentScreen === 'notifications'} onClick={() => setCurrentScreen('notifications')} />
            <NavBtn icon={<SettingsIcon />} label={language === 'ar' ? 'الإعدادات' : 'Settings'} active={currentScreen === 'settings'} onClick={() => setCurrentScreen('settings')} />
          </div>
        )}
      </div>
    </div>
  );
}

function NavBtn({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick} 
      className={`flex flex-col items-center space-y-1 ${active ? 'text-emerald-600' : 'text-gray-400'}`}
      data-testid={`nav-btn-${label}`}
    >
      <div className={`${active ? 'bg-emerald-50' : ''} p-2 rounded-xl transition-colors`}>
        {icon}
      </div>
      <span className="text-[10px] font-bold">{label}</span>
    </button>
  );
}

function OnboardingScreen({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-full p-6 bg-gradient-to-br from-emerald-600 to-emerald-800 text-white">
      <div className="flex-1 flex flex-col items-center justify-center space-y-8 w-full">
        <div className="relative">
          <div className="w-32 h-32 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
            <HeartPulse className="w-16 h-16 text-white" />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 text-emerald-600 shadow-lg">
            <Pill className="w-6 h-6" />
          </div>
        </div>
        
        <div className="text-center space-y-4 w-full">
          <h1 className="text-5xl font-black font-cairo tracking-tight">دواك</h1>
          <p className="text-emerald-100 text-xl font-medium">
            دواؤك في وقته دائماً
          </p>
          <p className="text-emerald-200/80 text-sm">
            Your medication, always on time
          </p>
        </div>

        <div className="flex justify-center gap-6 w-full pt-8">
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold">آمن</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Heart className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold">موثوق</span>
          </div>
          <div className="flex flex-col items-center gap-2">
            <div className="w-12 h-12 rounded-full bg-white/10 flex items-center justify-center">
              <Watch className="w-6 h-6" />
            </div>
            <span className="text-sm font-bold">ذكي</span>
          </div>
        </div>
      </div>

      <div className="w-full space-y-4 mb-8">
        <Button onClick={onNext} className="w-full h-16 rounded-2xl bg-white text-emerald-700 hover:bg-gray-50 text-xl font-bold shadow-lg" data-testid="btn-lang-ar">
          العربية
        </Button>
        <Button onClick={onNext} variant="outline" className="w-full h-16 rounded-2xl border-2 border-white/30 text-white hover:bg-white/10 text-xl font-bold" data-testid="btn-lang-en">
          English
        </Button>
      </div>
    </div>
  );
}

function LoginScreen({ onLogin }: { onLogin: () => void }) {
  const [step, setStep] = useState(1);
  
  return (
    <div className="flex flex-col min-h-full">
      <div className="h-48 bg-emerald-600 rounded-b-[40px] flex items-center justify-center relative shadow-lg">
        <div className="text-center text-white">
          <h1 className="text-4xl font-black font-cairo">دواك</h1>
        </div>
      </div>

      <div className="flex-1 p-6 pt-10 space-y-8">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-gray-900">تسجيل الدخول</h2>
          <p className="text-gray-500 text-lg">أدخل رقم هاتفك للمتابعة</p>
        </div>

        {step === 1 ? (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-xl font-bold text-gray-700">رقم الهاتف</label>
              <div className="flex gap-3" dir="ltr">
                <div className="flex items-center justify-center px-4 bg-gray-50 border-2 rounded-2xl text-gray-700 font-bold text-lg h-14">
                  🇪🇬 +20
                </div>
                <Input type="tel" placeholder="100 123 4567" className="text-left bg-gray-50 h-14 rounded-2xl border-2 text-lg font-bold" data-testid="input-phone" />
              </div>
            </div>
            
            <div className="space-y-4">
              <Button className="w-full h-14 rounded-2xl text-xl font-bold bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200" onClick={() => setStep(2)} data-testid="btn-send-otp">
                متابعة
              </Button>
              
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-gray-200"></div>
                <span className="flex-shrink-0 mx-4 text-gray-400 font-medium">أو</span>
                <div className="flex-grow border-t border-gray-200"></div>
              </div>
              
              <Button variant="outline" className="w-full h-14 rounded-2xl text-lg font-bold border-2 hover:bg-gray-50 text-gray-700" onClick={onLogin}>
                تسجيل الدخول بـ Google
              </Button>
            </div>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="space-y-4">
              <label className="text-xl font-bold text-gray-700">رمز التحقق</label>
              <div className="flex gap-2 justify-center" dir="ltr">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <Input key={i} className="w-12 h-14 text-center text-2xl font-bold bg-gray-50 border-2 rounded-xl" maxLength={1} />
                ))}
              </div>
            </div>
            
            <div className="space-y-4">
              <Button className="w-full h-14 rounded-2xl text-xl font-bold bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200" onClick={onLogin} data-testid="btn-verify-otp">
                تأكيد الدخول
              </Button>
              <Button variant="ghost" className="w-full text-gray-500 font-bold h-14 text-lg rounded-2xl" onClick={() => setStep(1)}>
                تعديل رقم الهاتف
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function HomeScreen({ meds, onToggle, onGoPremium, onGoChat, onGoDevices }: any) {
  const takenCount = meds.filter((m:any) => m.status === 'taken').length;
  const progress = Math.round((takenCount / meds.length) * 100) || 0;
  const missedMeds = meds.filter((m:any) => m.status === 'missed');
  
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  const todayStr = new Date().toLocaleDateString('ar-EG', options as any);

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-full">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded-3xl shadow-sm">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 font-cairo">مرحباً، أحمد 👋</h1>
          <p className="text-gray-500 text-sm font-medium">{todayStr}</p>
        </div>
        <Avatar className="w-14 h-14 border-4 border-emerald-100 bg-emerald-50">
          <AvatarFallback className="text-emerald-700 text-xl font-black">أ</AvatarFallback>
        </Avatar>
      </div>

      {/* Missed Dose Alert */}
      {missedMeds.length > 0 && (
        <motion.div
          animate={{ x: [0, -6, 6, -4, 4, -2, 2, 0] }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          <Card className="bg-red-50 border-0 border-r-4 border-r-red-500 shadow-md shadow-red-100">
            <CardContent className="p-4 flex items-center gap-4">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center shrink-0"
              >
                <AlertCircle className="w-6 h-6 text-red-600" />
              </motion.div>
              <div className="flex-1">
                <h3 className="font-bold text-red-900 text-lg">⚠️ فاتتك جرعة!</h3>
                <p className="text-red-700 font-medium">{missedMeds[0].name}</p>
                <Button onClick={() => onToggle(missedMeds[0].id)} className="mt-2 h-10 w-full bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold active:scale-95 transition-transform">
                  اضغط للتسجيل الآن
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Next Dose Prominent Card */}
      <Card className="bg-gradient-to-bl from-emerald-600 to-emerald-800 text-white overflow-hidden relative border-0 shadow-xl shadow-emerald-200">
        <div className="absolute left-0 top-0 w-40 h-40 bg-white/10 rounded-full blur-3xl -ml-10 -mt-10"></div>
        <CardContent className="p-6 relative z-10 space-y-4">
          <div className="flex justify-between items-start">
            <div className="space-y-1">
              <span className="text-emerald-100 font-bold bg-white/20 px-3 py-1 rounded-full text-sm inline-block">الجرعة القادمة</span>
              <h2 className="text-2xl font-black font-cairo leading-tight mt-2">ميتفورمين ٨٥٠ مج</h2>
              <p className="text-emerald-100 text-lg font-medium flex items-center gap-2">
                <Clock className="w-5 h-5" /> بعد ٤٥ دقيقة — ٢:٠٠ م
              </p>
            </div>
            <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
              <Pill className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <Button className="w-full h-14 rounded-2xl bg-white text-emerald-700 hover:bg-gray-100 font-bold text-lg shadow-md">
            تسجيل الجرعة الآن
          </Button>
        </CardContent>
      </Card>

      {/* Adherence Progress */}
      <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4 border">
        <div className="flex justify-between items-end">
          <h3 className="font-bold text-gray-900 text-lg">التزامك اليوم: {progress}٪</h3>
          <span className="text-3xl font-black text-emerald-600">{takenCount}/{meds.length}</span>
        </div>
        <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="h-full bg-emerald-500 rounded-full"
          />
        </div>
        <p className="text-gray-500 font-medium text-center">أنت في المسار الصحيح ❤️</p>
      </div>

      {/* Premium Banner */}
      <Card className="bg-gradient-to-r from-amber-50 to-amber-100 border-amber-200 cursor-pointer shadow-sm" onClick={onGoPremium}>
        <CardContent className="p-4 flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-200 rounded-full flex items-center justify-center text-amber-700 shrink-0">
            <Lock className="w-6 h-6" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-amber-900 text-lg">افتح مراقبة الأسرة</h4>
            <p className="text-sm font-medium text-amber-700 mt-1">٩٩ج.م/شهر — جرّب ٧ أيام مجاناً</p>
          </div>
          <ChevronRight className="w-6 h-6 text-amber-500" />
        </CardContent>
      </Card>

      {/* Doctor Chat Quick Access */}
      <motion.div whileTap={{ scale: 0.97 }}>
        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-2 border-blue-100 cursor-pointer shadow-sm hover:shadow-md hover:border-blue-300 transition-all" onClick={onGoChat}>
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
              <MessageCircle className="w-6 h-6" />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-blue-900 text-lg">تحدث مع طبيبك</h4>
              <p className="text-sm font-medium text-blue-600 mt-0.5">⏱ رد خلال ٣٠ دقيقة · دواك بريميوم</p>
            </div>
            <Lock className="w-5 h-5 text-blue-300 shrink-0" />
          </CardContent>
        </Card>
      </motion.div>

      {/* Today's Meds Timeline */}
      <div className="space-y-6">
        <h3 className="font-black text-xl text-gray-900 font-cairo">أدوية اليوم</h3>
        
        {['morning', 'noon', 'night'].map(period => {
          const periodMeds = meds.filter((m:any) => m.period === period);
          if (periodMeds.length === 0) return null;
          
          const isMorning = period === 'morning';
          const isNoon = period === 'noon';
          
          const periodLabel = isMorning ? 'الصباح' : isNoon ? 'الظهيرة' : 'المساء';
          const periodIcon = isMorning ? <Sun className="w-6 h-6 text-amber-500" /> : isNoon ? <Cloud className="w-6 h-6 text-blue-400" /> : <Moon className="w-6 h-6 text-indigo-500" />;
          const borderColor = isMorning ? 'border-amber-400' : isNoon ? 'border-blue-400' : 'border-indigo-400';
          
          return (
            <div key={period} className="space-y-4">
              <h4 className={`text-lg font-bold text-gray-700 flex items-center gap-2 border-r-4 ${borderColor} pr-3`}>
                {periodIcon} {periodLabel}
              </h4>
              <div className="space-y-3 pl-2">
                {periodMeds.map((med:any) => (
                  <MedCard key={med.id} med={med} onToggle={() => onToggle(med.id)} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Smart Bracelet Widget */}
      <motion.div whileTap={{ scale: 0.98 }}>
        <Card className="bg-white border-2 border-gray-100 shadow-sm cursor-pointer hover:border-emerald-200 hover:shadow-md transition-all" onClick={onGoDevices}>
          <CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                <Watch className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-bold text-gray-900">الأجهزة المتصلة</h4>
                <div className="flex items-center gap-2 text-xs font-medium text-gray-500 mt-1">
                  <span className="text-emerald-600">سوار: متصل ✅</span>
                  <span>•</span>
                  <span>بطارية: 78%</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-gray-400">إدارة</span>
              <ChevronRight className="w-5 h-5 text-gray-400" />
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}

function MedCard({ med, onToggle }: { med: any, onToggle: () => void }) {
  const isTaken = med.status === 'taken';
  const isMissed = med.status === 'missed';
  const [justTaken, setJustTaken] = useState(false);

  const handleToggle = () => {
    if (!isTaken) {
      setJustTaken(true);
      setTimeout(() => setJustTaken(false), 800);
    }
    onToggle();
  };

  return (
    <motion.div
      layout
      animate={justTaken ? { scale: [1, 1.03, 1] } : {}}
      transition={{ duration: 0.4 }}
    >
      <Card className={`transition-all overflow-hidden border-2 ${
        isTaken ? 'bg-gray-50 border-gray-100' : 
        isMissed ? 'bg-red-50 border-red-200' : 
        'bg-white border-gray-200 shadow-md'
      }`}>
        <CardContent className="p-0">
          <div className="p-4 flex items-center gap-4">
            <motion.button 
              onClick={handleToggle}
              whileTap={{ scale: 0.88 }}
              className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center transition-all shadow-sm ${
                isTaken ? 'bg-emerald-500 text-white' : 
                isMissed ? 'bg-red-100 text-red-500 hover:bg-red-200' : 
                'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}
              data-testid={`btn-toggle-med-${med.id}`}
            >
              <AnimatePresence mode="wait">
                {isTaken ? (
                  <motion.div key="check" initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} transition={{ duration: 0.25 }}>
                    <CheckCircle2 className="w-8 h-8" />
                  </motion.div>
                ) : (
                  <motion.div key="pill" initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} transition={{ duration: 0.2 }}>
                    <Pill className="w-7 h-7" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
            
            <div className="flex-1">
              <h4 className={`font-bold text-lg ${isTaken ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
                {med.name}
              </h4>
              <div className="flex items-center gap-2 mt-1">
                <p className={`text-base font-bold ${isTaken ? 'text-gray-400' : isMissed ? 'text-red-600' : 'text-emerald-600'}`}>
                  {med.time}
                </p>
                {isMissed && <Badge variant="destructive" className="text-xs px-2 py-0 h-5">متأخر</Badge>}
                {isTaken && <Badge variant="outline" className="text-xs px-2 py-0 h-5 bg-emerald-50 border-emerald-200 text-emerald-600">✓ مكتمل</Badge>}
              </div>
            </div>

            {justTaken && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-2xl">
                ✅
              </motion.div>
            )}
          </div>
          
          {(!isTaken) && (
            <div className={`px-4 py-3 border-t flex justify-end ${isMissed ? 'bg-red-100/50' : 'bg-gray-50'}`}>
              <motion.div whileTap={{ scale: 0.96 }} className="w-full">
                <Button 
                  onClick={handleToggle} 
                  className={`w-full h-12 rounded-xl font-bold text-lg ${
                    isMissed ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-emerald-600 hover:bg-emerald-700 text-white'
                  }`}
                >
                  تسجيل الجرعة
                </Button>
              </motion.div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}

function ScheduleScreen({ meds, onToggle }: any) {
  const days = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
  
  const takenCount = meds.filter((m:any) => m.status === 'taken').length;
  const missedCount = meds.filter((m:any) => m.status === 'missed').length;
  const upcomingCount = meds.length - takenCount - missedCount;

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-full">
      <h1 className="text-3xl font-black font-cairo text-gray-900">الجدول الأسبوعي</h1>
      
      {/* Week Strip */}
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar" dir="rtl">
        {days.map((day, i) => (
          <button key={day} className={`flex-shrink-0 w-20 py-4 rounded-2xl border-2 flex flex-col items-center gap-2 ${i === 1 ? 'bg-emerald-600 text-white border-emerald-600 shadow-lg shadow-emerald-200' : 'bg-white text-gray-500 border-gray-200'}`}>
            <span className="text-sm font-bold">{day}</span>
            <span className="text-2xl font-black">{i + 12}</span>
          </button>
        ))}
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="bg-emerald-100 p-4 rounded-2xl flex flex-col items-center justify-center border border-emerald-200">
          <span className="text-2xl font-black text-emerald-700">{takenCount}</span>
          <span className="text-sm font-bold text-emerald-600">مكتمل</span>
        </div>
        <div className="bg-amber-100 p-4 rounded-2xl flex flex-col items-center justify-center border border-amber-200">
          <span className="text-2xl font-black text-amber-700">{upcomingCount}</span>
          <span className="text-sm font-bold text-amber-600">قادم</span>
        </div>
        <div className="bg-red-100 p-4 rounded-2xl flex flex-col items-center justify-center border border-red-200">
          <span className="text-2xl font-black text-red-700">{missedCount}</span>
          <span className="text-sm font-bold text-red-600">فائت</span>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-6 relative before:absolute before:inset-0 before:right-5 before:w-1 before:bg-gray-200 before:rounded-full">
        {meds.map((med:any) => {
          const isTaken = med.status === 'taken';
          const isMissed = med.status === 'missed';
          
          return (
            <div key={med.id} className="relative flex items-center gap-6 z-10">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-4 border-gray-50 shadow-sm ${
                isTaken ? 'bg-emerald-500 text-white' : 
                isMissed ? 'bg-red-500 text-white' : 'bg-amber-400 text-white'
              }`}>
                {isTaken ? <CheckCircle2 className="w-5 h-5" /> : isMissed ? <X className="w-5 h-5" /> : <Clock className="w-5 h-5" />}
              </div>
              <div className="flex-1">
                <MedCard med={med} onToggle={() => onToggle(med.id)} />
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}

function AddMedicationScreen({ onBack }: { onBack: () => void }) {
  return (
    <div className="flex flex-col h-[100dvh] bg-white">
      <div className="bg-emerald-600 text-white p-4 pt-8 flex items-center gap-4 sticky top-0 z-10 rounded-b-3xl shadow-md">
        <button onClick={onBack} className="w-12 h-12 flex items-center justify-center hover:bg-white/20 rounded-full transition-colors" data-testid="btn-back">
          <ChevronRight className="w-8 h-8 rotate-180" />
        </button>
        <h1 className="text-2xl font-bold font-cairo">إضافة دواء جديد</h1>
      </div>

      <div className="p-6 space-y-8 flex-1 overflow-y-auto pb-32">
        
        <div className="space-y-3">
          <label className="text-xl font-bold text-gray-900">اسم الدواء</label>
          <Input placeholder="بحث عن دواء... (مثال: بانادول)" className="h-16 text-lg font-medium rounded-2xl bg-gray-50 border-2" data-testid="input-med-name" />
        </div>
        
        <div className="space-y-3">
          <label className="text-xl font-bold text-gray-900">الجرعة</label>
          <Input placeholder="مثال: حبة واحدة ٥٠٠ مج" className="h-16 text-lg font-medium rounded-2xl bg-gray-50 border-2" data-testid="input-med-dose" />
        </div>

        <div className="space-y-3">
          <label className="text-xl font-bold text-gray-900">التكرار اليومي</label>
          <div className="grid grid-cols-4 gap-3">
            {[1, 2, 3, 4].map(n => (
              <Button key={n} variant="outline" className={`h-16 rounded-2xl border-2 text-lg font-bold ${n === 2 ? 'bg-emerald-50 border-emerald-600 text-emerald-700' : 'bg-white hover:bg-gray-50 text-gray-600'}`}>
                {n}x
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xl font-bold text-gray-900">أوقات التذكير</label>
          <div className="grid grid-cols-3 gap-3">
            <button className="h-24 rounded-2xl border-2 bg-amber-50 border-amber-400 flex flex-col items-center justify-center gap-2 text-amber-700">
              <Sun className="w-8 h-8" />
              <span className="font-bold text-sm">الصباح</span>
            </button>
            <button className="h-24 rounded-2xl border-2 bg-blue-50 border-blue-400 flex flex-col items-center justify-center gap-2 text-blue-700">
              <Cloud className="w-8 h-8" />
              <span className="font-bold text-sm">الظهيرة</span>
            </button>
            <button className="h-24 rounded-2xl border-2 bg-gray-50 border-gray-200 flex flex-col items-center justify-center gap-2 text-gray-400">
              <Moon className="w-8 h-8" />
              <span className="font-bold text-sm">المساء</span>
            </button>
          </div>
        </div>

        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2">
          <div className="space-y-1">
            <h4 className="text-lg font-bold text-gray-900">تفعيل التذكير</h4>
            <p className="text-sm font-medium text-gray-500">تلقي إشعارات وقت الدواء</p>
          </div>
          <Switch defaultChecked className="scale-125" />
        </div>
      </div>

      <div className="p-6 bg-white border-t fixed bottom-0 left-0 right-0 w-full max-w-[390px] mx-auto shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <Button className="w-full h-16 rounded-2xl text-xl font-bold bg-emerald-600 hover:bg-emerald-700 shadow-lg shadow-emerald-200" onClick={onBack} data-testid="btn-save-med">
          حفظ الدواء
        </Button>
      </div>
    </div>
  );
}

function NotificationsScreen() {
  const notifs = [
    { id: 1, type: 'warning', title: 'تنبيه هام', desc: 'تجاوزت موعد دواء أتورفاستاتين الليلي.', time: 'منذ ١٠ دقائق' },
    { id: 2, type: 'success', title: 'عمل ممتاز!', desc: 'لقد أخذت جميع أدوية الصباح بنجاح.', time: 'منذ ساعتين' },
    { id: 3, type: 'info', title: 'تذكير قادم', desc: 'موعد دواء ميتفورمين بعد ٤٥ دقيقة.', time: 'منذ ٣ ساعات' },
  ];

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-full">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-black font-cairo text-gray-900">الإشعارات</h1>
        <Badge className="bg-red-500 text-white font-bold px-3 py-1 text-base">3 جديدة</Badge>
      </div>
      
      <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
        <Badge variant="outline" className="px-4 py-2 text-sm font-bold bg-white border-2">الكل</Badge>
        <Badge variant="outline" className="px-4 py-2 text-sm font-bold bg-red-50 text-red-600 border-red-200">الفائتة</Badge>
        <Badge variant="outline" className="px-4 py-2 text-sm font-bold bg-amber-50 text-amber-600 border-amber-200">التذكيرات</Badge>
        <Badge variant="outline" className="px-4 py-2 text-sm font-bold bg-emerald-50 text-emerald-600 border-emerald-200">المكتملة</Badge>
      </div>

      <div className="space-y-4">
        {notifs.map(n => (
          <Card key={n.id} className={`border-0 border-r-8 shadow-sm ${n.type === 'warning' ? 'border-r-red-500' : n.type === 'success' ? 'border-r-emerald-500' : 'border-r-blue-500'}`}>
            <CardContent className="p-5 flex gap-4 relative">
              <button className="absolute top-4 left-4 text-gray-400 hover:text-gray-600">
                <X className="w-5 h-5" />
              </button>
              
              <div className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 ${n.type === 'warning' ? 'bg-red-100 text-red-600' : n.type === 'success' ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'}`}>
                <Bell className="w-6 h-6" />
              </div>
              <div className="pr-2">
                <h4 className="font-bold text-lg text-gray-900">{n.title}</h4>
                <p className="text-base font-medium text-gray-600 mt-1 leading-snug">{n.desc}</p>
                <p className="text-sm font-bold text-gray-400 mt-3">{n.time}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

const INITIAL_MESSAGES = [
  { id: 1, from: 'doctor', text: 'مرحباً أحمد، كيف تشعر اليوم مع الجرعة الجديدة لميتفورمين؟', time: '١٠:٠٠ ص' },
  { id: 2, from: 'user',   text: 'الحمد لله يا دكتورة، أشعر بتحسن أفضل بكثير ولا يوجد دوار.', time: '١٠:٠٥ ص' },
  { id: 3, from: 'doctor', text: 'ممتاز! استمر على نفس الجرعة. إذا ظهرت أي أعراض جانبية أخبرني فوراً.', time: '١٠:٠٧ ص' },
];

function DoctorChatScreen({ onBack, isPremium, onGoPremium }: { onBack: () => void; isPremium: boolean; onGoPremium: () => void }) {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = { current: null as HTMLDivElement | null };

  const sendMessage = () => {
    const text = inputText.trim();
    if (!text) return;
    const now = new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now(), from: 'user', text, time: now }]);
    setInputText('');
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1, from: 'doctor',
        text: 'شكراً على تواصلك. سأراجع حالتك وأرد عليك قريباً. 🩺',
        time: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      }]);
    }, 2500);
  };

  if (!isPremium) {
    return (
      <div className="flex flex-col h-[100dvh] bg-gray-50">
        <div className="bg-white p-4 border-b flex items-center gap-4 shadow-sm">
          <button onClick={onBack} className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
            <ChevronRight className="w-8 h-8 rotate-180" />
          </button>
          <h1 className="text-xl font-bold font-cairo">محادثة الطبيب</h1>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8 text-center">
          <motion.div
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-24 h-24 bg-amber-100 rounded-full flex items-center justify-center"
          >
            <Lock className="w-12 h-12 text-amber-500" />
          </motion.div>
          <div className="space-y-3">
            <h2 className="text-2xl font-black font-cairo text-gray-900">ميزة بريميوم 🔒</h2>
            <p className="text-lg font-medium text-gray-600 leading-relaxed">
              راقب أحبائك في الوقت الفعلي وتحدث مع الأطباء مع دواك بريميوم
            </p>
          </div>
          <div className="bg-white p-6 rounded-3xl border-2 border-amber-200 space-y-4 w-full shadow-sm">
            <div className="flex items-center gap-3 text-right">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="font-medium text-gray-700">محادثة مباشرة مع الأطباء</span>
            </div>
            <div className="flex items-center gap-3 text-right">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="font-medium text-gray-700">رد خلال ٣٠ دقيقة ⏱</span>
            </div>
            <div className="flex items-center gap-3 text-right">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
              <span className="font-medium text-gray-700">تقارير صحية مفصلة</span>
            </div>
          </div>
          <motion.div whileTap={{ scale: 0.96 }} className="w-full">
            <Button
              onClick={onGoPremium}
              className="w-full h-16 rounded-2xl text-xl font-bold bg-amber-500 hover:bg-amber-600 text-amber-950 shadow-lg shadow-amber-200"
            >
              <Star className="w-5 h-5 ml-2 fill-current" />
              الترقية إلى دواك بريميوم — ٩٩ ج.م/شهر
            </Button>
          </motion.div>
          <p className="text-sm text-gray-400 font-medium">جرّب ٧ أيام مجاناً • بدون بطاقة بنكية</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-gray-50">
      <div className="bg-emerald-50 border-b border-emerald-100 text-emerald-800 text-center py-2 text-sm font-bold flex items-center justify-center gap-2">
        <Star className="w-4 h-4 fill-current text-amber-500" /> دواك بريميوم — الدكتور سيرد خلال ٣٠ دقيقة ⏱
      </div>
      <div className="bg-white p-4 border-b flex items-center gap-4 sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
          <ChevronRight className="w-8 h-8 rotate-180" />
        </button>
        <div className="relative">
          <Avatar className="w-12 h-12 border-2 border-emerald-100">
            <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold text-lg">د</AvatarFallback>
            <AvatarImage src="https://i.pravatar.cc/150?u=doctor" />
          </Avatar>
          <span className="absolute bottom-0 left-0 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full"></span>
        </div>
        <div>
          <h1 className="text-xl font-bold font-cairo">د. سارة أحمد</h1>
          <p className="text-sm font-bold text-emerald-600 flex items-center gap-1.5 mt-0.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
            {isTyping ? 'يكتب...' : 'متصل الآن · آخر ظهور: الآن'}
          </p>
        </div>
      </div>

      <div className="p-4 flex-1 overflow-y-auto space-y-4">
        {messages.map(msg => (
          <motion.div
            key={msg.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.from === 'doctor' && (
              <Avatar className="w-8 h-8 ml-2 shrink-0 self-end">
                <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold text-sm">د</AvatarFallback>
                <AvatarImage src="https://i.pravatar.cc/150?u=doctor" />
              </Avatar>
            )}
            <div className={`p-4 rounded-3xl max-w-[78%] shadow-sm ${
              msg.from === 'user'
                ? 'bg-emerald-600 text-white rounded-tl-sm shadow-emerald-200'
                : 'bg-white text-gray-800 rounded-tr-sm border border-gray-100'
            }`}>
              <p className="text-base font-medium leading-relaxed">{msg.text}</p>
              <p className={`text-xs font-bold mt-1.5 ${msg.from === 'user' ? 'text-emerald-200 text-right' : 'text-gray-400 text-left'}`}>
                {msg.time}
              </p>
            </div>
          </motion.div>
        ))}

        {isTyping && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex justify-start items-end gap-2">
            <Avatar className="w-8 h-8 shrink-0">
              <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold text-sm">د</AvatarFallback>
            </Avatar>
            <div className="bg-white border border-gray-100 rounded-3xl rounded-tr-sm px-5 py-4 shadow-sm flex gap-1.5 items-center">
              {[0, 0.2, 0.4].map((delay, i) => (
                <motion.span
                  key={i}
                  className="w-2.5 h-2.5 bg-gray-400 rounded-full"
                  animate={{ y: [0, -5, 0] }}
                  transition={{ duration: 0.7, repeat: Infinity, delay }}
                />
              ))}
            </div>
          </motion.div>
        )}
        <div ref={el => { messagesEndRef.current = el; }} />
      </div>

      <div className="p-4 bg-white border-t">
        <div className="flex gap-3">
          <Input
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
            placeholder="اكتب رسالتك للدكتور..."
            className="flex-1 bg-gray-50 h-14 rounded-full px-6 text-lg font-medium border-2"
          />
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button
              onClick={sendMessage}
              disabled={!inputText.trim()}
              className="w-14 h-14 rounded-full shrink-0 p-0 bg-emerald-600 hover:bg-emerald-700 shadow-md disabled:opacity-40"
            >
              <Send className="w-6 h-6 -ml-0.5 text-white" />
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function SettingsScreen({ language, setLanguage, onLogout, onGoDevices }: { language: 'ar' | 'en', setLanguage: (l: 'ar' | 'en') => void, onLogout: () => void, onGoDevices: () => void }) {
  const [bracelet] = useState({ connected: true, battery: 78, lastSync: 'منذ ٣ دقائق', lastVibration: '٠٨:٠٥ ص' });

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-full">
      <h1 className="text-3xl font-black font-cairo text-gray-900">الإعدادات</h1>
      
      {/* Profile Card */}
      <Card className="border-0 shadow-sm overflow-hidden">
        <CardContent className="p-6 flex items-center gap-4">
          <Avatar className="w-20 h-20 border-4 border-emerald-100">
            <AvatarFallback className="text-emerald-700 text-3xl font-black">أ</AvatarFallback>
            <AvatarImage src="https://i.pravatar.cc/150?u=ahmed" />
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 font-cairo">أحمد محمد</h2>
            <p className="text-gray-500 font-medium text-lg mt-1" dir="ltr">+20 100 123 4567</p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-6">
        <h3 className="font-bold text-xl text-gray-900">تفضيلات التطبيق</h3>
        <div className="bg-white rounded-3xl border-2 overflow-hidden shadow-sm">
          <div className="w-full p-4 flex items-center justify-between border-b-2">
            <div className="flex items-center gap-4">
              <Globe className="w-6 h-6 text-gray-400" />
              <span className="font-bold text-lg text-gray-700">اللغة / Language</span>
            </div>
            <div className="flex bg-gray-100 rounded-xl p-1">
              <button 
                onClick={() => setLanguage('ar')}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${language === 'ar' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500'}`}
              >
                🇪🇬 العربية
              </button>
              <button 
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors ${language === 'en' ? 'bg-white shadow-sm text-emerald-600' : 'text-gray-500'}`}
              >
                🇬🇧 EN
              </button>
            </div>
          </div>
          <button className="w-full p-5 flex items-center gap-4 hover:bg-gray-50 transition-colors">
            <Bell className="w-6 h-6 text-gray-400" />
            <span className="font-bold text-lg text-gray-700">تفضيلات الإشعارات</span>
            <ChevronRight className="w-6 h-6 text-gray-400 mr-auto rotate-180" />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <h3 className="font-bold text-xl text-gray-900">الأجهزة المتصلة</h3>
        <Card className="border-2 border-emerald-100 shadow-sm overflow-hidden relative">
          <div className="absolute top-0 right-0 w-full h-2 bg-emerald-500"></div>
          <CardContent className="p-6 space-y-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600">
                  <Watch className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="font-bold text-xl text-gray-900">السوار الذكي</h4>
                  <p className="text-emerald-600 font-bold mt-1">متصل ✅</p>
                </div>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl">
              <div>
                <p className="text-sm font-bold text-gray-500">آخر مزامنة</p>
                <p className="font-bold text-gray-900 mt-1">{bracelet.lastSync}</p>
              </div>
              <div>
                <p className="text-sm font-bold text-gray-500">آخر اهتزاز</p>
                <p className="font-bold text-gray-900 mt-1">{bracelet.lastVibration}</p>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-bold text-gray-700 flex items-center gap-2"><Battery className="w-5 h-5" /> البطارية</span>
                <span className="font-bold text-emerald-600">{bracelet.battery}%</span>
              </div>
              <div className="h-3 w-full bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${bracelet.battery}%` }}></div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-12 rounded-2xl border-2 border-emerald-200 text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100">
                اختبار الاهتزاز
              </Button>
              <Button onClick={onGoDevices} className="h-12 rounded-2xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
                <Bluetooth className="w-5 h-5 ml-2" /> إدارة الأجهزة
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <Button variant="destructive" className="w-full h-16 rounded-2xl text-xl font-bold mt-8 shadow-md" onClick={onLogout} data-testid="btn-logout">
        <LogOut className="w-6 h-6 ml-2" />
        تسجيل الخروج
      </Button>
    </div>
  );
}

function SubscriptionScreen({ onBack, onUpgrade }: { onBack: () => void; onUpgrade?: () => void }) {
  const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  return (
    <div className="flex flex-col h-full bg-gray-50">
      <div className="bg-white p-4 pt-8 border-b flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <button onClick={onBack} className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 rounded-full transition-colors">
          <ChevronRight className="w-8 h-8 rotate-180" />
        </button>
        <h1 className="text-2xl font-black font-cairo">الاشتراكات</h1>
        <div className="w-12"></div>
      </div>

      <div className="p-6 space-y-8 pb-32 overflow-y-auto flex-1">
        
        {/* Toggle */}
        <div className="bg-gray-200 p-1.5 rounded-2xl flex relative">
          <button 
            className={`flex-1 py-3 text-lg font-bold z-10 transition-colors ${billing === 'monthly' ? 'text-gray-900' : 'text-gray-500'}`}
            onClick={() => setBilling('monthly')}
          >
            شهري
          </button>
          <button 
            className={`flex-1 py-3 text-lg font-bold z-10 transition-colors ${billing === 'yearly' ? 'text-gray-900' : 'text-gray-500'}`}
            onClick={() => setBilling('yearly')}
          >
            سنوي (وفر ٢٠٪)
          </button>
          <div 
            className={`absolute top-1.5 bottom-1.5 w-[calc(50%-6px)] bg-white rounded-xl shadow-sm transition-all duration-300 ${billing === 'monthly' ? 'right-1.5' : 'translate-x-[-100%] right-[calc(50%+4px)]'}`}
          ></div>
        </div>

        {/* Premium Plan */}
        <Card className="bg-gradient-to-b from-emerald-600 to-emerald-800 text-white border-0 shadow-2xl shadow-emerald-300 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-4">
            <Badge className="bg-amber-400 text-amber-900 font-bold px-3 py-1">الأكثر شعبية</Badge>
          </div>
          <CardContent className="p-8 space-y-6">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-2">
              <Star className="w-8 h-8 text-amber-300 fill-amber-300" />
            </div>
            
            <div>
              <h2 className="text-3xl font-black font-cairo">دواك بريميوم</h2>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="text-5xl font-black">{billing === 'monthly' ? '٩٩' : '٧٩٩'}</span>
                <span className="text-xl text-emerald-200 font-bold">ج.م / {billing === 'monthly' ? 'شهر' : 'سنة'}</span>
              </div>
            </div>

            <ul className="space-y-4 text-white text-lg font-medium pt-4">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-300 shrink-0" />
                <span>كل مميزات الباقة المجانية</span>
              </li>
              <li className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-amber-300 shrink-0" />
                <span className="font-bold">مراقبة الأسرة عن بعد</span>
              </li>
              <li className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-amber-300 shrink-0" />
                <span className="font-bold">محادثة مباشرة مع الأطباء</span>
              </li>
              <li className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-amber-300 shrink-0" />
                <span className="font-bold">تقارير صحية مفصلة للتحاليل</span>
              </li>
              <li className="flex items-center gap-3">
                <Lock className="w-6 h-6 text-amber-300 shrink-0" />
                <span className="font-bold">تنبيهات السوار الذكي المتقدمة</span>
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Free Plan */}
        <Card className="bg-white border-4 border-gray-100 shadow-none">
          <CardContent className="p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-black font-cairo text-gray-900">الباقة الأساسية</h2>
              <div className="mt-2 text-3xl font-black text-gray-900">مجاناً</div>
            </div>

            <ul className="space-y-4 text-gray-600 text-lg font-medium pt-2">
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span>تذكيرات الأدوية الأساسية</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span>جدول المواعيد البسيط</span>
              </li>
              <li className="flex items-center gap-3">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 shrink-0" />
                <span>نصيحة اليوم الصحية</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="p-6 bg-white border-t fixed bottom-0 left-0 right-0 w-full max-w-[390px] mx-auto shadow-[0_-10px_20px_rgba(0,0,0,0.05)]">
        <motion.div whileTap={{ scale: 0.96 }}>
          <Button onClick={onUpgrade} className="w-full h-16 rounded-2xl text-xl font-bold bg-amber-500 hover:bg-amber-600 text-amber-950 shadow-lg shadow-amber-200">
            <Star className="w-5 h-5 ml-2 fill-current" /> ابدأ ٧ أيام مجاناً
          </Button>
        </motion.div>
        <p className="text-center text-sm text-gray-400 font-medium mt-3">بدون بطاقة بنكية • يمكن الإلغاء في أي وقت</p>
      </div>
    </div>
  );
}

function DevicesScreen({ onBack }: { onBack: () => void }) {
  const [braceletConnected, setBraceletConnected] = useState(true);
  const [watchConnected, setWatchConnected] = useState(false);
  const [pairing, setPairing] = useState(false);
  const [vibrating, setVibrating] = useState<string | null>(null);
  const [alertSent, setAlertSent] = useState(false);
  const braceletBattery = 78;

  const simulatePair = () => {
    setPairing(true);
    setTimeout(() => { setPairing(false); setWatchConnected(true); }, 2500);
  };

  const testVibration = (device: string) => {
    setVibrating(device);
    setTimeout(() => setVibrating(null), 2000);
  };

  const sendTestAlert = () => {
    setAlertSent(true);
    setTimeout(() => setAlertSent(false), 3000);
  };

  return (
    <div className="p-5 space-y-5 bg-gray-50 min-h-full pb-28">
      <div className="flex items-center gap-3 pt-2">
        <button onClick={onBack} className="w-10 h-10 flex items-center justify-center rounded-full bg-white border shadow-sm">
          <ChevronRight className="w-6 h-6 text-gray-700" />
        </button>
        <h1 className="text-2xl font-black font-cairo text-gray-900">الأجهزة المتصلة</h1>
      </div>

      <Card className="bg-blue-50 border-2 border-blue-100">
        <CardContent className="p-4 flex items-center gap-3">
          <motion.div animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 2, repeat: Infinity }}
            className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 shrink-0">
            <Bluetooth className="w-5 h-5" />
          </motion.div>
          <div className="flex-1">
            <p className="font-bold text-blue-900">البلوتوث نشط</p>
            <p className="text-xs font-medium text-blue-600 mt-0.5">جهازان في النطاق المجاور</p>
          </div>
          <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse shrink-0"></span>
        </CardContent>
      </Card>

      {/* Smart Bracelet */}
      <Card className={`border-2 shadow-sm transition-all ${braceletConnected ? 'border-emerald-200' : 'border-gray-200'}`}>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${braceletConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                <Watch className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">السوار الذكي</h3>
                <p className={`font-bold text-sm ${braceletConnected ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {braceletConnected ? 'متصل ✅' : 'غير متصل'}
                </p>
              </div>
            </div>
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => setBraceletConnected(!braceletConnected)}
              className={`h-8 px-4 rounded-full text-xs font-bold transition-colors ${braceletConnected ? 'bg-red-50 text-red-600 hover:bg-red-100' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}>
              {braceletConnected ? 'قطع الاتصال' : 'اتصال'}
            </motion.button>
          </div>

          <AnimatePresence>
            {braceletConnected && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-2xl text-sm">
                  <div><p className="font-bold text-gray-500">آخر مزامنة</p><p className="font-bold text-gray-900 mt-0.5">منذ ٣ دقائق</p></div>
                  <div><p className="font-bold text-gray-500">آخر اهتزاز</p><p className="font-bold text-gray-900 mt-0.5">٠٨:٠٥ ص</p></div>
                  <div><p className="font-bold text-gray-500">قوة الإشارة</p><p className="font-bold text-emerald-600 mt-0.5">ممتازة ████</p></div>
                  <div><p className="font-bold text-gray-500">الإصدار</p><p className="font-bold text-gray-900 mt-0.5">v2.1.4</p></div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-gray-700 flex items-center gap-2 text-sm"><Battery className="w-4 h-4" /> البطارية</span>
                    <span className="font-bold text-emerald-600 text-sm">{braceletBattery}%</span>
                  </div>
                  <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                    <motion.div initial={{ width: 0 }} animate={{ width: `${braceletBattery}%` }} transition={{ duration: 1, ease: "easeOut" }}
                      className="h-full bg-emerald-500 rounded-full" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button onClick={() => testVibration('bracelet')} variant="outline"
                      className="w-full h-12 rounded-2xl border-emerald-200 text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 text-sm">
                      {vibrating === 'bracelet' ? (
                        <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>📳 يهتز...</motion.span>
                      ) : 'اختبار الاهتزاز'}
                    </Button>
                  </motion.div>
                  <motion.div whileTap={{ scale: 0.95 }}>
                    <Button onClick={sendTestAlert} variant="outline"
                      className={`w-full h-12 rounded-2xl font-bold text-sm transition-all ${alertSent ? 'border-emerald-500 bg-emerald-50 text-emerald-700' : 'border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100'}`}>
                      {alertSent ? '✅ تم الإرسال!' : <span className="flex items-center gap-1.5 justify-center"><Zap className="w-4 h-4" /> إرسال تنبيه</span>}
                    </Button>
                  </motion.div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>

      {/* Smart Watch */}
      <Card className={`border-2 shadow-sm transition-all ${watchConnected ? 'border-emerald-200' : 'border-gray-200'}`}>
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${watchConnected ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
                <Watch className="w-7 h-7" />
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">الساعة الذكية</h3>
                <p className={`font-bold text-sm ${pairing ? 'text-blue-600' : watchConnected ? 'text-emerald-600' : 'text-gray-400'}`}>
                  {pairing ? 'جاري الاقتران...' : watchConnected ? 'متصل ✅' : 'غير متصل'}
                </p>
              </div>
            </div>
            {!watchConnected && !pairing && (
              <motion.button whileTap={{ scale: 0.95 }} onClick={simulatePair}
                className="h-8 px-4 rounded-full text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700">
                اقتران
              </motion.button>
            )}
            {pairing && (
              <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                <RefreshCw className="w-6 h-6 text-emerald-600" />
              </motion.div>
            )}
            {watchConnected && !pairing && (
              <button onClick={() => setWatchConnected(false)}
                className="h-8 px-4 rounded-full text-xs font-bold bg-red-50 text-red-600 hover:bg-red-100">
                قطع الاتصال
              </button>
            )}
          </div>

          <AnimatePresence>
            {watchConnected && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="space-y-4 overflow-hidden">
                <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-2xl text-sm">
                  <div><p className="font-bold text-gray-500">آخر مزامنة</p><p className="font-bold text-gray-900 mt-0.5">الآن</p></div>
                  <div><p className="font-bold text-gray-500">قوة الإشارة</p><p className="font-bold text-emerald-600 mt-0.5">جيدة ███░</p></div>
                </div>
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Button onClick={() => testVibration('watch')} variant="outline"
                    className="w-full h-12 rounded-2xl border-emerald-200 text-emerald-700 font-bold bg-emerald-50 hover:bg-emerald-100 text-sm">
                    {vibrating === 'watch' ? (
                      <motion.span animate={{ opacity: [1, 0.4, 1] }} transition={{ duration: 0.5, repeat: Infinity }}>📳 يهتز...</motion.span>
                    ) : 'اختبار الاهتزاز'}
                  </Button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {!watchConnected && !pairing && (
            <div className="bg-gray-50 rounded-2xl p-5 text-center">
              <Wifi className="w-8 h-8 text-gray-300 mx-auto mb-2" />
              <p className="font-bold text-gray-500 text-sm">لم يتم اكتشاف أي ساعة ذكية</p>
              <p className="text-xs font-medium text-gray-400 mt-1">تأكد من تشغيل البلوتوث على ساعتك</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
