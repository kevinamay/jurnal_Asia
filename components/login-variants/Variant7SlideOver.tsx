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
  ShieldAlert,
  BarChart3,
  TrendingUp,
  Receipt,
  DollarSign,
  LockKeyhole,
} from "lucide-react";

export function Variant7SlideOver() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("manager.keuangan@asiaplastik.com");
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
    <div className="min-h-screen w-full relative overflow-hidden font-sans text-slate-900 flex pb-20">
      {/* BACKGROUND: BLURRED / LOCKED REAL DASHBOARD PREVIEW */}
      <div className="absolute inset-0 bg-slate-100/80 p-8 flex flex-col justify-between filter blur-[6px] select-none pointer-events-none opacity-60">
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-sky-500 rounded-xl"></div>
            <div className="space-y-1">
              <div className="w-32 h-4 bg-slate-300 rounded"></div>
              <div className="w-48 h-3 bg-slate-200 rounded"></div>
            </div>
          </div>
          <div className="w-40 h-8 bg-slate-200 rounded-lg"></div>
        </div>

        <div className="grid grid-cols-4 gap-4 my-8">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-white rounded-2xl p-4 shadow-sm space-y-3">
              <div className="w-1/2 h-3 bg-slate-200 rounded"></div>
              <div className="w-3/4 h-6 bg-slate-300 rounded"></div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-12 gap-6 h-64">
          <div className="col-span-8 bg-white rounded-2xl shadow-sm"></div>
          <div className="col-span-4 bg-white rounded-2xl shadow-sm"></div>
        </div>
      </div>

      {/* DIM OVERLAY */}
      <div className="absolute inset-0 bg-slate-900/30 backdrop-blur-[2px]"></div>

      {/* SLIDE-OVER FLOATING LOGIN PANEL ON THE RIGHT */}
      <div className="relative z-20 w-full max-w-md ml-auto min-h-screen bg-white/95 backdrop-blur-xl border-l border-white/60 shadow-2xl p-8 lg:p-10 flex flex-col justify-between">
        {/* Top Header */}
        <div>
          <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-100">
            <Image
              src="/logos/logo.webp"
              alt="CV ASIA PLASTIK"
              width={160}
              height={55}
              className="h-8 w-auto object-contain"
              priority
            />
            <span className="flex items-center gap-1.5 text-[11px] font-bold text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full border border-sky-200">
              <LockKeyhole className="w-3 h-3 text-sky-600" />
              Sesi Terkunci
            </span>
          </div>

          <div className="space-y-2 mb-6">
            <h2 className="text-2xl font-black text-slate-900 tracking-tight">
              Buka Akses Dashboard
            </h2>
            <p className="text-xs text-slate-500">
              Silakan masukkan kredensial akun staf untuk membuka sistem pelaporan kas pabrik.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Perusahaan</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">Kata Sandi</label>
                <Link href="/auth?forgot=true" className="text-[11px] font-semibold text-sky-600 hover:underline">
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none transition-all font-mono"
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-md shadow-sky-500/20 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer active:scale-[0.99]"
            >
              {isLoading ? (
                <span>Membuka Kunci Sistem...</span>
              ) : (
                <>
                  <span>Buka Akses Dashboard Keuangan</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Bottom Panel Help */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span>Staf baru?</span>
          <Link href="/register" className="font-bold text-sky-600 hover:underline">
            Aktivasi Akun di Sini →
          </Link>
        </div>
      </div>
    </div>
  );
}
