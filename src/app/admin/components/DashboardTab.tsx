"use client";

import { useEffect, useState } from "react";
import { Clock, ShoppingBag, CreditCard, Flame } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

// This is mockup data for the chart since real timeseries requires complex aggregation.
// In a production app, we would pass the last 7 days revenue from the backend.
const chartData = [
  { name: 'Du', jami: 400000 },
  { name: 'Se', jami: 300000 },
  { name: 'Ch', jami: 550000 },
  { name: 'Pa', jami: 278000 },
  { name: 'Ju', jami: 689000 },
  { name: 'Sh', jami: 839000 },
  { name: 'Ya', jami: 949000 },
];

export default function DashboardTab() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/analytics")
      .then(res => res.json())
      .then(d => setData(d))
      .catch(console.error);
  }, []);

  if (!data) return <div className="p-8 text-[#a1a1aa] animate-pulse">Ma'lumotlar yuklanmoqda...</div>;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded-2xl p-4 flex gap-4">
        <div className="text-[#f59e0b] shrink-0 mt-0.5"><Clock className="w-5 h-5" /></div>
        <div>
          <h4 className="text-[#f59e0b] font-bold text-sm mb-1 uppercase tracking-wider">Tizim holati</h4>
          <p className="text-[#a0a0a0] text-[13px] leading-relaxed">Barcha ko'rsatkichlar joyida. Yangi funksiyalar (recharts, statistika) ishga tushirildi.</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { title: "JAMI DAROMAD", value: `${data.revenue?.toLocaleString() || 0} so'm`, sub: "Umumiy", color: "#22c55e" },
          { title: "KUNLIK TUSHUM", value: `${data.todayRevenue?.toLocaleString() || 0} so'm`, sub: "Bugun", color: "#f59e0b" },
          { title: "FAOL MIJOZLAR", value: data.activeUsers || 0, sub: "Tizimda", color: "#3b82f6" },
          { title: "SOTUVLAR SONI", value: data.salesCount || 0, sub: "Bajarilgan", color: "#a855f7" },
        ].map((s, i) => (
          <div key={i} className="bg-[#111111] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
            <h3 className="text-[#666] text-[11px] font-bold tracking-widest uppercase mb-3">{s.title}</h3>
            <p className="text-[20px] md:text-[28px] font-extrabold text-white mb-2">{s.value}</p>
            <p className="text-[12px] font-bold" style={{ color: s.color }}>{s.sub}</p>
            <ShoppingBag className="w-24 h-24 absolute -right-4 -bottom-4 opacity-5 text-white pointer-events-none" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart */}
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
          <h3 className="text-[16px] font-bold text-white mb-6">Haftalik Daromad (Grafik)</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="name" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#18181b', border: '1px solid #333' }} />
                <Line type="monotone" dataKey="jami" stroke="#f59e0b" strokeWidth={3} dot={{ r: 4, fill: '#f59e0b' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Popular Items */}
        <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
          <h3 className="text-[16px] font-bold text-white mb-6 flex items-center gap-2">
            <Flame className="w-5 h-5 text-orange-500" /> Xit Taomlar (Top 5)
          </h3>
          <div className="space-y-4">
            {data.popularItems?.length > 0 ? data.popularItems.map((item: any, i: number) => (
              <div key={i} className="flex justify-between items-center bg-[#18181b] p-3 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-[#27272a] text-[#a1a1aa] flex items-center justify-center text-xs font-bold">{i + 1}</span>
                  <span className="font-bold text-sm text-white">{item.name}</span>
                </div>
                <div className="flex flex-col text-right">
                  <span className="text-orange-500 font-bold text-sm">{item.revenue.toLocaleString()} so'm</span>
                  <span className="text-[#666] text-xs font-bold">{item.count} marta olingan</span>
                </div>
              </div>
            )) : <p className="text-[#666] text-sm">Hali ma'lumot yetarli emas</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
