"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, Eye, EyeOff, ArrowRight, HelpCircle } from "lucide-react";

export function Variant3Minimalist() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("sarah.jenkins@asiaplastik.com");
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
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-6 font-sans text-slate-900 pb-24">
      {/* Centered Minimalist Shell */}
      <div className="w-full max-w-sm space-y-8">
        {/* Top Minimal Brand */}
        <div className="text-center space-y-3">
          <Image
            src="/logos/logo.webp"
            alt="CV ASIA PLASTIK"
            width={170}
            height={58}
            className="h-8 w-auto object-contain mx-auto"
            priority
          />
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900">
              Masuk ke KledoFlow
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Sistem Akuntansi Internal CV. Asia Plastik
            </p>
          </div>
        </div>

        {/* Clean White Card */}
        <div className="bg-white rounded-3xl p-7 border border-slate-200/90 shadow-sm space-y-5">
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
              className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer active:scale-[0.99]"
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
            className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Pusat Bantuan IT Pabrik Surabaya</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
