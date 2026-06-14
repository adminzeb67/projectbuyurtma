"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Flame, Star, Clock, MapPin, ChevronRight, Search,
  Pizza, Coffee, Sandwich, ShieldCheck, X, AlertTriangle, Gift,
  ChevronLeft, ChevronRight as ChevronRightIcon, Megaphone
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
  { icon: Pizza,    label: "Ovqatlar",    color: "text-orange-500", bg: "bg-orange-500/10", section: "foods" },
  { icon: Coffee,   label: "Ichimliklar", color: "text-blue-400",   bg: "bg-blue-400/10",   section: "drinks" },
  { icon: Sandwich, label: "Fastfud",     color: "text-yellow-400", bg: "bg-yellow-400/10", section: "fastfood" },
];

const banners = [
  { emoji: "🛵", title: "Bepul yetkazish!", sub: "Birinchi buyurtmangiz mutlaqo bepul.", tag: "Yangi", gradient: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)" },
  { emoji: "🍖", title: "Palov Bayrami!", sub: "Shanba va yakshanba palovga -15% chegirma.", tag: "Aksiya", gradient: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 100%)" },
  { emoji: "🎁", title: "Keshbek 5%", sub: "Har bir buyurtmangizdan 5% keshbek.", tag: "Sovg'a", gradient: "linear-gradient(135deg, #059669 0%, #0d9488 100%)" },
];

const trending = [
  { id: 1, name: "Mol go'shtli Lavash", price: "28 000", img: "🌯", rating: 4.9, section: "fastfood" },
  { id: 2, name: "Tovuqli Burger",      price: "24 000", img: "🍔", rating: 4.8, section: "fastfood" },
  { id: 3, name: "Pepsi 0.5L",          price: "7 000",  img: "🥤", rating: 4.7, section: "drinks" },
  { id: 4, name: "Klab Sendvich",       price: "32 000", img: "🥪", rating: 4.9, section: "fastfood" },
];

const storyItems = [
  { emoji: "👨‍🍳", title: "Professional Oshpazlar", desc: "10 yillik tajribaga ega ustalar tomonidan tayyorlanadi." },
  { emoji: "🌿", title: "Yangi Mahsulotlar", desc: "Har kuni ertalab mahalliy bozordan olingan toza mahsulotlar." },
  { emoji: "⚡", title: "Tez Yetkazib Berish", desc: "O'rtacha 25-35 daqiqada eshigingizga yetkazamiz." },
];

export default function HomePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeBanner, setActiveBanner] = useState(0);
  const [geofenceWarning, setGeofenceWarning] = useState(false);
  const [siteSettings, setSiteSettings] = useState<Record<string,string>>({});

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => setActiveBanner(p => (p + 1) % banners.length), 4000);

    // Load admin settings
    fetch("/api/site-settings")
      .then(r => r.json())
      .then(d => setSiteSettings(d || {}))
      .catch(() => {});

    // Geofence check
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((pos) => {
        const dist = getDistance(pos.coords.latitude, pos.coords.longitude, XO_JAYLI_CENTER.lat, XO_JAYLI_CENTER.lng);
        if (dist > RADIUS_KM) setGeofenceWarning(true);
      }, () => {});
    }

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans pb-24 bg-[var(--bg-deep,#09090b)] text-white">

      {/* GEOFENCE WARNING */}
      <AnimatePresence>
        {geofenceWarning && (
          <motion.div
            initial={{ y: -80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-[999] bg-amber-600 text-white px-4 py-3 flex items-center gap-3 shadow-2xl"
          >
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-semibold flex-1">Hozircha faqat Xo'jayli tumanida xizmat ko'rsatamiz</p>
            <button onClick={() => setGeofenceWarning(false)}><X className="w-5 h-5" /></button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ANNOUNCEMENT BANNER — from admin settings */}
      {siteSettings.announcement && (
        <div className="mx-4 mt-4 px-4 py-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center gap-3">
          <Megaphone className="w-5 h-5 text-amber-400 shrink-0" />
          <p className="text-sm font-semibold text-amber-300">{siteSettings.announcement}</p>
        </div>
      )}

      {/* HEADER */}
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
        <div className="relative w-full">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="w-5 h-5 text-[#a1a1aa]" />
          </div>
          <input
            type="text"
            placeholder="Taom yoki ichimlik qidirish..."
            className="w-full bg-[#18181b] border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-[15px] font-medium placeholder-[#52525b] outline-none focus:border-orange-500/50 transition-colors"
            onClick={() => router.push("/menu")}
            readOnly
          />
        </div>
      </div>

      <div className={`transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>

        {/* HERO BANNER SLIDER */}
        <div className="px-4 mt-6 mb-8">
          <div className="relative w-full h-[155px] rounded-[24px] overflow-hidden shadow-[0_8px_30px_rgba(249,115,22,0.15)]">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeBanner}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="absolute inset-0 flex items-center px-6"
                style={{ background: banners[activeBanner].gradient }}
              >
                <div className="absolute -right-8 -top-8 w-40 h-40 bg-white/15 blur-3xl rounded-full" />
                <div className="relative z-10 w-[65%]">
                  <span className="inline-block px-2 py-1 bg-white/20 backdrop-blur-md rounded-md text-[10px] font-bold uppercase tracking-wider mb-2">
                    {banners[activeBanner].tag}
                  </span>
                  <h2 className="text-[20px] font-black leading-tight mb-1">{banners[activeBanner].title}</h2>
                  <p className="text-white/80 text-[13px] font-medium leading-snug">{banners[activeBanner].sub}</p>
                </div>
                <div className="absolute right-[-10px] bottom-[-10px] text-[100px] opacity-90 drop-shadow-2xl select-none">
                  {banners[activeBanner].emoji}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Dots */}
            <div className="absolute bottom-3 left-6 flex gap-1.5 z-20">
              {banners.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveBanner(i)}
                  className={`h-1.5 rounded-full transition-all duration-300 ${i === activeBanner ? "w-5 bg-white" : "w-1.5 bg-white/40"}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* CATEGORIES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8 px-4"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-[18px] font-bold text-white">Kategoriyalar</h3>
            <button onClick={() => router.push("/menu")} className="text-[13px] font-bold text-orange-500 flex items-center">
              Barchasi <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2">
            {categories.map((c, i) => (
              <motion.button
                key={i}
                whileTap={{ scale: 0.9 }}
                onClick={() => router.push(`/menu?section=${c.section}`)}
                className="flex flex-col items-center gap-2 min-w-[80px]"
              >
                <div className={`w-16 h-16 rounded-[20px] ${c.bg} flex items-center justify-center border border-white/5`}>
                  <c.icon className={`w-8 h-8 ${c.color}`} />
                </div>
                <span className="text-[13px] font-medium text-[#a1a1aa]">{c.label}</span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* TRENDING */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-8 px-4"
        >
          <div className="flex items-center gap-2 mb-4">
            <Flame className="w-5 h-5 text-orange-500" />
            <h3 className="text-[18px] font-bold text-white">Trenddagi taomlar</h3>
          </div>
          <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
            {trending.map((item, i) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * i + 0.2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => router.push(`/menu?section=${item.section}`)}
                className="min-w-[160px] bg-[#18181b] rounded-[24px] p-3 border border-white/5 shadow-lg flex flex-col cursor-pointer"
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
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* STORY / BIZ HAQIMIZDA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-8 px-4"
        >
          <h3 className="text-[18px] font-bold text-white mb-4">Biz haqimizda</h3>
          <div className="grid grid-cols-1 gap-3">
            {storyItems.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * i + 0.3 }}
                className="bg-[#18181b] border border-white/5 rounded-[20px] p-4 flex items-center gap-4"
              >
                <div className="w-12 h-12 rounded-[14px] bg-orange-500/10 flex items-center justify-center text-2xl border border-orange-500/10 shrink-0">
                  {s.emoji}
                </div>
                <div>
                  <h4 className="text-[15px] font-bold text-white mb-0.5">{s.title}</h4>
                  <p className="text-[13px] text-[#a1a1aa]">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CASHBACK BANNER */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mx-4 mb-8 bg-gradient-to-br from-[#1a1a2e] to-[#16213e] border border-purple-500/20 rounded-[24px] p-5 flex items-center gap-4"
        >
          <div className="w-14 h-14 bg-purple-500/20 rounded-[16px] flex items-center justify-center border border-purple-500/20 shrink-0">
            <Gift className="w-7 h-7 text-purple-400" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-white text-[16px]">Keshbek Tizimi</h4>
            <p className="text-[#a1a1aa] text-[13px]">Har bir buyurtmangizdan <span className="text-purple-400 font-bold">5% keshbek</span> hamyoningizga qo'shiladi!</p>
          </div>
        </motion.div>

        {/* INFO CARDS */}
        <div className="px-4 grid grid-cols-2 gap-3 mb-4">
          <div className="bg-[#18181b] border border-white/5 p-4 rounded-[20px] flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-orange-500/10 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-bold text-white">30 Daqiqa</span>
              <span className="text-[11px] font-medium text-[#a1a1aa]">Yetkazish</span>
            </div>
          </div>
          <div className="bg-[#18181b] border border-white/5 p-4 rounded-[20px] flex items-center gap-3">
            <div className="w-10 h-10 rounded-[12px] bg-green-500/10 flex items-center justify-center shrink-0">
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
