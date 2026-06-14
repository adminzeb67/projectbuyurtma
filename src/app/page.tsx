"use client";

import { useEffect, useState } from "react";
import { Flame, Star, Clock, MapPin, ChevronRight, Search, Pizza, Coffee, Sandwich, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

const categories = [
  { icon: Pizza, label: "Ovqatlar", color: "text-orange-500", bg: "bg-orange-500/10" },
  { icon: Coffee, label: "Ichimliklar", color: "text-blue-400", bg: "bg-blue-400/10" },
  { icon: Sandwich, label: "Fastfud", color: "text-yellow-400", bg: "bg-yellow-400/10" },
];

const trending = [
  { id: 1, name: "Mol go'shtli Lavash", price: "28 000", img: "🌯", rating: 4.9 },
  { id: 2, name: "Tovuqli Burger", price: "24 000", img: "🍔", rating: 4.8 },
  { id: 3, name: "Pepsi 0.5L", price: "7 000", img: "🥤", rating: 4.7 },
  { id: 4, name: "Klab Sendvich", price: "32 000", img: "🥪", rating: 4.9 },
];

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans pb-24 bg-[var(--bg-deep)] text-white">
      
      {/* ───── HEADER / SEARCH ───── */}
      <div className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5 pt-4 pb-3 px-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-[12px] text-[#a1a1aa] font-medium uppercase tracking-wider">Yetkazib berish</span>
            <div className="flex items-center gap-1 text-white">
              <MapPin className="w-4 h-4 text-orange-500" />
              <span className="text-[15px] font-bold">Xo'jayli tumani</span>
            </div>
          </div>
          <div className="w-10 h-10 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
            <Logo className="w-8 h-8 rounded-[25%]" />
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-[#a1a1aa]" />
          </div>
          <input 
            type="text" 
            placeholder="Taom yoki ichimlik qidirish..." 
            className="w-full bg-[#18181b] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-[15px] font-medium placeholder-[#52525b] outline-none focus:border-orange-500/50 transition-colors shadow-inner"
            onClick={() => router.push("/menu")}
          />
        </div>
      </div>

      <div className={`transition-opacity duration-500 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        
        {/* ───── PROMO BANNER ───── */}
        <div className="px-4 mt-6 mb-8">
          <div className="w-full h-[140px] rounded-[24px] relative overflow-hidden shadow-[0_8px_30px_rgba(249,115,22,0.15)] flex items-center px-6" style={{ background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)" }}>
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/20 blur-3xl rounded-full" />
            <div className="relative z-10 w-[60%]">
              <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded-md text-[10px] font-bold uppercase tracking-wider mb-2">Yangi</span>
              <h2 className="text-[20px] font-black leading-tight mb-1">Bepul yetkazish!</h2>
              <p className="text-white/80 text-[13px] font-medium leading-snug">Birinchi buyurtmangizni mutlaqo bepul yetkazib beramiz.</p>
            </div>
            {/* Placeholder for banner image */}
            <div className="absolute right-[-20px] bottom-[-20px] text-[100px] opacity-90 drop-shadow-2xl">
              🛵
            </div>
          </div>
        </div>

        {/* ───── CATEGORIES ───── */}
        <div className="mb-8 px-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[18px] font-bold text-white">Kategoriyalar</h3>
            <button onClick={() => router.push("/menu")} className="text-[13px] font-bold text-orange-500 flex items-center">
              Barchasi <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((c, i) => (
              <button 
                key={i} 
                onClick={() => router.push("/menu")}
                className="flex flex-col items-center gap-2 min-w-[80px]"
              >
                <div className={`w-16 h-16 rounded-[20px] ${c.bg} flex items-center justify-center border border-white/5`}>
                  <c.icon className={`w-8 h-8 ${c.color}`} />
                </div>
                <span className="text-[13px] font-medium text-[#a1a1aa]">{c.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ───── TRENDING ───── */}
        <div className="mb-8 px-4">
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-orange-500" />
            <h3 className="text-[18px] font-bold text-white">Trenddagi taomlar</h3>
          </div>
          
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
            {trending.map((item) => (
              <div 
                key={item.id}
                onClick={() => router.push("/menu")}
                className="min-w-[160px] bg-[#18181b] rounded-[24px] p-3 border border-white/5 shadow-lg flex flex-col active:scale-95 transition-transform"
              >
                <div className="w-full h-[120px] bg-[#27272a] rounded-[16px] mb-3 flex items-center justify-center text-[60px]">
                  {item.img}
                </div>
                <h4 className="text-[15px] font-bold text-white leading-tight mb-1">{item.name}</h4>
                <div className="flex items-center justify-between mt-auto pt-2">
                  <span className="text-[14px] font-bold text-orange-500">{item.price} <span className="text-[10px]">so'm</span></span>
                  <div className="flex items-center gap-1 bg-[#27272a] px-1.5 py-0.5 rounded-md">
                    <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                    <span className="text-[11px] font-bold">{item.rating}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ───── INFO CARDS ───── */}
        <div className="px-4 grid grid-cols-2 gap-3">
          <div className="bg-[#18181b] border border-white/5 p-4 rounded-[20px] flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-orange-500/10 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-white">30 Daqiqa</span>
              <span className="text-[11px] font-medium text-[#a1a1aa]">Yetkazish</span>
            </div>
          </div>
          <div className="bg-[#18181b] border border-white/5 p-4 rounded-[20px] flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-green-500/10 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-green-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-white">Xavfsiz</span>
              <span className="text-[11px] font-medium text-[#a1a1aa]">To'lovlar</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
