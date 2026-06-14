"use client";

import { useEffect, useState } from "react";
import { Zap, Star, Clock, ShieldCheck, MapPin, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

const features = [
  {
    icon: Zap,
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.12)",
    border: "rgba(245,158,11,0.2)",
    title: "Tezkor yetkazish",
    desc: "Buyurtmangiz 30 daqiqa ichida issiqligicha yetib boradi",
  },
  {
    icon: Star,
    color: "#a855f7",
    bg: "rgba(168,85,247,0.12)",
    border: "rgba(168,85,247,0.2)",
    title: "Sifatli taomlar",
    desc: "Eng sara ingredientlardan tayyorlangan milliy va zamonaviy taomlar",
  },
  {
    icon: Clock,
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.12)",
    border: "rgba(56,189,248,0.2)",
    title: "24/7 Xizmat",
    desc: "Istalgan vaqt buyurtma bering — biz doim tayyormiz",
  },
  {
    icon: ShieldCheck,
    color: "#22c55e",
    bg: "rgba(34,197,94,0.12)",
    border: "rgba(34,197,94,0.2)",
    title: "Xavfsiz to'lov",
    desc: "Naqd pul yoki karta orqali qulay va xavfsiz to'lov",
  },
  {
    icon: MapPin,
    color: "#f43f5e",
    bg: "rgba(244,63,94,0.12)",
    border: "rgba(244,63,94,0.2)",
    title: "Qoraqalpog'iston",
    desc: "Xo'jayli tumani va atrofdagi hududlarga yetkazib berish",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [visible, setVisible] = useState(false);
  const [featVisible, setFeatVisible] = useState<boolean[]>(Array(features.length).fill(false));

  useEffect(() => {
    // Hero entrance
    const t = setTimeout(() => setVisible(true), 80);

    // Staggered feature cards
    features.forEach((_, i) => {
      setTimeout(() => {
        setFeatVisible((prev) => {
          const next = [...prev];
          next[i] = true;
          return next;
        });
      }, 350 + i * 120);
    });

    return () => clearTimeout(t);
  }, []);

  return (
    <div
      className="flex flex-col min-h-screen text-white font-sans pb-28"
      style={{ background: "radial-gradient(circle at 30% 20%, #1a1d2e 0%, #0d0f18 70%, #0a0c14 100%)" }}
    >
      {/* ───── HERO ───── */}
      <div
        className="flex flex-col items-center justify-center px-6 pt-12 pb-10 text-center relative overflow-hidden"
        style={{
          transition: "opacity 0.6s ease, transform 0.6s ease",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(20px)",
        }}
      >
        {/* Glow blobs */}
        <div
          className="absolute top-[-60px] left-1/2 -translate-x-1/2 w-[300px] h-[300px] rounded-full pointer-events-none"
          style={{
            background: "radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />

        {/* Logo with pulse ring */}
        <div className="relative mb-6">
          <div
            className="absolute inset-0 rounded-[30%] animate-ping"
            style={{ background: "rgba(139,92,246,0.15)", animationDuration: "2.5s" }}
          />
          <Logo
            className="w-24 h-24 relative rounded-[25%]"
            style={{ boxShadow: "0 0 40px rgba(139,92,246,0.35), 0 0 80px rgba(99,102,241,0.15)" }}
          />
        </div>

        <h1
          className="text-[34px] sm:text-[42px] font-black leading-tight mb-3"
          style={{ letterSpacing: "-0.02em" }}
        >
          <span
            style={{
              background: "linear-gradient(135deg, #c084fc 0%, #818cf8 50%, #38bdf8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            OshFast
          </span>
          <br />
          <span className="text-white text-[24px] sm:text-[30px] font-bold">
            Ovqat yetkazib berish
          </span>
        </h1>

        <p className="text-[#8e93a6] text-[15px] sm:text-[16px] leading-relaxed max-w-[340px] mb-8">
          O'zbekiston bo'ylab eng tezkor va mazali taomlarni uyingizga
          yetkazamiz ✨
        </p>

        <button
          onClick={() => router.push("/menu")}
          className="flex items-center gap-2 px-8 py-3.5 rounded-full font-bold text-[15px] text-white transition-all hover:scale-105 active:scale-95"
          style={{
            background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
            boxShadow: "0 0 24px rgba(139,92,246,0.4)",
          }}
        >
          Buyurtma berish
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* ───── FEATURES ───── */}
      <div className="px-4 sm:px-6">
        <h2 className="text-[13px] font-bold text-[#5c6175] uppercase tracking-widest mb-4 px-1">
          Nima uchun OshFast?
        </h2>

        <div className="flex flex-col gap-3">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={i}
                className="flex items-center gap-4 px-5 py-4 rounded-[20px]"
                style={{
                  background: "rgba(35,38,58,0.5)",
                  border: `1px solid rgba(255,255,255,0.05)`,
                  transition: `opacity 0.5s ease ${i * 0.05}s, transform 0.5s ease ${i * 0.05}s`,
                  opacity: featVisible[i] ? 1 : 0,
                  transform: featVisible[i] ? "translateX(0)" : "translateX(-16px)",
                }}
              >
                <div
                  className="w-11 h-11 rounded-[14px] flex items-center justify-center shrink-0"
                  style={{ background: f.bg, border: `1px solid ${f.border}` }}
                >
                  <Icon className="w-5 h-5" style={{ color: f.color }} />
                </div>
                <div>
                  <h3 className="text-[14px] font-bold text-white mb-0.5">{f.title}</h3>
                  <p className="text-[12px] text-[#8e93a6] leading-snug">{f.desc}</p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Stats row */}
        <div
          className="mt-6 grid grid-cols-3 gap-3"
          style={{
            transition: "opacity 0.6s ease 0.8s, transform 0.6s ease 0.8s",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(12px)",
          }}
        >
          {[
            { val: "30 min", label: "Avg yetkazish" },
            { val: "4.9★", label: "Reyting" },
            { val: "1000+", label: "Buyurtmalar" },
          ].map((s, i) => (
            <div
              key={i}
              className="flex flex-col items-center py-4 rounded-[18px]"
              style={{
                background: "rgba(35,38,58,0.4)",
                border: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              <span className="text-[18px] font-black text-white">{s.val}</span>
              <span className="text-[10px] text-[#5c6175] font-semibold mt-0.5">{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
