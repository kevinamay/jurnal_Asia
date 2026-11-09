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
  ShieldCheck,
  CheckCircle2,
  Building2,
  Sparkles,
} from "lucide-react";

export function Variant1SplitHero() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("staf.keuangan@asiaplastik.com");
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
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 font-sans text-slate-900">
      {/* LEFT COLUMN: HERO INDUSTRIAL PRESENTATION */}
      <div className="lg:w-1/2 bg-gradient-to-br from-sky-500/10 via-sky-50/80 to-white p-8 lg:p-16 flex flex-col justify-between border-b lg:border-b-0 lg:border-r border-sky-100 relative overflow-hidden">
        {/* Ambient background decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-sky-200/30 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100/40 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        {/* Top Logo */}
        <div className="relative z-10">
          <div className="bg-white/90 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-soft border border-slate-200/80 inline-block">
            <Image
              src="/logos/logo.webp"
              alt="CV ASIA PLASTIK"
              width={180}
              height={60}
              className="h-8 w-auto object-contain"
              priority
            />
          </div>
        </div>

        {/* Middle Content */}
        <div className="relative z-10 my-10 max-w-lg space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-100/80 border border-sky-200 text-sky-700 text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-sky-600" />
            <span>Sistem Informasi Akuntansi & Operasional Pabrik</span>
          </div>

          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Akses Terpadu Keuangan & Logistik <span className="text-sky-600">CV Asia Plastik</span>
          </h1>

          <p className="text-sm text-slate-600 leading-relaxed">
            Portal resmi otorisasi transaksi manufaktur, pencatatan jurnal umum, monitoring kas riil, dan sinkronisasi logistik pallet industri.
          </p>

          {/* Value points */}
          <div className="space-y-3 pt-2">
            {[
              "Enkripsi perbankan 256-bit & verifikasi staf berlapis",
              "Pencatatan otomatis jurnal buku besar & rekonsiliasi kas",
              "Sesuai standar operasional ISO 9001 Manufaktur Plastik",
            ].map((text, idx) => (
              <div key={idx} className="flex items-center gap-2.5 text-xs text-slate-700 font-medium">
                <div className="w-5 h-5 rounded-full bg-sky-500/10 text-sky-600 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Status Card */}
        <div className="relative z-10 pt-6 border-t border-sky-200/60 flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium text-slate-700">Pabrik Rungkut Surabaya • Server Online</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400">v2.4 Production</span>
        </div>
      </div>

      {/* RIGHT COLUMN: CLEAN LOGIN FORM */}
      <div className="lg:w-1/2 p-6 lg:p-16 flex items-center justify-center bg-white">
        <div className="w-full max-w-md space-y-7">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-sky-600 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
              Otorisasi Staf Masuk
            </span>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-2.5">
              Selamat Datang Kembali
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Silakan masukkan email perusahaan atau NIK Anda untuk melanjutkan.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            {/* Input Email */}
            <div>
              <label className="block font-bold text-slate-700 mb-1.5">
                Email Perusahaan / NIK Staf
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staf@asiaplastik.com atau NIK 6-digit"
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                  required
                />
              </div>
            </div>

            {/* Input Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
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
                  placeholder="Masukkan kata sandi akun"
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember me checkbox */}
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-4 h-4 rounded text-sky-500 border-slate-300 focus:ring-sky-400"
                />
                <span className="text-xs text-slate-600">Ingat perangkat ini selama 30 hari</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-500/25 hover:shadow-lg transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer disabled:opacity-70 active:scale-[0.99]"
            >
              {isLoading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  <span>Memverifikasi Akses...</span>
                </span>
              ) : (
                <>
                  <span>Masuk ke Dashboard Sistem</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="pt-6 border-t border-slate-100 text-center text-xs text-slate-500">
            <span>Belum memiliki akses staf? </span>
            <Link
              href="/register"
              className="font-bold text-sky-600 hover:text-sky-700 hover:underline"
            >
              Ajukan Registrasi Akun Baru
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
