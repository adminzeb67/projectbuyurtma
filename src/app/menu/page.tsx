"use client";

import { useState, useEffect } from "react";
import { Star, X, ArrowRight, CheckCircle2, ChevronLeft, Navigation, CreditCard, Banknote, Search, RefreshCw, Flame, Coffee, Pizza, Sandwich } from "lucide-react";
import { useRouter } from "next/navigation";
import { SuccessAnimation } from "@/components/SuccessAnimation";
import { Logo } from "@/components/Logo";

function formatPrice(p: number) {
  return p.toLocaleString("uz-UZ") + " so'm";
}

export default function MenuPage() {
  const router = useRouter();
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  
  // Wizard State
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [step, setStep] = useState<"NONE" | "DETAILS" | "DRINKS_PROMPT" | "DRINKS_SELECTION" | "PAYMENT" | "INFO" | "SUCCESS">("NONE");
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  
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

  const drinksList = menuItems.filter(m => m.category === "Ichimliklar");

  // Group items
  const fastfoods = menuItems.filter(m => m.category.toLowerCase().includes("fastfud") || m.category.toLowerCase().includes("lavash") || m.category.toLowerCase().includes("burger"));
  const foods = menuItems.filter(m => m.category !== "Ichimliklar" && !fastfoods.includes(m));
  const drinks = drinksList;

  const getFiltered = (items: any[]) => {
    if (searchQuery.trim() === "") return items;
    return items.filter(m => 
      m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
      m.desc.toLowerCase().includes(searchQuery.toLowerCase()) ||
      m.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  };

  const filteredFastfoods = getFiltered(fastfoods);
  const filteredFoods = getFiltered(foods);
  const filteredDrinks = getFiltered(drinks);

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
        setStep("NONE");
        setShowOrderSuccess(true);
      } else {
        alert("Xatolik yuz berdi!");
      }
    } catch (err) {
      alert("Internet aloqasini tekshiring!");
    } finally {
      setIsSubmitting(false);
    }
  };

  const ItemCard = ({ item }: { item: any }) => (
    <div
      onClick={() => openWizard(item)}
      className="flex flex-col p-3 rounded-[24px] bg-[#18181b] border border-white/5 shadow-lg cursor-pointer hover:bg-[#27272a] transition-all hover:scale-[1.02] active:scale-95"
    >
      <div className="w-full aspect-square rounded-[16px] flex items-center justify-center text-5xl sm:text-6xl bg-[#27272a] shadow-inner mb-3 relative overflow-hidden">
        {/* Placeholder gradient if no real image */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
        {item.emoji}
      </div>
      <h3 className="font-bold text-[15px] sm:text-[16px] text-white leading-tight line-clamp-2 w-full mb-1">{item.name}</h3>
      <p className="text-[12px] text-[#a1a1aa] line-clamp-1 mb-2">{item.desc}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-[15px] sm:text-[16px] font-black text-orange-500">{formatPrice(item.price)}</span>
        <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-500">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen pb-24 font-sans bg-[var(--bg-deep)] text-white">

      {/* Order Success Animated Modal */}
      {showOrderSuccess && (
        <SuccessAnimation
          type="order"
          onClose={() => {
            setShowOrderSuccess(false);
            router.push("/orders");
          }}
        />
      )}

      {/* Header & Search */}
      <div className="p-4 pt-6 sticky top-0 z-30 bg-[#09090b]/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-[24px] font-black tracking-tight flex items-center gap-2">
            <Logo className="w-8 h-8 rounded-lg" /> F.Lavash
          </h1>
          <div className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-bold bg-orange-500/10 text-orange-500 border border-orange-500/20">
            <Star className="w-3.5 h-3.5 fill-current" /> 4.9
          </div>
        </div>
        
        {/* Search Bar */}
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#a1a1aa]" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-4 py-3.5 bg-[#18181b] border border-white/10 rounded-2xl text-white placeholder-[#52525b] focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 transition-all text-[15px] font-medium shadow-inner"
            placeholder="Taom yoki ichimlik qidiring..."
          />
        </div>
      </div>

      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center text-[#a1a1aa]">
          <RefreshCw className="w-10 h-10 mb-4 animate-spin text-orange-500" />
          <p className="font-medium">Menyu yuklanmoqda...</p>
        </div>
      ) : menuItems.length === 0 ? (
        <div className="py-20 flex flex-col items-center justify-center text-[#a1a1aa]">
          <Pizza className="w-16 h-16 mb-4 opacity-20" />
          <p>Hozircha taomlar mavjud emas.</p>
        </div>
      ) : (
        <div className="px-4 pt-6 pb-4 flex flex-col gap-10">
          
          {/* FASTFOOD SECTION */}
          {(filteredFastfoods.length > 0 || searchQuery === "") && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Sandwich className="w-6 h-6 text-yellow-500" />
                <h2 className="text-[22px] font-black text-white">Fastfud</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {filteredFastfoods.map(item => <ItemCard key={item.id} item={item} />)}
                {filteredFastfoods.length === 0 && <p className="text-[#a1a1aa] text-sm">Topilmadi</p>}
              </div>
            </section>
          )}

          {/* FOODS SECTION */}
          {(filteredFoods.length > 0 || searchQuery === "") && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Pizza className="w-6 h-6 text-orange-500" />
                <h2 className="text-[22px] font-black text-white">Ovqatlar</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {filteredFoods.map(item => <ItemCard key={item.id} item={item} />)}
                {filteredFoods.length === 0 && <p className="text-[#a1a1aa] text-sm">Topilmadi</p>}
              </div>
            </section>
          )}

          {/* DRINKS SECTION */}
          {(filteredDrinks.length > 0 || searchQuery === "") && (
            <section>
              <div className="flex items-center gap-2 mb-4">
                <Coffee className="w-6 h-6 text-blue-400" />
                <h2 className="text-[22px] font-black text-white">Ichimliklar</h2>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
                {filteredDrinks.map(item => <ItemCard key={item.id} item={item} />)}
                {filteredDrinks.length === 0 && <p className="text-[#a1a1aa] text-sm">Topilmadi</p>}
              </div>
            </section>
          )}

        </div>
      )}

      {/* Interactive Order Wizard Modal */}
      {step !== "NONE" && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm sm:p-4 transition-all">
          <div className="bg-[#18181b] w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 flex items-center justify-between border-b border-white/5 bg-[#09090b]">
              {step !== "DETAILS" && step !== "SUCCESS" ? (
                <button onClick={() => setStep("DETAILS")} className="p-2 -ml-2 text-[#a1a1aa] hover:text-white rounded-full transition-colors">
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
              <button onClick={closeWizard} className="p-2 -mr-2 bg-[#27272a] text-[#a1a1aa] hover:text-white rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 pb-12 overflow-y-auto">
              
              {/* STEP 1: Details */}
              {step === "DETAILS" && selectedItem && (
                <div className="flex flex-col items-center text-center animate-in slide-in-from-bottom-4 duration-300">
                  <div className="text-8xl mb-6 p-6 bg-[#27272a] rounded-[32px] shadow-inner">{selectedItem.emoji}</div>
                  <h3 className="text-2xl font-black text-white mb-2">{selectedItem.name}</h3>
                  <p className="text-[#a1a1aa] text-[15px] leading-relaxed mb-6 px-2">{selectedItem.desc}</p>
                  <div className="text-2xl font-black text-orange-500 mb-8 bg-orange-500/10 px-6 py-3 rounded-full border border-orange-500/20">
                    {formatPrice(selectedItem.price)}
                  </div>
                  <button 
                    onClick={() => setStep("DRINKS_PROMPT")}
                    className="w-full py-4.5 rounded-[20px] font-bold text-[17px] text-white bg-orange-500 hover:bg-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                  >
                    Buyurtma berish <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {/* STEP 2: Drinks Prompt */}
              {step === "DRINKS_PROMPT" && (
                <div className="flex flex-col items-center text-center animate-in slide-in-from-right-4 duration-300 py-6">
                  <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center text-5xl mb-6">🥤</div>
                  <h3 className="text-[22px] font-black text-white mb-8">Yana nimadir yoki ichimlik olasizmi?</h3>
                  <div className="flex gap-4 w-full">
                    <button 
                      onClick={() => setStep("PAYMENT")}
                      className="flex-1 py-4.5 rounded-[20px] font-bold text-[16px] text-[#a1a1aa] bg-[#27272a] hover:bg-[#3f3f46] transition-colors active:scale-95"
                    >
                      Yo'q, yetarli
                    </button>
                    <button 
                      onClick={() => setStep("DRINKS_SELECTION")}
                      className="flex-1 py-4.5 rounded-[20px] font-bold text-[16px] text-white bg-blue-500 hover:bg-blue-600 shadow-[0_0_15px_rgba(59,130,246,0.3)] transition-colors active:scale-95"
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
                      className="flex items-center justify-between p-4 bg-[#27272a]/60 rounded-[20px] cursor-pointer hover:bg-[#27272a] transition-colors border border-transparent hover:border-blue-500/30 active:scale-[0.98]"
                    >
                      <div className="flex items-center gap-4">
                        <div className="text-4xl bg-[#18181b] p-2 rounded-xl">{drink.emoji}</div>
                        <div>
                          <h4 className="font-bold text-white text-[16px]">{drink.name}</h4>
                          <p className="text-blue-400 font-bold text-[14px]">{formatPrice(drink.price)}</p>
                        </div>
                      </div>
                      <div className="w-10 h-10 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center">
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  )) : (
                    <div className="text-center py-6 text-[#a1a1aa]">Ichimliklar topilmadi.</div>
                  )}
                  <button 
                    onClick={() => setStep("PAYMENT")}
                    className="mt-4 w-full py-4.5 rounded-[20px] font-bold text-[#a1a1aa] bg-transparent border border-white/10 hover:bg-white/5 transition-colors active:scale-95"
                  >
                    O'tkazib yuborish
                  </button>
                </div>
              )}

              {/* STEP 3: Payment Method */}
              {step === "PAYMENT" && (
                <div className="flex flex-col items-center text-center animate-in slide-in-from-right-4 duration-300 py-4">
                  <h3 className="text-[22px] font-black text-white mb-6">To'lov turini tanlang</h3>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div 
                      onClick={() => {
                        setPaymentMethod("CASH");
                        setStep("INFO");
                      }}
                      className="flex flex-col items-center justify-center gap-4 p-6 bg-[#27272a]/60 rounded-[24px] cursor-pointer border border-transparent hover:border-green-500/30 hover:bg-green-500/10 transition-all group active:scale-95"
                    >
                      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Banknote className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="font-bold text-white text-[16px]">Naqd pul</span>
                    </div>
                    <div 
                      onClick={() => {
                        alert("Karta orqali to'lov (Click/Payme) tizimga kiritilmoqda. Iltimos hozircha naqd pulni tanlang.");
                      }}
                      className="flex flex-col items-center justify-center gap-4 p-6 bg-[#27272a]/60 rounded-[24px] cursor-pointer border border-transparent hover:border-orange-500/30 hover:bg-orange-500/10 transition-all group active:scale-95"
                    >
                      <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <CreditCard className="w-8 h-8 text-orange-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="font-bold text-white text-[16px]">Karta orqali</span>
                    </div>
                  </div>
                </div>
              )}

              {/* STEP 4: Phone & Location */}
              {step === "INFO" && (
                <div className="flex flex-col gap-5 animate-in slide-in-from-right-4 duration-300">
                  <div>
                    <label className="block text-[#a1a1aa] text-[13px] font-bold mb-2 ml-1">Telefon raqamingiz</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full bg-[#27272a] border border-white/10 rounded-[20px] px-5 py-4 text-white font-bold focus:outline-none focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 text-[16px]"
                      placeholder="+998 90 123 45 67"
                    />
                  </div>

                  <div>
                    <label className="block text-[#a1a1aa] text-[13px] font-bold mb-2 ml-1">Manzilingiz</label>
                    <button 
                      onClick={getLocation}
                      className={`w-full py-4.5 rounded-[20px] font-bold text-[16px] flex items-center justify-center gap-2 border transition-all active:scale-[0.98] ${
                        locationStr 
                          ? "bg-green-500/20 text-green-400 border-green-500/30" 
                          : "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20"
                      }`}
                    >
                      {locationStr ? <CheckCircle2 className="w-5 h-5" /> : <Navigation className="w-5 h-5" />}
                      {locationStr ? "Lokatsiya olindi!" : "📍 Lokatsiyani yuborish (GPS)"}
                    </button>
                    {!locationStr && (
                      <p className="text-[12px] text-[#a1a1aa] mt-3 text-center font-medium">
                        Kuryer aniq yetib borishi uchun lokatsiyani tasdiqlang.
                      </p>
                    )}
                  </div>

                  <button 
                    onClick={submitOrder}
                    disabled={isSubmitting || !locationStr}
                    className="mt-6 w-full py-4.5 rounded-[20px] font-black text-[17px] text-white bg-green-500 hover:bg-green-600 shadow-[0_0_20px_rgba(34,197,94,0.3)] disabled:opacity-50 disabled:shadow-none hover:scale-[1.02] active:scale-[0.98] transition-all flex justify-center items-center h-[60px]"
                  >
                    {isSubmitting ? (
                      <div className="w-6 h-6 border-3 border-white/50 border-t-white rounded-full animate-spin"></div>
                    ) : (
                      "Buyurtmani tasdiqlash"
                    )}
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
