"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, Coffee, UserCircle } from "lucide-react";
import { Logo } from "@/components/Logo";

export function Sidebar() {
  const pathname = usePathname();
  const navItems = [
    { label: "Asosiy", icon: Home, href: "/" },
    { label: "Menyu", icon: Coffee, href: "/menu" },
    { label: "Buyurtmalar", icon: ClipboardList, href: "/orders" },
    { label: "Profilim", icon: UserCircle, href: "/profil" },
  ];

  return (
    <div className="hidden sm:flex flex-col w-64 h-screen fixed left-0 top-0 bg-[var(--bg-deep)] border-r border-white/5 z-50">
      <div className="p-6">
        <div className="flex items-center gap-3">
          <Logo className="w-10 h-10 shadow-[0_0_20px_rgba(249,115,22,0.3)] rounded-[25%]" />
          <div>
            <h1 className="text-[20px] font-black tracking-tight text-white drop-shadow-md">
              F.Lavash
            </h1>
            <p className="text-[10px] text-[#a1a1aa] uppercase tracking-wider font-bold mt-0.5">Tez · Mazali</p>
          </div>
        </div>
      </div>

      <div className="h-[1px] bg-white/5 mx-5 mb-4" />

      <nav className="flex-1 px-4 flex flex-col gap-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href === '/menu' && pathname.startsWith('/menu')) || (item.href === '/profil' && pathname.startsWith('/profil'));
          const Icon = item.icon;
          return (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl transition-all duration-300 font-bold text-[14px] ${
                isActive 
                  ? "bg-orange-500/10 text-orange-500 border border-orange-500/20 shadow-inner" 
                  : "text-[#a1a1aa] hover:bg-white/5 hover:text-white border border-transparent"
              }`}>
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.5 : 2} />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
