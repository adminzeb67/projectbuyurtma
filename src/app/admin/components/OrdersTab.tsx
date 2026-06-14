"use client";

import { useEffect, useState, useRef } from "react";
import { Clock, CheckCircle, Truck, XCircle, Package } from "lucide-react";

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  PENDING:    { label: "Kutilmoqda",    color: "#f59e0b", bg: "#2a1f00", icon: Clock },
  ACCEPTED:   { label: "Qabul",         color: "#3b82f6", bg: "#001a3a", icon: CheckCircle },
  PREPARING:  { label: "Tayyorlanmoqda",color: "#8b5cf6", bg: "#1a0033", icon: Package },
  ON_THE_WAY: { label: "Yo'lda",        color: "#06b6d4", bg: "#001f2a", icon: Truck },
  DELIVERED:  { label: "Bajarildi",     color: "#22c55e", bg: "#002a10", icon: CheckCircle },
  CANCELLED:  { label: "Bekor qilingan",color: "#ef4444", bg: "#2a0000", icon: XCircle },
};

const nextStatus: Record<string, string> = {
  PENDING:    "ACCEPTED",
  ACCEPTED:   "PREPARING",
  PREPARING:  "ON_THE_WAY",
  ON_THE_WAY: "DELIVERED",
};

export default function OrdersTab() {
  const [orders, setOrders] = useState<any[]>([]);
  const [couriers, setCouriers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);
  const previousOrdersCount = useRef(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (Array.isArray(data)) {
        setOrders(data);
        // Play sound if new order arrived
        const pendingCount = data.filter(o => o.status === "PENDING").length;
        if (pendingCount > previousOrdersCount.current && audioRef.current) {
          audioRef.current.play().catch(e => console.log("Audio play prevented:", e));
        }
        previousOrdersCount.current = pendingCount;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCouriers = async () => {
    try {
      const res = await fetch("/api/admin/couriers");
      const data = await res.json();
      if (Array.isArray(data)) setCouriers(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    audioRef.current = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
    fetchOrders();
    fetchCouriers();
    const interval = setInterval(fetchOrders, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleStatusChange = async (orderId: string, status: string) => {
    setUpdating(orderId);
    try {
      await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, status }),
      });
      await fetchOrders();
    } finally {
      setUpdating(null);
    }
  };

  const assignCourier = async (orderId: string, courierId: string) => {
    setUpdating(orderId);
    try {
      await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, courierId }),
      });
      await fetchOrders();
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div className="space-y-4 animate-fade-in">
      {loading ? (
        <div className="text-center py-16 text-[#666] animate-pulse">Yuklanmoqda...</div>
      ) : orders.length === 0 ? (
        <div className="text-center py-16 text-[#666]">Buyurtmalar yo'q</div>
      ) : (
        orders.map(order => {
          const cfg = statusConfig[order.status] ?? statusConfig.PENDING;
          const StatusIcon = cfg.icon;
          const next = nextStatus[order.status];
          const nextCfg = next ? statusConfig[next] : null;

          // Parse address string for display
          const phone = order.deliveryAddress.match(/Telefon:\s*([^|]+)/)?.[1]?.trim() ?? "Noma'lum";
          const name = order.deliveryAddress.match(/Ism:\s*([^|]+)/)?.[1]?.trim() ?? "Mijoz";
          const location = order.deliveryAddress.match(/Lokatsiya:\s*([^|]+)/)?.[1]?.trim() ?? "";

          return (
            <div key={order.id} className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden flex flex-col md:flex-row shadow-lg">
              <div className="p-5 border-b md:border-b-0 md:border-r border-white/5 flex-1 relative">
                <div className="flex justify-between items-start mb-4">
                  <span className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-1.5" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}40` }}>
                    <StatusIcon className="w-3.5 h-3.5" /> {cfg.label}
                  </span>
                  <span className="text-xs text-[#666]">
                    {new Date(order.createdAt).toLocaleTimeString("uz-UZ", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
                <h3 className="font-bold text-white text-[16px] mb-1">{name}</h3>
                <p className="font-mono text-[#f59e0b] text-sm mb-3">📞 {phone}</p>
                {location && location.includes(",") && (
                  <a href={`https://www.google.com/maps?q=${location}`} target="_blank" className="inline-block text-[11px] font-bold px-3 py-1.5 bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 rounded-lg hover:bg-[#22c55e]/20 transition-colors">
                    📍 Xaritada ko'rish
                  </a>
                )}
              </div>
              
              <div className="p-5 flex-1 bg-[#161616]/50 border-b md:border-b-0 md:border-r border-white/5">
                <div className="space-y-2 mb-4">
                  {order.items.map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-[#a0a0a0]">{item.menuItem.name} <span className="text-[#666]">×{item.quantity}</span></span>
                      <span className="font-bold text-white">{item.price.toLocaleString()}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between items-center pt-3 border-t border-white/5 mb-3">
                  <span className="text-xs text-[#666] font-bold uppercase tracking-wider">To'lov:</span>
                  <span className="font-bold text-white">{order.paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-[#666] font-bold uppercase tracking-wider">Jami:</span>
                  <span className="font-extrabold text-[#f59e0b] text-[18px]">{order.totalAmount.toLocaleString()} so'm</span>
                </div>
              </div>

              <div className="p-5 w-full md:w-[220px] flex flex-col gap-3 justify-center bg-[#111111]">
                {/* Courier Selection */}
                {order.status === "PREPARING" || order.status === "ON_THE_WAY" ? (
                  <div className="mb-2">
                    <label className="block text-[10px] text-[#666] font-bold uppercase mb-1">Kuryer biriktirish</label>
                    <select 
                      value={order.courierId || ""} 
                      onChange={(e) => assignCourier(order.id, e.target.value)}
                      disabled={updating === order.id}
                      className="w-full bg-[#1a1a1a] border border-white/10 rounded-lg px-2 py-2 text-xs text-white outline-none focus:border-[#f59e0b]"
                    >
                      <option value="">Kuryer tanlang...</option>
                      {couriers.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                ) : null}

                {next && nextCfg && (
                  <button onClick={() => handleStatusChange(order.id, next)} disabled={updating === order.id} className="w-full py-3 bg-[#f59e0b] text-black font-bold rounded-xl text-sm hover:bg-[#d97706] disabled:opacity-50">
                    {updating === order.id ? "..." : `✅ ${nextCfg.label}`}
                  </button>
                )}
                {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                  <button onClick={() => handleStatusChange(order.id, "CANCELLED")} disabled={updating === order.id} className="w-full py-2 bg-[#2a0a0a] text-[#ef4444] border border-[#ef4444]/20 font-bold rounded-xl text-xs hover:bg-[#3a0a0a] disabled:opacity-50">
                    ✕ Bekor Qilish
                  </button>
                )}
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
