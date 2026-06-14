"use client";

import { useEffect, useState } from "react";
import { X, Check, PowerOff } from "lucide-react";

export default function MenuTab() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", price: "", desc: "", category: "Fast Food", emoji: "🍔" });

  const fetchMenu = async () => {
    try {
      const res = await fetch("/api/admin/menu");
      const data = await res.json();
      setMenuItems(Array.isArray(data) ? data : []);
    } catch {
      setMenuItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMenu();
  }, []);

  const addMenuItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    try {
      await fetch("/api/admin/menu", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...newItem, categoryName: newItem.category })
      });
      setNewItem({ name: "", price: "", desc: "", category: "Fast Food", emoji: "🍔" });
      await fetchMenu();
      alert("Qo'shildi!");
    } finally {
      setIsAdding(false);
    }
  };

  const deleteMenuItem = async (id: string) => {
    if (!confirm("Rostdan ham o'chirasizmi?")) return;
    try {
      await fetch(`/api/admin/menu?id=${id}`, { method: "DELETE" });
      await fetchMenu();
    } catch (e) {
      alert("Xatolik");
    }
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    try {
      await fetch("/api/admin/menu", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, isAvailable: !currentStatus })
      });
      await fetchMenu();
    } catch (e) {
      alert("Xatolik");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 shadow-lg">
        <h3 className="text-[18px] font-bold text-white mb-4">Yangi Taom Qo'shish</h3>
        <form onSubmit={addMenuItem} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <input type="text" required placeholder="Nomi (Masalan: Lavash)" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f59e0b]/50 text-sm" />
          <input type="number" required placeholder="Narxi (So'm)" value={newItem.price} onChange={e => setNewItem({...newItem, price: e.target.value})} className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f59e0b]/50 text-sm" />
          <input type="text" required placeholder="Kategoriya" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f59e0b]/50 text-sm" />
          <input type="text" placeholder="Tarkibi..." value={newItem.desc} onChange={e => setNewItem({...newItem, desc: e.target.value})} className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f59e0b]/50 text-sm" />
          <div className="flex gap-2">
            <input type="text" required placeholder="Emoji 🍔" value={newItem.emoji} onChange={e => setNewItem({...newItem, emoji: e.target.value})} className="w-16 text-center bg-[#1a1a1a] border border-white/5 rounded-xl px-2 py-3 text-white focus:outline-none focus:border-[#f59e0b]/50 text-xl" />
            <button type="submit" disabled={isAdding} className="flex-1 bg-[#f59e0b] text-black font-bold rounded-xl hover:bg-[#d97706] transition-colors disabled:opacity-50">
              Qo'shish
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {menuItems.map(item => (
          <div key={item.id} className={`bg-[#111111] border rounded-2xl p-5 relative group transition-all ${item.isAvailable !== false ? "border-white/5" : "border-red-500/30 opacity-70"}`}>
            <div className="absolute top-3 right-3 flex gap-2">
              <button onClick={() => toggleAvailability(item.id, item.isAvailable !== false)} title="Stop-listga qo'shish/olish" className={`p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all ${item.isAvailable !== false ? "bg-red-500/10 text-red-500 hover:bg-red-500/20" : "bg-green-500/10 text-green-500 hover:bg-green-500/20"}`}>
                <PowerOff className="w-4 h-4" />
              </button>
              <button onClick={() => deleteMenuItem(item.id)} className="text-[#666] hover:text-red-500 bg-[#1a1a1a] p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-4xl mb-3 bg-[#1a1a1a] w-16 h-16 rounded-xl flex items-center justify-center border border-white/5">{item.emoji}</div>
            <h4 className="font-bold text-white text-[16px] leading-tight mb-1">{item.name}</h4>
            <p className="text-[#f59e0b] font-bold text-sm mb-2">{Number(item.price).toLocaleString()} so'm</p>
            
            <div className="flex justify-between items-center mt-2">
              <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-[#222] text-[#888] uppercase tracking-wider">{item.category}</span>
              {item.isAvailable === false && (
                <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-red-500/10 text-red-500 border border-red-500/20">TUGAGAN</span>
              )}
            </div>
          </div>
        ))}
        {menuItems.length === 0 && !loading && <div className="col-span-full py-12 text-center text-[#666]">Hali taomlar qo'shilmagan</div>}
      </div>
    </div>
  );
}
