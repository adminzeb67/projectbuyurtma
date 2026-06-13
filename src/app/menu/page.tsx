"use client";

import { useState, useEffect } from "react";
import { Star, MapPin, X, ArrowRight, CheckCircle2, ChevronLeft, Navigation, CreditCard, Banknote, Search, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

function formatPrice(p: number) {
  return p.toLocaleString("uz-UZ") + " so'm";
}

export default function MenuPage() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const [activeCategory, setActiveCategory] = useState("Barchasi");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Wizard State
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [step, setStep] = useState<"NONE" | "DETAILS" | "DRINKS_PROMPT" | "DRINKS_SELECTION" | "PAYMENT" | "INFO" | "SUCCESS">("NONE");
  
  // Order Data State
  const [orderDrinks, setOrderDrinks] = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"CASH" | "CARD" | null>(null);
  const [phone, setPhone] = useState("+998");
  const [locationStr, setLocationStr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    fetch("/api/menu")
      .then(r => r.json())
      .then(data => {
        if (Array.isArray(data)) {
          setMenuItems(data);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const categories = ["Barchasi", ...Array.from(new Set(menuItems.map((m) => m.category).filter(c => c !== "Ichimliklar")))];
  const drinksList = menuItems.filter(m => m.category === "Ichimliklar");

  let filtered = menuItems;
  if (searchQuery.trim() !== "") {
    filtered = menuItems.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  } else {
    filtered = activeCategory === "Barchasi" 
      ? menuItems.filter(m => m.category !== "Ichimliklar") 
      : menuItems.filter((m) => m.category === activeCategory);
  }

  const openWizard = (item: any) => {
    setSelectedItem(item);
    setOrderDrinks([]);
    setPaymentMethod(null);
    setPhone("+998");
    setLocationStr("");
    setStep("DETAILS");
  };

  const closeWizard = () => {
    setStep("NONE");
    setSelectedItem(null);
  };

  const addDrink = (drink: any) => {
    setOrderDrinks(prev => [...prev, drink]);
    setStep("PAYMENT");
  };

  const getLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationStr(`${position.coords.latitude},${position.coords.longitude}`);
        },
        (error) => {
          alert("Lokatsiyani aniqlab bo'lmadi. GPS yoniqligini tekshiring.");
        }
      );
    } else {
      alert("Brauzeringiz geolokatsiyani qo'llab-quvvatlamaydi.");
    }
  };

  const submitOrder = async () => {
    if (phone.length < 9) {
      alert("Iltimos, telefon raqamingizni to'g'ri kiriting!");
      return;
    }
    if (!locationStr) {
      alert("Iltimos, manzilni jo'nating!");
      return;
    }

    setIsSubmitting(true);
    try {
      const itemsToOrder = [
        { id: selectedItem.id, name: selectedItem.name, price: selectedItem.price, quantity: 1 }
      ];
      orderDrinks.forEach(d => {
        itemsToOrder.push({ id: d.id, name: d.name, price: d.price, quantity: 1 });
      });

      const totalAmount = itemsToOrder.reduce((acc, i) => acc + (i.price * i.quantity), 0);

      const res = await fetch("/api/orders/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Mijoz (Saytdan)",
          phone: phone,
          items: itemsToOrder,
          totalAmount: totalAmount,
          paymentMethod: paymentMethod,
          location: locationStr
        })
      });

      if (res.ok) {
        setStep("SUCCESS");
      } else {
        alert("Xatolik yuz berdi!");
      }
    } catch (err) {
      alert("Internet aloqasini tekshiring!");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen pb-24" style={{ background: "#11131e" }}>
      {/* Header & Search */}
      <div className="p-4 pt-8 sticky top-0 z-30 bg-[#11131e]/95 backdrop-blur-xl border-b border-white/5">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">OshFast Menyu</h1>
          </div>
          <div className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-bold bg-[#23263a]/80 text-[#f5a623] border border-white/5">
            <Star className="w-3.5 h-3.5 fill-current" /> 4.9
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#8e93a6]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-4 py-3.5 bg-[#23263a]/60 border border-white/5 rounded-2xl text-white placeholder-[#5c6175] focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 transition-all text-[15px]"
            placeholder="Taom yoki ichimlik qidiring..."
          />
        </div>
      </div>

      {/* Categories (only show if not searching) */}
      {searchQuery.trim() === "" && menuItems.length > 0 && (
        <div className="px-4 pt-4 pb-2 flex gap-3 overflow-x-auto scrollbar-hide z-20">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-5 py-2.5 rounded-full text-[14px] font-medium transition-all duration-300 border ${
                activeCategory === cat 
                  ? 'bg-gradient-to-r from-purple-500 to-indigo-500 text-white border-transparent shadow-[0_0_15px_rgba(139,92,246,0.3)]' 
                  : 'bg-[#23263a]/60 text-[#8e93a6] border-white/5 hover:bg-[#23263a]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Grid Menu Items */}
      <div className="px-4 pb-4 mt-4 grid grid-cols-2 min-[400px]:grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-3 lg:gap-4">
        {loading ? (
          <div className="col-span-full py-20 flex flex-col items-center justify-center text-[#8e93a6]">
            <RefreshCw className="w-8 h-8 mb-4 animate-spin text-indigo-400" />
            <p>Menyu yuklanmoqda...</p>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((item) => (
            <div
              key={item.id}
              onClick={() => openWizard(item)}
              className="flex flex-col items-center justify-center p-4 rounded-[20px] bg-[#23263a]/40 border border-white/5 backdrop-blur-sm cursor-pointer hover:bg-[#23263a]/80 transition-all hover:scale-105"
            >
              <div className="w-[60px] h-[60px] lg:w-[80px] lg:h-[80px] rounded-full flex items-center justify-center text-3xl lg:text-4xl bg-gradient-to-br from-[#2a2d45] to-[#1a1d2e] border border-white/5 shadow-inner mb-3">
                {item.emoji}
              </div>
              <h3 className="font-bold text-[13px] lg:text-[15px] text-white text-center leading-tight line-clamp-2 w-full">{item.name}</h3>
              <p className="text-[12px] lg:text-[14px] font-extrabold mt-1.5 text-indigo-400">
                {formatPrice(item.price)}
              </p>
            </div>
          ))
        ) : (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-[#8e93a6]">
            <Search className="w-12 h-12 mb-4 opacity-20" />
            <p>Hozircha taomlar mavjud emas.</p>
            <p className="text-[12px] mt-2">Admin paneldan taom qo'shing.</p>
          </div>
        )}
      </div>

      {/* Interactive Order Wizard Modal */}
      {step !== "NONE" && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-0 sm:p-4 transition-all">
          <div className="bg-[#1c1e2d] w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 flex items-center justify-between border-b border-white/5 bg-[#23263a]/40">
              {step !== "DETAILS" && step !== "SUCCESS" ? (
                <button onClick={() => setStep("DETAILS")} className="p-2 -ml-2 text-[#8e93a6] hover:text-white rounded-full">
                  <ChevronLeft className="w-6 h-6" />
                </button>
              ) : (
                <div className="w-10"></div>
              )}
              <h2 className="text-[16px] font-bold text-white text-center flex-1">
                {step === "DETAILS" && "Taom tarkibi"}
                {step === "DRINKS_PROMPT" && "Qo'shimcha"}
                {step === "DRINKS_SELECTION" && "Ichimliklar"}
                {step === "PAYMENT" && "To'lov turi"}
                {step === "INFO" && "Manzil va Telefon"}
                {step === "SUCCESS" && "Muvaffaqiyatli"}
              </h2>
              <button onClick={closeWizard} className="p-2 -mr-2 bg-[#2a2d45] text-[#8e93a6] hover:text-white rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 pb-12 overflow-y-auto">
              
              {/* STEP 1: Details */}
              {step === "DETAILS" && selectedItem && (
                <div className="flex flex-col items-center text-center animate-in slide-in-from-right-4 duration-300">
                  <div className="text-6xl mb-4 p-4 bg-[#23263a]/60 rounded-[32px] shadow-inner">{selectedItem.emoji}</div>
                  <h3 className="text-2xl font-extrabold text-white mb-2">{selectedItem.name}</h3>
                  <p className="text-[#8e93a6] text-[15px] leading-relaxed mb-6 px-2">{selectedItem.desc}</p>
                  <div className="text-xl font-black text-indigo-400 mb-8 bg-indigo-500/10 px-6 py-2 rounded-full border border-indigo-500/20">
                    {formatPrice(selectedItem.price)}
                  </div>
                  <button 
                    onClick={() => setStep("DRINKS_PROMPT")}
                    className="w-full py-4 rounded-[20px] font-bold text-[16px] text-white bg-gradient-to-r from-purple-500 to-indigo-500 shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:scale-[1.02] transition-transform flex items-center justify-center gap-2"
                  >
                    Buyurtma berish <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* STEP 2: Drinks Prompt */}
              {step === "DRINKS_PROMPT" && (
                <div className="flex flex-col items-center text-center animate-in slide-in-from-right-4 duration-300 py-6">
                  <div className="w-20 h-20 bg-indigo-500/20 rounded-full flex items-center justify-center text-4xl mb-6">🥤</div>
                  <h3 className="text-[20px] font-bold text-white mb-8">Yana nimadir yoki ichimlik olasizmi?</h3>
                  <div className="flex gap-4 w-full">
                    <button 
                      onClick={() => setStep("PAYMENT")}
                      className="flex-1 py-4 rounded-[20px] font-bold text-[16px] text-[#8e93a6] bg-[#23263a] hover:bg-[#2a2d45] transition-colors"
                    >
                      Yo'q, yetarli
                    </button>
                    <button 
                      onClick={() => setStep("DRINKS_SELECTION")}
                      className="flex-1 py-4 rounded-[20px] font-bold text-[16px] text-white bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:bg-indigo-600 transition-colors"
                    >
                      Ha, olaman
                    </button>
                  </div>
                </div>
              )}

              {/* STEP 2.5: Drinks Selection */}
              {step === "DRINKS_SELECTION" && (
                <div className="flex flex-col gap-3 animate-in slide-in-from-right-4 duration-300">
                  {drinksList.length > 0 ? drinksList.map(drink => (
                    <div 
                      key={drink.id}
                      onClick={() => addDrink(drink)}
                      className="flex items-center justify-between p-4 bg-[#23263a]/60 rounded-[20px] cursor-pointer hover:bg-[#2a2d45] transition-colors border border-transparent hover:border-indigo-500/30"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-3xl">{drink.emoji}</div>
                        <div>
                          <h4 className="font-bold text-white text-[15px]">{drink.name}</h4>
                          <p className="text-indigo-400 font-bold text-[13px]">{formatPrice(drink.price)}</p>
                        </div>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-6 text-[#8e93a6]">Ichimliklar topilmadi.</div>
                  )}
                  <button 
                    onClick={() => setStep("PAYMENT")}
                    className="mt-4 w-full py-4 rounded-[20px] font-bold text-[#8e93a6] bg-transparent border border-white/10 hover:bg-white/5 transition-colors"
                  >
                    O'tkazib yuborish
                  </button>
                </div>
              )}

              {/* STEP 3: Payment Method */}
              {step === "PAYMENT" && (
                <div className="flex flex-col items-center text-center animate-in slide-in-from-right-4 duration-300 py-4">
                  <h3 className="text-[20px] font-bold text-white mb-6">To'lov turini tanlang</h3>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div 
                      onClick={() => {
                        setPaymentMethod("CASH");
                        setStep("INFO");
                      }}
                      className="flex flex-col items-center justify-center gap-3 p-6 bg-[#23263a]/60 rounded-[24px] cursor-pointer border border-transparent hover:border-green-500/30 hover:bg-green-500/10 transition-all group"
                    >
                      <Banknote className="w-10 h-10 text-green-400 group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-white">Naqd pul</span>
                    </div>
                    <div 
                      onClick={() => {
                        alert("Karta orqali to'lov (Click/Payme) tizimga kiritilmoqda. Iltimos hozircha naqd pulni tanlang.");
                      }}
                      className="flex flex-col items-center justify-center gap-3 p-6 bg-[#23263a]/60 rounded-[24px] cursor-pointer border border-transparent hover:border-indigo-500/30 hover:bg-indigo-500/10 transition-all group"
                    >
                      <CreditCard className="w-10 h-10 text-indigo-400 group-hover:scale-110 transition-transform" />
                      <span className="font-bold text-white">Karta orqali</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Phone & Location */}
              {step === "INFO" && (
                <div className="flex flex-col gap-5 animate-in slide-in-from-right-4 duration-300">
                  <div>
                    <label className="block text-[#8e93a6] text-[13px] font-bold mb-2 ml-1">Telefon raqamingiz</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#23263a]/60 border border-white/10 rounded-[20px] px-5 py-4 text-white font-bold focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                      placeholder="+998 90 123 45 67"
                    />
                  </div>

                  <div>
                    <label className="block text-[#8e93a6] text-[13px] font-bold mb-2 ml-1">Manzilingiz</label>
                    <button 
                      onClick={getLocation}
                      className={`w-full py-4 rounded-[20px] font-bold text-[15px] flex items-center justify-center gap-2 border transition-all ${
                        locationStr 
                          ? "bg-green-500/20 text-green-400 border-green-500/30" 
                          : "bg-indigo-500/10 text-indigo-400 border-indigo-500/30 hover:bg-indigo-500/20"
                      }`}
                    >
                      {locationStr ? <CheckCircle2 className="w-5 h-5" /> : <Navigation className="w-5 h-5" />}
                      {locationStr ? "Lokatsiya olindi!" : "📍 Lokatsiyani yuborish (GPS)"}
                    </button>
                    {!locationStr && (
                      <p className="text-[11px] text-[#8e93a6] mt-2 text-center">
                        Kuryer aniq yetib borishi uchun lokatsiyani tasdiqlang.
                      </p>
                    )}
                  </div>

                  <button 
                    onClick={submitOrder}
                    disabled={isSubmitting || !locationStr}
                    className="mt-4 w-full py-4.5 rounded-[20px] font-extrabold text-[16px] text-white bg-gradient-to-r from-green-500 to-emerald-500 shadow-[0_0_20px_rgba(34,197,94,0.3)] disabled:opacity-50 disabled:shadow-none hover:scale-[1.02] transition-transform flex justify-center items-center h-[56px]"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                    ) : (
                      "Buyurtmani tasdiqlash"
                    )}
                  </button>
                </div>
              )}

              {/* STEP 5: Success */}
              {step === "SUCCESS" && (
                <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-300 py-6">
                  <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6">
                    <CheckCircle2 className="w-12 h-12 text-green-400" />
                  </div>
                  <h3 className="text-[24px] font-extrabold text-white mb-2">Qabul qilindi!</h3>
                  <p className="text-[#8e93a6] text-[15px] mb-8 px-4">
                    Buyurtmangiz tayyorlanmoqda. Kuryer tez orada siz ko'rsatgan manzilga yetib boradi.
                  </p>
                  <button 
                    onClick={() => {
                      closeWizard();
                      router.push("/orders");
                    }}
                    className="w-full py-4 rounded-[20px] font-bold text-[16px] text-[#11131e] bg-white hover:bg-gray-100 transition-colors"
                  >
                    Buyurtmalarimga o'tish
                  </button>
                </div>
              )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
