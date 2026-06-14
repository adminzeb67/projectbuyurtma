"use client";

import { useEffect, useState } from "react";
import { CheckCircle2, PartyPopper } from "lucide-react";

interface SuccessAnimationProps {
  type: "order" | "register";
  onClose: () => void;
}

export function SuccessAnimation({ type, onClose }: SuccessAnimationProps) {
  const [visible, setVisible] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; x: number; y: number; color: string; size: number; delay: number; angle: number }>>([]);

  useEffect(() => {
    // Trigger entrance animation
    const t = setTimeout(() => setVisible(true), 10);

    // Generate confetti particles
    const colors = ["#a855f7", "#6366f1", "#22c55e", "#f59e0b", "#ec4899", "#38bdf8"];
    const newParticles = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 60,
      color: colors[Math.floor(Math.random() * colors.length)],
      size: Math.random() * 8 + 4,
      delay: Math.random() * 0.6,
      angle: Math.random() * 360,
    }));
    setParticles(newParticles);

    return () => clearTimeout(t);
  }, []);

  const isOrder = type === "order";

  return (
    <div
      className={`fixed inset-0 z-[200] flex items-center justify-center p-4 transition-all duration-300 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
      style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
    >
      {/* Confetti Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-sm"
            style={{
              left: `${p.x}%`,
              top: `-${p.size * 2}px`,
              width: `${p.size}px`,
              height: `${p.size * 1.5}px`,
              backgroundColor: p.color,
              transform: `rotate(${p.angle}deg)`,
              animation: `confettiFall ${1.5 + p.delay}s ease-in ${p.delay}s forwards`,
              opacity: 0.9,
            }}
          />
        ))}
      </div>

      {/* Card */}
      <div
        className={`relative bg-[#1c1e2d] w-full max-w-sm rounded-[32px] overflow-hidden shadow-2xl transition-all duration-500 ${
          visible ? "scale-100 translate-y-0" : "scale-75 translate-y-8"
        }`}
        style={{ border: "1px solid rgba(255,255,255,0.08)" }}
      >
        {/* Top gradient bar */}
        <div
          className="h-1.5 w-full"
          style={{
            background: isOrder
              ? "linear-gradient(90deg, #22c55e, #16a34a)"
              : "linear-gradient(90deg, #8b5cf6, #6366f1)",
          }}
        />

        <div className="p-8 flex flex-col items-center text-center">
          {/* Animated checkmark circle */}
          <div className="relative mb-6">
            {/* Outer pulse rings */}
            <div
              className="absolute inset-0 rounded-full animate-ping"
              style={{
                background: isOrder ? "rgba(34,197,94,0.15)" : "rgba(139,92,246,0.15)",
                animationDuration: "1.5s",
              }}
            />
            <div
              className="absolute -inset-3 rounded-full animate-ping"
              style={{
                background: isOrder ? "rgba(34,197,94,0.08)" : "rgba(139,92,246,0.08)",
                animationDuration: "2s",
                animationDelay: "0.3s",
              }}
            />

            {/* Icon container */}
            <div
              className="relative w-24 h-24 rounded-full flex items-center justify-center"
              style={{
                background: isOrder
                  ? "radial-gradient(circle, rgba(34,197,94,0.25) 0%, rgba(34,197,94,0.05) 100%)"
                  : "radial-gradient(circle, rgba(139,92,246,0.25) 0%, rgba(139,92,246,0.05) 100%)",
                border: isOrder ? "2px solid rgba(34,197,94,0.3)" : "2px solid rgba(139,92,246,0.3)",
                boxShadow: isOrder
                  ? "0 0 40px rgba(34,197,94,0.25)"
                  : "0 0 40px rgba(139,92,246,0.25)",
              }}
            >
              {isOrder ? (
                <CheckCircle2
                  className="w-12 h-12"
                  style={{
                    color: "#22c55e",
                    filter: "drop-shadow(0 0 8px rgba(34,197,94,0.6))",
                    animation: "iconPop 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.2s both",
                  }}
                />
              ) : (
                <PartyPopper
                  className="w-12 h-12"
                  style={{
                    color: "#a855f7",
                    filter: "drop-shadow(0 0 8px rgba(168,85,247,0.6))",
                    animation: "iconPop 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.2s both",
                  }}
                />
              )}
            </div>
          </div>

          {/* Text */}
          <h2
            className="text-[26px] font-extrabold text-white mb-3 leading-tight"
            style={{ animation: "slideUp 0.4s ease 0.35s both" }}
          >
            {isOrder ? "Buyurtma qabul qilindi! 🎉" : "Tabriklaymiz! 🎊"}
          </h2>

          <p
            className="text-[15px] leading-relaxed mb-8 px-2"
            style={{
              color: "#8e93a6",
              animation: "slideUp 0.4s ease 0.45s both",
            }}
          >
            {isOrder
              ? "Buyurtmangiz muvaffaqiyatli qabul qilindi.\nKuryer tez orada sizga yetib boradi! 🚀"
              : "Muvaffaqiyatli ro'yxatdan o'tdingiz!\nEndi OshFast xizmatlaridan to'liq foydalanishingiz mumkin."}
          </p>

          {/* Emoji row */}
          <div
            className="flex gap-3 text-3xl mb-8"
            style={{ animation: "slideUp 0.4s ease 0.55s both" }}
          >
            {isOrder ? (
              <>
                <span style={{ animation: "bounce 1s ease 0.6s infinite" }}>🍽️</span>
                <span style={{ animation: "bounce 1s ease 0.75s infinite" }}>🚴</span>
                <span style={{ animation: "bounce 1s ease 0.9s infinite" }}>📍</span>
              </>
            ) : (
              <>
                <span style={{ animation: "bounce 1s ease 0.6s infinite" }}>✅</span>
                <span style={{ animation: "bounce 1s ease 0.75s infinite" }}>🌟</span>
                <span style={{ animation: "bounce 1s ease 0.9s infinite" }}>🎉</span>
              </>
            )}
          </div>

          {/* Button */}
          <button
            onClick={onClose}
            className="w-full py-4 rounded-[20px] font-extrabold text-[16px] text-white transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: isOrder
                ? "linear-gradient(135deg, #22c55e 0%, #16a34a 100%)"
                : "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
              boxShadow: isOrder
                ? "0 0 24px rgba(34,197,94,0.35)"
                : "0 0 24px rgba(139,92,246,0.35)",
              animation: "slideUp 0.4s ease 0.65s both",
            }}
          >
            {isOrder ? "Buyurtmalarimga o'tish →" : "Menyuga o'tish →"}
          </button>
        </div>

        {/* CSS Animations */}
        <style jsx>{`
          @keyframes confettiFall {
            0% {
              transform: translateY(-20px) rotate(0deg);
              opacity: 1;
            }
            100% {
              transform: translateY(100vh) rotate(720deg);
              opacity: 0;
            }
          }
          @keyframes iconPop {
            0% { transform: scale(0); opacity: 0; }
            100% { transform: scale(1); opacity: 1; }
          }
          @keyframes slideUp {
            0% { transform: translateY(16px); opacity: 0; }
            100% { transform: translateY(0); opacity: 1; }
          }
          @keyframes bounce {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-8px); }
          }
        `}</style>
      </div>
    </div>
  );
}
