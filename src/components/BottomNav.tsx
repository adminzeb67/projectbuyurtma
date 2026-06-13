"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, ShoppingCart, ClipboardList, Coffee } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Asosiy", icon: Home, href: "/" },
    { label: "Menyu", icon: Coffee, href: "/menu" },
    { label: "Buyurtmalar", icon: ClipboardList, href: "/orders" },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 sm:hidden"
      style={{ background: "#11131e", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="flex justify-around items-center h-16 bg-[#23263a]/40 backdrop-blur-md px-1">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/menu' && pathname.startsWith('/menu'));
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors"
            >
              <div className={`relative flex items-center justify-center w-8 h-8 rounded-xl transition-all ${isActive ? 'bg-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.2)]' : 'bg-transparent'}`}>
                <Icon className={`w-5 h-5 ${isActive ? 'text-indigo-400' : 'text-[#5c6175]'}`} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[9px] font-bold mt-0.5 ${isActive ? 'text-indigo-400' : 'text-[#5c6175]'}`}>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
