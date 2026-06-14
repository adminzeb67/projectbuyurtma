"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Clock, CheckCircle, Package, Truck, ArrowLeft, Loader2, PartyPopper, XCircle } from "lucide-react";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  menuItem: { name: string; image: string | null };
};

type Order = {
  id: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  estimatedTime: number | null;
  createdAt: string;
  latitude: number;
  longitude: number;
  items: OrderItem[];
};

const statusSteps = [
  { id: "PENDING",    label: "Kutilmoqda",       icon: Clock,        emoji: "⏳", color: "#f59e0b" },
  { id: "ACCEPTED",   label: "Qabul qilindi",     icon: CheckCircle,  emoji: "✅", color: "#3b82f6" },
  { id: "PREPARING",  label: "Tayyorlanmoqda",    icon: Package,      emoji: "👨‍🍳", color: "#8b5cf6" },
  { id: "ON_THE_WAY", label: "Kuryer yo'lda",     icon: Truck,        emoji: "🛵", color: "#06b6d4" },
  { id: "DELIVERED",  label: "Yetkazib berildi",  icon: CheckCircle,  emoji: "🎉", color: "#22c55e" },
];

// Animated toast
function StatusToast({ status, label }: { status: string; label: string }) {
  const step = statusSteps.find(s => s.id === status);
  if (!step) return null;
  return (
    <motion.div
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -60, opacity: 0 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="fixed top-4 left-4 right-4 z-[999] flex items-center gap-3 bg-[#1c1c1c] border border-white/10 rounded-2xl px-4 py-3 shadow-2xl"
    >
      <span className="text-3xl">{step.emoji}</span>
      <div>
        <p className="text-xs text-[#a1a1aa] font-bold uppercase tracking-wider">Holat yangilandi</p>
        <p className="font-bold text-white">{label}</p>
      </div>
    </motion.div>
  );
}

export default function OrderTrackingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [prevStatus, setPrevStatus] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

  // Tick every second for countdown
  useEffect(() => {
    const t = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) throw new Error("Buyurtma topilmadi");
      const data = await res.json();
      setOrder(prev => {
        if (prev && prev.status !== data.status) {
          setPrevStatus(prev.status);
          setShowToast(true);
          setTimeout(() => setShowToast(false), 3000);
        }
        return data;
      });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#09090b] text-white">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#09090b] text-white px-4 gap-4">
        <XCircle className="w-16 h-16 text-red-500" />
        <p className="text-red-400 font-bold">{error || "Buyurtma topilmadi"}</p>
        <button onClick={() => router.push("/")} className="bg-orange-500 px-6 py-3 rounded-xl font-bold">
          Bosh sahifaga
        </button>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex(s => s.id === order.status);
  const toastStep = statusSteps.find(s => s.id === order.status);

  const createdDate = new Date(order.createdAt).getTime();
  const estimatedMs = (order.estimatedTime || 30) * 60000;
  const estimatedDate = createdDate + estimatedMs;
  const remainingMs = Math.max(0, estimatedDate - currentTime);
  const remainingMinutes = Math.floor(remainingMs / 60000);
  const remainingSeconds = Math.floor((remainingMs % 60000) / 1000);
  const progress = Math.min(100, Math.round(((currentTime - createdDate) / estimatedMs) * 100));

  return (
    <div className="flex flex-col min-h-screen font-sans pb-24 bg-[#09090b] text-white">

      {/* Animated status toast */}
      <AnimatePresence>
        {showToast && toastStep && (
          <StatusToast status={order.status} label={toastStep.label} />
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="p-4 flex items-center gap-3 sticky top-0 z-50 bg-[#09090b]/90 backdrop-blur-xl border-b border-white/5">
        <button onClick={() => router.push("/")} className="p-2 bg-[#18181b] rounded-full text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-[18px] font-bold">Buyurtmani kuzatish</h1>
          <p className="text-xs text-[#a1a1aa]">ID: #{order.id.slice(-6).toUpperCase()}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">

        {/* Main Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#18181b] border border-white/5 rounded-[24px] p-6 text-center relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-orange-500/5 blur-[60px] pointer-events-none" />
          <div className="relative z-10">
            {order.status === "DELIVERED" ? (
              <>
                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                  <PartyPopper className="w-16 h-16 text-green-500 mx-auto mb-3" />
                </motion.div>
                <h2 className="text-2xl font-black mb-1 text-green-400">Buyurtma yetkazildi!</h2>
                <p className="text-[#a1a1aa] text-sm">Yoqimli ishtaha! 🎉</p>
              </>
            ) : order.status === "CANCELLED" ? (
              <>
                <XCircle className="w-16 h-16 text-red-500 mx-auto mb-3" />
                <h2 className="text-2xl font-black mb-1 text-red-400">Bekor qilindi</h2>
                <p className="text-[#a1a1aa] text-sm">Buyurtma bekor qilindi</p>
              </>
            ) : (
              <>
                <div className="relative inline-flex items-center justify-center mb-4">
                  <svg className="w-28 h-28 -rotate-90">
                    <circle cx="56" cy="56" r="48" fill="none" stroke="#27272a" strokeWidth="8" />
                    <motion.circle
                      cx="56" cy="56" r="48" fill="none" stroke="#f97316" strokeWidth="8"
                      strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 48}
                      initial={{ strokeDashoffset: 2 * Math.PI * 48 }}
                      animate={{ strokeDashoffset: 2 * Math.PI * 48 * (1 - progress / 100) }}
                      transition={{ duration: 1 }}
                    />
                  </svg>
                  <div className="absolute flex flex-col items-center">
                    <span className="text-[28px] font-black text-orange-500 leading-none">
                      {remainingMinutes}:{remainingSeconds.toString().padStart(2, "0")}
                    </span>
                    <span className="text-[10px] text-[#666] font-bold uppercase tracking-wider">qoldi</span>
                  </div>
                </div>

                <h2 className="text-[18px] font-black mb-1">{toastStep?.label}</h2>
                <p className="text-[#a1a1aa] text-sm">Taxminiy yetkazib berish vaqti</p>

                <div className="mt-4 flex items-center justify-center gap-2 text-xs font-bold text-orange-500 bg-orange-500/10 py-2 px-4 rounded-full w-max mx-auto">
                  <span className="text-base">{toastStep?.emoji}</span>
                  Kuryer manzilingiz tomon kelmoqda
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Progress Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-[#18181b] border border-white/5 rounded-[24px] p-5"
        >
          <div className="flex items-center justify-between mb-1">
            {statusSteps.map((step, idx) => {
              const isActive = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              return (
                <div key={step.id} className="flex flex-col items-center gap-1.5 flex-1">
                  <motion.div
                    animate={{ scale: isCurrent ? [1, 1.15, 1] : 1 }}
                    transition={{ repeat: isCurrent ? Infinity : 0, duration: 1.5 }}
                    className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all ${
                      isActive
                        ? "border-orange-500 bg-orange-500 text-white shadow-[0_0_12px_rgba(249,115,22,0.5)]"
                        : "border-[#333] bg-[#1a1a1a] text-[#555]"
                    }`}
                  >
                    <span className="text-base">{step.emoji}</span>
                  </motion.div>
                  {idx < statusSteps.length - 1 && (
                    <div className="absolute" style={{ display: "none" }} />
                  )}
                  <span className={`text-[9px] font-bold text-center leading-tight ${isActive ? "text-orange-400" : "text-[#555]"}`}>
                    {step.label}
                  </span>
                </div>
              );
            })}
          </div>
          {/* Connector line */}
          <div className="relative h-1.5 bg-[#27272a] rounded-full mx-4 -mt-[76px] mb-[50px] z-0">
            <motion.div
              className="absolute top-0 left-0 h-full bg-orange-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStepIndex / (statusSteps.length - 1)) * 100}%` }}
              transition={{ duration: 0.8 }}
            />
          </div>
        </motion.div>

        {/* Order Items */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-[#18181b] border border-white/5 rounded-[24px] p-5 space-y-3"
        >
          <h3 className="font-bold text-[16px] mb-2">Buyurtma tarkibi</h3>
          {order.items.map(item => (
            <div key={item.id} className="flex justify-between text-sm items-center">
              <span className="text-[#a1a1aa]">{item.quantity}x {item.menuItem.name}</span>
              <span className="font-bold">{(item.price * item.quantity).toLocaleString()} so'm</span>
            </div>
          ))}
          <div className="border-t border-white/5 pt-3 flex justify-between text-sm">
            <span className="text-[#a1a1aa]">To'lov turi</span>
            <span className="font-bold">{order.paymentMethod}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-[15px]">Jami summa</span>
            <span className="font-black text-orange-500 text-[18px]">{order.totalAmount.toLocaleString()} so'm</span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
