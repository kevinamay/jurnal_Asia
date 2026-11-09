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
  Server,
  Activity,
  Headphones,
  ShieldCheck,
  Clock,
  MapPin,
} from "lucide-react";

export function Variant6BentoGrid() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("staff@asiaplastik.com");
  const [password, setPassword] = useState("••••••••••••");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex items-center justify-center p-4 lg:p-10 font-sans text-slate-900 pb-24">
      <div className="w-full max-w-4xl space-y-4">
        {/* Top Minimal Branding */}
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-3">
            <Image
              src="/logos/logo.webp"
              alt="CV ASIA PLASTIK"
              width={160}
              height={55}
              className="h-7 w-auto object-contain"
              priority
            />
            <span className="text-xs font-bold text-slate-400 hidden sm:inline">|</span>
            <span className="text-xs font-semibold text-slate-500 hidden sm:inline">
              Enterprise Resource Login
            </span>
          </div>
          <span className="text-[11px] font-bold text-sky-700 bg-sky-50 px-3 py-1 rounded-full border border-sky-200">
            Node: Surabaya-HQ-01
          </span>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {/* TILE 1 (8 COLS): MAIN LOGIN CARD */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-7 border border-slate-200 shadow-soft space-y-6">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-sky-700 bg-sky-50 px-2.5 py-0.5 rounded-full border border-sky-200">
                Pintu Masuk Terotentikasi
              </span>
              <h2 className="text-2xl font-black text-slate-900 mt-2 tracking-tight">
                Portal Akuntansi Staf
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Akses buku besar, faktur pengiriman, dan pembukuan CV. Asia Plastik.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
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
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">Kata Sandi</label>
                  <Link href="/auth?forgot=true" className="text-[11px] font-semibold text-sky-600 hover:underline">
                    Lupa password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all font-mono"
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

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer active:scale-[0.99]"
              >
                {isLoading ? (
                  <span>Mengautentikasi...</span>
                ) : (
                  <>
                    <span>Masuk ke Dashboard Sistem</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Belum memiliki kredensial staf?</span>
              <Link href="/register" className="font-bold text-sky-600 hover:underline">
                Registrasi Akun Baru →
              </Link>
            </div>
          </div>

          {/* TILE 2 & 3 (5 COLS): STATUS & HELPDESK SIDE BENTO */}
          <div className="lg:col-span-5 space-y-4 flex flex-col justify-between">
            {/* Server Status Tile */}
            <div className="bg-gradient-to-br from-sky-50/80 via-white to-sky-100/40 rounded-3xl p-6 border border-sky-100 shadow-soft space-y-4">
              <div className="flex items-center justify-between">
                <span className="w-8 h-8 rounded-xl bg-sky-500 text-white flex items-center justify-center shadow-xs">
                  <Server className="w-4 h-4" />
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                  Semua Sistem Normal
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-slate-900">Operasional Pabrik Aktif</h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  Shift Pagi: 07.00 - 15.00 WIB • Rungkut Industri Surabaya
                </p>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-1 border-t border-sky-100/80 text-[11px]">
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                  <span>Uptime: 99.98%</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-600">
                  <Activity className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Latensi: 14 ms</span>
                </div>
              </div>
            </div>

            {/* Helpdesk & Support Tile */}
            <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-sky-50 text-sky-600 border border-sky-200 flex items-center justify-center">
                  <Headphones className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="font-bold text-xs text-slate-900">Bantuan IT & Akun Terkunci</h4>
                  <p className="text-[10px] text-slate-500">Layanan reset sandi darurat teknis pabrik</p>
                </div>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-100 text-[11px] text-slate-600 flex items-center justify-between">
                <span>WhatsApp IT Desk:</span>
                <strong className="text-sky-700 font-mono">+62 811-322-9988</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
