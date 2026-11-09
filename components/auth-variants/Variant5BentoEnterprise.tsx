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
  FileCheck2,
  Building,
  HelpCircle,
} from "lucide-react";

export function Variant5BentoEnterprise() {
  const [tab, setTab] = useState<"register" | "login" | "otp">("register");
  const [channel, setChannel] = useState<"whatsapp" | "email">("whatsapp");
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <div className="min-h-screen w-full bg-slate-100/70 p-6 lg:p-12 flex items-center justify-center font-sans text-slate-900">
      <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Top / Left Bento Cards: Company & Security Info (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-5">
          {/* Bento Card 1: Brand & Identity */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-soft">
            <Image
              src="/logos/logo.webp"
              alt="CV ASIA PLASTIK"
              width={180}
              height={60}
              className="h-9 w-auto object-contain mb-4"
              priority
            />
            <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 px-2 py-0.5 rounded border border-sky-200">
              Desain 5: Bento Grid Enterprise
            </span>
            <h3 className="text-sm font-bold text-slate-900 mt-2">Sistem Keuangan Resmi</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">
              Otorisasi akses modul Buku Besar, Piutang, Hutang, dan Rekonsiliasi Bank <strong>CV ASIA PLASTIK</strong>.
            </p>
          </div>

          {/* Bento Card 2: 2FA WhatsApp Guarantee */}
          <div className="bg-gradient-to-br from-sky-500 to-sky-600 rounded-2xl p-6 text-white shadow-soft">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center mb-3">
              <ShieldCheck className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-bold text-sm">Autentikasi 2FA Terproteksi</h4>
            <p className="text-xs text-sky-100 mt-1 leading-relaxed">
              Setiap pendaftaran tidak dapat login sebelum verifikasi OTP ke WhatsApp atau Email perusahaan.
            </p>
          </div>

          {/* Bento Card 3: IT Support Quick Ping */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/90 shadow-soft flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
              <HelpCircle className="w-5 h-5 text-sky-500" />
            </div>
            <div className="text-xs">
              <p className="font-bold text-slate-900">Kendala Pendaftaran?</p>
              <p className="text-slate-500">Hubungi Admin IT: 0811-2345-6789</p>
            </div>
          </div>
        </div>

        {/* Right Bento Area: Main Auth & OTP Card (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl p-8 border border-slate-200/90 shadow-soft flex flex-col justify-between">
          <div>
            {/* Nav Tabs */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
              <div className="flex gap-2">
                <button
                  onClick={() => setTab("register")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    tab === "register" ? "bg-sky-500 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  1. Pendaftaran Staf
                </button>
                <button
                  onClick={() => setTab("login")}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${
                    tab === "login" ? "bg-sky-500 text-white shadow-xs" : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  Masuk Akun
                </button>
              </div>

              {tab === "otp" && (
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                  Tahap Verifikasi OTP
                </span>
              )}
            </div>

            {/* TAB: REGISTER */}
            {tab === "register" && (
              <div className="space-y-4 text-xs">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Input Data Pendaftaran Baru</h2>
                  <p className="text-slate-500 text-xs">Semua kolom wajib diisi dengan data valid.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block font-bold text-slate-700 mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      defaultValue="Dewi Lestari"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Perusahaan</label>
                    <input
                      type="email"
                      defaultValue="dewi@asiaplastik.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">No. WhatsApp Aktif</label>
                    <input
                      type="tel"
                      defaultValue="081912345678"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-500"
                    />
                  </div>
                </div>

                {/* OTP Channel Choice inside Bento */}
                <div className="pt-2">
                  <label className="block font-bold text-slate-700 mb-2">Metode Penerimaan Kode OTP:</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setChannel("whatsapp")}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        channel === "whatsapp" ? "border-emerald-500 bg-emerald-50 text-emerald-900 font-bold" : "border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <MessageSquare className="w-4 h-4 text-emerald-600" />
                        <span>Kirim via WhatsApp</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-normal mt-0.5">Ke 081912345678</p>
                    </button>

                    <button
                      type="button"
                      onClick={() => setChannel("email")}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        channel === "email" ? "border-sky-500 bg-sky-50 text-sky-900 font-bold" : "border-slate-200"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-sky-600" />
                        <span>Kirim via Email</span>
                      </div>
                      <p className="text-[10px] text-slate-500 font-normal mt-0.5">Ke dewi@asiaplastik.com</p>
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => setTab("otp")}
                  className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg shadow-sm flex items-center justify-center gap-2 mt-4"
                >
                  <span>Daftarkan & Kirim Kode OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* TAB: LOGIN */}
            {tab === "login" && (
              <div className="space-y-4 text-xs">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Masuk Akun Finance</h2>
                  <p className="text-slate-500 text-xs">Gunakan kredensial yang telah aktif.</p>
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Email / WhatsApp</label>
                  <input
                    type="text"
                    defaultValue="dewi@asiaplastik.com"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Kata Sandi</label>
                  <input
                    type="password"
                    defaultValue="Secret123"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none"
                  />
                </div>
                <button
                  onClick={() => setTab("otp")}
                  className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg shadow-sm"
                >
                  Lanjut Autentikasi
                </button>
              </div>
            )}

            {/* TAB: OTP */}
            {tab === "otp" && (
              <div className="space-y-5 text-xs">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Verifikasi Kode 6-Digit OTP</h2>
                  <p className="text-slate-500 mt-1">
                    Kode autentikasi telah dikirim ke{" "}
                    <strong>{channel === "whatsapp" ? "WhatsApp (081912345678)" : "Email (dewi@asiaplastik.com)"}</strong>
                  </p>
                </div>

                {isSuccess ? (
                  <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                    <h4 className="font-bold text-sm text-emerald-900">Verifikasi Sukses</h4>
                    <p className="text-emerald-700">Akun teraktivasi.</p>
                    <Link href="/" className="inline-block px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg">
                      Masuk Dashboard
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex justify-center gap-2">
                      {[0, 1, 2, 3, 4, 5].map((idx) => (
                        <input
                          key={idx}
                          type="text"
                          maxLength={1}
                          defaultValue={idx === 0 ? "3" : idx === 1 ? "9" : ""}
                          className="w-12 h-12 text-center text-lg font-bold font-mono bg-slate-50 border border-slate-200 rounded-lg focus:border-sky-500 outline-none"
                        />
                      ))}
                    </div>

                    <div className="flex justify-between items-center text-slate-500">
                      <span>Waktu kedaluwarsa: <strong className="text-sky-600">01:50</strong></span>
                      <button className="text-sky-600 font-bold hover:underline">Kirim Ulang Kode</button>
                    </div>

                    <button
                      onClick={() => setIsSuccess(true)}
                      className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg shadow-sm"
                    >
                      Verifikasi & Selesai
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="pt-6 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Sistem Finansial CV ASIA PLASTIK</span>
            <span>Standar PSAK • Multi-User Role</span>
          </div>
        </div>
      </div>
    </div>
  );
}

