"use client";

import { useEffect, useState } from "react";
import { Download, Tag, PlusCircle } from "lucide-react";
import * as XLSX from "xlsx";

export default function FinanceTab() {
  const [data, setData] = useState<{ orders: any[], promoCodes: any[] }>({ orders: [], promoCodes: [] });
  const [loading, setLoading] = useState(true);
  
  const [promoForm, setPromoForm] = useState({ code: "", discount: "", type: "PERCENT" });
  const [isAddingPromo, setIsAddingPromo] = useState(false);

  const fetchFinance = async () => {
    try {
      const res = await fetch("/api/admin/finance");
      const json = await res.json();
      setData(json);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinance();
  }, []);

  const addPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAddingPromo(true);
    try {
      await fetch("/api/admin/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(promoForm)
      });
      setPromoForm({ code: "", discount: "", type: "PERCENT" });
      await fetchFinance();
    } finally {
      setIsAddingPromo(false);
    }
  };

  const exportToExcel = () => {
    if (!data.orders || data.orders.length === 0) return alert("Eksport qilish uchun ma'lumot yo'q");

    const worksheetData = data.orders.map(o => ({
      "ID": o.id,
      "Sana": new Date(o.createdAt).toLocaleString("uz-UZ"),
      "Mijoz / Manzil": o.deliveryAddress,
      "Summa": o.totalAmount,
      "To'lov Turi": o.paymentMethod,
      "Holat": o.status,
      "Kuryer": o.courier?.name || "Biriktirilmagan"
    }));

    const worksheet = XLSX.utils.json_to_sheet(worksheetData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Buyurtmalar");
    XLSX.writeFile(workbook, "Moliya_Hisoboti.xlsx");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Excel Export */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h3 className="text-[18px] font-bold text-white mb-1">Moliyaviy Hisobot (Excel)</h3>
          <p className="text-[#a1a1aa] text-sm">Barcha buyurtmalar va tushumlarni yuklab oling</p>
        </div>
        <button 
          onClick={exportToExcel} 
          disabled={loading}
          className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-50"
        >
          <Download className="w-5 h-5" /> Yuklab Olish (.xlsx)
        </button>
      </div>

      {/* Promo Codes */}
      <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 shadow-lg">
        <h3 className="text-[18px] font-bold text-white mb-4 flex items-center gap-2">
          <Tag className="w-5 h-5 text-orange-500" /> Promo-kodlar (Chegirmalar)
        </h3>
        
        <form onSubmit={addPromo} className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
          <input type="text" required placeholder="Kod (masalan: SUPER10)" value={promoForm.code} onChange={e => setPromoForm({...promoForm, code: e.target.value})} className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f59e0b]/50 text-sm uppercase" />
          <input type="number" required placeholder="Chegirma miqdori" value={promoForm.discount} onChange={e => setPromoForm({...promoForm, discount: e.target.value})} className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f59e0b]/50 text-sm" />
          <select value={promoForm.type} onChange={e => setPromoForm({...promoForm, type: e.target.value})} className="bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f59e0b]/50 text-sm">
            <option value="PERCENT">Foiz (%)</option>
            <option value="FIXED">Summa (so'm)</option>
          </select>
          <button type="submit" disabled={isAddingPromo} className="flex items-center justify-center gap-2 bg-[#f59e0b] text-black font-bold rounded-xl py-3 hover:bg-[#d97706] transition-colors disabled:opacity-50">
            <PlusCircle className="w-5 h-5" /> Yaratish
          </button>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.promoCodes?.map(promo => (
            <div key={promo.id} className="bg-[#1a1a1a] border border-white/5 rounded-xl p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-white tracking-widest">{promo.code}</h4>
                <p className="text-[#f59e0b] text-sm font-bold">
                  -{promo.discount}{promo.type === "PERCENT" ? "%" : " so'm"}
                </p>
              </div>
              <span className={`text-[10px] font-bold px-2 py-1 rounded-md uppercase ${promo.isActive ? 'bg-green-500/10 text-green-500 border border-green-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                {promo.isActive ? 'Faol' : 'Nofaol'}
              </span>
            </div>
          ))}
          {data.promoCodes?.length === 0 && <p className="col-span-full text-[#666] text-sm">Promo-kodlar mavjud emas</p>}
        </div>
      </div>
    </div>
  );
}
