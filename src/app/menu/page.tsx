"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { Star, X, ArrowRight, CheckCircle2, ChevronLeft, Navigation, CreditCard, Banknote, Search, RefreshCw, Coffee, Pizza, Sandwich } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { SuccessAnimation } from "@/components/SuccessAnimation";
import { Logo } from "@/components/Logo";

function formatPrice(p: number) {
  return p.toLocaleString("uz-UZ") + " so'm";
}

// Qaysi kategoriya qaysi bo'limga tegishli
const FASTFOOD_CATS  = ["lavash", "burger", "fastfud", "hot dog", "sendvich", "pizza"];
const DRINK_CATS     = ["ichimlik", "drink", "juice", "sharbat", "kola", "pepsi", "choy", "kofe"];

function getSection(category: string): "fastfood" | "drinks" | "foods" {
  const c = category.toLowerCase();
  if (DRINK_CATS.some(k => c.includes(k))) return "drinks";
  if (FASTFOOD_CATS.some(k => c.includes(k))) return "fastfood";
  return "foods";
}

function MenuContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sectionParam = searchParams.get("section"); // "fastfood" | "drinks" | "foods" | null

  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [loading, setLoading]     = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Wizard
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [step, setStep] = useState<"NONE"|"DETAILS"|"DRINKS_PROMPT"|"DRINKS_SELECTION"|"PAYMENT"|"INFO">("NONE");
  const [showOrderSuccess, setShowOrderSuccess] = useState(false);
  const [orderDrinks, setOrderDrinks]   = useState<any[]>([]);
  const [paymentMethod, setPaymentMethod] = useState<"CASH"|"CARD"|null>(null);
  const [phone, setPhone]         = useState("+998");
  const [locationStr, setLocationStr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Section refs for scroll
  const fastfoodRef = useRef<HTMLElement>(null);
  const foodsRef    = useRef<HTMLElement>(null);
  const drinksRef   = useRef<HTMLElement>(null);

  useEffect(() => {
    fetch("/api/menu")
      .then(r => r.json())
      .then(data => { if (Array.isArray(data)) setMenuItems(data); })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Scroll to section when param changes or items load
  useEffect(() => {
    if (!sectionParam || loading) return;
    const map: Record<string, React.RefObject<HTMLElement>> = {
      fastfood: fastfoodRef,
      foods:    foodsRef,
      drinks:   drinksRef,
    };
    const ref = map[sectionParam];
    if (ref?.current) {
      setTimeout(() => ref.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
    }
  }, [sectionParam, loading]);

  // Group
  const fastfoods = menuItems.filter(m => getSection(m.category) === "fastfood");
  const foods     = menuItems.filter(m => getSection(m.category) === "foods");
  const drinks    = menuItems.filter(m => getSection(m.category) === "drinks");

  // If all go into one bucket (admin named categories differently), fallback: split by category
  const allFoodLike = menuItems.filter(m => m.category !== "Ichimliklar");
  const allDrinks   = menuItems.filter(m => m.category === "Ichimliklar");

  const useFallback = fastfoods.length === 0 && foods.length === 0;
  const finalFastfoods = useFallback ? [] : fastfoods;
  const finalFoods     = useFallback ? allFoodLike : foods;
  const finalDrinks    = useFallback ? allDrinks : drinks;

  const q = searchQuery.toLowerCase().trim();
  const filter = (items: any[]) =>
    q === "" ? items : items.filter(m =>
      m.name.toLowerCase().includes(q) ||
      (m.desc || "").toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
    );

  const openWizard = (item: any) => {
    setSelectedItem(item);
    setOrderDrinks([]);
    setPaymentMethod(null);
    setPhone("+998");
    setLocationStr("");
    setStep("DETAILS");
  };

  const closeWizard = () => { setStep("NONE"); setSelectedItem(null); };
  const addDrink    = (drink: any) => { setOrderDrinks(p => [...p, drink]); setStep("PAYMENT"); };

  const getLocation = () => {
    if (!("geolocation" in navigator)) { alert("GPS qo'llab-quvvatlanmaydi."); return; }
    navigator.geolocation.getCurrentPosition(
      pos => setLocationStr(`${pos.coords.latitude},${pos.coords.longitude}`),
      ()  => alert("Lokatsiyani aniqlab bo'lmadi.")
    );
  };

  const submitOrder = async () => {
    if (phone.length < 9) { alert("Telefon raqamni to'g'ri kiriting!"); return; }
    if (!locationStr)      { alert("Lokatsiyani yuboring!"); return; }
    setIsSubmitting(true);
    try {
      const items = [
        { id: selectedItem.id, name: selectedItem.name, price: selectedItem.price, quantity: 1 },
        ...orderDrinks.map(d => ({ id: d.id, name: d.name, price: d.price, quantity: 1 })),
      ];
      const res = await fetch("/api/orders/guest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: "Mijoz (Saytdan)", phone,
          items, totalAmount: items.reduce((s, i) => s + i.price, 0),
          paymentMethod, location: locationStr,
        }),
      });
      if (res.ok) { setStep("NONE"); setShowOrderSuccess(true); }
      else alert("Xatolik yuz berdi!");
    } catch { alert("Internet aloqasini tekshiring!"); }
    finally { setIsSubmitting(false); }
  };

  const ItemCard = ({ item }: { item: any }) => (
    <div
      onClick={() => openWizard(item)}
      className="flex flex-col p-3 rounded-[24px] bg-[#18181b] border border-white/5 shadow-lg cursor-pointer hover:bg-[#27272a] transition-all hover:scale-[1.02] active:scale-95"
    >
      <div className="w-full aspect-square rounded-[16px] flex items-center justify-center text-5xl sm:text-6xl bg-[#27272a] shadow-inner mb-3">
        {item.emoji}
      </div>
      <h3 className="font-bold text-[15px] text-white leading-tight line-clamp-2 mb-1">{item.name}</h3>
      <p className="text-[12px] text-[#a1a1aa] line-clamp-1 mb-2">{item.desc}</p>
      <div className="flex items-center justify-between mt-auto">
        <span className="text-[14px] font-black text-orange-500">{formatPrice(item.price)}</span>
        <div className="w-8 h-8 rounded-full bg-orange-500/10 flex items-center justify-center border border-orange-500/20 text-orange-500">
          <ArrowRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );

  // Section component
  const Section = ({
    title, icon, items, sectionRef, accentClass,
  }: {
    title: string;
    icon: React.ReactNode;
    items: any[];
    sectionRef: React.RefObject<HTMLElement>;
    accentClass: string;
  }) => {
    const filtered = filter(items);
    if (filtered.length === 0 && q !== "") return null;
    if (items.length === 0) return null;
    return (
      <section ref={sectionRef as any} className="scroll-mt-32">
        <div className={`flex items-center gap-2 mb-4 ${accentClass}`}>
          {icon}
          <h2 className="text-[22px] font-black">{title}</h2>
          <span className="ml-auto text-[13px] font-medium text-[#a1a1aa]">{items.length} ta</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {filtered.map(item => <ItemCard key={item.id} item={item} />)}
          {filtered.length === 0 && <p className="col-span-full text-[#a1a1aa] text-sm">Topilmadi</p>}
        </div>
      </section>
    );
  };

  return (
    <div className="flex flex-col min-h-screen pb-24 font-sans text-white" style={{ background: "var(--bg-deep)" }}>
      {showOrderSuccess && (
        <SuccessAnimation type="order" onClose={() => { setShowOrderSuccess(false); router.push("/orders"); }} />
      )}

      {/* Header */}
      <div className="p-4 pt-6 sticky top-0 z-30 bg-[#09090b]/90 backdrop-blur-xl border-b border-white/5">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-[22px] font-black flex items-center gap-2">
            <Logo className="w-8 h-8 rounded-lg" /> F.Lavash Menyu
          </h1>
          <div className="flex items-center gap-1 text-xs px-3 py-1.5 rounded-full font-bold bg-orange-500/10 text-orange-500 border border-orange-500/20">
            <Star className="w-3.5 h-3.5 fill-current" /> 4.9
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#a1a1aa]" />
          </div>
          <input
            type="text" value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="block w-full pl-12 pr-4 py-3.5 bg-[#18181b] border border-white/10 rounded-2xl text-white placeholder-[#52525b] focus:outline-none focus:border-orange-500/50 transition-all text-[15px] font-medium shadow-inner"
            placeholder="Taom yoki ichimlik qidiring..."
          />
        </div>

        {/* Quick section tabs */}
        {!loading && (
          <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide">
            {finalFastfoods.length > 0 && (
              <button onClick={() => fastfoodRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-yellow-500/10 text-yellow-400 border border-yellow-500/20 text-[13px] font-bold whitespace-nowrap shrink-0 hover:bg-yellow-500/20 transition-colors">
                <Sandwich className="w-4 h-4" /> Fastfud
              </button>
            )}
            {finalFoods.length > 0 && (
              <button onClick={() => foodsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-orange-500/10 text-orange-500 border border-orange-500/20 text-[13px] font-bold whitespace-nowrap shrink-0 hover:bg-orange-500/20 transition-colors">
                <Pizza className="w-4 h-4" /> Ovqatlar
              </button>
            )}
            {finalDrinks.length > 0 && (
              <button onClick={() => drinksRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })}
                className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20 text-[13px] font-bold whitespace-nowrap shrink-0 hover:bg-blue-500/20 transition-colors">
                <Coffee className="w-4 h-4" /> Ichimliklar
              </button>
            )}
          </div>
        )}
      </div>

      {/* Content */}
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
          <Section title="Fastfud" icon={<Sandwich className="w-6 h-6" />} items={finalFastfoods} sectionRef={fastfoodRef} accentClass="text-yellow-400" />
          <Section title="Ovqatlar" icon={<Pizza className="w-6 h-6" />} items={finalFoods} sectionRef={foodsRef} accentClass="text-orange-500" />
          <Section title="Ichimliklar" icon={<Coffee className="w-6 h-6" />} items={finalDrinks} sectionRef={drinksRef} accentClass="text-blue-400" />
        </div>
      )}

      {/* Order Wizard */}
      {step !== "NONE" && (
        <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm sm:p-4">
          <div className="bg-[#18181b] w-full sm:max-w-md rounded-t-[32px] sm:rounded-[32px] overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
            <div className="p-5 flex items-center justify-between border-b border-white/5 bg-[#09090b]">
              {step !== "DETAILS" ? (
                <button onClick={() => setStep("DETAILS")} className="p-2 -ml-2 text-[#a1a1aa] hover:text-white rounded-full">
                  <ChevronLeft className="w-6 h-6" />
                </button>
              ) : <div className="w-10" />}
              <h2 className="text-[16px] font-bold text-white text-center flex-1">
                {step === "DETAILS" && "Taom tarkibi"}
                {step === "DRINKS_PROMPT" && "Qo'shimcha"}
                {step === "DRINKS_SELECTION" && "Ichimliklar"}
                {step === "PAYMENT" && "To'lov turi"}
                {step === "INFO" && "Manzil va Telefon"}
              </h2>
              <button onClick={closeWizard} className="p-2 -mr-2 bg-[#27272a] text-[#a1a1aa] hover:text-white rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 pb-12 overflow-y-auto">
              {step === "DETAILS" && selectedItem && (
                <div className="flex flex-col items-center text-center">
                  <div className="text-8xl mb-6 p-6 bg-[#27272a] rounded-[32px]">{selectedItem.emoji}</div>
                  <h3 className="text-2xl font-black text-white mb-2">{selectedItem.name}</h3>
                  <p className="text-[#a1a1aa] text-[15px] mb-6 px-2">{selectedItem.desc}</p>
                  <div className="text-2xl font-black text-orange-500 mb-8 bg-orange-500/10 px-6 py-3 rounded-full border border-orange-500/20">
                    {formatPrice(selectedItem.price)}
                  </div>
                  <button onClick={() => setStep("DRINKS_PROMPT")}
                    className="w-full py-4 rounded-[20px] font-bold text-[17px] text-white bg-orange-500 hover:bg-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all flex items-center justify-center gap-2">
                    Buyurtma berish <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              )}

              {step === "DRINKS_PROMPT" && (
                <div className="flex flex-col items-center text-center py-6">
                  <div className="w-24 h-24 bg-blue-500/20 rounded-full flex items-center justify-center text-5xl mb-6">🥤</div>
                  <h3 className="text-[22px] font-black text-white mb-8">Ichimlik ham olasizmi?</h3>
                  <div className="flex gap-4 w-full">
                    <button onClick={() => setStep("PAYMENT")}
                      className="flex-1 py-4 rounded-[20px] font-bold text-[16px] text-[#a1a1aa] bg-[#27272a] hover:bg-[#3f3f46] transition-colors">
                      Yo'q
                    </button>
                    <button onClick={() => setStep("DRINKS_SELECTION")}
                      className="flex-1 py-4 rounded-[20px] font-bold text-[16px] text-white bg-blue-500 hover:bg-blue-600 transition-colors">
                      Ha
                    </button>
                  </div>
                </div>
              )}

              {step === "DRINKS_SELECTION" && (
                <div className="flex flex-col gap-3">
                  {finalDrinks.length > 0 ? finalDrinks.map(drink => (
                    <div key={drink.id} onClick={() => addDrink(drink)}
                      className="flex items-center justify-between p-4 bg-[#27272a] rounded-[20px] cursor-pointer hover:bg-[#3f3f46] transition-colors border border-transparent hover:border-blue-500/30">
                      <div className="flex items-center gap-4">
                        <div className="text-4xl bg-[#18181b] p-2 rounded-xl">{drink.emoji}</div>
                        <div>
                          <h4 className="font-bold text-white">{drink.name}</h4>
                          <p className="text-blue-400 font-bold text-[14px]">{formatPrice(drink.price)}</p>
                        </div>
                      </div>
                      <ArrowRight className="w-5 h-5 text-blue-400" />
                    </div>
                  )) : <p className="text-center text-[#a1a1aa] py-4">Ichimliklar topilmadi.</p>}
                  <button onClick={() => setStep("PAYMENT")}
                    className="mt-2 w-full py-4 rounded-[20px] font-bold text-[#a1a1aa] border border-white/10 hover:bg-white/5 transition-colors">
                    O'tkazib yuborish
                  </button>
                </div>
              )}

              {step === "PAYMENT" && (
                <div className="flex flex-col items-center text-center py-4">
                  <h3 className="text-[22px] font-black text-white mb-6">To'lov turini tanlang</h3>
                  <div className="grid grid-cols-2 gap-4 w-full">
                    <div onClick={() => { setPaymentMethod("CASH"); setStep("INFO"); }}
                      className="flex flex-col items-center gap-4 p-6 bg-[#27272a] rounded-[24px] cursor-pointer border border-transparent hover:border-green-500/30 hover:bg-green-500/10 transition-all group">
                      <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center">
                        <Banknote className="w-8 h-8 text-green-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="font-bold text-white">Naqd pul</span>
                    </div>
                    <div onClick={() => alert("Karta to'lovi tez orada qo'shiladi!")}
                      className="flex flex-col items-center gap-4 p-6 bg-[#27272a] rounded-[24px] cursor-pointer border border-transparent hover:border-orange-500/30 hover:bg-orange-500/10 transition-all group">
                      <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center">
                        <CreditCard className="w-8 h-8 text-orange-400 group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="font-bold text-white">Karta</span>
                    </div>
                  </div>
                </div>
              )}

              {step === "INFO" && (
                <div className="flex flex-col gap-5">
                  <div>
                    <label className="block text-[#a1a1aa] text-[13px] font-bold mb-2 ml-1">Telefon raqamingiz</label>
                    <input type="tel" value={phone} onChange={e => setPhone(e.target.value)}
                      className="w-full bg-[#27272a] border border-white/10 rounded-[20px] px-5 py-4 text-white font-bold focus:outline-none focus:border-orange-500/50 text-[16px]"
                      placeholder="+998 90 123 45 67" />
                  </div>
                  <div>
                    <label className="block text-[#a1a1aa] text-[13px] font-bold mb-2 ml-1">Manzilingiz (GPS)</label>
                    <button onClick={getLocation}
                      className={`w-full py-4 rounded-[20px] font-bold text-[16px] flex items-center justify-center gap-2 border transition-all ${locationStr ? "bg-green-500/20 text-green-400 border-green-500/30" : "bg-blue-500/10 text-blue-400 border-blue-500/30 hover:bg-blue-500/20"}`}>
                      {locationStr ? <CheckCircle2 className="w-5 h-5" /> : <Navigation className="w-5 h-5" />}
                      {locationStr ? "Lokatsiya olindi!" : "📍 GPS orqali yuborish"}
                    </button>
                  </div>
                  <button onClick={submitOrder} disabled={isSubmitting || !locationStr}
                    className="mt-4 w-full h-[60px] rounded-[20px] font-black text-[17px] text-white bg-green-500 hover:bg-green-600 shadow-[0_0_20px_rgba(34,197,94,0.3)] disabled:opacity-50 transition-all flex justify-center items-center">
                    {isSubmitting ? <div className="w-6 h-6 border-2 border-white/50 border-t-white rounded-full animate-spin" /> : "Buyurtmani tasdiqlash ✓"}
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

export default function MenuPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen" style={{ background: "var(--bg-deep)" }}>
        <RefreshCw className="w-10 h-10 animate-spin text-orange-500" />
      </div>
    }>
      <MenuContent />
    </Suspense>
  );
}
