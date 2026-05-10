import { Link } from "wouter";
import { motion } from "framer-motion";
import { HeartPulse, UserCircle2, Pill, ShieldCheck, Bell, Watch, Users, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const TRUST_FEATURES = [
  { icon: <Bell className="w-5 h-5" />, label: "تذكيرات ذكية" },
  { icon: <Watch className="w-5 h-5" />, label: "سوار + ساعة ذكية" },
  { icon: <Users className="w-5 h-5" />, label: "مراقبة الأسرة" },
  { icon: <Shield className="w-5 h-5" />, label: "بيانات آمنة 100%" },
];

export default function Landing() {
  return (
    <div className="min-h-[100dvh] w-full flex items-center justify-center bg-gradient-to-b from-emerald-50 to-gray-50 p-6" dir="rtl">
      <div className="w-full max-w-4xl mx-auto space-y-14">

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center space-y-6"
        >
          <div className="relative inline-block mb-4">
            <div className="mx-auto w-28 h-28 bg-emerald-600 rounded-[2rem] rotate-12 flex items-center justify-center shadow-2xl shadow-emerald-200">
              <HeartPulse className="w-14 h-14 text-white -rotate-12" />
            </div>
            <div className="absolute -bottom-4 -right-4 bg-white rounded-full p-3 shadow-lg border border-gray-100">
              <Pill className="w-8 h-8 text-emerald-600" />
            </div>
          </div>
          <h1 className="text-6xl font-black text-gray-900 font-cairo tracking-tight">
            دواك <span className="text-emerald-600">Dawak</span>
          </h1>
          <p className="text-2xl text-gray-600 font-cairo font-bold">
            منصة إدارة الأدوية الذكية
          </p>
          <p className="text-gray-500 max-w-lg mx-auto text-lg leading-relaxed font-medium">
            منصة صحية متكاملة تجمع بين المرضى ومقدمي الرعاية في تجربة واحدة موثوقة وآمنة.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Link href="/app" className="block outline-none" data-testid="link-patient-app">
            <motion.div
              whileHover={{ scale: 1.03, y: -6 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="h-full cursor-pointer border-2 hover:border-emerald-500 shadow-lg hover:shadow-2xl hover:shadow-emerald-100 transition-all rounded-3xl overflow-hidden bg-white group">
                <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
                  <div className="w-24 h-24 bg-emerald-50 group-hover:bg-emerald-600 rounded-full flex items-center justify-center text-emerald-600 group-hover:text-white transition-colors duration-300 shadow-md">
                    <UserCircle2 className="w-12 h-12" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black font-cairo text-gray-900">دخول المستخدم</h2>
                    <p className="text-emerald-600 font-bold text-base">User Login</p>
                    <p className="text-gray-400 font-medium text-sm">للمرضى وأصحاب الأدوية</p>
                  </div>
                  <Button className="w-full h-14 rounded-2xl text-lg font-bold bg-gray-100 text-gray-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                    دخول التطبيق
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Link>

          <Link href="/caregiver" className="block outline-none" data-testid="link-caregiver-dashboard">
            <motion.div
              whileHover={{ scale: 1.03, y: -6 }}
              whileTap={{ scale: 0.97 }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <Card className="h-full cursor-pointer border-2 border-emerald-600 shadow-xl shadow-emerald-100 hover:shadow-2xl transition-all rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-600 to-emerald-800 text-white group">
                <CardContent className="p-10 flex flex-col items-center text-center space-y-6">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-white shadow-md">
                    <ShieldCheck className="w-12 h-12" />
                  </div>
                  <div className="space-y-2">
                    <h2 className="text-3xl font-black font-cairo text-white">دخول مقدم الرعاية</h2>
                    <p className="text-emerald-200 font-bold text-base">Caregiver Login</p>
                    <p className="text-emerald-100/70 font-medium text-sm">للأطباء وأفراد الأسرة المراقبين</p>
                  </div>
                  <Button className="w-full h-14 rounded-2xl text-lg font-bold bg-white text-emerald-700 hover:bg-gray-50 shadow-lg">
                    دخول لوحة التحكم
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Link>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="flex justify-center gap-8 flex-wrap pb-4"
        >
          {TRUST_FEATURES.map((f, i) => (
            <div key={i} className="flex items-center gap-2 text-gray-500 font-bold text-sm">
              <span className="text-emerald-500">{f.icon}</span>
              {f.label}
            </div>
          ))}
        </motion.div>

      </div>
    </div>
  );
}
