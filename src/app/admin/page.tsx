"use client";

import { useEffect, useState } from "react";
import { Lock, LayoutDashboard, ShoppingBag, FileText, Settings, Users, Banknote, XCircle } from "lucide-react";
import { Logo } from "@/components/Logo";

import DashboardTab from "./components/DashboardTab";
import OrdersTab from "./components/OrdersTab";
import MenuTab from "./components/MenuTab";
import CouriersTab from "./components/CouriersTab";
import FinanceTab from "./components/FinanceTab";
import SettingsTab from "./components/SettingsTab";

const sidebarLinks = [
  { id: "DASHBOARD", label: "Dashboard", icon: LayoutDashboard },
  { id: "ORDERS", label: "Buyurtmalar", icon: FileText },
  { id: "MENU", label: "Menyu & Stop-list", icon: ShoppingBag },
  { id: "COURIERS", label: "Kuryerlar", icon: Users },
  { id: "FINANCE", label: "Moliya", icon: Banknote },
  { id: "SETTINGS", label: "Sozlamalar", icon: Settings },
];

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState<string>("DASHBOARD");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAuth = localStorage.getItem("oshfast_admin_auth");
      if (savedAuth === "true") setIsAdmin(true);
    }
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: username, password })
      });
      const data = await res.json();
      if (data.redirect === "/admin") {
        setIsAdmin(true);
        setLoginError("");
        localStorage.setItem("oshfast_admin_auth", "true");
      } else {
        setLoginError("Login yoki parol noto'g'ri");
      }
    } catch {
      setLoginError("Xatolik yuz berdi");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("oshfast_admin_auth");
    setUsername("");
    setPassword("");
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 font-sans" style={{ background: "#111111" }}>
        <div className="w-full max-w-sm bg-[#1c1c1c] border border-white/5 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#f59e0b]/10 rounded-2xl flex items-center justify-center mb-4 border border-[#f59e0b]/20">
              <Lock className="w-8 h-8 text-[#f59e0b]" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin Kirish</h1>
          </div>
          {loginError && <div className="text-[#ef4444] text-center mb-4 text-sm">{loginError}</div>}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input 
              type="text" required value={username} onChange={e => setUsername(e.target.value)} 
              className="w-full bg-[#111] border border-white/5 p-4 rounded-xl text-white outline-none focus:border-[#f59e0b]/50"
              placeholder="Login" 
            />
            <input 
              type="password" required value={password} onChange={e => setPassword(e.target.value)} 
              className="w-full bg-[#111] border border-white/5 p-4 rounded-xl text-white outline-none focus:border-[#f59e0b]/50"
              placeholder="Parol" 
            />
            <button type="submit" className="w-full py-4 bg-[#f59e0b] text-black font-bold rounded-xl hover:bg-[#d97706] transition-colors">
              Kirish
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex text-white font-sans" style={{ background: "#161616" }}>
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-[260px] bg-[#111111] border-r border-white/5 fixed h-full z-20">
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <Logo className="w-10 h-10 text-[#f59e0b]" />
          <div>
            <h1 className="font-extrabold text-[18px] tracking-wide text-white">OSH FAST</h1>
            <p className="text-[10px] text-[#f59e0b] font-bold tracking-widest uppercase">Admin Panel</p>
          </div>
        </div>
        
        <div className="p-4">
          <div className="bg-[#1c1c1c] rounded-xl p-3 flex items-center gap-3 border border-white/5 mb-6">
            <div className="w-10 h-10 bg-[#f59e0b]/20 text-[#f59e0b] rounded-lg flex items-center justify-center font-bold text-lg">A</div>
            <div>
              <p className="font-bold text-sm text-white">Admin</p>
              <p className="text-[10px] text-[#f59e0b] font-bold uppercase">Boshqaruvchi</p>
            </div>
            <button onClick={handleLogout} className="ml-auto text-[#666] hover:text-[#f59e0b]"><XCircle className="w-4 h-4" /></button>
          </div>
          
          <nav className="flex flex-col gap-1">
            {sidebarLinks.map(link => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive ? "bg-[#f59e0b] text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]" : "text-[#888] hover:bg-[#1c1c1c] hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" /> {link.label}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 w-full bg-[#111111] border-t border-white/5 flex justify-around items-center h-[70px] z-50 px-2 pb-2">
        {sidebarLinks.slice(0, 5).map(link => {
          const Icon = link.icon;
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id)}
              className={`flex flex-col items-center justify-center w-[20%] h-full gap-1 transition-all ${
                isActive ? "text-[#f59e0b]" : "text-[#666]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[9px] font-bold truncate w-full text-center">{link.label}</span>
            </button>
          );
        })}
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-[260px] p-4 md:p-8 pb-24 md:pb-8">
        
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-[28px] md:text-[36px] font-extrabold text-white flex items-center gap-3">
              {sidebarLinks.find(l => l.id === activeTab)?.label}
            </h2>
          </div>
        </header>

        {activeTab === "DASHBOARD" && <DashboardTab />}
        {activeTab === "ORDERS" && <OrdersTab />}
        {activeTab === "MENU" && <MenuTab />}
        {activeTab === "COURIERS" && <CouriersTab />}
        {activeTab === "FINANCE" && <FinanceTab />}
        {activeTab === "SETTINGS" && <SettingsTab />}

      </main>
    </div>
  );
}
