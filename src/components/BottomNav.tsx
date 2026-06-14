"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ClipboardList, Coffee, UserCircle } from "lucide-react";

export function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { label: "Asosiy", icon: Home, href: "/" },
    { label: "Menyu", icon: Coffee, href: "/menu" },
    { label: "Buyurtmalar", icon: ClipboardList, href: "/orders" },
    { label: "Profilim", icon: UserCircle, href: "/profil" },
  ];

  return (
    <>
      <div
        className="fixed bottom-0 left-0 right-0 z-[9999] flex flex-col sm:hidden"
        style={{
          background: "rgba(9,9,11,0.95)",
          borderTop: "1px solid rgba(255,255,255,0.05)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div className="flex justify-around items-center h-[64px] px-2 relative">
          {navItems.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href === "/menu" && pathname.startsWith("/menu")) ||
              (item.href === "/profil" && pathname.startsWith("/profil"));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center flex-1 h-full gap-1 no-underline transition-all duration-200 relative group"
              >
                {/* Active Indicator Dot */}
                {isActive && (
                  <div className="absolute top-0 w-8 h-[3px] bg-orange-500 rounded-b-full shadow-[0_0_10px_rgba(249,115,22,0.5)]" />
                )}
                
                <div
                  className={`flex items-center justify-center w-12 h-8 rounded-full transition-all duration-200 mt-1 ${
                    isActive
                      ? "bg-orange-500/10"
                      : "bg-transparent group-hover:bg-white/5"
                  }`}
                >
                  <Icon
                    className={`w-6 h-6 transition-colors duration-200 ${
                      isActive ? "text-orange-500" : "text-[#a1a1aa] group-hover:text-white"
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
                <span
                  className={`text-[11px] font-bold transition-colors duration-200 ${
                    isActive ? "text-orange-500" : "text-[#a1a1aa] group-hover:text-white"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Spacer so content is not hidden behind nav */}
      <div className="sm:hidden h-[64px]" />
    </>
  );
}


