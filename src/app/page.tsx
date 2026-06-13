"use client";

import { MapPin, Info, ClipboardList, CreditCard, LogOut, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

export default function HomePage() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/");
      router.refresh();
    } catch (error) {
      console.error(error);
    }
  };

  const gridItems = [
    { icon: ClipboardList, label: "Buyurtmalar", onClick: () => router.push("/orders") },
    { icon: MapPin, label: "Manzil", onClick: () => alert("Tez orada ishga tushadi") },
    { icon: CreditCard, label: "Onlayn to'lov", onClick: () => alert("Tez orada ishga tushadi") },
    { icon: Info, label: "Biz haqimizda", onClick: () => router.push("/about") },
    { icon: LogOut, label: "Chiqish", onClick: handleLogout },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-[#11131e] text-white font-sans pb-[100px]" style={{ background: "radial-gradient(circle at top center, #1a1d2e 0%, #0d0f18 100%)" }}>
      
      {/* Top Bar with Name */}
      <div className="flex justify-between items-center p-5">
        <div className="flex items-center gap-2 cursor-pointer bg-[#23263a]/80 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/5">
          <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center bg-white">
            <div className="w-full h-full flex flex-col">
              <div className="h-1/3 bg-[#009eb3]"></div>
              <div className="h-1/3 bg-white flex items-center justify-center"><div className="w-full h-[1px] bg-red-500"></div></div>
              <div className="h-1/3 bg-[#1eb53a]"></div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-white/50 rotate-90" />
        </div>
      </div>

      <div className="px-5">
        <div className="flex items-center gap-3 mb-8 mt-2">
          <Logo className="w-12 h-12" />
          <h1 className="text-[24px] font-bold">Ibragimov</h1>
        </div>

        {/* Grid Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-[17px] font-bold">Mening profilim</h2>
        </div>

        <div className="grid grid-cols-3 gap-y-6 gap-x-3">
          {gridItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                onClick={item.onClick}
                className="flex flex-col items-center gap-2 cursor-pointer group"
              >
                <div className="w-[64px] h-[64px] rounded-[20px] bg-[#1c1e2d] border border-white/5 flex items-center justify-center transition-all group-hover:bg-[#23263a]">
                  <Icon className={`w-6 h-6 ${item.label === "Chiqish" ? "text-red-400" : "text-[#8b5cf6]"}`} />
                </div>
                <span className="text-[11px] font-medium text-[#8e93a6] text-center px-1 leading-tight">
                  {item.label}
                </span>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}
