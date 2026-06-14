"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LogOut, User, Phone, Lock, Eye, EyeOff, Edit3, CheckCircle2, X,
  Gift, MapPin, Globe, Moon, Sun, History, RotateCcw, Trash2, Plus,
  ChevronRight, ShieldCheck, Bell
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useSettingsStore } from "@/store/useSettingsStore";

interface UserProfile { id: string; name: string; username: string | null; phone: string; role: string; }
interface PastOrder { id: string; totalAmount: number; status: string; createdAt: string; items: { quantity: number; menuItem: { name: string } }[]; }

const LANG_FLAGS: Record<string, string> = { uz: "🇺🇿", qq: "🌊", ru: "🇷🇺" };
const LANG_LABELS: Record<string, string> = { uz: "O'zbekcha", qq: "Qaraqalpaqsha", ru: "Русский" };

const STATUS_MAP: Record<string, { label: string; color: string }> = {
  DELIVERED:  { label: "Yetkazildi",   color: "text-green-400 bg-green-400/10 border-green-400/20" },
  PENDING:    { label: "Kutilmoqda",   color: "text-yellow-400 bg-yellow-400/10 border-yellow-400/20" },
  PREPARING:  { label: "Tayyorlanmoqda", color: "text-blue-400 bg-blue-400/10 border-blue-400/20" },
  CANCELLED:  { label: "Bekor",        color: "text-red-400 bg-red-400/10 border-red-400/20" },
};

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
  const [openSection, setOpenSection] = useState<string | null>("profile");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [newAddrLabel, setNewAddrLabel] = useState("");
  const [newAddrVal, setNewAddrVal] = useState("");

  useEffect(() => {
    fetch("/api/auth/me").then(r => r.json()).then(data => {
      if (data.id) { setUser(data); setName(data.name || ""); setPhone(data.phone || ""); }
    }).catch(console.error).finally(() => setLoading(false));
    fetch("/api/orders/my").then(r => r.json()).then(data => { if (Array.isArray(data)) setPastOrders(data.slice(0, 10)); }).catch(() => {});
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

  const addAddr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddrLabel || !newAddrVal) return;
    addSavedAddress({ label: newAddrLabel, address: newAddrVal });
    setNewAddrLabel(""); setNewAddrVal("");
  };

  const displayName = user?.name || user?.username || "Foydalanuvchi";
  const initials = displayName.slice(0, 2).toUpperCase();

  const toggle = (id: string) => setOpenSection(prev => prev === id ? null : id);

  return (
    <div className="flex flex-col min-h-screen text-white font-sans pb-28 bg-[#09090b] overflow-x-hidden">

      {/* Success toast */}
      <AnimatePresence>
        {saveSuccess && (
          <motion.div initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -80, opacity: 0 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 bg-green-500/20 border border-green-500/30 rounded-2xl text-green-400 font-bold text-[14px] shadow-2xl backdrop-blur-xl">
            <CheckCircle2 className="w-4 h-4" /> Muvaffaqiyatli saqlandi!
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER */}
      <div className="sticky top-0 z-30 px-5 py-4 flex items-center justify-between bg-[#09090b]/90 backdrop-blur-2xl border-b border-white/5">
        <h1 className="text-[22px] font-black text-white tracking-tight">Sozlamalar</h1>
        <button onClick={handleLogout}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] font-bold hover:bg-red-500/20 active:scale-95 transition-all">
          <LogOut className="w-4 h-4" /> Chiqish
        </button>
      </div>

      <div className="px-4 pt-5 flex flex-col gap-5">

        {/* ─── COMPACT PROFILE STRIP ─── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-3 px-4 py-3 rounded-[20px] border border-orange-500/15"
          style={{ background: "linear-gradient(135deg,rgba(249,115,22,0.10),rgba(234,88,12,0.04))" }}>
          <div className="w-11 h-11 rounded-[12px] flex items-center justify-center text-[16px] font-black text-white shrink-0"
            style={{ background: "linear-gradient(135deg,#f97316,#ea580c)" }}>
            {loading ? ".." : initials}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[15px] font-black text-white truncate leading-tight">{loading ? "Yuklanmoqda..." : displayName}</p>
            <p className="text-[12px] font-bold text-orange-400 truncate">{user?.phone || "—"}</p>
          </div>
          <div className="flex items-center gap-1.5 bg-purple-500/10 border border-purple-500/20 rounded-xl px-3 py-1.5 shrink-0">
            <Gift className="w-3.5 h-3.5 text-purple-400" />
            <span className="font-black text-purple-300 text-[13px]">{cashbackBalance.toLocaleString()} so'm</span>
          </div>
        </motion.div>

        {/* ─── ACCORDION SECTIONS ─── */}

        {/* 1. Profilim */}
        <AccordionSection
          id="profile"
          open={openSection === "profile"}
          onToggle={() => toggle("profile")}
          icon={<User className="w-5 h-5 text-orange-500" />}
          iconBg="bg-orange-500/10"
          title="Profilim"
          subtitle="Ism, telefon, parol"
        >
          <div className="flex flex-col gap-3 pt-1">
            {error && <div className="px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] text-center">{error}</div>}

            {/* Edit toggle */}
            <div className="flex justify-end">
              {!editing ? (
                <button onClick={() => { setEditing(true); setError(""); }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[13px] font-bold hover:bg-orange-500/20 transition-all">
                  <Edit3 className="w-3.5 h-3.5" /> Tahrirlash
                </button>
              ) : (
                <button onClick={() => { setEditing(false); setError(""); }}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-[#888] text-[13px] font-bold hover:bg-white/10 transition-all">
                  <X className="w-3.5 h-3.5" /> Bekor
                </button>
              )}
            </div>

            <FieldRow icon={<User className="w-4 h-4 text-orange-500" />} label="Ism yoki login" editing={editing} value={name} display={displayName} onChange={setName} placeholder="Ism yoki login" />
            <FieldRow icon={<Phone className="w-4 h-4 text-green-500" />} label="Telefon raqam" editing={editing} value={phone} display={user?.phone || "—"} onChange={setPhone} placeholder="+998..." inputType="tel" />

            <AnimatePresence>
              {editing && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="flex flex-col gap-3 overflow-hidden">
                  <div className="flex items-center gap-3 px-4 py-3.5 rounded-[18px] bg-[#111] border border-orange-500/25">
                    <Lock className="w-4 h-4 text-yellow-500 shrink-0" />
                    <input type={showPassword ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)}
                      className="flex-1 bg-transparent text-white font-bold outline-none placeholder-[#444] text-[15px]" placeholder="Yangi parol" />
                    <button onClick={() => setShowPassword(!showPassword)} className="p-1">
                      {showPassword ? <EyeOff className="w-4 h-4 text-[#666]" /> : <Eye className="w-4 h-4 text-[#666]" />}
                    </button>
                  </div>
                  <div className="flex items-center gap-3 px-4 py-3.5 rounded-[18px] bg-[#111] border border-orange-500/25">
                    <Lock className="w-4 h-4 text-yellow-500 shrink-0" />
                    <input type={showPassword ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}
                      className="flex-1 bg-transparent text-white font-bold outline-none placeholder-[#444] text-[15px]" placeholder="Parolni tasdiqlang" />
                  </div>
                  <button onClick={handleSave} disabled={saving}
                    className="w-full py-4 rounded-[18px] font-black text-white bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:opacity-60 transition-all flex items-center justify-center gap-2 shadow-[0_4px_20px_rgba(249,115,22,0.35)] active:scale-[0.98]">
                    {saving ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><CheckCircle2 className="w-4 h-4" /> Saqlash</>}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </AccordionSection>

        {/* 2. Til va Ko'rinish */}
        <AccordionSection
          id="settings"
          open={openSection === "settings"}
          onToggle={() => toggle("settings")}
          icon={<Globe className="w-5 h-5 text-blue-400" />}
          iconBg="bg-blue-400/10"
          title="Til va Ko'rinish"
          subtitle="Interfeys tili, tema"
        >
          <div className="flex flex-col gap-4 pt-1">
            {/* Language */}
            <div>
              <p className="text-[11px] font-bold text-[#666] uppercase tracking-widest mb-3">Til tanlash</p>
              <div className="grid grid-cols-3 gap-2.5">
                {(["uz", "qq", "ru"] as const).map(lang => (
                  <button key={lang} onClick={() => setLanguage(lang)}
                    className={`flex flex-col items-center gap-1.5 py-3 rounded-[18px] font-bold text-[13px] transition-all border-2 ${language === lang ? "bg-orange-500 text-black border-orange-500 shadow-[0_4px_20px_rgba(249,115,22,0.3)]" : "bg-[#18181b] text-[#888] border-transparent hover:border-white/10"}`}>
                    <span className="text-2xl">{LANG_FLAGS[lang]}</span>
                    <span className="text-[11px] font-bold">{LANG_LABELS[lang]}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Dark mode */}
            <div className="flex items-center justify-between px-4 py-4 bg-[#18181b] rounded-[18px] border border-white/5">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-[12px] flex items-center justify-center ${darkMode ? "bg-blue-500/10" : "bg-yellow-500/10"}`}>
                  {darkMode ? <Moon className="w-5 h-5 text-blue-400" /> : <Sun className="w-5 h-5 text-yellow-400" />}
                </div>
                <div>
                  <p className="font-bold text-white text-[14px]">{darkMode ? "Tungi rejim" : "Kunduzgi rejim"}</p>
                  <p className="text-[11px] text-[#666]">Interfeys ko'rinishi</p>
                </div>
              </div>
              <button onClick={toggleDarkMode}
                className={`w-14 h-7 rounded-full transition-all duration-300 relative shadow-inner ${darkMode ? "bg-orange-500" : "bg-[#333]"}`}>
                <span className={`absolute top-1 w-5 h-5 bg-white rounded-full shadow-md transition-all duration-300 ${darkMode ? "left-8" : "left-1"}`} />
              </button>
            </div>
          </div>
        </AccordionSection>

        {/* 3. Saqlangan manzillar */}
        <AccordionSection
          id="addresses"
          open={openSection === "addresses"}
          onToggle={() => toggle("addresses")}
          icon={<MapPin className="w-5 h-5 text-green-400" />}
          iconBg="bg-green-400/10"
          title="Manzillar"
          subtitle={`${savedAddresses.length} ta saqlangan`}
        >
          <div className="flex flex-col gap-3 pt-1">
            {/* Add form */}
            <form onSubmit={addAddr} className="flex gap-2">
              <input value={newAddrLabel} onChange={e => setNewAddrLabel(e.target.value)} placeholder="Nomi (Uyim)"
                className="w-[35%] bg-[#18181b] border border-white/10 rounded-[14px] px-3 py-2.5 text-white text-[13px] outline-none focus:border-orange-500/50 transition-colors" />
              <input value={newAddrVal} onChange={e => setNewAddrVal(e.target.value)} placeholder="Ko'cha, uy raqami..."
                className="flex-1 bg-[#18181b] border border-white/10 rounded-[14px] px-3 py-2.5 text-white text-[13px] outline-none focus:border-orange-500/50 transition-colors" />
              <button type="submit"
                className="bg-orange-500 text-black rounded-[14px] px-3 py-2.5 hover:bg-orange-600 transition-colors active:scale-95">
                <Plus className="w-4 h-4" />
              </button>
            </form>

            <div className="flex flex-col gap-2 max-h-[220px] overflow-y-auto scrollbar-hide">
              {savedAddresses.length === 0 ? (
                <div className="py-8 text-center text-[#555] text-[13px]">
                  <MapPin className="w-8 h-8 mx-auto mb-2 opacity-30" />
                  <p>Hali manzil qo'shilmagan</p>
                </div>
              ) : savedAddresses.map((addr, i) => (
                <div key={i} className="bg-[#18181b] border border-white/5 rounded-[18px] p-3.5 flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500/10 rounded-[12px] flex items-center justify-center text-xl shrink-0">
                    {addr.label.toLowerCase().includes("uy") ? "🏠" : addr.label.toLowerCase().includes("ish") ? "🏢" : "📍"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-[14px] truncate">{addr.label}</p>
                    <p className="text-[12px] text-[#888] truncate">{addr.address}</p>
                  </div>
                  <button onClick={() => removeSavedAddress(addr.label)} className="w-8 h-8 flex items-center justify-center rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </AccordionSection>

        {/* 4. Buyurtmalar tarixi */}
        <AccordionSection
          id="history"
          open={openSection === "history"}
          onToggle={() => toggle("history")}
          icon={<History className="w-5 h-5 text-purple-400" />}
          iconBg="bg-purple-400/10"
          title="Buyurtmalar tarixi"
          subtitle={`${pastOrders.length} ta buyurtma`}
        >
          <div className="flex flex-col gap-2.5 pt-1 max-h-[350px] overflow-y-auto scrollbar-hide">
            {pastOrders.length === 0 ? (
              <div className="py-10 text-center text-[#555] text-[13px]">
                <History className="w-8 h-8 mx-auto mb-2 opacity-30" />
                <p>Hali buyurtma yo'q</p>
              </div>
            ) : pastOrders.map(order => {
              const st = STATUS_MAP[order.status] || { label: order.status, color: "text-[#888] bg-white/5 border-white/10" };
              return (
                <div key={order.id} className="bg-[#18181b] border border-white/5 rounded-[20px] p-4">
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] text-[#666] font-bold uppercase tracking-wider mb-1">
                        {new Date(order.createdAt).toLocaleDateString("uz-UZ", { year: "numeric", month: "short", day: "numeric" })}
                      </p>
                      <p className="font-bold text-white text-[13px] leading-snug line-clamp-1">
                        {order.items.map(i => `${i.quantity}× ${i.menuItem.name}`).join(", ")}
                      </p>
                    </div>
                    <span className="font-black text-orange-500 text-[15px] shrink-0">{order.totalAmount.toLocaleString()} so'm</span>
                  </div>
                  <div className="flex items-center justify-between pt-2.5 border-t border-white/5">
                    <span className={`text-[11px] font-bold px-3 py-1 rounded-full border ${st.color}`}>{st.label}</span>
                    <button onClick={() => { localStorage.setItem("oshfast_reorder", JSON.stringify(order.items)); router.push("/menu"); }}
                      className="flex items-center gap-1.5 text-[12px] font-bold text-orange-400 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-full hover:bg-orange-500/20 active:scale-95 transition-all">
                      <RotateCcw className="w-3 h-3" /> Qayta buyurtma
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </AccordionSection>

        {/* 5. Xavfsizlik info */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
          className="flex items-center gap-4 px-5 py-4 bg-[#18181b] border border-white/5 rounded-[24px]">
          <div className="w-10 h-10 bg-green-500/10 rounded-[12px] flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <p className="font-bold text-white text-[14px]">Xavfsiz platform</p>
            <p className="text-[12px] text-[#666]">Ma'lumotlaringiz himoyalangan</p>
          </div>
        </motion.div>

      </div>
    </div>
  );
}

/* ─── ACCORDION SECTION COMPONENT ─── */
function AccordionSection({ id, open, onToggle, icon, iconBg, title, subtitle, children }: {
  id: string; open: boolean; onToggle: () => void;
  icon: React.ReactNode; iconBg: string; title: string; subtitle?: string; children: React.ReactNode;
}) {
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
      className={`rounded-[24px] border transition-all duration-300 overflow-hidden ${open ? "border-orange-500/25 bg-[#18181b]" : "border-white/5 bg-[#18181b]"}`}>
      <button onClick={onToggle} className="w-full flex items-center gap-4 px-5 py-4 text-left">
        <div className={`w-11 h-11 rounded-[14px] ${iconBg} flex items-center justify-center shrink-0`}>{icon}</div>
        <div className="flex-1">
          <p className="font-black text-white text-[15px] leading-tight">{title}</p>
          {subtitle && <p className="text-[12px] text-[#666] mt-0.5">{subtitle}</p>}
        </div>
        <motion.div animate={{ rotate: open ? 90 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronRight className="w-5 h-5 text-[#555]" />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden">
            <div className="px-5 pb-5">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

/* ─── FIELD ROW ─── */
function FieldRow({ icon, label, editing, value, display, onChange, placeholder, inputType = "text" }: {
  icon: React.ReactNode; label: string; editing: boolean;
  value: string; display: string; onChange: (v: string) => void; placeholder: string; inputType?: string;
}) {
  return (
    <div className={`flex items-center gap-3.5 px-4 py-3.5 rounded-[18px] bg-[#111] transition-all ${editing ? "border border-orange-500/30" : "border border-white/5"}`}>
      <div className="w-9 h-9 rounded-[10px] bg-white/5 flex items-center justify-center shrink-0">{icon}</div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-[#555] uppercase tracking-widest mb-0.5">{label}</p>
        {editing
          ? <input type={inputType} value={value} onChange={e => onChange(e.target.value)} className="w-full bg-transparent text-white text-[15px] font-bold outline-none placeholder-[#444]" placeholder={placeholder} />
          : <p className="text-[15px] font-bold text-white truncate">{display}</p>}
      </div>
    </div>
  );
}
