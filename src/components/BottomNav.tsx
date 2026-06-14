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
          background: "rgba(13,15,24,0.98)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
        }}
      >
        <div className="flex justify-around items-center h-[60px] px-2">
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
                className="flex flex-col items-center justify-center flex-1 h-full gap-1 no-underline transition-all duration-200"
              >
                <div
                  className={`flex items-center justify-center w-10 h-[30px] rounded-[14px] transition-all duration-200 ${
                    isActive
                      ? "bg-indigo-500/20 shadow-[0_0_12px_rgba(99,102,241,0.25)]"
                      : "bg-transparent"
                  }`}
                >
                  <Icon
                    className={`w-5 h-5 transition-colors duration-200 ${
                      isActive ? "text-indigo-400" : "text-[#4a4f6a]"
                    }`}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
                <span
                  className={`text-[10px] font-semibold transition-colors duration-200 ${
                    isActive ? "text-indigo-400" : "text-[#4a4f6a]"
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
      <div className="sm:hidden h-[60px]" />
    </>
  );
}


