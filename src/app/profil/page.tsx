"use client";

import { useState, useEffect } from "react";
import { LogOut, User, Phone, Lock, Eye, EyeOff, Edit3, CheckCircle2, X, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Logo } from "@/components/Logo";

interface UserProfile {
  id: string;
  name: string;
  username: string | null;
  phone: string;
  role: string;
}

export default function ProfilPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    fetch("/api/auth/me")
      .then((r) => r.json())
      .then((data) => {
        if (data.id) {
          setUser(data);
          setName(data.name || "");
          setUsername(data.username || "");
          setPhone(data.phone || "");
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  };

  const handleSave = async () => {
    setError("");
    setSaving(true);
    try {
      const res = await fetch("/api/auth/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, username, phone, password, confirmPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Xatolik yuz berdi");
      setUser(data.user);
      setPassword("");
      setConfirmPassword("");
      setEditing(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const displayName = user?.username || user?.name || "Mijoz";
  const initials = displayName.slice(0, 2).toUpperCase();

  return (
    <div
      className="flex flex-col min-h-screen text-white font-sans pb-28"
      style={{ background: "radial-gradient(circle at top center, #1a1d2e 0%, #0d0f18 100%)" }}
    >
      {/* Success Toast */}
      {saveSuccess && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 bg-green-500/20 border border-green-500/30 rounded-2xl text-green-400 font-semibold text-[14px] shadow-lg backdrop-blur-md">
          <CheckCircle2 className="w-4 h-4" />
          Profil muvaffaqiyatli yangilandi!
        </div>
      )}

      {/* Header */}
      <div
        className="sticky top-0 z-30 px-5 py-4 flex items-center justify-between"
        style={{
          background: "rgba(17,19,30,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <h1 className="text-[18px] font-extrabold bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent">
          Profilim
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/15 text-red-400 text-[12px] font-semibold hover:bg-red-500/20 transition-all"
        >
          <LogOut className="w-3.5 h-3.5" />
          Chiqish
        </button>
      </div>

      <div className="flex flex-col items-center px-5 pt-8">
        {/* Avatar + Name Card */}
        <div
          className="w-full max-w-md rounded-[28px] p-6 flex flex-col items-center mb-6"
          style={{
            background: "linear-gradient(135deg, rgba(139,92,246,0.12) 0%, rgba(99,102,241,0.08) 100%)",
            border: "1px solid rgba(139,92,246,0.18)",
          }}
        >
          <div className="relative mb-4">
            <div
              className="w-20 h-20 rounded-[25%] flex items-center justify-center text-[28px] font-black text-white shadow-xl"
              style={{
                background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
                boxShadow: "0 0 32px rgba(139,92,246,0.35)",
              }}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                initials
              )}
            </div>
            <div className="absolute -bottom-2 -right-2">
              <Logo className="w-8 h-8 rounded-full border-2 border-[#11131e]" />
            </div>
          </div>

          <h2 className="text-[22px] font-extrabold text-white mb-1">
            {loading ? "..." : displayName}
          </h2>
          <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-indigo-500/15 text-indigo-400 border border-indigo-500/20">
            {user?.role === "ADMIN" ? "Administrator" : "Faol mijoz ✓"}
          </span>
        </div>

        {/* Profile Info / Edit Section */}
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-[15px] font-bold text-white">Mening profilim</h3>
            {!editing && user?.role !== "ADMIN" && (
              <button
                onClick={() => { setEditing(true); setError(""); }}
                className="flex items-center gap-1.5 text-[12px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
              >
                <Edit3 className="w-3.5 h-3.5" />
                Tahrirlash
              </button>
            )}
            {editing && (
              <button
                onClick={() => { setEditing(false); setError(""); setPassword(""); setConfirmPassword(""); }}
                className="flex items-center gap-1 text-[12px] font-semibold text-[#8e93a6] hover:text-white transition-colors"
              >
                <X className="w-3.5 h-3.5" />
                Bekor qilish
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-[13px] text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3">
            {/* Name */}
            <FieldRow
              icon={<User className="w-4 h-4 text-purple-400" />}
              iconBg="rgba(168,85,247,0.15)"
              label="Ism"
              editing={editing}
              value={name}
              display={user?.name || "—"}
              onChange={setName}
              placeholder="Ismingizni kiriting"
            />

            {/* Username */}
            <FieldRow
              icon={<span className="text-indigo-400 font-black text-[14px]">@</span>}
              iconBg="rgba(99,102,241,0.15)"
              label="Login"
              editing={editing}
              value={username}
              display={user?.username || "—"}
              onChange={setUsername}
              placeholder="Loginingizni kiriting"
            />

            {/* Phone */}
            <FieldRow
              icon={<Phone className="w-4 h-4 text-green-400" />}
              iconBg="rgba(34,197,94,0.15)"
              label="Telefon raqam"
              editing={editing}
              value={phone}
              display={user?.phone || "—"}
              onChange={setPhone}
              placeholder="+998 90 123 45 67"
              inputType="tel"
            />

            {/* Password fields — editing only */}
            {editing && (
              <>
                <div
                  className="flex items-center gap-4 px-5 py-4 rounded-[20px]"
                  style={{ background: "rgba(35,38,58,0.6)", border: "1px solid rgba(139,92,246,0.25)" }}
                >
                  <div className="w-9 h-9 rounded-[12px] bg-orange-500/15 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-[#5c6175] uppercase tracking-wider mb-0.5">Yangi parol</p>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent text-white text-[15px] font-semibold outline-none placeholder-[#5c6175]"
                      placeholder="Bo'sh qoldirsangiz o'zgarmaydi"
                    />
                  </div>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#5c6175] hover:text-white shrink-0">
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                <div
                  className="flex items-center gap-4 px-5 py-4 rounded-[20px]"
                  style={{ background: "rgba(35,38,58,0.6)", border: "1px solid rgba(139,92,246,0.25)" }}
                >
                  <div className="w-9 h-9 rounded-[12px] bg-orange-500/15 flex items-center justify-center shrink-0">
                    <Lock className="w-4 h-4 text-orange-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-[#5c6175] uppercase tracking-wider mb-0.5">Parolni tasdiqlash</p>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-transparent text-white text-[15px] font-semibold outline-none placeholder-[#5c6175]"
                      placeholder="Parolni qayta kiriting"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-4 rounded-[20px] font-extrabold text-[15px] text-white transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 mt-1"
                  style={{
                    background: "linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)",
                    boxShadow: "0 0 20px rgba(139,92,246,0.3)",
                  }}
                >
                  {saving ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Saqlanmoqda...
                    </span>
                  ) : "Saqlash ✓"}
                </button>
              </>
            )}
          </div>

          {!editing && (
            <div className="mt-6 flex flex-col gap-2">
              <button
                onClick={() => router.push("/orders")}
                className="flex items-center justify-between px-5 py-4 rounded-[20px] transition-all hover:bg-[#23263a]/80"
                style={{ background: "rgba(35,38,58,0.4)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <span className="text-[14px] font-semibold text-[#8e93a6]">Buyurtmalarim</span>
                <ChevronRight className="w-4 h-4 text-[#5c6175]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Reusable field row component
function FieldRow({
  icon, iconBg, label, editing, value, display, onChange, placeholder, inputType = "text",
}: {
  icon: React.ReactNode;
  iconBg: string;
  label: string;
  editing: boolean;
  value: string;
  display: string;
  onChange: (v: string) => void;
  placeholder: string;
  inputType?: string;
}) {
  return (
    <div
      className="flex items-center gap-4 px-5 py-4 rounded-[20px] transition-all"
      style={{
        background: "rgba(35,38,58,0.6)",
        border: editing ? "1px solid rgba(139,92,246,0.25)" : "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        className="w-9 h-9 rounded-[12px] flex items-center justify-center shrink-0"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold text-[#5c6175] uppercase tracking-wider mb-0.5">{label}</p>
        {editing ? (
          <input
            type={inputType}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent text-white text-[15px] font-semibold outline-none placeholder-[#5c6175]"
            placeholder={placeholder}
          />
        ) : (
          <p className="text-[15px] font-semibold text-white truncate">{display}</p>
        )}
      </div>
    </div>
  );
}
