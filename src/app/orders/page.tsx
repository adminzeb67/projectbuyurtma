"use client";

import { ClipboardList, Clock, CheckCircle, Package, Truck, XCircle, ArrowRight } from "lucide-react";
import Link from "next/link";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  PENDING:    { label: "Kutilmoqda",    color: "#f5a623", bg: "#23263a", icon: Clock },
  ACCEPTED:   { label: "Qabul qilindi", color: "#3b82f6", bg: "#1a1d2e", icon: CheckCircle },
  PREPARING:  { label: "Tayyorlanmoqda",color: "#8b5cf6", bg: "#1a1d2e", icon: Package },
  ON_THE_WAY: { label: "Yo'lda",        color: "#06b6d4", bg: "#1a1d2e", icon: Truck },
  DELIVERED:  { label: "Yetkazildi",    color: "#22c55e", bg: "#1a1d2e", icon: CheckCircle },
  CANCELLED:  { label: "Bekor qilindi", color: "#ef4444", bg: "#23263a", icon: XCircle },
};

export default function OrdersPage() {
  return (
    <div className="flex flex-col min-h-screen pb-24" style={{ background: "#11131e" }}>
      {/* Header */}
      <div className="p-5 pt-8 sticky top-0 z-40 bg-[#11131e]/90 backdrop-blur-md border-b border-white/5">
        <h1 className="text-2xl font-extrabold text-white">Buyurtmalarim</h1>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center pb-20 text-center px-4 mt-10">
        <div className="w-24 h-24 bg-[#23263a]/60 border border-white/5 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(139,92,246,0.1)]">
          <ClipboardList className="w-10 h-10 text-indigo-400/50" />
        </div>
        <h2 className="text-xl font-bold text-white mb-2">Hali buyurtma qilmadingiz</h2>
        <p className="text-[#8e93a6] mb-8 max-w-[250px] text-sm">
          Sizning faol va oldingi buyurtmalaringiz shu yerda ko'rinadi.
        </p>
        <Link href="/">
          <button className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white font-bold py-3.5 px-8 rounded-2xl shadow-lg shadow-indigo-500/25 hover:scale-105 transition-transform flex items-center gap-2">
            Menyuga qaytish <ArrowRight className="w-4 h-4" />
          </button>
        </Link>
      </div>
    </div>
  );
}
