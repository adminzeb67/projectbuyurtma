"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogOut, User, Phone, Lock, Eye, EyeOff, Edit3, CheckCircle2, X, ChevronRight, Gift, MapPin, Globe, Moon, Sun, History, RotateCcw, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";
import { useSettingsStore } from "@/store/useSettingsStore";

interface UserProfile { id: string; name: string; username: string | null; phone: string; role: string; }
interface PastOrder { id: string; totalAmount: number; status: string; createdAt: string; items: { quantity: number; menuItem: { name: string } }[]; }

const LANG_LABELS: Record<string, string> = { uz: "O'zbekcha", qq: "Qaraqalpaqsha", ru: "Русский" };

export default function ProfilPage() {
  const router = useRouter();
  const { language, setLanguage, darkMode, toggleDarkMode, cashbackBalance, savedAddresses, addSavedAddress, removeSavedAddress } = useSettingsStore();

  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");
  const [pastOrders, setPastOrders] = useState<PastOrder[]>([]);
  const [activeTab, setActiveTab] = useState<"profile"|"history"|"addresses"|"settings">("profile");

  const [name, setName] = useState(""); const [username, setUsername] = useState("");
  const [phone, setPhone] = useState(""); const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState(""); const [showPassword, setShowPassword] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState(""); const [newAddrVal, setNewAddrVal] = useState("");

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(data => {
      if (data.id) { setUser(data); setName(data.name||""); setUsername(data.username||""); setPhone(data.phone||""); }
    }).catch(console.error).finally(() => setLoading(false));

    // Fetch order history
    fetch("/api/orders/my").then(r => r.json()).then(data => { if (Array.isArray(data)) setPastOrders(data.slice(0,10)); }).catch(()=>{});
  }, []);

  const handleLogout = async () => { await fetch("/api/auth/logout", { method: "POST" }); router.push("/"); router.refresh(); };

  const handleSave = async () => {
    setError(""); setSaving(true);
    try {
      const res = await fetch("/api/auth/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, username, phone, password, confirmPassword }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Xatolik");
      setUser(data.user); setPassword(""); setConfirmPassword(""); setEditing(false);
      setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) { setError(err.message); } finally { setSaving(false); }
  };

  const reOrder = (order: PastOrder) => {
    // Save items to localStorage and redirect to menu
    localStorage.setItem("oshfast_reorder", JSON.stringify(order.items));
    router.push("/menu");
  };

  const addAddr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLabel || !newAddrVal) return;
    addSavedAddress({ label: newAddrLabel, address: newAddrVal });
    setNewAddrLabel(""); setNewAddrVal("");
  };

  const displayName = user?.username || user?.name || "Mijoz";
  const initials = displayName.slice(0, 2).toUpperCase();

  const tabs = [
    { id: "profile",   label: "Profil",     emoji: "👤" },
    { id: "history",   label: "Tarix",      emoji: "📋" },
    { id: "addresses", label: "Manzillar",  emoji: "📍" },
    { id: "settings",  label: "Sozlamalar", emoji: "⚙️" },
  ];

  return (
    <div className="flex flex-col min-h-screen text-white font-sans pb-28" style={{ background: "var(--bg-deep,#09090b)" }}>

      {saveSuccess && (
        <motion.div initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 bg-green-500/20 border border-green-500/30 rounded-2xl text-green-400 font-semibold text-[14px] shadow-lg">
          <CheckCircle2 className="w-4 h-4" /> Profil yangilandi!
        </motion.div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-30 px-5 py-4 flex items-center justify-between bg-[#09090b]/92 backdrop-blur-xl border-b border-white/5">
        <h1 className="text-[20px] font-black text-white">Profilim</h1>
        <button onClick={handleLogout} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/15 text-red-500 text-[13px] font-bold hover:bg-red-500/20 transition-all">
          <LogOut className="w-4 h-4" /> Chiqish
        </button>
      </div>

      {/* Avatar Card */}
      <div className="px-5 pt-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] p-6 flex items-center gap-4 mb-4" style={{ background: "linear-gradient(135deg,rgba(249,115,22,0.12),rgba(234,88,12,0.05))", border: "1px solid rgba(249,115,22,0.15)" }}>
          <div className="w-16 h-16 rounded-[20px] flex items-center justify-center text-[24px] font-black text-white shrink-0" style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", boxShadow: "0 0 24px rgba(249,115,22,0.3)" }}>
            {loading ? "..." : initials}
          </div>
          <div className="flex-1">
            <h2 className="text-[20px] font-black text-white">{loading ? "Yuklanmoqda..." : displayName}</h2>
            <span className="text-xs font-bold text-orange-500">{user?.phone}</span>
          </div>
          {/* Cashback Badge */}
          <div className="flex flex-col items-center bg-purple-500/10 border border-purple-500/20 rounded-2xl px-4 py-2">
            <Gift className="w-4 h-4 text-purple-400 mb-1" />
            <span className="text-[11px] text-[#a1a1aa] font-bold">Keshbek</span>
            <span className="font-black text-purple-400">{cashbackBalance.toLocaleString()} so'm</span>
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5 overflow-x-auto scrollbar-hide pb-1">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[13px] font-bold whitespace-nowrap transition-all ${activeTab === tab.id ? "bg-orange-500 text-black" : "bg-[#18181b] text-[#888] border border-white/5"}`}>
              <span>{tab.emoji}</span> {tab.label}
            </button>
          ))}
        </div>

        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-bold text-white">Ma'lumotlarim</h3>
              {!editing ? (
                <button onClick={() => { setEditing(true); setError(""); }} className="flex items-center gap-1 text-[13px] font-bold text-orange-500">
                  <Edit3 className="w-4 h-4" /> Tahrirlash
                </button>
              ) : (
                <button onClick={() => { setEditing(false); setError(""); }} className="flex items-center gap-1 text-[13px] font-bold text-[#a1a1aa]">
                  <X className="w-4 h-4" /> Bekor
                </button>
              )}
            </div>
            {error && <div className="mb-2 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[13px] text-center">{error}</div>}
            <FieldRow icon={<User className="w-5 h-5 text-orange-500"/>} label="Ism" editing={editing} value={name} display={user?.name||"—"} onChange={setName} placeholder="Ismingiz"/>
            <FieldRow icon={<span className="text-orange-500 font-black text-lg">@</span>} label="Login" editing={editing} value={username} display={user?.username||"—"} onChange={setUsername} placeholder="Login"/>
            <FieldRow icon={<Phone className="w-5 h-5 text-green-500"/>} label="Telefon" editing={editing} value={phone} display={user?.phone||"—"} onChange={setPhone} placeholder="+998..." inputType="tel"/>
            {editing && (
              <>
                <div className="flex items-center gap-4 px-5 py-4 rounded-[20px] bg-[#18181b] border border-orange-500/30">
                  <Lock className="w-5 h-5 text-yellow-500 shrink-0"/>
                  <input type={showPassword?"text":"password"} value={password} onChange={e=>setPassword(e.target.value)} className="flex-1 bg-transparent text-white font-bold outline-none placeholder-[#555]" placeholder="Yangi parol"/>
                  <button onClick={()=>setShowPassword(!showPassword)}>{showPassword?<EyeOff className="w-5 h-5 text-[#666]"/>:<Eye className="w-5 h-5 text-[#666]"/>}</button>
                </div>
                <div className="flex items-center gap-4 px-5 py-4 rounded-[20px] bg-[#18181b] border border-orange-500/30">
                  <Lock className="w-5 h-5 text-yellow-500 shrink-0"/>
                  <input type={showPassword?"text":"password"} value={confirmPassword} onChange={e=>setConfirmPassword(e.target.value)} className="flex-1 bg-transparent text-white font-bold outline-none placeholder-[#555]" placeholder="Parolni tasdiqlang"/>
                </div>
                <button onClick={handleSave} disabled={saving} className="w-full py-4 rounded-[20px] font-black text-white bg-orange-500 hover:bg-orange-600 disabled:opacity-60 transition-all flex items-center justify-center gap-2">
                  {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"/> : "Saqlash ✓"}
                </button>
              </>
            )}
          </motion.div>
        )}

        {/* HISTORY TAB */}
        {activeTab === "history" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
            <h3 className="font-bold text-white mb-1 flex items-center gap-2"><History className="w-4 h-4 text-orange-500"/> Buyurtmalar tarixi</h3>
            {pastOrders.length === 0 ? (
              <div className="py-12 text-center text-[#666]">Hali buyurtma yo'q</div>
            ) : pastOrders.map(order => (
              <div key={order.id} className="bg-[#18181b] border border-white/5 rounded-[20px] p-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="text-[11px] text-[#666] font-bold uppercase">{new Date(order.createdAt).toLocaleDateString("uz-UZ")}</p>
                    <p className="font-bold text-white text-sm mt-0.5">{order.items.map(i=>`${i.quantity}x ${i.menuItem.name}`).join(", ").slice(0,40)}...</p>
                  </div>
                  <span className="font-black text-orange-500">{order.totalAmount.toLocaleString()} so'm</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-[10px] font-bold px-2 py-1 rounded-full ${order.status==="DELIVERED"?"bg-green-500/10 text-green-500":"bg-[#27272a] text-[#666]"}`}>{order.status}</span>
                  <button onClick={()=>reOrder(order)} className="flex items-center gap-1 text-[12px] font-bold text-orange-500 bg-orange-500/10 px-3 py-1.5 rounded-full hover:bg-orange-500/20 transition-colors">
                    <RotateCcw className="w-3 h-3"/> Qayta buyurtma
                  </button>
                </div>
              </div>
            ))}
          </motion.div>
        )}

        {/* ADDRESSES TAB */}
        {activeTab === "addresses" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3">
            <h3 className="font-bold text-white mb-1 flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-500"/> Saqlangan manzillar</h3>
            {savedAddresses.map((addr, i) => (
              <div key={i} className="bg-[#18181b] border border-white/5 rounded-[20px] p-4 flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-500/10 rounded-[12px] flex items-center justify-center text-xl shrink-0">
                  {addr.label==="Uyim"?"🏠":addr.label==="Ishxonam"?"🏢":"📍"}
                </div>
                <div className="flex-1">
                  <p className="font-bold text-white">{addr.label}</p>
                  <p className="text-[12px] text-[#a1a1aa]">{addr.address}</p>
                </div>
                <button onClick={()=>removeSavedAddress(addr.label)} className="text-red-500 hover:text-red-400 p-1"><Trash2 className="w-4 h-4"/></button>
              </div>
            ))}
            <form onSubmit={addAddr} className="bg-[#18181b] border border-white/5 rounded-[20px] p-4 flex flex-col gap-3 mt-2">
              <p className="text-[12px] font-bold text-[#a1a1aa] uppercase tracking-wider">Yangi manzil qo'shish</p>
              <div className="flex gap-2">
                <input value={newAddrLabel} onChange={e=>setNewAddrLabel(e.target.value)} placeholder="Nomi (Uyim)" className="w-1/3 bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-orange-500/50"/>
                <input value={newAddrVal} onChange={e=>setNewAddrVal(e.target.value)} placeholder="Manzil yoki ko'cha" className="flex-1 bg-[#111] border border-white/10 rounded-xl px-3 py-2 text-white text-sm outline-none focus:border-orange-500/50"/>
                <button type="submit" className="bg-orange-500 text-black rounded-xl px-3 py-2"><Plus className="w-4 h-4"/></button>
              </div>
            </form>
          </motion.div>
        )}

        {/* SETTINGS TAB */}
        {activeTab === "settings" && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4">
            <h3 className="font-bold text-white mb-1 flex items-center gap-2"><Globe className="w-4 h-4 text-orange-500"/> Til tanlash</h3>
            <div className="grid grid-cols-3 gap-3">
              {(["uz","qq","ru"] as const).map(lang => (
                <button key={lang} onClick={()=>setLanguage(lang)}
                  className={`py-3 rounded-[16px] font-bold text-sm transition-all border-2 ${language===lang ? "bg-orange-500 text-black border-orange-500" : "bg-[#18181b] text-[#888] border-white/5"}`}>
                  {LANG_LABELS[lang]}
                </button>
              ))}
            </div>

            <div className="bg-[#18181b] border border-white/5 rounded-[20px] p-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-5 h-5 text-blue-400"/> : <Sun className="w-5 h-5 text-yellow-400"/>}
                <div>
                  <p className="font-bold text-white">{darkMode ? "Tungi rejim" : "Kunduzgi rejim"}</p>
                  <p className="text-[12px] text-[#a1a1aa]">Interfeys ko'rinishi</p>
                </div>
              </div>
              <button onClick={toggleDarkMode} className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? "bg-orange-500" : "bg-[#333]"}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${darkMode ? "left-6" : "left-0.5"}`}/>
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}

function FieldRow({ icon, label, editing, value, display, onChange, placeholder, inputType="text" }: { icon: React.ReactNode; label: string; editing: boolean; value: string; display: string; onChange: (v:string)=>void; placeholder: string; inputType?: string }) {
  return (
    <div className={`flex items-center gap-4 px-5 py-4 rounded-[20px] bg-[#18181b] transition-all ${editing ? "border border-orange-500/30" : "border border-white/5"}`}>
      <div className="w-10 h-10 rounded-[12px] bg-orange-500/10 flex items-center justify-center shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-[#a1a1aa] uppercase tracking-wider mb-0.5">{label}</p>
        {editing ? <input type={inputType} value={value} onChange={e=>onChange(e.target.value)} className="w-full bg-transparent text-white text-[16px] font-bold outline-none placeholder-[#555]" placeholder={placeholder}/> : <p className="text-[16px] font-bold text-white truncate">{display}</p>}
      </div>
    </div>
  );
}
