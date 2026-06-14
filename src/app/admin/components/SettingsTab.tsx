"use client";

import { useEffect, useState } from "react";
import { Clock, ShieldAlert, Users } from "lucide-react";

export default function SettingsTab() {
  const [address, setAddress] = useState("");
  const [settings, setSettings] = useState<Record<string, string>>({
    working_hours: "09:00 - 23:00",
    delivery_fee: "0",
  });
  const [blacklist, setBlacklist] = useState<any[]>([]);
  
  const [blPhone, setBlPhone] = useState("");
  const [blReason, setBlReason] = useState("");
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings");
      const data = await res.json();
      setAddress(data.address || "");
      
      const newSettings = { ...settings };
      data.settings?.forEach((s: any) => { newSettings[s.key] = s.value; });
      setSettings(newSettings);
      
      setBlacklist(data.blacklist || []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, settings })
      });
      alert("Sozlamalar saqlandi!");
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
    } catch {
      alert("Xatolik");
    }
  };

  if (loading) return <div className="animate-pulse p-8 text-[#a1a1aa]">Yuklanmoqda...</div>;

  return (
    <div className="space-y-6 animate-fade-in max-w-4xl">
      
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 shadow-lg">
        <h3 className="text-[18px] font-bold text-white mb-6 flex items-center gap-2">
          <Clock className="w-5 h-5 text-orange-500" /> Umumiy Sozlamalar
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[12px] font-bold text-[#666] uppercase tracking-wider mb-2">Restoran Manzili</label>
            <textarea 
              value={address} onChange={e => setAddress(e.target.value)}
              className="w-full h-24 bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f59e0b]/50 text-sm resize-none"
            />
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-[12px] font-bold text-[#666] uppercase tracking-wider mb-2">Ish vaqti</label>
              <input 
                type="text" value={settings.working_hours} onChange={e => setSettings({...settings, working_hours: e.target.value})}
                className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f59e0b]/50 text-sm"
              />
            </div>
            <div>
              <label className="block text-[12px] font-bold text-[#666] uppercase tracking-wider mb-2">Yetkazib berish boshlang'ich narxi (so'm)</label>
              <input 
                type="text" value={settings.delivery_fee} onChange={e => setSettings({...settings, delivery_fee: e.target.value})}
                className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f59e0b]/50 text-sm"
              />
            </div>
          </div>
        </div>
        <button onClick={handleSave} disabled={saving} className="mt-6 w-full py-3 bg-[#f59e0b] text-black font-bold rounded-xl hover:bg-[#d97706] disabled:opacity-50 transition-colors">
          Barcha o'zgarishlarni saqlash
        </button>
      </div>

      <div className="bg-[#111111] border border-red-500/20 rounded-2xl p-6 shadow-lg">
        <h3 className="text-[18px] font-bold text-red-500 mb-4 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5" /> Qora Ro'yxat (Blacklist)
        </h3>
        <form onSubmit={handleAddBlacklist} className="flex flex-col sm:flex-row gap-3 mb-6">
          <input type="text" required placeholder="Telefon raqam" value={blPhone} onChange={e => setBlPhone(e.target.value)} className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 text-sm sm:w-1/3" />
          <input type="text" required placeholder="Sabab (ixtiyoriy)" value={blReason} onChange={e => setBlReason(e.target.value)} className="flex-1 bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500/50 text-sm" />
          <button type="submit" className="bg-red-500/20 text-red-500 border border-red-500/30 font-bold rounded-xl px-6 py-3 hover:bg-red-500/30 transition-colors">
            Bloklash
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {blacklist.map(b => (
            <div key={b.id} className="bg-[#1a1a1a] p-3 rounded-xl border border-red-500/10 flex flex-col">
              <span className="font-bold text-white text-sm">{b.phone}</span>
              <span className="text-[#a1a1aa] text-xs">{b.reason}</span>
            </div>
          ))}
          {blacklist.length === 0 && <p className="text-[#666] text-sm">Qora ro'yxat bo'sh</p>}
        </div>
      </div>

    </div>
  );
}
