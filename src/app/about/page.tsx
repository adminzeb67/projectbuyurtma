"use client";

import { useEffect, useState } from "react";
import { ChevronLeft, Info, MapPin, Phone, Clock, ShieldCheck } from "lucide-react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

export default function AboutPage() {
  const router = useRouter();
  const [address, setAddress] = useState("Yuklanmoqda...");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(r => r.json())
      .then(d => {
        if (d.address) {
          setAddress(d.address);
        } else {
          setAddress("Manzil kiritilmagan");
        }
      })
      .catch(() => setAddress("Tarmoq xatosi"));
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#11131e] text-white font-sans pb-24">
      {/* Header */}
      <div className="p-5 pt-8 sticky top-0 z-30 bg-[#11131e]/90 backdrop-blur-md border-b border-white/5 flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 -ml-2 bg-[#23263a] text-white rounded-full hover:bg-[#2a2d45] transition-colors">
          <ChevronLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-extrabold">Biz haqimizda</h1>
      </div>

      <div className="p-5">
        {/* Brand Section */}
        <div className="flex flex-col items-center justify-center py-8 bg-gradient-to-b from-[#23263a]/40 to-transparent rounded-[32px] border border-white/5 mb-6">
          <div className="w-24 h-24 rounded-[24px] bg-gradient-to-tr from-purple-500 to-indigo-500 p-1 mb-4 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
            <div className="w-full h-full rounded-[20px] bg-[#11131e] flex items-center justify-center overflow-hidden">
              <Logo className="w-12 h-12" />
            </div>
          </div>
          <h2 className="text-[28px] font-extrabold tracking-wide bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            OshFast
          </h2>
          <p className="text-[#8e93a6] text-[13px] font-medium mt-1">Tez • Mazali • Ishonchli</p>
        </div>

        {/* Info Cards */}
        <div className="flex flex-col gap-4">
          <div className="bg-[#1c1e2d] border border-white/5 rounded-[24px] p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                <Info className="w-5 h-5" />
              </div>
              <h3 className="text-[16px] font-bold">Loyiha haqida</h3>
            </div>
            <p className="text-[#8e93a6] text-[14px] leading-relaxed">
              OshFast — bu eng mazali taomlarni uyingizgacha yoki ish joyingizgacha tezkor yetkazib berish xizmati. Bizning maqsadimiz mijozlarimizga doim issiq va sifatli taomlarni taqdim etishdir.
            </p>
          </div>

          <div className="bg-[#1c1e2d] border border-white/5 rounded-[24px] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-green-500/20 text-green-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-[16px] font-bold">Bizning afzalliklarimiz</h3>
            </div>
            <ul className="flex flex-col gap-3 text-[#8e93a6] text-[14px]">
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-400"></div> Tezkor yetkazib berish (30-40 daqiqa)</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-400"></div> Yangi va sifatli masalliqlar</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-400"></div> Qulay to'lov tizimi (Naqd va Karta)</li>
              <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-green-400"></div> Zamonaviy va oson interfeys</li>
            </ul>
          </div>

          <div className="bg-[#1c1e2d] border border-white/5 rounded-[24px] p-5">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-pink-500/20 text-pink-400 flex items-center justify-center">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="text-[16px] font-bold">Aloqa va Manzil</h3>
            </div>
            
            <div className="flex flex-col gap-4 text-[14px]">
              <div className="flex items-start gap-3 text-[#8e93a6]">
                <MapPin className="w-5 h-5 text-[#5c6175] shrink-0 mt-0.5" />
                <p>{address}</p>
              </div>
              <div className="flex items-center gap-3 text-[#8e93a6]">
                <Phone className="w-5 h-5 text-[#5c6175]" />
                <p>+998 90 123 45 67</p>
              </div>
              <div className="flex items-center gap-3 text-[#8e93a6]">
                <Clock className="w-5 h-5 text-[#5c6175]" />
                <p>Ish vaqti: 09:00 - 23:00 (Har kuni)</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
