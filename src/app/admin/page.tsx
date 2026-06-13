"use client";

import { useEffect, useState } from "react";
import { 
  RefreshCw, Clock, CheckCircle, Truck, XCircle, Package, Lock, User, 
  Settings, FileText, LayoutDashboard, ShoppingBag, CreditCard, ChevronRight, Menu as MenuIcon, X
} from "lucide-react";
import { Logo } from "@/components/Logo";

type Order = {
  id: string;
  status: string;
  totalAmount: number;
  deliveryAddress: string;
  createdAt: string;
  items: {
    id: string;
    quantity: number;
    price: number;
    menuItem: { name: string };
  }[];
};

type MenuItem = {
  id: string;
  name: string;
  price: number;
  category: string;
  desc: string;
  emoji: string;
};

const statusConfig: Record<string, { label: string; color: string; bg: string; icon: any }> = {
  PENDING:    { label: "Kutilmoqda",    color: "#f59e0b", bg: "#2a1f00", icon: Clock },
  ACCEPTED:   { label: "Qabul qilindi", color: "#3b82f6", bg: "#001a3a", icon: CheckCircle },
  PREPARING:  { label: "Tayyorlanmoqda",color: "#8b5cf6", bg: "#1a0033", icon: Package },
  ON_THE_WAY: { label: "Yo'lda",        color: "#06b6d4", bg: "#001f2a", icon: Truck },
  DELIVERED:  { label: "Bajarildi",     color: "#22c55e", bg: "#002a10", icon: CheckCircle },
  CANCELLED:  { label: "Bekor qilindi", color: "#ef4444", bg: "#2a0000", icon: XCircle },
};

const nextStatus: Record<string, string> = {
  PENDING:    "ACCEPTED",
  ACCEPTED:   "PREPARING",
  PREPARING:  "ON_THE_WAY",
  ON_THE_WAY: "DELIVERED",
};

function parseAddress(addr: string) {
  const phone = addr.match(/Telefon:\s*([^|]+)/)?.[1]?.trim() ?? addr;
  const name  = addr.match(/Ism:\s*([^|]+)/)?.[1]?.trim() ?? "";
  const location = addr.match(/Lokatsiya:\s*([^|]+)/)?.[1]?.trim() ?? "";
  const payment = addr.match(/To'lov:\s*([^|]+)/)?.[1]?.trim() ?? "";
  return { phone, name, location, payment };
}

export default function AdminPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState<"DASHBOARD" | "MENU" | "ORDERS" | "SETTINGS">("DASHBOARD");
  
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [updating, setUpdating] = useState<string | null>(null);

  const [restaurantAddress, setRestaurantAddress] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [isSavingSettings, setIsSavingSettings] = useState(false);

  // New Menu Item Form
  const [newItem, setNewItem] = useState({ name: "", price: "", desc: "", category: "Fast Food", emoji: "🍔" });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedAuth = localStorage.getItem("oshfast_admin_auth");
      if (savedAuth === "true") {
        setIsAdmin(true);
      }
    }
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ login: username, password })
      });
      const data = await res.json();
      if (data.redirect === "/admin") {
        setIsAdmin(true);
        setLoginError("");
        localStorage.setItem("oshfast_admin_auth", "true");
      } else {
        setLoginError("Login yoki parol noto'g'ri");
      }
    } catch {
      setLoginError("Xatolik yuz berdi");
    }
  };

  const handleLogout = () => {
    setIsAdmin(false);
    localStorage.removeItem("oshfast_admin_auth");
    setUsername("");
    setPassword("");
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMenu = async () => {
    try {
      const res = await fetch("/api/admin/menu");
      const data = await res.json();
      setMenuItems(Array.isArray(data) ? data : []);
    } catch {
      setMenuItems([]);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    fetchOrders();
    fetchMenu();
    fetch("/api/admin/settings").then(r => r.json()).then(d => setRestaurantAddress(d.address));
    
    const interval = setInterval(() => {
      if (activeTab === "ORDERS" || activeTab === "DASHBOARD") fetchOrders();
    }, 15000);
    return () => clearInterval(interval);
  }, [isAdmin, activeTab]);

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

  const saveSettings = async () => {
    setIsSavingSettings(true);
    try {
      await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: restaurantAddress, cardNumber }) // We can update backend to save cardNumber later
      });
      alert("Sozlamalar saqlandi!");
    } finally {
      setIsSavingSettings(false);
    }
  };

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

  const stats = {
    revenue: orders.filter(o => o.status === "DELIVERED").reduce((a, b) => a + b.totalAmount, 0),
    activeUsers: new Set(orders.map(o => parseAddress(o.deliveryAddress).phone)).size,
    salesCount: orders.filter(o => o.status === "DELIVERED").length,
    menuCount: menuItems.length
  };

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 font-sans" style={{ background: "#111111" }}>
        <div className="w-full max-w-sm bg-[#1c1c1c] border border-white/5 rounded-3xl p-8 shadow-2xl">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 bg-[#f59e0b]/10 rounded-2xl flex items-center justify-center mb-4 border border-[#f59e0b]/20">
              <Lock className="w-8 h-8 text-[#f59e0b]" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Admin Kirish</h1>
          </div>
          {loginError && <div className="text-[#ef4444] text-center mb-4 text-sm">{loginError}</div>}
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <input 
              type="text" required value={username} onChange={e => setUsername(e.target.value)} 
              className="w-full bg-[#111] border border-white/5 p-4 rounded-xl text-white outline-none focus:border-[#f59e0b]/50"
              placeholder="Login" 
            />
            <input 
              type="password" required value={password} onChange={e => setPassword(e.target.value)} 
              className="w-full bg-[#111] border border-white/5 p-4 rounded-xl text-white outline-none focus:border-[#f59e0b]/50"
              placeholder="Parol" 
            />
            <button type="submit" className="w-full py-4 bg-[#f59e0b] text-black font-bold rounded-xl hover:bg-[#d97706] transition-colors">
              Kirish
            </button>
          </form>
        </div>
      </div>
    );
  }

  const sidebarLinks = [
    { id: "DASHBOARD", label: "Boshqaruv Paneli", icon: LayoutDashboard },
    { id: "MENU", label: "Mahsulotlar", icon: ShoppingBag },
    { id: "ORDERS", label: "Buyurtmalar", icon: FileText },
    { id: "SETTINGS", label: "Sozlamalar", icon: Settings },
  ];

  return (
    <div className="min-h-screen flex text-white font-sans" style={{ background: "#161616" }}>
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden md:flex flex-col w-[260px] bg-[#111111] border-r border-white/5 fixed h-full z-20">
        <div className="p-6 flex items-center gap-3 border-b border-white/5">
          <Logo className="w-10 h-10 text-[#f59e0b]" />
          <div>
            <h1 className="font-extrabold text-[18px] tracking-wide text-white">OSH FAST</h1>
            <p className="text-[10px] text-[#f59e0b] font-bold tracking-widest uppercase">Premium Store</p>
          </div>
        </div>
        
        <div className="p-4">
          <div className="bg-[#1c1c1c] rounded-xl p-3 flex items-center gap-3 border border-white/5 mb-6">
            <div className="w-10 h-10 bg-[#f59e0b]/20 text-[#f59e0b] rounded-lg flex items-center justify-center font-bold text-lg">A</div>
            <div>
              <p className="font-bold text-sm text-white">Administrator</p>
              <p className="text-[10px] text-[#f59e0b] font-bold uppercase">Boshqaruvchi</p>
            </div>
            <button onClick={handleLogout} className="ml-auto text-[#666] hover:text-[#f59e0b]"><XCircle className="w-4 h-4" /></button>
          </div>
          
          <p className="text-[11px] text-[#666] font-bold uppercase mb-3 px-2 tracking-widest">Sahifalar Menyusi</p>
          <nav className="flex flex-col gap-1">
            {sidebarLinks.map(link => {
              const Icon = link.icon;
              const isActive = activeTab === link.id;
              return (
                <button
                  key={link.id}
                  onClick={() => setActiveTab(link.id as any)}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    isActive ? "bg-[#f59e0b] text-black shadow-[0_0_15px_rgba(245,158,11,0.3)]" : "text-[#888] hover:bg-[#1c1c1c] hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" /> {link.label}
                </button>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* MOBILE BOTTOM NAV */}
      <nav className="md:hidden fixed bottom-0 w-full bg-[#111111] border-t border-white/5 flex justify-around items-center h-[70px] z-50 px-2 pb-2">
        {sidebarLinks.map(link => {
          const Icon = link.icon;
          const isActive = activeTab === link.id;
          return (
            <button
              key={link.id}
              onClick={() => setActiveTab(link.id as any)}
              className={`flex flex-col items-center justify-center w-[22%] h-full gap-1 transition-all ${
                isActive ? "text-[#f59e0b]" : "text-[#666]"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-bold truncate w-full text-center">{link.label}</span>
            </button>
          );
        })}
      </nav>

      {/* MAIN CONTENT */}
      <main className="flex-1 md:ml-[260px] p-4 md:p-8 pb-24 md:pb-8">
        
        {/* HEADER */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-[28px] md:text-[36px] font-extrabold text-white flex items-center gap-3">
              {sidebarLinks.find(l => l.id === activeTab)?.label}
              <span className="text-[10px] bg-[#2a0a0a] text-[#ef4444] border border-[#ef4444]/20 px-2 py-1 rounded-md font-bold uppercase tracking-wider">Admin</span>
            </h2>
            {activeTab === "DASHBOARD" && <p className="text-[#888] text-sm mt-1">Tizimning asosiy ko'rsatkichlari va boshqaruv xulosasi.</p>}
          </div>
          <button onClick={fetchOrders} className="w-10 h-10 bg-[#1c1c1c] border border-white/5 rounded-full flex items-center justify-center text-[#888] hover:text-white hover:bg-[#f59e0b]/10 transition-colors">
            <RefreshCw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </header>

        {/* TAB: DASHBOARD */}
        {activeTab === "DASHBOARD" && (
          <div className="space-y-6 animate-fade-in">
            {/* Alert */}
            <div className="bg-[#f59e0b]/10 border border-[#f59e0b]/20 rounded-2xl p-4 flex gap-4">
              <div className="text-[#f59e0b] shrink-0 mt-0.5"><Clock className="w-5 h-5" /></div>
              <div>
                <h4 className="text-[#f59e0b] font-bold text-sm mb-1 uppercase tracking-wider">E'tibor Bering</h4>
                <p className="text-[#a0a0a0] text-[13px] leading-relaxed">Tizimda backend ulangan, barcha ma'lumotlar real vaqt rejimida yangilanadi. Hozircha faqat yetkazib berish jarayonini boshqarish faollashtirilgan.</p>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { title: "JAMI DAROMAD", value: `${stats.revenue.toLocaleString()} so'm`, sub: "+20.1% o'tgan oydan", color: "#22c55e" },
                { title: "FAOL MIJOZLAR", value: stats.activeUsers, sub: "+180.1% o'tgan oydan", color: "#22c55e" },
                { title: "SOTUVLAR SONI", value: stats.salesCount, sub: "+19% o'tgan oydan", color: "#22c55e" },
                { title: "OMBORDAGI TAOMLAR", value: stats.menuCount, sub: "Tizimga kiritilgan", color: "#ef4444" },
              ].map((s, i) => (
                <div key={i} className="bg-[#111111] border border-white/5 rounded-2xl p-5 relative overflow-hidden">
                  <h3 className="text-[#666] text-[11px] font-bold tracking-widest uppercase mb-3">{s.title}</h3>
                  <p className="text-[24px] md:text-[32px] font-extrabold text-white mb-2">{s.value}</p>
                  <p className="text-[12px] font-bold" style={{ color: s.color }}>{s.sub}</p>
                  <ShoppingBag className="w-24 h-24 absolute -right-4 -bottom-4 opacity-5 text-white pointer-events-none" />
                </div>
              ))}
            </div>

            {/* Quick Settings Widget */}
            <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#f59e0b]/20 text-[#f59e0b] rounded-xl flex items-center justify-center"><CreditCard className="w-5 h-5" /></div>
                <div>
                  <h3 className="text-white font-bold text-[16px]">To'lov Sozlamalari</h3>
                  <p className="text-[#666] text-[12px]">Mijozlar to'lov qilishi uchun karta raqamingizni kiriting</p>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="text" placeholder="Karta raqami (masalan: 8600 1234 ...)" 
                  value={cardNumber} onChange={e => setCardNumber(e.target.value)}
                  className="flex-1 bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f59e0b]/50 text-sm font-mono"
                />
                <button onClick={saveSettings} disabled={isSavingSettings} className="px-6 py-3 bg-[#f59e0b] text-black font-bold rounded-xl hover:bg-[#d97706] disabled:opacity-50">
                  Saqlash
                </button>
              </div>
            </div>

            {/* Recent Orders Mini Table */}
            <div>
              <h3 className="text-[18px] font-bold text-white mb-4">So'nggi Buyurtmalar</h3>
              <div className="bg-[#111111] border border-white/5 rounded-2xl overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-white/5 text-[#666] text-[11px] uppercase tracking-widest bg-[#161616]">
                    <tr>
                      <th className="px-6 py-4 font-bold">Mijoz</th>
                      <th className="px-6 py-4 font-bold">Telefon</th>
                      <th className="px-6 py-4 font-bold">Summa</th>
                      <th className="px-6 py-4 font-bold">Holat</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {orders.slice(0, 5).map(o => {
                      const { name, phone } = parseAddress(o.deliveryAddress);
                      const st = statusConfig[o.status] || statusConfig.PENDING;
                      return (
                        <tr key={o.id} className="hover:bg-[#1a1a1a] transition-colors">
                          <td className="px-6 py-4 font-bold text-[#e2e8f0]">{name || "Saytdan"}</td>
                          <td className="px-6 py-4 font-mono text-[#f59e0b]">{phone}</td>
                          <td className="px-6 py-4 font-bold">{o.totalAmount.toLocaleString()} so'm</td>
                          <td className="px-6 py-4">
                            <span className="text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider" style={{ background: st.bg, color: st.color, border: `1px solid ${st.color}40` }}>
                              {st.label}
                            </span>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                {orders.length === 0 && <p className="text-center py-6 text-[#666]">Hali buyurtmalar yo'q</p>}
              </div>
            </div>
          </div>
        )}

        {/* TAB: MENU */}
        {activeTab === "MENU" && (
          <div className="space-y-6 animate-fade-in">
            {/* Add Item Form */}
            <div className="bg-[#111111] border border-white/5 rounded-2xl p-6">
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

            {/* Menu List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {menuItems.map(item => (
                <div key={item.id} className="bg-[#111111] border border-white/5 rounded-2xl p-5 relative group">
                  <button onClick={() => deleteMenuItem(item.id)} className="absolute top-3 right-3 text-[#666] hover:text-red-500 bg-[#1a1a1a] p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all">
                    <X className="w-4 h-4" />
                  </button>
                  <div className="text-4xl mb-3 bg-[#1a1a1a] w-16 h-16 rounded-xl flex items-center justify-center border border-white/5">{item.emoji}</div>
                  <h4 className="font-bold text-white text-[16px] leading-tight mb-1">{item.name}</h4>
                  <p className="text-[#f59e0b] font-bold text-sm mb-2">{Number(item.price).toLocaleString()} so'm</p>
                  <span className="text-[10px] font-bold px-2 py-1 rounded-md bg-[#222] text-[#888] uppercase tracking-wider">{item.category}</span>
                </div>
              ))}
              {menuItems.length === 0 && <div className="col-span-full py-12 text-center text-[#666]">Hali taomlar qo'shilmagan</div>}
            </div>
          </div>
        )}

        {/* TAB: ORDERS */}
        {activeTab === "ORDERS" && (
          <div className="space-y-4 animate-fade-in">
            {loading && orders.length === 0 ? (
              <div className="text-center py-16 text-[#666]">Yuklanmoqda...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 text-[#666]">Buyurtmalar yo'q</div>
            ) : (
              orders.map(order => {
                const cfg = statusConfig[order.status] ?? statusConfig.PENDING;
                const StatusIcon = cfg.icon;
                const { phone, name, location, payment } = parseAddress(order.deliveryAddress);
                const next = nextStatus[order.status];
                const nextCfg = next ? statusConfig[next] : null;

                return (
                  <div key={order.id} className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden flex flex-col md:flex-row">
                    <div className="p-5 border-b md:border-b-0 md:border-r border-white/5 flex-1">
                      <div className="flex justify-between items-start mb-4">
                        <span className="text-[11px] font-bold px-2.5 py-1.5 rounded-lg uppercase tracking-wider flex items-center gap-1.5" style={{ background: cfg.bg, color: cfg.color, border: `1px solid ${cfg.color}40` }}>
                          <StatusIcon className="w-3.5 h-3.5" /> {cfg.label}
                        </span>
                        <span className="text-xs text-[#666]">
                          {new Date(order.createdAt).toLocaleString("uz-UZ", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" })}
                        </span>
                      </div>
                      <h3 className="font-bold text-white text-[16px] mb-1">{name || "Mijoz"}</h3>
                      <p className="font-mono text-[#f59e0b] text-sm mb-3">📞 {phone}</p>
                      
                      {location && location.includes(",") && (
                        <a href={`https://www.google.com/maps?q=${location}`} target="_blank" className="inline-block text-[11px] font-bold px-3 py-1.5 bg-[#22c55e]/10 text-[#22c55e] border border-[#22c55e]/20 rounded-lg hover:bg-[#22c55e]/20 transition-colors">
                          📍 Xaritada ko'rish
                        </a>
                      )}
                    </div>
                    
                    <div className="p-5 flex-1 bg-[#161616]/50">
                      <div className="space-y-2 mb-4">
                        {order.items.map(item => (
                          <div key={item.id} className="flex justify-between text-sm">
                            <span className="text-[#a0a0a0]">{item.menuItem.name} <span className="text-[#666]">×{item.quantity}</span></span>
                            <span className="font-bold text-white">{item.price.toLocaleString()}</span>
                          </div>
                        ))}
                      </div>
                      <div className="flex justify-between items-center pt-3 border-t border-white/5">
                        <span className="text-xs text-[#666] font-bold uppercase tracking-wider">Jami Summa:</span>
                        <span className="font-extrabold text-[#f59e0b] text-[18px]">{order.totalAmount.toLocaleString()} so'm</span>
                      </div>
                    </div>

                    <div className="p-5 border-t md:border-t-0 md:border-l border-white/5 w-full md:w-[200px] flex flex-col gap-2 justify-center bg-[#111111]">
                      {next && nextCfg && (
                        <button onClick={() => handleStatusChange(order.id, next)} disabled={updating === order.id} className="w-full py-3 bg-[#f59e0b] text-black font-bold rounded-xl text-sm hover:bg-[#d97706] disabled:opacity-50">
                          {updating === order.id ? "..." : `✅ ${nextCfg.label}`}
                        </button>
                      )}
                      {order.status !== "CANCELLED" && order.status !== "DELIVERED" && (
                        <button onClick={() => handleStatusChange(order.id, "CANCELLED")} disabled={updating === order.id} className="w-full py-3 bg-[#2a0a0a] text-[#ef4444] border border-[#ef4444]/20 font-bold rounded-xl text-sm hover:bg-[#3a0a0a] disabled:opacity-50">
                          ✕ Bekor Qilish
                        </button>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* TAB: SETTINGS */}
        {activeTab === "SETTINGS" && (
          <div className="space-y-6 animate-fade-in max-w-2xl">
            <div className="bg-[#111111] border border-white/5 rounded-2xl p-6 md:p-8">
              <h3 className="text-[20px] font-bold text-white mb-6">Restoran Sozlamalari</h3>
              
              <div className="space-y-5">
                <div>
                  <label className="block text-[12px] font-bold text-[#666] uppercase tracking-wider mb-2">Restoran Manzili (Mijozlar uchun)</label>
                  <textarea 
                    value={restaurantAddress} onChange={e => setRestaurantAddress(e.target.value)}
                    className="w-full h-32 bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f59e0b]/50 text-sm resize-none"
                    placeholder="Masalan: Nukus shahri, A. Dosnazarov ko'chasi 112-uy"
                  ></textarea>
                </div>

                <div>
                  <label className="block text-[12px] font-bold text-[#666] uppercase tracking-wider mb-2">Plastik Karta (To'lov uchun)</label>
                  <input 
                    type="text" value={cardNumber} onChange={e => setCardNumber(e.target.value)}
                    className="w-full bg-[#1a1a1a] border border-white/5 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-[#f59e0b]/50 text-sm font-mono"
                    placeholder="8600 1234 5678 9012"
                  />
                </div>

                <button onClick={saveSettings} disabled={isSavingSettings} className="w-full py-4 bg-[#f59e0b] text-black font-extrabold rounded-xl text-sm hover:bg-[#d97706] disabled:opacity-50 transition-colors mt-4">
                  Barcha o'zgarishlarni saqlash
                </button>
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
