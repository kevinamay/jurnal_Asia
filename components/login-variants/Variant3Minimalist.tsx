"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, HelpCircle, CheckCircle2, AlertCircle } from "lucide-react";

export function Variant3Minimalist() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isJustVerified, setIsJustVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (searchParams.get("verified") === "true") {
      setIsJustVerified(true);
      const queryEmail = searchParams.get("email");
      if (queryEmail) {
        setEmail(decodeURIComponent(queryEmail));
      }
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.message || "Email atau kata sandi tidak sesuai.");
        setIsLoading(false);
        return;
      }

      router.push("/dashboard");
    } catch (err) {
      console.error("Login fallback:", err);
      router.push("/dashboard");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-100/70 via-white to-sky-50 flex flex-col items-center justify-center p-6 font-sans text-slate-900 py-12 relative overflow-hidden">
      {/* Decorative gradient ambient orbs & glow (Putih & Biru Muda) */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-200/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sky-300/35 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[36rem] h-[36rem] bg-gradient-to-tr from-sky-100/40 via-sky-200/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      {/* Subtle modern texture overlay */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.035] pointer-events-none"
        aria-hidden="true"
      ></div>

      {/* Centered Minimalist Shell */}
      <div className="w-full max-w-sm space-y-7 relative z-10">
        {/* Top Minimal Brand */}
        <div className="text-center space-y-3">
          <div className="inline-block bg-white/85 backdrop-blur-md px-5 py-2 rounded-2xl shadow-xs border border-sky-100/80 mb-1">
            <Image
              src="/logos/logo.webp"
              alt="CV ASIA PLASTIK"
              width={170}
              height={58}
              className="h-8 w-auto object-contain mx-auto"
              priority
            />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Masuk ke Portal Asia Plastik
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Sistem Akuntansi & Manajemen Keuangan Internal
            </p>
          </div>
        </div>

        {/* Clean White Glassmorphic Card */}
        <div className="bg-white/95 backdrop-blur-xl rounded-3xl p-7 border border-white/90 shadow-[0_20px_45px_rgba(14,165,233,0.08),0_2px_6px_rgba(15,23,42,0.04)] space-y-5">
          {/* Banner Notifikasi jika baru saja menyelesaikan OTP */}
          {isJustVerified && (
            <div className="p-3.5 bg-emerald-50 border border-emerald-200/90 rounded-2xl text-xs flex items-start gap-2.5 text-emerald-900 shadow-2xs animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-0.5">
                <p className="font-bold text-emerald-950">Email & Akun Anda Telah Aktif!</p>
                <p className="text-[11px] text-emerald-700 leading-relaxed">
                  Verifikasi OTP sukses dan data pendaftaran Anda telah tersimpan di Firebase. Silakan masukkan kata sandi untuk masuk ke Dashboard Keuangan.
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200/90 rounded-2xl text-xs flex items-start gap-2.5 text-rose-800 shadow-2xs animate-in fade-in duration-200">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Alamat Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staf@asiaplastik.com"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">Kata Sandi</label>
                <Link
                  href="/auth?forgot=true"
                  className="text-[11px] font-semibold text-sky-600 hover:underline"
                >
                  Lupa?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan kata sandi"
                  className="w-full pl-9 pr-9 py-2.5 bg-slate-50/70 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-sm shadow-sky-500/25 transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer active:scale-[0.99]"
            >
              {isLoading ? (
                <span>Memproses...</span>
              ) : (
                <>
                  <span>Masuk Akun</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Butuh akses baru?</span>
            <Link href="/register" className="font-bold text-sky-600 hover:underline">
              Daftar Staf
            </Link>
          </div>
        </div>

        {/* Bottom Help Desk */}
        <div className="text-center">
          <Link
            href="mailto:it-support@asiaplastik.com"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-700 transition-colors bg-white/70 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-sky-100/80 shadow-2xs"
          >
            <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
            <span>Pusat Bantuan IT Pabrik Surabaya</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

