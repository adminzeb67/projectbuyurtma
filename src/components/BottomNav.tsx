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
      {/* Mobile Bottom Nav — always visible on mobile via inline style */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 9999,
          background: "rgba(13,15,24,0.98)",
          borderTop: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          display: "flex",
          flexDirection: "column",
        }}
        className="sm:hidden"
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            height: "60px",
            paddingLeft: "8px",
            paddingRight: "8px",
          }}
        >
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
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  flex: 1,
                  height: "100%",
                  gap: "4px",
                  textDecoration: "none",
                  transition: "all 0.2s",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    width: "40px",
                    height: "30px",
                    borderRadius: "14px",
                    background: isActive
                      ? "rgba(99,102,241,0.2)"
                      : "transparent",
                    boxShadow: isActive
                      ? "0 0 12px rgba(99,102,241,0.25)"
                      : "none",
                    transition: "all 0.2s",
                  }}
                >
                  <Icon
                    style={{
                      width: "20px",
                      height: "20px",
                      color: isActive ? "#818cf8" : "#4a4f6a",
                      transition: "color 0.2s",
                    }}
                    strokeWidth={isActive ? 2.5 : 2}
                  />
                </div>
                <span
                  style={{
                    fontSize: "10px",
                    fontWeight: 600,
                    color: isActive ? "#818cf8" : "#4a4f6a",
                    transition: "color 0.2s",
                  }}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Spacer so content is not hidden behind nav */}
      <div className="sm:hidden" style={{ height: "60px" }} />
    </>
  );
}


