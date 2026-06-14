"use client";

import { ClipboardList, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function OrdersPage() {
  return (
    <div className="flex flex-col min-h-screen pb-24 font-sans" style={{ background: "var(--bg-deep)" }}>
      {/* Header */}
      <div className="p-5 pt-8 sticky top-0 z-40 bg-[#09090b]/90 backdrop-blur-xl border-b border-white/5">
        <h1 className="text-[22px] font-black text-white tracking-tight">Buyurtmalarim</h1>
      </div>
      
      {/* Empty State */}
      <div className="flex-1 flex flex-col items-center justify-center pb-20 text-center px-6 mt-10">
        {/* Animated Icon */}
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-orange-500/10 blur-[40px] rounded-full animate-pulse" />
          <div className="w-28 h-28 bg-[#18181b] border border-white/5 rounded-full flex items-center justify-center relative shadow-lg">
            <ClipboardList className="w-12 h-12 text-orange-500/50" />
          </div>
        </div>
        
        <h2 className="text-[24px] font-black text-white mb-3">Hali buyurtma yo'q</h2>
        <p className="text-[#a1a1aa] mb-10 max-w-[260px] text-[15px] leading-relaxed">
          Sizning faol va oldingi buyurtmalaringiz shu yerda ko'rinadi.
        </p>
        
        <Link href="/menu">
          <button className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-4 px-8 rounded-2xl shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2 text-[16px]">
            Menyuga o'tish <ArrowRight className="w-5 h-5" />
          </button>
        </Link>
      </div>
    </div>
  );
}
