"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { LogOut, User, Phone, Lock, Eye, EyeOff, Edit3, CheckCircle2, X, Gift, MapPin, Globe, Moon, Sun, History, RotateCcw, Trash2, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
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
      const res = await fetch("/api/auth/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ name, username: name, phone, password, confirmPassword }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Xatolik");
      setUser(data.user); setPassword(""); setConfirmPassword(""); setEditing(false);
      setSaveSuccess(true); setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) { setError(err.message); } finally { setSaving(false); }
  };

  const reOrder = (order: PastOrder) => {
    localStorage.setItem("oshfast_reorder", JSON.stringify(order.items));
    router.push("/menu");
  };

  const addAddr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLabel || !newAddrVal) return;
    addSavedAddress({ label: newAddrLabel, address: newAddrVal });
    setNewAddrLabel(""); setNewAddrVal("");
  };

  const displayName = user?.name || user?.username || "Mijoz";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col min-h-screen text-white font-sans pb-28" style={{ background: "var(--bg-deep,#09090b)" }}>

      {saveSuccess && (
        <motion.div initial={{ y: -60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 bg-green-500/20 border border-green-500/30 rounded-2xl text-green-400 font-semibold text-[14px] shadow-lg">
          <CheckCircle2 className="w-4 h-4" /> Profil yangilandi!
        </motion.div>
      )}

      {/* Header */}
      <div className="sticky top-0 z-30 px-5 py-4 flex items-center justify-between bg-[#09090b]/92 backdrop-blur-xl border-b border-white/5">
        <h1 className="text-[20px] font-black text-white">Sozlamalar</h1>
        <button onClick={handleLogout} className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/15 text-red-500 text-[13px] font-bold hover:bg-red-500/20 transition-all">
          <LogOut className="w-4 h-4" /> Chiqish
        </button>
      </div>

      <div className="px-4 pt-6 flex flex-col gap-8">
        
        {/* Avatar Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-[28px] p-6 flex items-center gap-4" style={{ background: "linear-gradient(135deg,rgba(249,115,22,0.12),rgba(234,88,12,0.05))", border: "1px solid rgba(249,115,22,0.15)" }}>
          <div className="w-16 h-16 rounded-[20px] flex items-center justify-center text-[24px] font-black text-white shrink-0" style={{ background: "linear-gradient(135deg,#f97316,#ea580c)", boxShadow: "0 0 24px rgba(249,115,22,0.3)" }}>
            {loading ? "..." : initials}
          </div>
          <div className="flex-1">
            <h2 className="text-[20px] font-black text-white">{loading ? "Yuklanmoqda..." : displayName}</h2>
            <span className="text-xs font-bold text-orange-500">{user?.phone}</span>
          </div>
          <div className="flex flex-col items-center bg-purple-500/10 border border-purple-500/20 rounded-2xl px-4 py-2">
            <Gift className="w-4 h-4 text-purple-400 mb-1" />
            <span className="text-[11px] text-[#a1a1aa] font-bold">Keshbek</span>
            <span className="font-black text-purple-400">{cashbackBalance.toLocaleString()} so'm</span>
          </div>
        </motion.div>

        {/* PROFILIM */}
        <section>
          <div className="flex items-center justify-between mb-3 px-1">
            <h3 className="font-bold text-white text-[17px]">Profilim (Ma'lumotlar)</h3>
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
          <div className="flex flex-col gap-3">
            {error && <div className="px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[13px] text-center">{error}</div>}
            <FieldRow icon={<User className="w-5 h-5 text-orange-500"/>} label="Ism yoki login" editing={editing} value={name} display={displayName} onChange={setName} placeholder="Ism yoki login"/>
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
          </div>
        </section>

        {/* SOZLAMALAR */}
        <section>
          <h3 className="font-bold text-white mb-3 px-1 text-[17px]">Tizim sozlamalari</h3>
          <div className="flex flex-col gap-3">
            <div className="bg-[#18181b] border border-white/5 rounded-[20px] p-4">
              <p className="text-[12px] font-bold text-[#a1a1aa] uppercase tracking-wider mb-3 flex items-center gap-2"><Globe className="w-4 h-4 text-orange-500"/> Til tanlash</p>
              <div className="grid grid-cols-3 gap-2">
                {(["uz","qq","ru"] as const).map(lang => (
                  <button key={lang} onClick={()=>setLanguage(lang)}
                    className={`py-2.5 rounded-[14px] font-bold text-[13px] transition-all border-2 ${language===lang ? "bg-orange-500 text-black border-orange-500" : "bg-[#27272a] text-[#888] border-transparent"}`}>
                    {LANG_LABELS[lang]}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-[#18181b] border border-white/5 rounded-[20px] p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {darkMode ? <Moon className="w-5 h-5 text-blue-400"/> : <Sun className="w-5 h-5 text-yellow-400"/>}
                <div>
                  <p className="font-bold text-white text-[14px]">{darkMode ? "Tungi rejim" : "Kunduzgi rejim"}</p>
                  <p className="text-[11px] text-[#a1a1aa]">Interfeys ko'rinishi</p>
                </div>
              </div>
              <button onClick={toggleDarkMode} className={`w-12 h-6 rounded-full transition-colors relative ${darkMode ? "bg-orange-500" : "bg-[#333]"}`}>
                <span className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${darkMode ? "left-6" : "left-0.5"}`}/>
              </button>
            </div>
          </div>
        </section>

        {/* MANZILLAR VA TARIX */}
        <section>
          <h3 className="font-bold text-white mb-3 px-1 text-[17px]">Manzillar va Tarix</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Manzillar */}
            <div className="bg-[#18181b] border border-white/5 rounded-[24px] p-4 flex flex-col gap-3">
              <p className="text-[12px] font-bold text-[#a1a1aa] uppercase tracking-wider flex items-center gap-2"><MapPin className="w-4 h-4 text-orange-500"/> Saqlangan manzillar</p>
              
              <form onSubmit={addAddr} className="flex gap-2 mb-1">
                <input value={newAddrLabel} onChange={e=>setNewAddrLabel(e.target.value)} placeholder="Nomi (Uy)" className="w-[30%] bg-[#27272a] rounded-xl px-3 py-2 text-white text-[13px] outline-none"/>
                <input value={newAddrVal} onChange={e=>setNewAddrVal(e.target.value)} placeholder="Manzil" className="flex-1 bg-[#27272a] rounded-xl px-3 py-2 text-white text-[13px] outline-none"/>
                <button type="submit" className="bg-orange-500 text-black rounded-xl px-3 py-2"><Plus className="w-4 h-4"/></button>
              </form>
              
              <div className="flex flex-col gap-2 max-h-[200px] overflow-y-auto scrollbar-hide">
                {savedAddresses.map((addr, i) => (
                  <div key={i} className="bg-[#27272a]/50 rounded-2xl p-3 flex items-center gap-3">
                    <div className="w-8 h-8 bg-orange-500/10 rounded-xl flex items-center justify-center text-lg shrink-0">
                      {addr.label.toLowerCase().includes("uy")?"🏠":addr.label.toLowerCase().includes("ish")?"🏢":"📍"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-bold text-white text-[13px] truncate">{addr.label}</p>
                      <p className="text-[11px] text-[#a1a1aa] truncate">{addr.address}</p>
                    </div>
                    <button onClick={()=>removeSavedAddress(addr.label)} className="text-red-500 hover:text-red-400 p-1"><Trash2 className="w-4 h-4"/></button>
                  </div>
                ))}
                {savedAddresses.length === 0 && <p className="text-center text-[#666] text-xs py-4">Manzillar yo'q</p>}
              </div>
            </div>

            {/* Tarix */}
            <div className="bg-[#18181b] border border-white/5 rounded-[24px] p-4 flex flex-col gap-3">
              <p className="text-[12px] font-bold text-[#a1a1aa] uppercase tracking-wider flex items-center gap-2"><History className="w-4 h-4 text-orange-500"/> Buyurtmalar tarixi</p>
              
              <div className="flex flex-col gap-2 max-h-[250px] overflow-y-auto scrollbar-hide">
                {pastOrders.length === 0 ? (
                  <div className="py-8 text-center text-[#666] text-xs">Hali buyurtma yo'q</div>
                ) : pastOrders.map(order => (
                  <div key={order.id} className="bg-[#27272a]/50 rounded-2xl p-3">
                    <div className="flex justify-between items-start mb-1.5">
                      <div>
                        <p className="text-[10px] text-[#888] font-bold uppercase">{new Date(order.createdAt).toLocaleDateString("uz-UZ")}</p>
                        <p className="font-bold text-white text-[12px] leading-tight mt-0.5">{order.items.map(i=>`${i.quantity}x ${i.menuItem.name}`).join(", ").slice(0,30)}...</p>
                      </div>
                      <span className="font-black text-orange-500 text-[13px] shrink-0">{order.totalAmount.toLocaleString()} so'm</span>
                    </div>
                    <div className="flex justify-between items-center mt-2 pt-2 border-t border-white/5">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-md ${order.status==="DELIVERED"?"bg-green-500/10 text-green-500":"bg-white/5 text-[#888]"}`}>{order.status}</span>
                      <button onClick={()=>reOrder(order)} className="flex items-center gap-1 text-[11px] font-bold text-orange-500 bg-orange-500/10 px-2.5 py-1.5 rounded-lg hover:bg-orange-500/20">
                        <RotateCcw className="w-3 h-3"/> Qayta buyurtma
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

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
