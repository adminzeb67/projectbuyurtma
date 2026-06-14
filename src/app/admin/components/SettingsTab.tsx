"use client";

import { useEffect, useState } from "react";
import { Clock, ShieldAlert, Palette, Type, Megaphone, Check, Loader2 } from "lucide-react";

const DEFAULTS = {
  restaurant_name: "F.Lavash",
  banner_title: "Eng mazali lavash & fastfud",
  banner_subtitle: "Tez, issiq va mazali yetkazib berish",
  announcement: "",
  working_hours: "09:00 - 23:00",
  delivery_fee: "0",
  accent_color: "#f97316",
  is_open: "true",
};

export default function SettingsTab() {
  const [address, setAddress] = useState("");
  const [settings, setSettings] = useState<Record<string, string>>(DEFAULTS);
  const [blacklist, setBlacklist] = useState<any[]>([]);
  const [blPhone, setBlPhone] = useState("");
  const [blReason, setBlReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setAddress(data.address || "");
      const merged = { ...DEFAULTS };
      data.settings?.forEach((s: any) => { merged[s.key as keyof typeof DEFAULTS] = s.value; });
      setSettings(merged);
      setBlacklist(data.blacklist || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, settings })
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  };

  const handleAddBlacklist = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ blacklistPhone: blPhone, blacklistReason: blReason })
      });
      setBlPhone(""); setBlReason("");
      await fetchSettings();
    } catch { alert("Xatolik"); }
  };

  const removeBlacklist = async (id: string) => {
    await fetch(`/api/admin/settings?blacklistId=${id}`, { method: "DELETE" });
    await fetchSettings();
  };

  const Field = ({ label, k, type = "text", placeholder = "" }: { label: string; k: string; type?: string; placeholder?: string }) => (
    <div>
      <label className="block text-[11px] font-bold text-[#666] uppercase tracking-wider mb-1.5">{label}</label>
      <input
        type={type}
        value={settings[k] ?? ""}
        onChange={e => setSettings(prev => ({ ...prev, [k]: e.target.value }))}
        placeholder={placeholder}
        className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 text-sm"
      />
    </div>
  );

  if (loading) return <div className="animate-pulse p-8 text-[#a1a1aa]">Yuklanmoqda...</div>;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">

      {/* Save button floating */}
      <div className="flex justify-end">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-orange-500 text-black font-bold rounded-xl hover:bg-orange-600 disabled:opacity-50 transition-all shadow-[0_0_20px_rgba(249,115,22,0.3)]"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
          {saved ? "Saqlandi ✓" : "Barcha o'zgarishlarni saqlash"}
        </button>
      </div>

      {/* === BRAND SETTINGS === */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 shadow-lg">
        <h3 className="text-[16px] font-bold text-white mb-5 flex items-center gap-2">
          <Type className="w-5 h-5 text-orange-500" /> Brend & Nom Sozlamalari
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Restoran / Brend nomi" k="restaurant_name" placeholder="F.Lavash" />
          <div>
            <label className="block text-[11px] font-bold text-[#666] uppercase tracking-wider mb-1.5">Restoran Manzili</label>
            <input
              type="text"
              value={address}
              onChange={e => setAddress(e.target.value)}
              placeholder="Manzilni kiriting..."
              className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 text-sm"
            />
          </div>
        </div>
      </div>

      {/* === BANNER / HOMEPAGE === */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 shadow-lg">
        <h3 className="text-[16px] font-bold text-white mb-5 flex items-center gap-2">
          <Megaphone className="w-5 h-5 text-blue-400" /> Asosiy Sahifa Banner
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <Field label="Banner sarlavhasi" k="banner_title" placeholder="Eng mazali lavash & fastfud" />
          <Field label="Banner tavsifi" k="banner_subtitle" placeholder="Tez, issiq va mazali yetkazib berish" />
        </div>
        <div className="mt-5">
          <Field label="E'lon / Ogohlantirish matni (ixtiyoriy)" k="announcement" placeholder="Masalan: Bugun -20% chegirma! yoki Restoran ta'mirda..." />
          <p className="text-[11px] text-[#666] mt-1">Bu matn asosiy sahifada sariq bannerda ko'rinadi. Bo'sh qoldirsangiz, ko'rinmaydi.</p>
        </div>
      </div>

      {/* === WORK HOURS & DELIVERY === */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 shadow-lg">
        <h3 className="text-[16px] font-bold text-white mb-5 flex items-center gap-2">
          <Clock className="w-5 h-5 text-green-400" /> Ish Vaqti & Yetkazib Berish
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          <Field label="Ish vaqti" k="working_hours" placeholder="09:00 - 23:00" />
          <Field label="Yetkazib berish narxi (so'm)" k="delivery_fee" type="number" placeholder="0" />
          <div>
            <label className="block text-[11px] font-bold text-[#666] uppercase tracking-wider mb-1.5">Restoran holati</label>
            <select
              value={settings.is_open ?? "true"}
              onChange={e => setSettings(prev => ({ ...prev, is_open: e.target.value }))}
              className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-orange-500/50 text-sm"
            >
              <option value="true">✅ Ochiq — Buyurtma qabul qilinadi</option>
              <option value="false">🔴 Yopiq — Buyurtma qabul qilinmaydi</option>
            </select>
          </div>
        </div>
      </div>

      {/* === UI COLOR === */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 shadow-lg">
        <h3 className="text-[16px] font-bold text-white mb-5 flex items-center gap-2">
          <Palette className="w-5 h-5 text-purple-400" /> Interfeys Rangi
        </h3>
        <div className="flex items-center gap-4">
          <input
            type="color"
            value={settings.accent_color ?? "#f97316"}
            onChange={e => setSettings(prev => ({ ...prev, accent_color: e.target.value }))}
            className="w-16 h-16 rounded-xl border-2 border-white/10 cursor-pointer bg-transparent"
          />
          <div>
            <p className="text-white font-bold text-[15px]">Asosiy rang: <span style={{ color: settings.accent_color }}>{settings.accent_color}</span></p>
            <p className="text-[#666] text-[12px] mt-1">Tugmalar, narxlar va aksent elementlarining rangi</p>
          </div>
        </div>
      </div>

      {/* === BLACKLIST === */}
      <div className="bg-[#111111] border border-red-500/20 rounded-2xl p-6 shadow-lg">
        <h3 className="text-[16px] font-bold text-red-400 mb-4 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" /> Qora Ro'yxat (Blacklist)
        </h3>
        <form onSubmit={handleAddBlacklist} className="flex flex-col sm:flex-row gap-3 mb-4">
          <input type="text" required placeholder="+998xxxxxxxx" value={blPhone} onChange={e => setBlPhone(e.target.value)} className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 text-sm sm:w-1/3" />
          <input type="text" placeholder="Sabab (ixtiyoriy)" value={blReason} onChange={e => setBlReason(e.target.value)} className="flex-1 bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 text-sm" />
          <button type="submit" className="bg-red-500/20 text-red-400 border border-red-500/30 font-bold rounded-xl px-6 py-3 hover:bg-red-500/30 transition-colors">Bloklash</button>
        </form>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {blacklist.map(b => (
            <div key={b.id} className="bg-[#1a1a1a] p-3 rounded-xl border border-red-500/10 flex items-center justify-between">
              <div>
                <span className="font-bold text-white text-sm">{b.phone}</span>
                {b.reason && <p className="text-[#a1a1aa] text-xs mt-0.5">{b.reason}</p>}
              </div>
              <button onClick={() => removeBlacklist(b.id)} className="text-red-500 hover:text-red-400 text-xs font-bold px-2 py-1 rounded-lg bg-red-500/10">O'chirish</button>
            </div>
          ))}
          {blacklist.length === 0 && <p className="text-[#666] text-sm">Qora ro'yxat bo'sh</p>}
        </div>
      </div>

    </div>
  );
}
