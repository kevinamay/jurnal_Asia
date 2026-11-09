"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Key,
  MessageCircle,
  Mail,
  Lock,
  Phone,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle2,
} from "lucide-react";

export function Variant5DualMethod() {
  const router = useRouter();
  const [method, setMethod] = useState<"password" | "otp">("password");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("staf.operasional@asiaplastik.com");
  const [password, setPassword] = useState("••••••••••••");
  const [phone, setPhone] = useState("081398765432");
  const [otpSent, setOtpSent] = useState(false);
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  };

  const handleSendOtp = () => {
    setOtpSent(true);
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-900 pb-24">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="bg-white px-5 py-2.5 rounded-2xl shadow-soft border border-slate-200/80 inline-block">
            <Image
              src="/logos/logo.webp"
              alt="CV ASIA PLASTIK"
              width={180}
              height={60}
              className="h-8 w-auto object-contain mx-auto"
              priority
            />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Masuk ke Sistem Keuangan</h1>
          <p className="text-xs text-slate-500">Pilih metode autentikasi yang Anda inginkan</p>
        </div>

        {/* Dual Mode Switcher */}
        <div className="grid grid-cols-2 p-1.5 bg-slate-100/90 rounded-2xl border border-slate-200/80 gap-1.5">
          <button
            type="button"
            onClick={() => setMethod("password")}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              method === "password"
                ? "bg-white text-sky-700 shadow-sm border border-slate-200/70"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <Key className="w-3.5 h-3.5 text-sky-600" />
            <span>Kata Sandi Akun</span>
          </button>

          <button
            type="button"
            onClick={() => setMethod("otp")}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              method === "otp"
                ? "bg-white text-emerald-700 shadow-sm border border-slate-200/70"
                : "text-slate-600 hover:text-slate-900"
            }`}
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>OTP WhatsApp Cepat</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-soft">
          {method === "password" ? (
            /* METHOD 1: STANDARD PASSWORD */
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Email Perusahaan / NIK
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
                  <span>Memverifikasi...</span>
                ) : (
                  <>
                    <span>Masuk dengan Kata Sandi</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* METHOD 2: WHATSAPP OTP FAST LOGIN */
            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">
                  Nomor WhatsApp Terdaftar
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-emerald-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                    required
                  />
                </div>
              </div>

              {!otpSent ? (
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Kirim Kode OTP ke WhatsApp</span>
                </button>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 pt-1">
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-start gap-2.5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="text-[11px] text-emerald-800">
                      <p className="font-bold">Kode OTP 6-Digit Terkirim!</p>
                      <p className="text-emerald-700 mt-0.5">Cek notifikasi WhatsApp pada nomor {phone}.</p>
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-2 text-center">
                      Masukkan 6 Angka Kode OTP
                    </label>
                    <div className="flex justify-center gap-2">
                      {[0, 1, 2, 3, 4, 5].map((i) => (
                        <input
                          key={i}
                          type="text"
                          maxLength={1}
                          defaultValue={i === 0 ? "8" : i === 1 ? "2" : ""}
                          className="w-10 h-11 text-center font-mono font-bold text-base bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none shadow-xs"
                        />
                      ))}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 mt-2 cursor-pointer"
                  >
                    <span>Verifikasi & Masuk Dashboard</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              )}
            </div>
          )}

          <div className="mt-5 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-500">
            <span>Staf baru belum memiliki akun? </span>
            <Link href="/register" className="font-bold text-sky-600 hover:underline">
              Daftar di sini
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
