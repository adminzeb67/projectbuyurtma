"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { User, Lock, Eye, EyeOff, Rocket, Star, Heart, ArrowLeft } from "lucide-react";
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
    <div className="min-h-screen flex flex-col items-center justify-center font-sans relative overflow-x-hidden" style={{ background: "var(--bg-deep)" }}>
      
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
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-red-500/10 blur-[120px] rounded-full pointer-events-none fixed" />

      <div className="w-full relative z-10 flex flex-col flex-1 items-center px-6 justify-center min-h-[100dvh]">
        
        {!activeTab ? (
          <div className="flex flex-col items-center justify-center w-full max-w-md animate-fade-in text-center gap-8 py-10">
            {/* Hero Logo */}
            <div className="relative">
              <div className="absolute inset-0 bg-orange-500/20 blur-[50px] rounded-full animate-pulse" />
              <Logo className="w-48 h-48 sm:w-56 sm:h-56 relative z-10 shadow-[0_0_50px_rgba(249,115,22,0.4)] rounded-[25%]" />
            </div>

            {/* Title & Info */}
            <div>
              <h1 className="text-[36px] sm:text-[48px] font-black text-white mb-4 tracking-tight leading-none drop-shadow-md">
                F.Lavash
              </h1>
              <p className="text-[16px] sm:text-[18px] text-[#a1a1aa] max-w-[320px] mx-auto leading-relaxed">
                Shahrimizning eng mazali fastfud, ovqat va ichimliklarini hoziroq buyurtma qiling!
              </p>
            </div>

            {/* Mini Features */}
            <div className="flex items-center justify-center gap-6 text-[#a1a1aa] mb-4">
              <div className="flex flex-col items-center gap-2">
                <Rocket className="w-6 h-6 text-orange-400" />
                <span className="text-[12px] font-medium uppercase tracking-wider">Tezkor</span>
              </div>
              <div className="w-[1px] h-8 bg-white/10" />
              <div className="flex flex-col items-center gap-2">
                <Star className="w-6 h-6 text-yellow-400" />
                <span className="text-[12px] font-medium uppercase tracking-wider">Sifatli</span>
              </div>
              <div className="w-[1px] h-8 bg-white/10" />
              <div className="flex flex-col items-center gap-2">
                <Heart className="w-6 h-6 text-red-400" />
                <span className="text-[12px] font-medium uppercase tracking-wider">Mazali</span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex flex-col gap-3 mt-auto sm:mt-8">
              <button 
                onClick={() => { setActiveTab('register'); setError(""); }}
                className="w-full py-4 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl font-bold text-[17px] shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all active:scale-[0.98]"
              >
                Ro'yxatdan o'tish
              </button>
              <button 
                onClick={() => { setActiveTab('login'); setError(""); }}
                className="w-full py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold text-[17px] border border-white/10 transition-all active:scale-[0.98]"
              >
                Tizimga kirish
              </button>
            </div>
          </div>
        ) : (
          <div className="w-full max-w-[400px] flex flex-col justify-center min-h-[100dvh] py-8">
            
            {/* Back Button */}
            <button 
              onClick={() => setActiveTab(null)}
              className="absolute top-6 left-6 p-2 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>

            {/* Header Title */}
            <div className="flex flex-col items-center justify-center mb-10">
              <Logo className="w-32 h-32 sm:w-40 sm:h-40 mb-6 shadow-[0_0_40px_rgba(249,115,22,0.3)] rounded-[25%]" />
              <h2 className="text-[32px] font-black text-white tracking-tight drop-shadow-md text-center">
                {isLogin ? "Kirish" : "Xush kelibsiz!"}
              </h2>
              <p className="text-[#a1a1aa] text-[15px] mt-2 text-center">
                {isLogin ? "Hisobingizga kiring" : "Ma'lumotlaringizni to'ldiring"}
              </p>
            </div>

            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-3 rounded-2xl mb-6 text-sm text-center font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="flex flex-col gap-4 mb-6 w-full" autoComplete="off">
              
              {/* Ism yoki login */}
              <div className="bg-[#18181b]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 flex items-center shadow-inner focus-within:border-orange-500/50 transition-colors">
                <div className="pl-4 text-[#a1a1aa]">
                  <User className="w-5 h-5" />
                </div>
                <input 
                  type="text" 
                  required 
                  value={loginName} 
                  onChange={e => setLoginName(e.target.value)} 
                  className="!bg-transparent border-none outline-none text-white w-full p-4 placeholder-[#52525b] text-[16px] font-medium"
                  placeholder="Ism yoki login"
                  autoComplete="off"
                />
              </div>

              {/* Telefon raqam (Only for Registration) */}
              {!isLogin && (
                <div className="flex gap-3 h-[68px]">
                  <div className="bg-[#18181b]/80 backdrop-blur-xl border border-white/10 rounded-2xl px-4 flex items-center gap-2 shadow-inner shrink-0">
                    <span className="text-white font-bold text-[16px]">+998</span>
                  </div>
                  
                  <div className="bg-[#18181b]/80 backdrop-blur-xl border border-white/10 rounded-2xl flex-1 flex items-center shadow-inner overflow-hidden focus-within:border-orange-500/50 transition-colors">
                    <input 
                      type="tel" 
                      required 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                      className="!bg-transparent border-none outline-none text-white w-full h-full px-5 placeholder-[#52525b] text-[16px] font-medium tracking-wide"
                      placeholder="Telefon raqam"
                      autoComplete="off"
                    />
                  </div>
                </div>
              )}

              {/* Parol */}
              <div className="bg-[#18181b]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 flex items-center shadow-inner focus-within:border-orange-500/50 transition-colors">
                <div className="pl-4 text-[#a1a1aa]">
                  <Lock className="w-5 h-5" />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  required 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="!bg-transparent border-none outline-none text-white w-full p-4 placeholder-[#52525b] text-[16px] font-medium"
                  placeholder="Parol"
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="pr-4 text-[#a1a1aa] hover:text-white transition-colors">
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Parolni tasdiqlash (Only for Registration) */}
              {!isLogin && (
                <div className="bg-[#18181b]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 flex items-center shadow-inner focus-within:border-orange-500/50 transition-colors">
                  <div className="pl-4 text-[#a1a1aa]">
                    <Lock className="w-5 h-5" />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required 
                    value={confirmPassword} 
                    onChange={e => setConfirmPassword(e.target.value)} 
                    className="!bg-transparent border-none outline-none text-white w-full p-4 placeholder-[#52525b] text-[16px] font-medium"
                    placeholder="Parolni tasdiqlash"
                    autoComplete="new-password"
                  />
                </div>
              )}

              <button 
                type="submit" 
                disabled={loading}
                className="w-full h-[64px] rounded-2xl mt-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-[18px] shadow-[0_0_20px_rgba(249,115,22,0.3)] transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center"
              >
                {loading ? (
                  <div className="w-6 h-6 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  isLogin ? "Tizimga kirish" : "Ro'yxatdan o'tish"
                )}
              </button>
              
              {/* Toggle links */}
              <div className="mt-4 text-center">
                {isLogin ? (
                  <button type="button" onClick={() => { setActiveTab('register'); setError(""); }} className="text-[#a1a1aa] hover:text-white transition-colors text-[15px]">
                    Hisobingiz yo'qmi? <span className="text-orange-500 font-bold ml-1">Ro'yxatdan o'tish</span>
                  </button>
                ) : (
                  <button type="button" onClick={() => { setActiveTab('login'); setError(""); }} className="text-[#a1a1aa] hover:text-white transition-colors text-[15px]">
                    Allaqachon hisobingiz bormi? <span className="text-orange-500 font-bold ml-1">Tizimga kirish</span>
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

      </div>
    </div>
  );
}

