"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame, MapPin, ChevronRight, Search,
  Pizza, Coffee, Sandwich, AlertTriangle, X, Gift, Megaphone
} from "lucide-react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

const XO_JAYLI_CENTER = { lat: 42.4601, lng: 59.6302 };
const RADIUS_KM = 30;

function getDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dLat / 2) ** 2 + Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

const categories = [
  { icon: Pizza,    label: "Ovqatlar",    color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/30", section: "foods" },
  { icon: Coffee,   label: "Ichimliklar", color: "text-blue-400",   bg: "bg-blue-400/10",   border: "border-blue-400/30",   section: "drinks" },
  { icon: Sandwich, label: "Fastfud",     color: "text-yellow-400", bg: "bg-yellow-400/10", border: "border-yellow-400/30", section: "fastfood" },
];

const banners = [
  { emoji: "🛵", title: "Bepul yetkazish!", sub: "Birinchi buyurtmangiz mutlaqo bepul.", tag: "YANGI", gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)" },
  { emoji: "🍖", title: "Palov Bayrami!", sub: "Shanba va yakshanba palovga -15% chegirma.", tag: "AKSIYA", gradient: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)" },
  { emoji: "🎁", title: "Keshbek 5%", sub: "Har bir buyurtmangizdan 5% keshbek.", tag: "SOVG'A", gradient: "linear-gradient(135deg, #059669 0%, #0d9488 100%)" },
];

const storyItems = [
  { emoji: "👨‍🍳", title: "Tajribali Oshpazlar", desc: "10 yillik tajribaga ega ustalar." },
  { emoji: "🌿", title: "Toza Mahsulotlar", desc: "Faqat yangi va halol masalliqlar." },
  { emoji: "⚡", title: "Tez Yetkazish", desc: "O'rtacha 25-35 daqiqada." },
];

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeBanner, setActiveBanner] = useState(0);
  const [geofenceWarning, setGeofenceWarning] = useState(false);
  const [siteSettings, setSiteSettings] = useState<Record<string,string>>({});
  const [trendingItems, setTrendingItems] = useState<any[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setActiveBanner(p => (p + 1) % banners.length), 4000);

    fetch("/api/site-settings").then(r => r.json()).then(d => setSiteSettings(d || {})).catch(() => {});
    fetch("/api/menu/trending").then(r => r.json()).then(d => { if (Array.isArray(d)) setTrendingItems(d); }).catch(() => {}).finally(() => setTrendingLoading(false));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        if (getDistance(pos.coords.latitude, pos.coords.longitude, XO_JAYLI_CENTER.lat, XO_JAYLI_CENTER.lng) > RADIUS_KM) setGeofenceWarning(true);
      }, () => {});
    }
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans pb-28 bg-[var(--bg-deep,#09090b)] text-white overflow-x-hidden">

      {/* GEOFENCE WARNING */}
      <AnimatePresence>
        {geofenceWarning && (
          <motion.div initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -80, opacity: 0 }} className="fixed top-0 left-0 right-0 z-[999] bg-amber-600 text-white px-4 py-3 flex items-center gap-3 shadow-2xl">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-semibold flex-1">Hozircha faqat Xo'jayli tumanida xizmat ko'rsatamiz</p>
            <button onClick={() => setGeofenceWarning(false)}><X className="w-5 h-5" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="sticky top-0 z-50 bg-[#09090b]/85 backdrop-blur-2xl border-b border-white/5 pt-4 pb-3 px-4 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <span className="text-[11px] text-[#a1a1aa] font-bold uppercase tracking-widest">Yetkazib berish</span>
            <div className="flex items-center gap-1.5 text-white mt-0.5">
              <MapPin className="w-4 h-4 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
              <span className="text-[16px] font-black tracking-tight">Xo'jayli tumani</span>
            </div>
          </div>
          <div className="relative">
            <div className="absolute inset-0 bg-orange-500/20 blur-[15px] rounded-full" />
            <Logo className="w-10 h-10 rounded-[10px] relative z-10 border border-white/10" />
          </div>
        </div>
        <div className="relative w-full group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-[#888] group-focus-within:text-orange-500 transition-colors" />
          </div>
          <input
            type="text"
            placeholder="Taom yoki ichimlik qidirish..."
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-[15px] font-medium placeholder-[#666] outline-none focus:border-orange-500/50 focus:bg-white/10 transition-all shadow-inner"
            onClick={() => router.push("/menu")}
            readOnly
          />
        </div>
      </div>

      <div className={`transition-opacity duration-700 ${mounted ? "opacity-100" : "opacity-0"}`}>
        
        {siteSettings.announcement && (
          <div className="mx-4 mt-5 px-4 py-3 rounded-[16px] bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
            <Megaphone className="w-5 h-5 text-amber-400 shrink-0 animate-pulse" />
            <p className="text-[13px] font-bold text-amber-300 leading-tight">{siteSettings.announcement}</p>
          </div>
        )}

        {/* HERO BANNER SLIDER - Kept as requested */}
        <div className="px-4 mt-6 mb-8">
          <div className="relative w-full h-[160px] rounded-[28px] overflow-hidden shadow-[0_10px_40px_rgba(249,115,22,0.2)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeBanner}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="absolute inset-0 flex flex-col justify-center px-6"
                style={{ background: banners[activeBanner].gradient }}
              >
                <div className="absolute -right-10 -top-10 w-48 h-48 bg-white/20 blur-3xl rounded-full" />
                <div className="relative z-10 w-[65%]">
                  <span className="inline-block px-2.5 py-1 bg-black/20 backdrop-blur-md rounded-lg text-[10px] font-black text-white uppercase tracking-wider mb-2">
                    {banners[activeBanner].tag}
                  </span>
                  <h2 className="text-[22px] font-black text-white leading-tight mb-1 drop-shadow-md">{banners[activeBanner].title}</h2>
                  <p className="text-white/90 text-[13px] font-bold leading-snug drop-shadow-sm">{banners[activeBanner].sub}</p>
                </div>
                <div className="absolute right-[-5px] bottom-[-15px] text-[110px] opacity-95 drop-shadow-2xl select-none transform hover:scale-110 transition-transform">
                  {banners[activeBanner].emoji}
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-3 left-6 flex gap-1.5 z-20">
              {banners.map((_, i) => (
                <button key={i} onClick={() => setActiveBanner(i)} className={`h-1.5 rounded-full transition-all duration-300 ${i === activeBanner ? "w-6 bg-white shadow-[0_0_10px_rgba(255,255,255,0.8)]" : "w-1.5 bg-white/40"}`} />
              ))}
            </div>
          </div>
        </div>

        {/* CATEGORIES - New Dynamic Design */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mb-10 px-4">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-[20px] font-black text-white tracking-tight">Kategoriyalar</h3>
            <button onClick={() => router.push("/menu")} className="text-[13px] font-bold text-[#a1a1aa] hover:text-white transition-colors flex items-center">
              Barchasi <ChevronRight className="w-4 h-4 ml-0.5" />
            </button>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {categories.map((c, i) => (
              <motion.button key={i} whileTap={{ scale: 0.95 }} onClick={() => router.push(`/menu?section=${c.section}`)}
                className={`relative overflow-hidden flex flex-col items-center justify-center p-4 rounded-[24px] border ${c.border} bg-[#18181b] hover:bg-[#202024] transition-colors group`}>
                <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 ${c.bg} blur-xl`} />
                <div className={`w-12 h-12 rounded-full ${c.bg} flex items-center justify-center mb-3 relative z-10 shadow-inner`}>
                  <c.icon className={`w-6 h-6 ${c.color}`} />
                </div>
                <span className="text-[13px] font-bold text-white relative z-10">{c.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* TRENDING - New Glassmorphism Wide Cards */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="mb-10 pl-4 pr-0">
          <div className="flex items-center gap-2 mb-4 pr-4">
            <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
              <Flame className="w-4 h-4 text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]" />
            </div>
            <h3 className="text-[20px] font-black text-white tracking-tight">Trenddagi</h3>
          </div>
          
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 pr-4">
            {trendingLoading ? (
              [1,2].map(i => <div key={i} className="min-w-[260px] h-[120px] bg-[#18181b] rounded-[24px] animate-pulse border border-white/5 shrink-0" />)
            ) : trendingItems.length === 0 ? (
              <p className="text-[#a1a1aa] text-sm py-4">Hali buyurtmalar yo'q</p>
            ) : (
              trendingItems.map((item, i) => (
                <motion.div key={item.id} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }}
                  whileTap={{ scale: 0.98 }} onClick={() => router.push("/menu")}
                  className="min-w-[260px] h-[120px] bg-[#18181b] rounded-[24px] p-3 border border-white/10 flex items-center gap-4 relative overflow-hidden shrink-0 shadow-lg cursor-pointer group">
                  <div className="absolute -right-10 -top-10 w-32 h-32 bg-orange-500/5 blur-[40px] rounded-full pointer-events-none" />
                  
                  <div className="w-[90px] h-[90px] bg-[#27272a] rounded-[20px] flex items-center justify-center text-[45px] shadow-inner shrink-0 group-hover:scale-105 transition-transform duration-300">
                    {item.emoji}
                  </div>
                  <div className="flex flex-col justify-center flex-1 h-full py-1">
                    <h4 className="text-[15px] font-black text-white leading-tight mb-1 line-clamp-2 pr-2">{item.name}</h4>
                    <span className="text-[14px] font-black text-orange-500 mt-auto">{Number(item.price).toLocaleString()} <span className="text-[10px] text-orange-500/70">so'm</span></span>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>

        {/* BIZ HAQIMIZDA - Grid Layout */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mb-10 px-4">
          <h3 className="text-[20px] font-black text-white tracking-tight mb-4 px-1">Nega aynan biz?</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {storyItems.map((s, i) => (
              <motion.div key={i} whileHover={{ scale: 1.02 }} className="bg-gradient-to-br from-[#18181b] to-[#111113] border border-white/5 rounded-[24px] p-5 relative overflow-hidden group">
                <div className="absolute right-[-20px] bottom-[-20px] text-[70px] opacity-5 group-hover:opacity-10 transition-opacity duration-300 transform -rotate-12 pointer-events-none">{s.emoji}</div>
                <div className="w-12 h-12 rounded-[16px] bg-white/5 flex items-center justify-center text-2xl border border-white/5 mb-3 shadow-inner">{s.emoji}</div>
                <h4 className="text-[15px] font-black text-white mb-1 tracking-tight">{s.title}</h4>
                <p className="text-[12px] font-medium text-[#888] leading-relaxed">{s.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CASHBACK BANNER */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="mx-4 mb-8 bg-gradient-to-r from-purple-900/40 to-indigo-900/40 border border-purple-500/20 rounded-[28px] p-6 relative overflow-hidden flex items-center gap-5 shadow-[0_10px_30px_rgba(147,51,234,0.1)]">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/20 blur-[50px] rounded-full pointer-events-none" />
          <div className="w-14 h-14 bg-purple-500/20 rounded-[18px] flex items-center justify-center border border-purple-500/30 shrink-0 shadow-inner relative z-10">
            <Gift className="w-7 h-7 text-purple-400" />
          </div>
          <div className="flex-1 relative z-10">
            <h4 className="font-black text-white text-[17px] mb-0.5 tracking-tight">Keshbek Tizimi</h4>
            <p className="text-[#a1a1aa] text-[13px] font-medium leading-snug">Har bir xariddan <span className="text-purple-400 font-black">5% keshbek</span> oling!</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
