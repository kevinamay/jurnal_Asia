"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ShieldCheck,
  Mail,
  Phone,
  User,
  Lock,
  ArrowRight,
  MessageSquare,
  CheckCircle2,
  Clock,
  KeyRound,
  RotateCcw,
  Sparkles,
} from "lucide-react";

export function Variant8FullPortal() {
  const [activeTab, setActiveTab] = useState<"step1-reg" | "step2-channel" | "step3-otp" | "login">("step1-reg");
  const [channel, setChannel] = useState<"whatsapp" | "email">("whatsapp");
  const [otpDigits, setOtpDigits] = useState(["4", "8", "1", "9", "", ""]);
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-between p-4 lg:p-8 font-sans text-slate-900">
      {/* Top Navbar */}
      <header className="max-w-6xl w-full mx-auto bg-white rounded-2xl p-4 border border-slate-200 shadow-soft flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Image
            src="/logos/logo.webp"
            alt="CV ASIA PLASTIK"
            width={160}
            height={50}
            className="h-8 w-auto object-contain"
            priority
          />
          <div className="hidden sm:block pl-3 border-l border-slate-200">
            <p className="text-xs font-bold text-slate-800">Sistem Akuntansi & Pembukuan</p>
            <p className="text-[10px] text-slate-500">Security Gate & Two-Factor Autentikasi</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold bg-sky-50 text-sky-700 px-3 py-1 rounded-full border border-sky-200">
            Desain 8: Interactive Portal Simulator
          </span>
        </div>
      </header>

      {/* Main Container: Two-Column Interactive Workspace */}
      <main className="max-w-6xl w-full mx-auto my-6 grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: The Interactive Form (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/90 shadow-soft">
          {/* Flow Stepper Buttons on Top */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-100 text-xs">
            <span className="font-bold text-slate-800">Simulasi Alur Pendaftaran:</span>
            <div className="flex gap-1.5">
              <button
                onClick={() => setActiveTab("step1-reg")}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  activeTab === "step1-reg" ? "bg-sky-500 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                1. Registrasi
              </button>
              <button
                onClick={() => setActiveTab("step2-channel")}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  activeTab === "step2-channel" ? "bg-sky-500 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                2. Pilih Saluran
              </button>
              <button
                onClick={() => setActiveTab("step3-otp")}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  activeTab === "step3-otp" ? "bg-sky-500 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                3. Input OTP
              </button>
              <button
                onClick={() => setActiveTab("login")}
                className={`px-2.5 py-1 rounded-lg font-bold text-[11px] transition-all ${
                  activeTab === "login" ? "bg-slate-800 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Login
              </button>
            </div>
          </div>

          {/* SCREEN 1: REGISTRATION */}
          {activeTab === "step1-reg" && (
            <div className="space-y-5 text-xs">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Registrasi Akun Baru</h2>
                <p className="text-slate-500 mt-0.5">
                  Lengkapi 3 data utama: Nama, Email kantor, dan No. WhatsApp aktif.
                </p>
              </div>

              <div className="space-y-3.5">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Lengkap</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      defaultValue="Siti Rahmawati"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email Kantor</label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      defaultValue="siti@asiaplastik.com"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp</label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      defaultValue="081298877665"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-500"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => setActiveTab("step2-channel")}
                className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 mt-4"
              >
                <span>Lanjut: Pilih Kanal OTP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* SCREEN 2: CHANNEL SELECTION */}
          {activeTab === "step2-channel" && (
            <div className="space-y-5 text-xs">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Pilih Saluran Pengiriman OTP</h2>
                <p className="text-slate-500 mt-0.5">
                  Akun belum dapat login secara langsung sebelum Anda memverifikasi token yang dikirimkan.
                </p>
              </div>

              <div className="space-y-3">
                <div
                  onClick={() => setChannel("whatsapp")}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    channel === "whatsapp" ? "border-emerald-500 bg-emerald-50/50" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">Kirim via WhatsApp</h4>
                      <p className="text-slate-500 text-[11px] font-mono mt-0.5">+62 812-9887-7665</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                    Otomatis Bot
                  </span>
                </div>

                <div
                  onClick={() => setChannel("email")}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center justify-between ${
                    channel === "email" ? "border-sky-500 bg-sky-50/50" : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sky-500 text-white flex items-center justify-center">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">Kirim via Email Resmi</h4>
                      <p className="text-slate-500 text-[11px] font-mono mt-0.5">siti@asiaplastik.com</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                    Surel Kantor
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setActiveTab("step1-reg")}
                  className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                >
                  Kembali
                </button>
                <button
                  onClick={() => setActiveTab("step3-otp")}
                  className="w-2/3 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg shadow-sm flex items-center justify-center gap-2"
                >
                  <span>Kirim Kode OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* SCREEN 3: OTP VERIFICATION */}
          {activeTab === "step3-otp" && (
            <div className="space-y-5 text-xs">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Verifikasi Kode 6-Digit</h2>
                <p className="text-slate-500 mt-0.5">
                  Token keamanan telah dikirimkan ke{" "}
                  <strong>{channel === "whatsapp" ? "WhatsApp (081298877665)" : "Email (siti@asiaplastik.com)"}</strong>
                </p>
              </div>

              {isSuccess ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-sm text-emerald-900">Autentikasi Selesai!</h4>
                  <p className="text-emerald-700 text-xs">Akun Anda sekarang aktif dan dapat mengakses pembukuan.</p>
                  <Link href="/" className="inline-block px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-lg">
                    Buka Dashboard Keuangan
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between gap-2">
                    {otpDigits.map((d, idx) => (
                      <input
                        key={idx}
                        type="text"
                        maxLength={1}
                        defaultValue={d}
                        className="w-12 h-12 text-center text-lg font-bold font-mono bg-slate-50 border-2 border-slate-200 rounded-lg focus:border-sky-500 focus:bg-white outline-none"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-slate-500">
                    <span>Kedaluwarsa dalam: <strong className="text-sky-600 font-mono">01:42</strong></span>
                    <button className="text-sky-600 font-bold hover:underline">Kirim Ulang OTP</button>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <button
                      onClick={() => setActiveTab("step2-channel")}
                      className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg"
                    >
                      Ubah Saluran
                    </button>
                    <button
                      onClick={() => setIsSuccess(true)}
                      className="w-2/3 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg shadow-sm"
                    >
                      Verifikasi & Selesai
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SCREEN 4: LOGIN */}
          {activeTab === "login" && (
            <div className="space-y-4 text-xs">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Masuk ke Akun Terdaftar</h2>
                <p className="text-slate-500 mt-0.5">Khusus staf yang telah memverifikasi kode OTP</p>
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Email / WhatsApp</label>
                <input
                  type="text"
                  defaultValue="siti@asiaplastik.com"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                />
              </div>
              <div>
                <label className="block font-bold text-slate-700 mb-1">Kata Sandi</label>
                <input
                  type="password"
                  defaultValue="Password123"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                />
              </div>
              <button
                onClick={() => setActiveTab("step2-channel")}
                className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg shadow-sm"
              >
                Masuk
              </button>
            </div>
          )}
        </div>

        {/* Right Column: Live Flow Visualizer & Architecture Explainer (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-soft">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-500" />
              Arsitektur Alur Keamanan OTP
            </h3>

            <div className="space-y-4 text-xs">
              <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-100 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  1
                </span>
                <div>
                  <h4 className="font-bold text-slate-800">Pendaftaran Data Staf</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Nama, Email, dan No WA disimpan dengan status <code>PENDING_VERIFICATION</code>.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-100 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  2
                </span>
                <div>
                  <h4 className="font-bold text-slate-800">Pemilihan Saluran OTP</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Staf bebas memilih pengiriman via WhatsApp API Gateway atau SMTP Email kantor.
                  </p>
                </div>
              </div>

              <div className="p-3 bg-sky-50/70 rounded-xl border border-sky-100 flex items-start gap-2.5">
                <span className="w-5 h-5 rounded-full bg-sky-500 text-white font-bold flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                  3
                </span>
                <div>
                  <h4 className="font-bold text-slate-800">Verifikasi 6-Digit & Aktivasi</h4>
                  <p className="text-[11px] text-slate-600 mt-0.5">
                    Setelah kode 6-digit cocok, status akun berubah menjadi <code>ACTIVE</code> dan sesi login di-generate.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mini Trust Box */}
          <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-soft text-xs space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-sky-400">CV ASIA PLASTIK ERP</span>
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300">ISO 27001 Ready</span>
            </div>
            <p className="text-[11px] text-slate-300 leading-relaxed">
              Mencegah login ilegal dengan validasi nomor WhatsApp nyata & email staf resmi.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-6xl w-full mx-auto text-center text-xs text-slate-400 pt-4">
        &copy; 2026 CV ASIA PLASTIK • Sistem Autentikasi Finansial Internal
      </footer>
    </div>
  );
}

