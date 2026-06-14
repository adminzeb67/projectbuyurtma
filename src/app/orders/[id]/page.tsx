"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { MapPin, Clock, CheckCircle, Package, Truck, ArrowLeft, Loader2 } from "lucide-react";

type OrderItem = {
  id: string;
  quantity: number;
  price: number;
  menuItem: { name: string; image: string | null };
};

type Order = {
  id: string;
  status: string;
  totalAmount: number;
  paymentMethod: string;
  estimatedTime: number | null;
  createdAt: string;
  latitude: number;
  longitude: number;
  items: OrderItem[];
};

const statusSteps = [
  { id: "PENDING", label: "Kutilmoqda", icon: Clock },
  { id: "ACCEPTED", label: "Qabul qilindi", icon: CheckCircle },
  { id: "PREPARING", label: "Tayyorlanmoqda", icon: Package },
  { id: "ON_THE_WAY", label: "Yo'lda", icon: Truck },
  { id: "DELIVERED", label: "Yetkazildi", icon: CheckCircle },
];

export default function OrderTrackingPage() {
  const { id } = useParams();
  const router = useRouter();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    try {
      const res = await fetch(`/api/orders/${id}`);
      if (!res.ok) throw new Error("Buyurtma topilmadi");
      const data = await res.json();
      setOrder(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
    // Refresh every 10 seconds
    const interval = setInterval(fetchOrder, 10000);
    return () => clearInterval(interval);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--bg-deep)] text-white">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[var(--bg-deep)] text-white px-4">
        <p className="text-red-500 mb-4">{error}</p>
        <button onClick={() => router.push("/")} className="bg-orange-500 px-6 py-2 rounded-xl font-bold">Bosh sahifaga qaytish</button>
      </div>
    );
  }

  const currentStepIndex = statusSteps.findIndex(s => s.id === order.status);
  
  // Calculate remaining time
  const createdDate = new Date(order.createdAt).getTime();
  const estimatedDate = new Date(createdDate + (order.estimatedTime || 30) * 60000).getTime();
  const now = new Date().getTime();
  const remainingMinutes = Math.max(0, Math.ceil((estimatedDate - now) / 60000));

  return (
    <div className="flex flex-col min-h-screen font-sans pb-24 bg-[var(--bg-deep)] text-white">
      {/* Header */}
      <div className="p-4 flex items-center gap-3 sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/5">
        <button onClick={() => router.push("/orders")} className="p-2 bg-[#18181b] rounded-full text-white">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-[18px] font-bold">Buyurtma holati</h1>
          <p className="text-xs text-[#a1a1aa]">ID: {order.id.slice(-6).toUpperCase()}</p>
        </div>
      </div>

      <div className="p-4 space-y-6">
        
        {/* Map / Tracking Sim */}
        <div className="bg-[#18181b] border border-white/5 rounded-[24px] overflow-hidden p-6 relative">
          <div className="absolute inset-0 bg-orange-500/5 blur-[50px] pointer-events-none" />
          <div className="relative z-10 text-center">
            {order.status === "DELIVERED" ? (
              <>
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h2 className="text-2xl font-black mb-1">Buyurtma yetkazildi</h2>
                <p className="text-[#a1a1aa] text-sm">Yoqimli ishtaha!</p>
              </>
            ) : order.status === "CANCELLED" ? (
              <>
                <h2 className="text-2xl font-black mb-1 text-red-500">Bekor qilindi</h2>
                <p className="text-[#a1a1aa] text-sm">Buyurtma bekor qilindi</p>
              </>
            ) : (
              <>
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-500/20 border-4 border-orange-500/50 mb-4 animate-pulse">
                  <span className="text-3xl font-black text-orange-500">{remainingMinutes}</span>
                </div>
                <h2 className="text-[20px] font-black mb-1">Daqiqa qoldi</h2>
                <p className="text-[#a1a1aa] text-sm font-medium">Taxminiy yetkazib berish vaqti</p>
                
                <div className="mt-6 flex items-center justify-center gap-2 text-xs font-bold text-orange-500 bg-orange-500/10 py-2 px-4 rounded-full w-max mx-auto">
                  <MapPin className="w-4 h-4" />
                  Kuryer yo'lda, manzilingiz tomon kelmoqda
                </div>
              </>
            )}
          </div>
        </div>

        {/* Stepper */}
        <div className="bg-[#18181b] border border-white/5 rounded-[24px] p-6">
          <h3 className="font-bold text-[16px] mb-5">Buyurtma holati</h3>
          <div className="relative border-l-2 border-[#27272a] ml-4 space-y-8">
            {statusSteps.map((step, idx) => {
              const isActive = idx <= currentStepIndex;
              const isCurrent = idx === currentStepIndex;
              const Icon = step.icon;
              return (
                <div key={step.id} className="relative pl-6">
                  <div className={`absolute -left-[11px] top-0.5 w-5 h-5 rounded-full border-4 border-[#18181b] flex items-center justify-center ${isActive ? "bg-orange-500" : "bg-[#27272a]"}`}>
                    {isActive && <CheckCircle className="w-2.5 h-2.5 text-[#18181b]" />}
                  </div>
                  <h4 className={`text-[15px] font-bold ${isActive ? "text-white" : "text-[#52525b]"}`}>{step.label}</h4>
                  {isCurrent && <p className="text-xs font-medium text-orange-500 mt-1 animate-pulse">Ayni vaqtda shu jarayonda</p>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Order Details */}
        <div className="bg-[#18181b] border border-white/5 rounded-[24px] p-6 space-y-4">
          <h3 className="font-bold text-[16px]">Buyurtma ma'lumotlari</h3>
          
          <div className="space-y-3">
            {order.items.map(item => (
              <div key={item.id} className="flex justify-between text-sm">
                <span className="text-[#a1a1aa] font-medium">{item.quantity}x {item.menuItem.name}</span>
                <span className="font-bold">{(item.price * item.quantity).toLocaleString()} so'm</span>
              </div>
            ))}
          </div>
          
          <div className="border-t border-white/5 pt-4 flex justify-between items-center text-[15px]">
            <span className="text-[#a1a1aa] font-medium">To'lov turi</span>
            <span className="font-bold">{order.paymentMethod}</span>
          </div>

          <div className="flex justify-between items-center text-[16px]">
            <span className="font-bold">Jami summa</span>
            <span className="font-black text-orange-500">{order.totalAmount.toLocaleString()} so'm</span>
          </div>
        </div>

      </div>
    </div>
  );
}
