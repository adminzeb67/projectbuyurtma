"use client";

import { useEffect, useState } from "react";
import { UserPlus, Wallet, Package } from "lucide-react";

export default function CouriersTab() {
  const [couriers, setCouriers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: "", phone: "", password: "" });
  const [isAdding, setIsAdding] = useState(false);

  const fetchCouriers = async () => {
    try {
      const res = await fetch("/api/admin/couriers");
      const data = await res.json();
      if (Array.isArray(data)) setCouriers(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCouriers();
  }, []);

  const addCourier = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      const res = await fetch("/api/admin/couriers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        setForm({ name: "", phone: "", password: "" });
        await fetchCouriers();
        alert("Kuryer qo'shildi!");
      } else {
        alert("Xatolik yuz berdi");
      }
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 shadow-lg">
        <h3 className="text-[18px] font-bold text-white mb-4 flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-orange-500" /> Yangi Kuryer Qo'shish
        </h3>
        <form onSubmit={addCourier} className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <input type="text" required placeholder="Ismi" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f59e0b]/50 text-sm" />
          <input type="text" required placeholder="Telefon (+998...)" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f59e0b]/50 text-sm" />
          <input type="text" required placeholder="Parol" value={form.password} onChange={e => setForm({...form, password: e.target.value})} className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f59e0b]/50 text-sm" />
          <button type="submit" disabled={isAdding} className="bg-[#f59e0b] text-black font-bold rounded-xl py-3 hover:bg-[#d97706] transition-colors disabled:opacity-50">
            Qo'shish
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full text-center py-12 text-[#666]">Yuklanmoqda...</div>
        ) : couriers.length === 0 ? (
          <div className="col-span-full text-center py-12 text-[#666]">Kuryerlar yo'q</div>
        ) : (
          couriers.map(c => (
            <div key={c.id} className="bg-[#111111] border border-white/5 rounded-2xl p-5 relative">
              <h4 className="font-bold text-white text-[18px] mb-1">{c.name}</h4>
              <p className="text-[#a1a1aa] font-mono text-sm mb-4">{c.phone}</p>
              
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-[#1a1a1a] rounded-xl p-3 border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="w-4 h-4 text-blue-400" />
                    <span className="text-[10px] text-[#666] font-bold uppercase">Yetkazildi</span>
                  </div>
                  <span className="text-white font-bold text-lg">{c.deliveredCount} ta</span>
                </div>
                
                <div className="bg-[#1a1a1a] rounded-xl p-3 border border-white/5">
                  <div className="flex items-center gap-2 mb-1">
                    <Wallet className="w-4 h-4 text-green-400" />
                    <span className="text-[10px] text-[#666] font-bold uppercase">Balans</span>
                  </div>
                  <span className="text-green-400 font-bold text-lg">{(c.balance / 1000).toFixed(0)}k</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
