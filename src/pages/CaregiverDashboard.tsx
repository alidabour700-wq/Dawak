import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "wouter";
import { 
  Users, Activity, FileText, MessageCircle, LogOut, 
  Bell, Search, ChevronDown, CheckCircle2, AlertTriangle, 
  XCircle, Clock, Download, Phone, PhoneCall,
  Pill, AlertCircle, HeartPulse, X, Watch, Send, MessageSquare
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";

type Page = 'dashboard' | 'tracking' | 'reports' | 'chat';

const PATIENTS = [
  { id: 1, name: "أحمد محمد", relation: "الأب", age: 68, status: "on-track", adherence: 85, doses: "٥/٦", nextMed: "١٠:٠٠ م - أتورفاستاتين" },
  { id: 2, name: "فاطمة علي", relation: "الأم", age: 62, status: "warning", adherence: 62, doses: "٣/٥", nextMed: "متأخر ٤٥ دقيقة - ميتفورمين" },
  { id: 3, name: "محمد حسن", relation: "العم", age: 71, status: "critical", adherence: 43, doses: "١/٤", nextMed: "خطر - ٣ أدوية متأخرة" },
];

const MED_SCHEDULE = [
  { patient: "أحمد محمد", med: "باراسيتامول ٥٠٠ مج", time: "٠٨:٠٠ ص", status: "taken", takenAt: "٠٨:٠٥ ص" },
  { patient: "أحمد محمد", med: "أملوديبين ٥ مج", time: "٠٩:٠٠ ص", status: "taken", takenAt: "٠٩:١٢ ص" },
  { patient: "فاطمة علي", med: "ميتفورمين ٨٥٠ مج", time: "٠٢:٠٠ م", status: "missed", takenAt: "-" },
  { patient: "محمد حسن", med: "أميودارون ٢٠٠ مج", time: "٠٨:٠٠ م", status: "upcoming", takenAt: "-" },
  { patient: "فاطمة علي", med: "أتورفاستاتين ٤٠ مج", time: "١٠:٠٠ م", status: "upcoming", takenAt: "-" },
];

export default function CaregiverDashboard() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="min-h-[100dvh] w-full bg-gray-50 flex" dir="rtl">
      {/* Sidebar */}
      <aside className="w-72 bg-white border-l flex flex-col shadow-xl z-20 h-[100dvh] sticky top-0">
        <div className="p-8 border-b">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center">
              <HeartPulse className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-emerald-700 font-cairo">دواك بريميوم</h1>
              <p className="text-xs text-gray-500 font-bold uppercase tracking-wider">Caregiver Portal</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 p-6 space-y-3 overflow-y-auto">
          <SidebarBtn icon={<Activity className="w-5 h-5" />} label="لوحة المراقبة" active={currentPage === 'dashboard'} onClick={() => setCurrentPage('dashboard')} />
          <SidebarBtn icon={<Pill className="w-5 h-5" />} label="تتبع الأدوية" active={currentPage === 'tracking'} onClick={() => setCurrentPage('tracking')} />
          <SidebarBtn icon={<FileText className="w-5 h-5" />} label="التقارير" active={currentPage === 'reports'} onClick={() => setCurrentPage('reports')} />
          <SidebarBtn icon={<MessageCircle className="w-5 h-5" />} label="محادثات المرضى" active={currentPage === 'chat'} onClick={() => setCurrentPage('chat')} />
        </nav>

        <div className="p-6 border-t bg-gray-50/50">
          <div className="flex items-center gap-4 mb-6 bg-white p-4 rounded-2xl border shadow-sm">
            <Avatar className="w-12 h-12 border-2 border-emerald-100">
              <AvatarFallback className="bg-emerald-50 text-emerald-700 font-bold">س</AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-gray-900 truncate">سارة أحمد</p>
              <p className="text-xs font-bold text-emerald-600">مدير حساب الرعاية</p>
            </div>
          </div>
          <Link href="/">
            <Button variant="outline" className="w-full h-12 text-base font-bold text-red-600 hover:text-red-700 border-red-200 hover:bg-red-50 rounded-xl">
              <LogOut className="w-5 h-5 ml-2" /> تسجيل الخروج
            </Button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-[100dvh] overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white border-b h-20 flex items-center justify-between px-10 shrink-0 z-10 shadow-sm">
          <div className="flex items-center gap-4 bg-gray-100 px-4 py-3 rounded-2xl w-[400px] border focus-within:border-emerald-500 focus-within:ring-2 ring-emerald-100 transition-all">
            <Search className="w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="ابحث عن مريض أو دواء..." 
              className="bg-transparent border-none outline-none text-base w-full font-medium"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex items-center gap-6">
            <div className="text-left hidden md:block">
              <p className="text-sm font-bold text-gray-500">تاريخ اليوم</p>
              <p className="font-bold text-gray-900">{new Date().toLocaleDateString('ar-EG', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
            <div className="h-10 w-px bg-gray-200"></div>
            <Button variant="ghost" size="icon" className="relative w-12 h-12 rounded-full bg-gray-50 hover:bg-gray-100">
              <Bell className="w-6 h-6 text-gray-700" />
              <span className="absolute top-2 right-2 w-3 h-3 bg-red-500 border-2 border-white rounded-full flex items-center justify-center text-[8px] font-bold text-white">3</span>
            </Button>
          </div>
        </header>

        {/* Dynamic Page Content */}
        <div className="flex-1 overflow-y-auto p-10 bg-gray-50">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
              className="max-w-7xl mx-auto"
            >
              {currentPage === 'dashboard' && <Dashboard />}
              {currentPage === 'tracking' && <Tracking />}
              {currentPage === 'reports' && <Reports />}
              {currentPage === 'chat' && <Chat />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}

function SidebarBtn({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all font-bold text-lg ${
        active ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-200' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
      }`}
      data-testid={`sidebar-btn-${label}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );
}

type ModalType = 'call' | 'reminder' | 'mark' | 'emergency';
type ModalState = { type: ModalType; patient: (typeof PATIENTS)[0] } | null;

function ActionModal({ modal, onClose, onConfirm }: { modal: ModalState; onClose: () => void; onConfirm: () => void }) {
  const [reminderMsg, setReminderMsg] = useState("مرحباً، حان وقت تناول دوائك. يرجى التناول الآن. 💊");
  const [calling, setCalling] = useState(false);

  if (!modal) return null;
  const p = modal.patient;

  const handleCall = () => {
    setCalling(true);
    setTimeout(() => { setCalling(false); onConfirm(); }, 2500);
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-6"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl"
        initial={{ scale: 0.9, y: 24 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 24 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-emerald-100">
              <AvatarImage src={`https://i.pravatar.cc/150?u=${p.id}`} />
              <AvatarFallback className="font-bold text-lg">{p.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">{p.name}</h3>
              <p className="text-sm font-medium text-gray-500">{p.relation} • {p.age} عام</p>
            </div>
          </div>
          <button onClick={onClose} className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {modal.type === 'call' && (
          <div className="space-y-6">
            <div className="text-center space-y-4">
              <motion.div
                animate={calling ? { scale: [1, 1.12, 1] } : {}}
                transition={{ duration: 0.8, repeat: Infinity }}
                className={`w-20 h-20 rounded-full mx-auto flex items-center justify-center ${calling ? 'bg-emerald-600' : 'bg-blue-50'}`}
              >
                <PhoneCall className={`w-10 h-10 ${calling ? 'text-white' : 'text-blue-600'}`} />
              </motion.div>
              <div>
                <p className="font-black text-xl text-gray-900">{calling ? 'جاري الاتصال...' : 'الاتصال بالمريض'}</p>
                <p className="text-gray-500 font-medium mt-1" dir="ltr">+20 100 555 {p.id}234</p>
              </div>
            </div>
            {!calling ? (
              <div className="grid grid-cols-2 gap-3">
                <Button variant="outline" onClick={onClose} className="h-12 rounded-2xl font-bold">إلغاء</Button>
                <Button onClick={handleCall} className="h-12 rounded-2xl font-bold bg-blue-600 hover:bg-blue-700 text-white">
                  <PhoneCall className="w-5 h-5 ml-2" /> اتصال الآن
                </Button>
              </div>
            ) : (
              <Button variant="outline" onClick={onClose} className="w-full h-12 rounded-2xl font-bold border-red-200 text-red-600 hover:bg-red-50">إنهاء المكالمة</Button>
            )}
          </div>
        )}

        {modal.type === 'reminder' && (
          <div className="space-y-5">
            <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-2xl">
              <MessageSquare className="w-6 h-6 text-blue-600 shrink-0" />
              <p className="font-bold text-blue-900">إرسال تذكير للمريض</p>
            </div>
            <div className="space-y-2">
              <label className="font-bold text-gray-700 text-sm">نص الرسالة</label>
              <textarea
                value={reminderMsg}
                onChange={e => setReminderMsg(e.target.value)}
                className="w-full h-28 bg-gray-50 border-2 rounded-2xl p-4 font-medium text-gray-800 outline-none focus:border-emerald-500 resize-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={onClose} className="h-12 rounded-2xl font-bold">إلغاء</Button>
              <Button onClick={onConfirm} className="h-12 rounded-2xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
                <Send className="w-5 h-5 ml-2" /> إرسال التذكير
              </Button>
            </div>
          </div>
        )}

        {modal.type === 'mark' && (
          <div className="space-y-6">
            <div className="bg-emerald-50 border-2 border-emerald-200 p-5 rounded-2xl space-y-2">
              <p className="font-bold text-emerald-900">تسجيل الجرعة عن بعد</p>
              <p className="text-gray-600 font-medium text-sm">هل تأكدت أن {p.name} تناول/ت دوائه/ا؟ سيتم تسجيلها في النظام.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" onClick={onClose} className="h-12 rounded-2xl font-bold">إلغاء</Button>
              <Button onClick={onConfirm} className="h-12 rounded-2xl font-bold bg-emerald-600 hover:bg-emerald-700 text-white">
                <CheckCircle2 className="w-5 h-5 ml-2" /> تأكيد التسجيل
              </Button>
            </div>
          </div>
        )}

        {modal.type === 'emergency' && (
          <div className="space-y-5">
            <div className="bg-red-50 border-2 border-red-200 p-5 rounded-2xl">
              <p className="font-bold text-red-900 text-lg">🚨 إجراء طارئ</p>
              <p className="text-red-700 font-medium mt-1 text-sm">الحالة تتطلب تدخلاً فورياً لـ {p.name}</p>
            </div>
            <div className="space-y-3">
              <Button onClick={onConfirm} className="w-full h-14 rounded-2xl font-bold text-lg bg-red-600 hover:bg-red-700 text-white">
                <PhoneCall className="w-6 h-6 ml-2" /> الاتصال بخدمات الطوارئ (123)
              </Button>
              <Button variant="outline" onClick={onConfirm} className="w-full h-12 rounded-2xl font-bold border-amber-300 text-amber-700 hover:bg-amber-50">
                إبلاغ الطبيب المعالج
              </Button>
              <Button variant="outline" onClick={onClose} className="w-full h-12 rounded-2xl font-bold text-gray-500">إلغاء</Button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

function Dashboard() {
  const [modal, setModal] = useState<ModalState>(null);
  const [successMap, setSuccessMap] = useState<Record<number, string>>({});

  const openModal = (type: ModalType, patient: (typeof PATIENTS)[0]) => setModal({ type, patient });

  const confirmAction = () => {
    if (!modal) return;
    const pid = modal.patient.id;
    const type = modal.type;
    const labels: Record<ModalType, string> = { call: '📞 تم الاتصال', reminder: '📨 تم إرسال التذكير', mark: '✅ تم التسجيل', emergency: '🚨 تم الإبلاغ' };
    setModal(null);
    setSuccessMap(prev => ({ ...prev, [pid]: labels[type] }));
    setTimeout(() => setSuccessMap(prev => { const n = { ...prev }; delete n[pid]; return n; }), 4000);
  };

  return (
    <div className="space-y-8 relative">
      <AnimatePresence>{modal && <ActionModal modal={modal} onClose={() => setModal(null)} onConfirm={confirmAction} />}</AnimatePresence>

      {/* Hero Banner */}
      <div className="bg-emerald-700 rounded-3xl p-8 text-white shadow-xl relative overflow-hidden flex justify-between items-center">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -ml-20 -mt-20"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-black font-cairo mb-2">مرحباً، سارة — لديك ٣ مرضى تحت رعايتك</h2>
          <p className="text-emerald-100 text-lg font-medium">معدل الالتزام العام اليوم ممتاز، لكن هناك تنبيه واحد يتطلب التدخل.</p>
        </div>
        <div className="relative z-10 bg-white/20 backdrop-blur-md rounded-2xl p-6 text-center border border-white/20">
          <div className="text-5xl font-black mb-1">٧٨٪</div>
          <div className="text-emerald-100 font-bold">الالتزام العام اليوم</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Patient Cards */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-black font-cairo text-gray-900">حالة المرضى</h3>
          <div className="space-y-4">
            {PATIENTS.map((p, i) => (
              <motion.div key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                <Card className={`border-2 hover:shadow-lg transition-all ${
                  p.status === 'on-track' ? 'border-emerald-100' :
                  p.status === 'warning' ? 'border-amber-200 bg-amber-50/30' :
                  'border-red-200 bg-red-50/30'
                }`}>
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-5">
                      <div className="flex items-center gap-4">
                        <Avatar className={`w-16 h-16 border-4 ${p.status === 'on-track' ? 'border-emerald-500' : p.status === 'warning' ? 'border-amber-500' : 'border-red-500'}`}>
                          <AvatarImage src={`https://i.pravatar.cc/150?u=${p.id}`} />
                          <AvatarFallback className="text-xl font-bold">{p.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{p.name}</h3>
                          <p className="text-sm font-bold text-gray-500 mt-1">{p.relation} • {p.age} عام</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <AnimatePresence>
                          {successMap[p.id] && (
                            <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.8 }}
                              className="bg-emerald-100 text-emerald-800 px-3 py-1.5 rounded-full text-sm font-bold">
                              {successMap[p.id]}
                            </motion.div>
                          )}
                        </AnimatePresence>
                        <Badge className={`text-sm px-3 py-1.5 font-bold ${p.status === 'on-track' ? 'bg-emerald-100 text-emerald-800' : p.status === 'warning' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'}`} variant="outline">
                          {p.status === 'on-track' ? 'منتظم ✅' : p.status === 'warning' ? 'تنبيه ⚠️' : 'حرج 🚨'}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-5">
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm font-bold">
                          <span className="text-gray-600">الالتزام اليوم</span>
                          <span className={p.status === 'on-track' ? 'text-emerald-600' : p.status === 'warning' ? 'text-amber-600' : 'text-red-600'}>{p.adherence}٪</span>
                        </div>
                        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
                          <motion.div initial={{ width: 0 }} animate={{ width: `${p.adherence}%` }} transition={{ duration: 1, ease: "easeOut" }}
                            className={`h-full rounded-full ${p.status === 'on-track' ? 'bg-emerald-500' : p.status === 'warning' ? 'bg-amber-500' : 'bg-red-500'}`} />
                        </div>
                      </div>
                      <div className="space-y-1">
                        <p className="text-sm font-bold text-gray-500">الجرعات اليوم ({p.doses})</p>
                        <p className={`text-sm font-bold flex items-center gap-2 ${p.status === 'warning' || p.status === 'critical' ? 'text-red-600' : 'text-gray-900'}`}>
                          <Clock className="w-4 h-4 shrink-0" /> {p.nextMed}
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-4 border-t flex-wrap">
                      <motion.div whileTap={{ scale: 0.95 }} className="flex-1 min-w-[120px]">
                        <Button onClick={() => openModal('call', p)} variant="outline" className="w-full h-11 text-sm font-bold border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100">
                          <PhoneCall className="w-4 h-4 ml-1.5" /> اتصال
                        </Button>
                      </motion.div>
                      <motion.div whileTap={{ scale: 0.95 }} className="flex-1 min-w-[120px]">
                        <Button onClick={() => openModal('reminder', p)} variant="outline" className="w-full h-11 text-sm font-bold border-amber-200 text-amber-700 bg-amber-50 hover:bg-amber-100">
                          <MessageSquare className="w-4 h-4 ml-1.5" /> تذكير
                        </Button>
                      </motion.div>
                      <motion.div whileTap={{ scale: 0.95 }} className="flex-1 min-w-[120px]">
                        <Button onClick={() => openModal('mark', p)} variant="outline" className="w-full h-11 text-sm font-bold border-emerald-200 text-emerald-700 bg-emerald-50 hover:bg-emerald-100">
                          <CheckCircle2 className="w-4 h-4 ml-1.5" /> تسجيل
                        </Button>
                      </motion.div>
                      {(p.status === 'critical' || p.status === 'warning') && (
                        <motion.div whileTap={{ scale: 0.95 }}>
                          <Button onClick={() => openModal('emergency', p)} variant="outline" className="h-11 text-sm font-bold border-red-200 text-red-700 bg-red-50 hover:bg-red-100 px-4">
                            <AlertTriangle className="w-4 h-4 ml-1.5" /> طوارئ
                          </Button>
                        </motion.div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Live Alerts Sidebar */}
        <div className="space-y-6">
          <h3 className="text-2xl font-black font-cairo text-gray-900">التنبيهات المباشرة</h3>
          <Card className="border-2 shadow-sm">
            <CardContent className="p-0 divide-y">
              {MED_SCHEDULE.filter(m => m.status !== 'taken').map((m, i) => (
                <div key={i} className="p-5 hover:bg-gray-50 transition-colors">
                  <div className="flex items-start gap-4">
                    <motion.div animate={m.status === 'missed' ? { scale: [1, 1.3, 1] } : {}} transition={{ duration: 1.5, repeat: Infinity }}
                      className={`w-3 h-3 rounded-full mt-2 shrink-0 ${m.status === 'missed' ? 'bg-red-500' : 'bg-amber-400'}`} />
                    <div className="flex-1">
                      <h4 className="font-bold text-gray-900">{m.patient}</h4>
                      <p className="text-gray-600 font-medium text-sm mt-0.5">{m.med}</p>
                      <div className="flex items-center justify-between mt-3 gap-2 flex-wrap">
                        <Badge variant={m.status === 'missed' ? 'destructive' : 'secondary'} className="font-bold text-xs">
                          {m.time} ({m.status === 'missed' ? 'متأخر' : 'قادم'})
                        </Badge>
                        <Button size="sm" variant={m.status === 'missed' ? 'default' : 'outline'}
                          className={`text-xs font-bold ${m.status === 'missed' ? 'bg-red-600 hover:bg-red-700' : ''}`}>
                          {m.status === 'missed' ? 'اتصل الآن' : 'تأكيد'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-gray-900 text-white border-0 shadow-xl overflow-hidden">
            <CardHeader className="border-b border-gray-800 pb-4">
              <CardTitle className="font-cairo text-xl flex items-center justify-between">
                ملخص اليوم <Activity className="w-5 h-5 text-emerald-400" />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-5">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold">إجمالي الجرعات</span>
                <span className="text-2xl font-black">١٤/١٧</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold">جرعات فائتة</span>
                <span className="text-2xl font-black text-red-400">٣</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-400 font-bold">متوسط الالتزام</span>
                <span className="text-2xl font-black text-amber-400">٧٨٪</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function Tracking() {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm border">
        <div>
          <h2 className="text-3xl font-black font-cairo text-gray-900">سجل الأدوية التفصيلي</h2>
          <p className="text-gray-500 font-bold mt-1">تتبع دقيق لجميع جرعات المرضى</p>
        </div>
        <div className="flex gap-4">
          <select className="h-12 bg-gray-50 border-2 rounded-xl px-4 font-bold text-gray-700 outline-none">
            <option>كل المرضى</option>
            <option>أحمد محمد</option>
            <option>فاطمة علي</option>
            <option>محمد حسن</option>
          </select>
          <div className="h-12 flex items-center gap-2 bg-emerald-50 border-2 border-emerald-200 text-emerald-700 px-4 rounded-xl font-bold">
            <Watch className="w-5 h-5" /> السوار متصل ✅
          </div>
        </div>
      </div>

      {/* Summary Stats Row */}
      <div className="grid grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm border-b-4 border-b-emerald-500 bg-white">
          <CardContent className="p-6">
            <p className="text-gray-500 font-bold">تم الأخذ</p>
            <p className="text-3xl font-black text-gray-900 mt-2">١٤ <span className="text-sm text-gray-400">جرعة</span></p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm border-b-4 border-b-amber-400 bg-white">
          <CardContent className="p-6">
            <p className="text-gray-500 font-bold">قادم</p>
            <p className="text-3xl font-black text-gray-900 mt-2">٨ <span className="text-sm text-gray-400">جرعات</span></p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm border-b-4 border-b-red-500 bg-white">
          <CardContent className="p-6">
            <p className="text-gray-500 font-bold">فائت</p>
            <p className="text-3xl font-black text-red-600 mt-2">٣ <span className="text-sm text-red-400">جرعات</span></p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm border-b-4 border-b-blue-500 bg-white">
          <CardContent className="p-6">
            <p className="text-gray-500 font-bold">نسبة الالتزام</p>
            <p className="text-3xl font-black text-gray-900 mt-2">٨٢٪</p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-base text-right">
            <thead className="bg-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-5 font-black text-gray-700">الوقت</th>
                <th className="px-6 py-5 font-black text-gray-700">المريض</th>
                <th className="px-6 py-5 font-black text-gray-700">الدواء و الجرعة</th>
                <th className="px-6 py-5 font-black text-gray-700">الحالة</th>
                <th className="px-6 py-5 font-black text-gray-700">وقت التناول الفعلي</th>
                <th className="px-6 py-5 font-black text-gray-700">إجراءات</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {MED_SCHEDULE.map((m, i) => (
                <tr key={i} className={`transition-colors ${
                  m.status === 'taken' ? 'bg-emerald-50/30' : 
                  m.status === 'missed' ? 'bg-red-50/30' : 'bg-white hover:bg-gray-50'
                }`}>
                  <td className="px-6 py-5 font-bold text-gray-900">{m.time}</td>
                  <td className="px-6 py-5 font-bold text-gray-700">
                    <div className="flex items-center gap-3">
                      <Avatar className="w-8 h-8">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${i}`} />
                        <AvatarFallback>{m.patient[0]}</AvatarFallback>
                      </Avatar>
                      {m.patient}
                    </div>
                  </td>
                  <td className="px-6 py-5 font-bold text-gray-700">{m.med}</td>
                  <td className="px-6 py-5">
                    {m.status === 'taken' && <Badge className="bg-emerald-100 text-emerald-700 border-0 px-3 py-1 font-bold text-sm">تم الأخذ ✅</Badge>}
                    {m.status === 'missed' && <Badge variant="destructive" className="px-3 py-1 font-bold text-sm bg-red-500">متأخر 🚨</Badge>}
                    {m.status === 'upcoming' && <Badge variant="outline" className="text-amber-700 border-amber-300 bg-amber-50 px-3 py-1 font-bold text-sm">قادم ⏳</Badge>}
                  </td>
                  <td className="px-6 py-5 font-medium text-gray-500" dir="ltr">{m.takenAt}</td>
                  <td className="px-6 py-5">
                    {m.status === 'upcoming' && (
                      <Button size="sm" variant="outline" className="font-bold border-emerald-200 text-emerald-700 hover:bg-emerald-50">تأكيد التناول</Button>
                    )}
                    {m.status === 'missed' && (
                      <Button size="sm" className="font-bold bg-blue-600 hover:bg-blue-700 text-white">اتصال بالمريض</Button>
                    )}
                    {m.status === 'taken' && (
                      <span className="text-gray-400 font-medium text-sm">لا إجراء مطلوب</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Reports() {
  const data = [
    { name: 'السبت', adherence: 85 },
    { name: 'الأحد', adherence: 90 },
    { name: 'الإثنين', adherence: 75 },
    { name: 'الثلاثاء', adherence: 88 },
    { name: 'الأربعاء', adherence: 95 },
    { name: 'الخميس', adherence: 65 },
    { name: 'الجمعة', adherence: 82 },
  ];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-sm border">
        <div>
          <h2 className="text-3xl font-black font-cairo text-gray-900">التقارير التحليلية</h2>
          <p className="text-gray-500 font-bold mt-1">تقييم أداء المرضى والالتزام بالخطة العلاجية</p>
        </div>
        <div className="flex gap-4">
          <select className="h-12 bg-gray-50 border-2 rounded-xl px-4 font-bold text-gray-700 outline-none">
            <option>هذا الأسبوع</option>
            <option>الشهر الماضي</option>
          </select>
          <Button className="h-12 px-6 gap-2 text-base font-bold shadow-lg shadow-emerald-200 bg-emerald-600 hover:bg-emerald-700" data-testid="btn-export-pdf">
            <Download className="w-5 h-5" /> تصدير PDF
          </Button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-gray-900 to-gray-800 text-white border-0 shadow-lg">
          <CardContent className="p-8">
            <p className="text-gray-400 font-bold text-lg">إجمالي الجرعات المقررة</p>
            <p className="text-5xl font-black mt-4">٢٤٥</p>
          </CardContent>
        </Card>
        <Card className="bg-gradient-to-br from-emerald-500 to-emerald-700 text-white border-0 shadow-lg shadow-emerald-200">
          <CardContent className="p-8">
            <p className="text-emerald-100 font-bold text-lg">الجرعات المأخوذة بنجاح</p>
            <p className="text-5xl font-black mt-4">٢١٠</p>
          </CardContent>
        </Card>
        <Card className="bg-white border-2 shadow-sm">
          <CardContent className="p-8">
            <p className="text-gray-500 font-bold text-lg">معدل الالتزام الكلي</p>
            <div className="flex items-baseline gap-2 mt-4">
              <p className="text-5xl font-black text-gray-900">٨٥٪</p>
              <span className="text-emerald-500 font-bold text-sm">↑ +٢٪ عن الأسبوع الماضي</span>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-2 shadow-sm">
        <CardHeader className="border-b bg-gray-50/50 p-6">
          <CardTitle className="font-cairo text-xl">معدل الالتزام اليومي (هذا الأسبوع)</CardTitle>
        </CardHeader>
        <CardContent className="p-8">
          <div className="h-[400px] w-full" dir="ltr">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6b7280', fontWeight: 'bold' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} domain={[0, 100]} tick={{ fill: '#6b7280', fontWeight: 'bold' }} dx={-10} />
                <Tooltip 
                  cursor={{ fill: '#f3f4f6' }} 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }} 
                />
                <Bar dataKey="adherence" radius={[8, 8, 0, 0]} barSize={48}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.adherence >= 90 ? '#10b981' : entry.adherence >= 70 ? '#fbbf24' : '#ef4444'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function Chat() {
  return (
    <div className="flex h-[calc(100dvh-160px)] border-2 rounded-3xl overflow-hidden bg-white shadow-lg">
      {/* Chat List */}
      <div className="w-96 border-l-2 flex flex-col bg-gray-50/80">
        <div className="p-6 border-b-2 bg-white">
          <h3 className="font-black text-2xl font-cairo text-gray-900">المحادثات</h3>
          <div className="mt-4 relative">
            <Search className="w-5 h-5 text-gray-400 absolute right-3 top-1/2 -translate-y-1/2" />
            <input type="text" placeholder="بحث..." className="w-full bg-gray-100 rounded-xl h-12 pr-10 pl-4 outline-none border-2 focus:border-emerald-500 font-bold" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {PATIENTS.map((p, i) => (
            <button key={i} className={`w-full p-5 flex items-start gap-4 border-b text-right transition-colors ${i === 0 ? 'bg-emerald-50 border-l-4 border-l-emerald-600' : 'hover:bg-white'}`}>
              <Avatar className="w-14 h-14 border-2 border-white shadow-sm">
                <AvatarImage src={`https://i.pravatar.cc/150?u=${p.id}`} />
                <AvatarFallback>{p.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex-1 overflow-hidden mt-1">
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-lg text-gray-900 truncate">{p.name}</span>
                  <span className="text-xs font-bold text-gray-500">١٠:٠٠ ص</span>
                </div>
                <p className={`text-sm font-medium truncate ${i === 0 ? 'text-emerald-700' : 'text-gray-500'}`}>
                  نعم، تم أخذ الدواء في موعده، شكراً للمتابعة...
                </p>
              </div>
            </button>
          ))}
        </div>
      </div>
      
      {/* Chat Window */}
      <div className="flex-1 flex flex-col bg-[#f0f4f8]">
        <div className="p-6 border-b-2 flex items-center justify-between bg-white z-10 shadow-sm">
          <div className="flex items-center gap-4">
            <Avatar className="w-14 h-14 border-2 border-emerald-100">
              <AvatarImage src={`https://i.pravatar.cc/150?u=1`} />
              <AvatarFallback>أ</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-xl text-gray-900">أحمد محمد</h3>
              <p className="text-sm font-bold text-emerald-600 flex items-center gap-2 mt-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block"></span> متصل
              </p>
            </div>
          </div>
          <Button variant="outline" className="h-12 border-blue-200 text-blue-700 bg-blue-50 hover:bg-blue-100 font-bold px-6">
            <PhoneCall className="w-5 h-5 ml-2" /> اتصال بالمريض
          </Button>
        </div>
        
        <div className="flex-1 p-8 overflow-y-auto space-y-6">
          <div className="flex justify-start">
            <div className="bg-emerald-600 text-white p-4 rounded-3xl rounded-tr-sm shadow-md max-w-lg">
              <p className="text-base font-medium leading-relaxed">السلام عليكم أستاذ أحمد، لاحظت أنك لم تسجل جرعة ميتفورمين الصباحية، هل كل شيء بخير؟</p>
              <p className="text-xs font-bold text-emerald-200 mt-2 text-left">٠٩:٤٥ ص</p>
            </div>
          </div>
          <div className="flex justify-end">
            <div className="bg-white p-4 rounded-3xl rounded-tl-sm shadow-md max-w-lg border border-gray-100">
              <p className="text-base font-medium text-gray-800 leading-relaxed">وعليكم السلام، نعم أخذته في التاسعة صباحاً لكنني نسيت تسجيله في التطبيق. عذراً.</p>
              <p className="text-xs font-bold text-gray-400 mt-2 text-right">١٠:٠٠ ص</p>
            </div>
          </div>
          <div className="flex justify-start">
            <div className="bg-emerald-600 text-white p-4 rounded-3xl rounded-tr-sm shadow-md max-w-lg">
              <p className="text-base font-medium leading-relaxed">لا بأس أبداً، قمت بتسجيله لك الآن. أتمنى لك دوام الصحة والعافية.</p>
              <p className="text-xs font-bold text-emerald-200 mt-2 text-left">١٠:٠٢ ص</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 border-t-2 bg-white flex gap-3 z-10">
          <Input placeholder="اكتب رسالة للمريض..." className="flex-1 bg-gray-50 rounded-2xl h-14 border-2 text-lg font-medium px-6" />
          <Button className="shrink-0 h-14 w-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 shadow-md p-0">
            <Send className="w-6 h-6 -ml-1 text-white" />
          </Button>
        </div>
      </div>
    </div>
  );
}
