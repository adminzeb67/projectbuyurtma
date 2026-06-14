"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, Send, User, Lock, Eye, EyeOff, Rocket, Star, Heart, Smartphone, ShoppingBag } from "lucide-react";
import { Logo } from "@/components/Logo";
import { SuccessAnimation } from "@/components/SuccessAnimation";

export function AuthView() {
  const [activeTab, setActiveTab] = useState<'login' | 'register' | null>(null);
  const isLogin = activeTab === 'login';
  const router = useRouter();

  const [loginName, setLoginName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showRegisterSuccess, setShowRegisterSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      if (isLogin) {
        const res = await fetch("/api/auth/login", { 
          method: "POST", 
          headers: { "Content-Type": "application/json" }, 
          body: JSON.stringify({ login: loginName, password }) 
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Xatolik yuz berdi");

        if (data.redirect === "/admin") {
          localStorage.setItem("oshfast_admin_auth", "true");
          window.location.href = "/admin";
          return;
        }

        router.refresh();
      } else {
        if (password !== confirmPassword) {
          throw new Error("Parollar mos kelmadi");
        }
        const formattedPhone = "+998" + phone.replace(/\D/g, '');
        const res = await fetch("/api/auth/register", { 
          method: "POST", 
          headers: { "Content-Type": "application/json" }, 
          // Assuming loginName serves as both name and username for simplicity based on the prompt
          body: JSON.stringify({ name: loginName, username: loginName, phone: formattedPhone, password }) 
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Xatolik yuz berdi");
        setShowRegisterSuccess(true);
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#11131e] flex flex-col items-center font-sans relative overflow-x-hidden" style={{ background: "radial-gradient(circle at center, #1a1d2e 0%, #0d0f18 100%)" }}>
      
      {/* Register Success Animated Modal */}
      {showRegisterSuccess && (
        <SuccessAnimation
          type="register"
          onClose={() => {
            setShowRegisterSuccess(false);
            router.refresh();
          }}
        />
      )}
      
      {/* Background glow effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 blur-[100px] rounded-full pointer-events-none fixed" />

      {/* Top Navbar */}
      <div className="w-full flex items-center justify-between p-4 sm:p-6 mb-2 relative z-50 bg-[#11131e]/80 backdrop-blur-md border-b border-white/5 sticky top-0">
        
        {/* Left: Animated Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => setActiveTab(null)}>
          <Logo className="w-10 h-10 sm:w-12 sm:h-12 shadow-[0_0_15px_rgba(139,92,246,0.3)]" />
          <span className="text-white font-bold text-lg sm:text-2xl tracking-wide bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
            OshFast
          </span>
        </div>

        {/* Right: Login / Register Toggle */}
        <div className="flex items-center gap-2 sm:gap-4">
          <div className="bg-[#23263a]/80 backdrop-blur-md rounded-full p-1 border border-white/5 flex shadow-lg">
            <button 
              type="button"
              onClick={() => { setActiveTab('login'); setError(""); }}
              className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-[13px] sm:text-sm font-medium transition-all duration-300 ${activeTab === 'login' ? 'bg-[#6366f1] text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'text-[#8e93a6] hover:text-white'}`}
            >
              Kirish
            </button>
            <button 
              type="button"
              onClick={() => { setActiveTab('register'); setError(""); }}
              className={`px-3 sm:px-5 py-1.5 sm:py-2 rounded-full text-[13px] sm:text-sm font-medium transition-all duration-300 ${activeTab === 'register' ? 'bg-[#6366f1] text-white shadow-[0_0_15px_rgba(99,102,241,0.5)]' : 'text-[#8e93a6] hover:text-white'}`}
            >
              Ro'yxatdan o'tish
            </button>
          </div>
          
          {/* Language Selector Icon (Compact) */}
          <button className="hidden sm:flex items-center justify-center w-10 h-10 bg-[#23263a]/80 backdrop-blur-md rounded-full border border-white/5 text-white/90 hover:bg-[#2a2d45] transition-colors">
            <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center bg-white border border-white/10">
              <div className="w-full h-full flex flex-col">
                <div className="h-1/3 bg-[#009eb3]"></div>
                <div className="h-1/3 bg-white flex items-center justify-center"><div className="w-full h-[1px] bg-red-500"></div></div>
                <div className="h-1/3 bg-[#1eb53a]"></div>
              </div>
            </div>
          </button>
        </div>
      </div>

      <div className="w-full relative z-10 flex flex-col flex-1 items-center px-4">
        
        {!activeTab ? (
          <div className="flex flex-col items-center w-full max-w-[800px] pb-16 animate-fade-in mt-6 sm:mt-10">
            {/* Hero Section */}
            <Logo className="w-28 h-28 sm:w-36 sm:h-36 mb-6 shadow-[0_0_40px_rgba(139,92,246,0.3)] rounded-[25%] shrink-0" />
            <h1 className="text-[32px] sm:text-[44px] font-bold text-white text-center mb-4 tracking-tight leading-tight">
              OshFast ga xush kelibsiz!
            </h1>
            <p className="text-[#8e93a6] text-center text-[15px] sm:text-[18px] max-w-[550px] mb-12 leading-relaxed">
              Eng tezkor, qulay va mazali taomlar yetkazib berish xizmati. Uyda, ishda yoki istalgan joyda sevimli taomlaringizdan bahramand bo'ling.
            </p>

            {/* Advantages Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 w-full mb-16">
              <div className="bg-[#23263a]/40 backdrop-blur-sm border border-white/5 rounded-3xl p-6 flex flex-col items-center text-center hover:bg-[#23263a]/60 transition-colors">
                <div className="w-14 h-14 bg-blue-500/10 rounded-2xl flex items-center justify-center mb-4 border border-blue-500/20">
                  <Rocket className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="text-white font-bold text-[17px] mb-2">Tezkor yetkazish</h3>
                <p className="text-[#8e93a6] text-[14px] leading-relaxed">Buyurtmangiz sanoqli daqiqalarda manzilga issiqligicha yetkazib beriladi.</p>
              </div>
              <div className="bg-[#23263a]/40 backdrop-blur-sm border border-white/5 rounded-3xl p-6 flex flex-col items-center text-center hover:bg-[#23263a]/60 transition-colors">
                <div className="w-14 h-14 bg-purple-500/10 rounded-2xl flex items-center justify-center mb-4 border border-purple-500/20">
                  <Star className="w-7 h-7 text-purple-400" />
                </div>
                <h3 className="text-white font-bold text-[17px] mb-2">Ajoyib ta'm</h3>
                <p className="text-[#8e93a6] text-[14px] leading-relaxed">Eng sara masalliqlardan tayyorlangan betakror lavash, burger va milliy taomlar.</p>
              </div>
              <div className="bg-[#23263a]/40 backdrop-blur-sm border border-white/5 rounded-3xl p-6 flex flex-col items-center text-center hover:bg-[#23263a]/60 transition-colors">
                <div className="w-14 h-14 bg-green-500/10 rounded-2xl flex items-center justify-center mb-4 border border-green-500/20">
                  <Heart className="w-7 h-7 text-green-400" />
                </div>
                <h3 className="text-white font-bold text-[17px] mb-2">Qulay interfeys</h3>
                <p className="text-[#8e93a6] text-[14px] leading-relaxed">Barchasi siz uchun qulaylashtirilgan. Bir necha tugma orqali osongina buyurtma bering.</p>
              </div>
            </div>

            {/* PWA Installation Guide */}
            <div className="w-full bg-gradient-to-r from-[#23263a]/80 to-[#1a1d2e]/80 border border-white/10 rounded-[32px] p-8 sm:p-10 mb-16 relative overflow-hidden shadow-2xl">
              <div className="absolute -right-20 -top-20 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none"></div>
              <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-purple-500/10 blur-[80px] rounded-full pointer-events-none"></div>
              
              <div className="relative z-10 flex flex-col sm:flex-row gap-8 items-center">
                <div className="flex-1">
                  <h2 className="text-[24px] sm:text-[28px] font-bold text-white mb-4 flex items-center gap-3">
                    <Smartphone className="w-8 h-8 text-blue-400" /> Ilovani o'rnatish
                  </h2>
                  <p className="text-[#8e93a6] mb-6 text-[15px] sm:text-[16px] leading-relaxed">
                    OshFast platformasini Play Market yoki App Store'siz, to'g'ridan-to'g'ri telefoningiz ekraniga mobil ilova (PWA) sifatida o'rnatib olishingiz mumkin.
                  </p>
                  <ul className="text-[#a0a5b8] text-[15px] space-y-4">
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold text-[13px] shrink-0">1</span> 
                      <span>Telefoningizda <b>Google Chrome</b> (Android) yoki <b>Safari</b> (iOS) orqali saytga kiring.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold text-[13px] shrink-0">2</span> 
                      <span>Brauzer menyusidan <b className="text-white">"Add to Home Screen"</b> (Ekranga qo'shish) yoki <b className="text-white">"Install App"</b> tugmasini tanlang.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <span className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-500/20 text-blue-400 font-bold text-[13px] shrink-0">3</span> 
                      <span>Tayyor! Endi OshFast ilovasi telefoningiz ekranida paydo bo'ladi va xuddi oddiy dasturdek ishlaydi.</span>
                    </li>
                  </ul>
                </div>
                <div className="hidden sm:flex flex-col items-center justify-center p-6 bg-black/40 rounded-3xl border border-white/5">
                  <Logo className="w-20 h-20 mb-3 rounded-[25%]" />
                  <div className="text-white font-bold mb-1">OshFast App</div>
                  <div className="px-4 py-1.5 bg-blue-500 rounded-full text-[12px] font-bold mt-2 shadow-lg shadow-blue-500/30">O'rnatish</div>
                </div>
              </div>
            </div>

            {/* How to use Guide */}
            <div className="w-full mb-12">
              <h2 className="text-[28px] font-bold text-white mb-8 text-center">Qanday ishlaydi?</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Registration Step */}
                <div className="bg-[#23263a]/30 border border-white/5 rounded-[24px] p-8 hover:bg-[#23263a]/50 transition-colors">
                  <div className="w-14 h-14 bg-indigo-500/20 rounded-2xl flex items-center justify-center mb-5 border border-indigo-500/30">
                    <User className="w-6 h-6 text-indigo-400" />
                  </div>
                  <h3 className="text-white font-bold text-[20px] mb-3">1. Ro'yxatdan o'tish</h3>
                  <p className="text-[#8e93a6] text-[15px] leading-relaxed">
                    Yuqoridagi <b>"Ro'yxatdan o'tish"</b> tugmasi orqali ismingiz, raqamingiz va parolingizni kiritib shaxsiy hisobingizni yarating. Bu atigi 30 soniya vaqt oladi.
                  </p>
                </div>

                {/* Order Step */}
                <div className="bg-[#23263a]/30 border border-white/5 rounded-[24px] p-8 hover:bg-[#23263a]/50 transition-colors">
                  <div className="w-14 h-14 bg-orange-500/20 rounded-2xl flex items-center justify-center mb-5 border border-orange-500/30">
                    <ShoppingBag className="w-6 h-6 text-orange-400" />
                  </div>
                  <h3 className="text-white font-bold text-[20px] mb-3">2. Buyurtma berish</h3>
                  <p className="text-[#8e93a6] text-[15px] leading-relaxed">
                    Menyudan o'zingizga yoqqan lavash, taom yoki ichimliklarni savatchaga qo'shing. Manzilingizni belgilab tasdiqlang va issiqqina ovqatni kuting!
                  </p>
                </div>

              </div>
            </div>

            {/* CTA */}
            <button 
              onClick={() => { setActiveTab('login'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="mt-6 px-10 py-4 bg-gradient-to-r from-purple-500 to-indigo-500 text-white rounded-2xl font-bold text-[18px] shadow-lg shadow-indigo-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2"
            >
              Hoziroq boshlash
            </button>

          </div>
        ) : (
          <div className="w-full max-w-[400px] mt-[10vh]">
            {/* Header Title Only */}
            <div className="flex flex-col items-center justify-center mb-6">
              <h1 className="text-[34px] font-bold text-white mb-2 tracking-tight drop-shadow-lg shadow-blue-500/20 text-center">
                {isLogin ? "Kirish" : "Ro'yxatdan o'tish"}
              </h1>
              <p className="text-[#8e93a6] text-[15px] text-center">
                {isLogin ? "Ma'lumotlaringizni kiriting" : "Barcha maydonlarni to'ldiring"}
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-2xl mb-6 text-sm text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6" autoComplete="off">
              
              {/* Ism yoki login */}
              <div className="bg-[#23263a]/90 backdrop-blur-xl border border-white/5 rounded-2xl p-1 flex items-center shadow-lg focus-within:border-[#f5a623]/50 transition-colors">
                <div className="pl-4 text-[#8e93a6]">
                  <User className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  required 
                  value={loginName} 
                  onChange={e => setLoginName(e.target.value)} 
                  className="!bg-transparent border-none outline-none text-white w-full p-4 placeholder-[#5c6175] text-[16px]"
                  placeholder="Ism yoki login"
                  autoComplete="off"
                />
              </div>

              {/* Telefon raqam (Only for Registration) */}
              {!isLogin && (
                <div className="flex gap-3 h-[60px]">
                  <div className="bg-[#23263a]/90 backdrop-blur-xl border border-white/5 rounded-2xl px-4 flex items-center gap-2 shadow-lg shrink-0">
                    <div className="w-5 h-5 rounded-full overflow-hidden flex items-center justify-center bg-white">
                      <div className="w-full h-full flex flex-col">
                        <div className="h-1/3 bg-[#009eb3]"></div>
                        <div className="h-1/3 bg-white"></div>
                        <div className="h-1/3 bg-[#1eb53a]"></div>
                      </div>
                    </div>
                    <span className="text-white font-medium text-[16px]">+998</span>
                  </div>
                  
                  <div className="bg-[#23263a]/90 backdrop-blur-xl border border-white/5 rounded-2xl flex-1 flex items-center shadow-lg overflow-hidden focus-within:border-[#f5a623]/50 transition-colors">
                    <input 
                      type="tel" 
                      required 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                      className="!bg-transparent border-none outline-none text-white w-full h-full px-5 placeholder-[#5c6175] text-[16px] tracking-wide"
                      placeholder="Telefon raqam"
                      autoComplete="off"
                    />
                  </div>
                </div>
              )}

              {/* Parol */}
              <div className="bg-[#23263a]/90 backdrop-blur-xl border border-white/5 rounded-2xl p-1 flex items-center shadow-lg focus-within:border-[#f5a623]/50 transition-colors">
                <div className="pl-4 text-[#8e93a6]">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="!bg-transparent border-none outline-none text-white w-full p-4 placeholder-[#5c6175] text-[16px]"
                  placeholder="Parol"
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="pr-4 text-[#8e93a6] hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Parolni tasdiqlash (Only for Registration) */}
              {!isLogin && (
                <div className="bg-[#23263a]/90 backdrop-blur-xl border border-white/5 rounded-2xl p-1 flex items-center shadow-lg focus-within:border-[#f5a623]/50 transition-colors">
                  <div className="pl-4 text-[#8e93a6]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    className="!bg-transparent border-none outline-none text-white w-full p-4 placeholder-[#5c6175] text-[16px]"
                    placeholder="Parolni tasdiqlash"
                    autoComplete="new-password"
                  />
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-[60px] rounded-2xl mt-2 text-white font-semibold text-[17px] shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98] disabled:opacity-70"
                style={{ background: "linear-gradient(135deg, #7c5cff 0%, #5d3fff 100%)" }}
              >
                {loading ? "Kuting..." : (isLogin ? "Kirish" : "Ro'yxatdan o'tish")}
              </button>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

