"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Shield,
  KeyRound,
  CheckCircle2,
} from "lucide-react";

export function Variant2Glassmorphism() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("rian.kusuma@asiaplastik.com");
  const [password, setPassword] = useState("••••••••••••");
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-radial-gradient from-sky-100/70 via-slate-50 to-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans text-slate-900 pb-24">
      {/* Ambient sky blue gradient orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-sky-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-300/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Brand Header */}
      <div className="relative z-10 mb-6 text-center">
        <div className="bg-white/85 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-soft border border-slate-200/80 inline-block">
          <Image
            src="/logos/logo.webp"
            alt="CV ASIA PLASTIK"
            width={190}
            height={64}
            className="h-9 w-auto object-contain mx-auto"
            priority
          />
        </div>
      </div>

      {/* Main Glassmorphism Login Card */}
      <div className="relative z-10 w-full max-w-md bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-white/70 shadow-[0_20px_50px_rgba(14,165,233,0.12)]">
        {/* Card Header */}
        <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 px-2.5 py-0.5 rounded-full border border-sky-200">
              Autentikasi Staf Terverifikasi
            </span>
            <h2 className="text-xl font-bold text-slate-900 mt-2">Masuk ke Akun Staf</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Masukkan kredensial resmi CV. Asia Plastik Anda
            </p>
          </div>
          <div className="w-10 h-10 rounded-2xl bg-sky-50 text-sky-600 border border-sky-100 flex items-center justify-center shrink-0">
            <KeyRound className="w-5 h-5" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {/* Input Email / User */}
          <div>
            <label className="block font-bold text-slate-700 mb-1">
              Email Perusahaan / Akun Staf
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="nama@asiaplastik.com"
                className="w-full pl-10 pr-3.5 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                required
              />
            </div>
          </div>

          {/* Input Password */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block font-bold text-slate-700">Kata Sandi</label>
              <Link
                href="/auth?forgot=true"
                className="text-[11px] font-semibold text-sky-600 hover:text-sky-700 hover:underline"
              >
                Lupa kata sandi?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full pl-10 pr-10 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all font-mono"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember me & Security status */}
          <div className="flex items-center justify-between pt-1">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded text-sky-500 border-slate-300 focus:ring-sky-400"
              />
              <span className="text-[11px] text-slate-600">Simpan sesi login ini</span>
            </label>
            <span className="text-[10px] text-emerald-600 font-medium flex items-center gap-1">
              <Shield className="w-3 h-3" />
              256-bit SSL
            </span>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-70 active:scale-[0.99]"
          >
            {isLoading ? (
              <span className="inline-flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                <span>Mengautentikasi...</span>
              </span>
            ) : (
              <>
                <span>Masuk ke Dashboard Sistem</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer info */}
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Staf baru?</span>
          <Link
            href="/register"
            className="font-bold text-sky-600 hover:text-sky-700 hover:underline"
          >
            Aktivasi 2FA Akun Staf →
          </Link>
        </div>
      </div>
    </div>
  );
}
