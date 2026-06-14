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
      style={{ background: "var(--bg-deep)" }}
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
          background: "rgba(9,9,11,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <h1 className="text-[20px] font-black tracking-tight text-white drop-shadow-md">
          Profilim
        </h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/15 text-red-500 text-[13px] font-bold hover:bg-red-500/20 transition-all active:scale-95"
        >
          <LogOut className="w-4 h-4" />
          Chiqish
        </button>
      </div>

      <div className="flex flex-col items-center px-5 pt-8">
        {/* Avatar + Name Card */}
        <div
          className="w-full max-w-md rounded-[28px] p-6 flex flex-col items-center mb-6 shadow-lg"
          style={{
            background: "linear-gradient(135deg, rgba(249,115,22,0.1) 0%, rgba(234,88,12,0.05) 100%)",
            border: "1px solid rgba(249,115,22,0.15)",
          }}
        >
          <div className="relative mb-4">
            <div
              className="w-24 h-24 rounded-[25%] flex items-center justify-center text-[32px] font-black text-white shadow-xl"
              style={{
                background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                boxShadow: "0 0 32px rgba(249,115,22,0.3)",
              }}
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                initials
              )}
            </div>
            <div className="absolute -bottom-2 -right-2">
              <Logo className="w-10 h-10 rounded-full border-[3px] border-[#09090b]" />
            </div>
          </div>

          <h2 className="text-[24px] font-black text-white mb-1">
            {loading ? "Yuklanmoqda..." : displayName}
          </h2>
          <span className="px-4 py-1.5 rounded-full text-[12px] font-bold bg-orange-500/15 text-orange-500 border border-orange-500/20">
            {user?.role === "ADMIN" ? "Administrator" : "Faol mijoz ✓"}
          </span>
        </div>

        {/* Profile Info / Edit Section */}
        <div className="w-full max-w-md">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-[16px] font-black text-white">Mening profilim</h3>
            {!editing && user?.role !== "ADMIN" && (
              <button
                onClick={() => { setEditing(true); setError(""); }}
                className="flex items-center gap-1.5 text-[13px] font-bold text-orange-500 hover:text-orange-400 transition-colors"
              >
                <Edit3 className="w-4 h-4" />
                Tahrirlash
              </button>
            )}
            {editing && (
              <button
                onClick={() => { setEditing(false); setError(""); setPassword(""); setConfirmPassword(""); }}
                className="flex items-center gap-1 text-[13px] font-bold text-[#a1a1aa] hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
                Bekor qilish
              </button>
            )}
          </div>

          {error && (
            <div className="mb-4 px-4 py-3 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-500 text-[13px] font-medium text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-3">
            {/* Name */}
            <FieldRow
              icon={<User className="w-5 h-5 text-orange-500" />}
              iconBg="rgba(249,115,22,0.15)"
              label="Ism"
              editing={editing}
              value={name}
              display={user?.name || "—"}
              onChange={setName}
              placeholder="Ismingizni kiriting"
            />

            {/* Username */}
            <FieldRow
              icon={<span className="text-orange-500 font-black text-[18px]">@</span>}
              iconBg="rgba(249,115,22,0.15)"
              label="Login"
              editing={editing}
              value={username}
              display={user?.username || "—"}
              onChange={setUsername}
              placeholder="Loginingizni kiriting"
            />

            {/* Phone */}
            <FieldRow
              icon={<Phone className="w-5 h-5 text-green-500" />}
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
                  style={{ background: "rgba(24,24,27,0.8)", border: "1px solid rgba(249,115,22,0.3)" }}
                >
                  <div className="w-10 h-10 rounded-[12px] bg-yellow-500/15 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-[#a1a1aa] uppercase tracking-wider mb-0.5">Yangi parol</p>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-transparent text-white text-[16px] font-bold outline-none placeholder-[#52525b]"
                      placeholder="Bo'sh qoldirsangiz o'zgarmaydi"
                    />
                  </div>
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#a1a1aa] hover:text-white shrink-0 transition-colors">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>

                <div
                  className="flex items-center gap-4 px-5 py-4 rounded-[20px]"
                  style={{ background: "rgba(24,24,27,0.8)", border: "1px solid rgba(249,115,22,0.3)" }}
                >
                  <div className="w-10 h-10 rounded-[12px] bg-yellow-500/15 flex items-center justify-center shrink-0">
                    <Lock className="w-5 h-5 text-yellow-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-[#a1a1aa] uppercase tracking-wider mb-0.5">Parolni tasdiqlash</p>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-transparent text-white text-[16px] font-bold outline-none placeholder-[#52525b]"
                      placeholder="Parolni qayta kiriting"
                    />
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="w-full py-4.5 rounded-[20px] font-black text-[16px] text-white transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 mt-2 flex items-center justify-center gap-2"
                  style={{
                    background: "linear-gradient(135deg, #f97316 0%, #ea580c 100%)",
                    boxShadow: "0 0 20px rgba(249,115,22,0.3)",
                  }}
                >
                  {saving ? (
                    <>
                      <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
                      Saqlanmoqda...
                    </>
                  ) : "Saqlash ✓"}
                </button>
              </>
            )}
          </div>

          {!editing && (
            <div className="mt-6 flex flex-col gap-3">
              <button
                onClick={() => router.push("/orders")}
                className="flex items-center justify-between px-6 py-5 rounded-[20px] transition-all hover:bg-[#27272a] active:scale-[0.98]"
                style={{ background: "rgba(24,24,27,0.8)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <span className="text-[16px] font-bold text-white">Buyurtmalarim</span>
                <ChevronRight className="w-5 h-5 text-[#a1a1aa]" />
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
        background: "rgba(24,24,27,0.8)",
        border: editing ? "1px solid rgba(249,115,22,0.3)" : "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div
        className="w-10 h-10 rounded-[12px] flex items-center justify-center shrink-0"
        style={{ background: iconBg }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[11px] font-bold text-[#a1a1aa] uppercase tracking-wider mb-0.5">{label}</p>
        {editing ? (
          <input
            type={inputType}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-transparent text-white text-[16px] font-bold outline-none placeholder-[#52525b]"
            placeholder={placeholder}
          />
        ) : (
          <p className="text-[16px] font-bold text-white truncate">{display}</p>
        )}
      </div>
    </div>
  );
}
