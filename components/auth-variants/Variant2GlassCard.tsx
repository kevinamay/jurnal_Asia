"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Mail,
  Phone,
  User,
  Lock,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  Sparkles,
  ArrowLeft,
  Key,
} from "lucide-react";

export function Variant2GlassCard() {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Register, 2: Channel, 3: OTP
  const [channel, setChannel] = useState<"wa" | "email">("wa");
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <div className="min-h-screen w-full bg-radial-gradient from-sky-100/60 via-slate-50 to-white flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Decorative gradient ambient orbs */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-sky-200/40 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-sky-300/30 rounded-full blur-3xl pointer-events-none"></div>

      {/* Brand Header */}
      <div className="relative z-10 mb-6 text-center">
        <div className="bg-white/80 backdrop-blur-md px-5 py-2.5 rounded-2xl shadow-soft border border-slate-200/80 inline-block">
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

      {/* Main Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-lg bg-white/90 backdrop-blur-xl rounded-3xl p-8 border border-white/60 shadow-elevation">
        {/* Step Indicator Header */}
        <div className="mb-6 pb-4 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 px-2.5 py-0.5 rounded-full border border-sky-200">
              Verifikasi 2FA // Keamanan Akun
            </span>
          </div>
          {/* Step Pill */}
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-500">
            <span className={`w-5 h-5 rounded-full flex items-center justify-center ${step >= 1 ? "bg-sky-500 text-white" : "bg-slate-200"}`}>1</span>
            <span className="w-3 h-0.5 bg-slate-200"></span>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center ${step >= 2 ? "bg-sky-500 text-white" : "bg-slate-200"}`}>2</span>
            <span className="w-3 h-0.5 bg-slate-200"></span>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center ${step >= 3 ? "bg-sky-500 text-white" : "bg-slate-200"}`}>3</span>
          </div>
        </div>

        {/* STEP 1: REGISTRATION FORM */}
        {step === 1 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Registrasi Akun Staf</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Masukkan identitas dan nomor kontak untuk proses verifikasi dua langkah (2FA)
              </p>
            </div>

            <div className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-slate-700 mb-1">Nama Lengkap</label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    defaultValue="Rian Kusuma"
                    placeholder="Nama lengkap"
                    className="w-full pl-9 pr-3 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Perusahaan</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    defaultValue="rian@asiaplastik.com"
                    placeholder="email@asiaplastik.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    defaultValue="081398765432"
                    placeholder="0813xxxxxxxx"
                    className="w-full pl-9 pr-3 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-sm shadow-sky-500/30 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer"
            >
              <span>Lanjut: Pilih Metode Pengiriman OTP</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="pt-4 border-t border-slate-100 text-center text-[11px] text-slate-500">
              <span>Sudah memiliki akun terdaftar? </span>
              <Link href="/login" className="font-bold text-sky-600 hover:text-sky-700 hover:underline">
                Masuk di sini
              </Link>
            </div>
          </div>
        )}

        {/* STEP 2: CHANNEL SELECTION */}
        {step === 2 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Pilih Metode Verifikasi</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Tentukan kemana sistem harus mengirimkan 6-digit kode keamanan
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setChannel("wa")}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  channel === "wa"
                    ? "border-sky-500 bg-sky-50/70 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-emerald-500 text-white flex items-center justify-center mb-2">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-slate-900">WhatsApp</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Kirim instan ke nomor WA 081398765432</p>
              </button>

              <button
                type="button"
                onClick={() => setChannel("email")}
                className={`p-4 rounded-2xl border-2 text-left transition-all ${
                  channel === "email"
                    ? "border-sky-500 bg-sky-50/70 shadow-sm"
                    : "border-slate-200 hover:border-slate-300 bg-white"
                }`}
              >
                <div className="w-9 h-9 rounded-xl bg-sky-500 text-white flex items-center justify-center mb-2">
                  <Mail className="w-5 h-5" />
                </div>
                <h4 className="font-bold text-xs text-slate-900">Email Kantor</h4>
                <p className="text-[10px] text-slate-500 mt-0.5">Kirim ke rian@asiaplastik.com</p>
              </button>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setStep(1)}
                className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
              >
                Kembali
              </button>
              <button
                onClick={() => setStep(3)}
                className="w-2/3 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5"
              >
                <span>Kirim Kode OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: OTP VERIFICATION */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <h2 className="text-xl font-bold text-slate-900">Verifikasi Kode OTP</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Masukkan 6 angka yang dikirimkan ke{" "}
                <strong>{channel === "wa" ? "WhatsApp (081398765432)" : "Email (rian@asiaplastik.com)"}</strong>
              </p>
            </div>

            {isSuccess ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-2xl text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto mb-2" />
                <h4 className="font-bold text-sm text-emerald-900">Akun Berhasil Diaktifkan!</h4>
                <p className="text-xs text-emerald-700 mt-1">Anda sekarang dapat masuk ke Dashboard Finansial.</p>
                <Link href="/dashboard" className="inline-block mt-3 px-4 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all">
                  Buka Dashboard
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex justify-center gap-2">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      defaultValue={i === 0 ? "7" : i === 1 ? "4" : ""}
                      className="w-11 h-12 text-center text-lg font-bold font-mono bg-white border border-slate-200 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none shadow-xs"
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                  <span>Masa berlaku: <strong className="text-sky-600 font-mono">01:52</strong></span>
                  <button className="text-sky-600 hover:underline font-bold">Kirim Ulang</button>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    onClick={() => setStep(2)}
                    className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl"
                  >
                    Ganti Jalur
                  </button>
                  <button
                    onClick={() => setIsSuccess(true)}
                    className="w-2/3 py-2.5 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-xl shadow-sm"
                  >
                    Konfirmasi OTP
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

