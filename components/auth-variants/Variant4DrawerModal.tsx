"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  X,
  ShieldCheck,
  Mail,
  Phone,
  User,
  Lock,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  KeyRound,
  Layers,
  ArrowLeft,
} from "lucide-react";

export function Variant4DrawerModal() {
  const [tab, setTab] = useState<"login" | "register">("register");
  const [mode, setMode] = useState<"form" | "otp">("form");
  const [channel, setChannel] = useState<"wa" | "email">("wa");
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <div className="min-h-screen w-full relative bg-slate-900/30 backdrop-blur-sm flex justify-end font-sans">
      {/* Background Simulation of Dashboard */}
      <div className="absolute inset-0 bg-slate-100 opacity-40 pointer-events-none p-8 hidden lg:grid grid-cols-4 gap-6">
        <div className="bg-white rounded-xl h-32 border border-slate-300"></div>
        <div className="bg-white rounded-xl h-32 border border-slate-300"></div>
        <div className="bg-white rounded-xl h-32 border border-slate-300"></div>
        <div className="bg-white rounded-xl h-32 border border-slate-300"></div>
        <div className="col-span-3 bg-white rounded-xl h-96 border border-slate-300"></div>
        <div className="bg-white rounded-xl h-96 border border-slate-300"></div>
      </div>

      {/* Slide-Over Drawer Container */}
      <div className="relative z-10 w-full max-w-md bg-white min-h-screen shadow-2xl border-l border-slate-200 flex flex-col justify-between p-6 sm:p-8 animate-in slide-in-from-right duration-300">
        <div>
          {/* Top Brand Bar inside Drawer */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-100">
            <Image
              src="/logos/logo.webp"
              alt="CV ASIA PLASTIK"
              width={150}
              height={50}
              className="h-8 w-auto object-contain"
              priority
            />
            <span className="text-[10px] font-bold bg-sky-50 text-sky-700 px-2.5 py-1 rounded-full border border-sky-200">
              Desain 4: Slide-over Drawer
            </span>
          </div>

          {/* Form vs OTP View */}
          {mode === "form" ? (
            <div className="mt-6 space-y-6">
              {/* Segmented Control Tabs */}
              <div className="flex p-1 bg-slate-100 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setTab("register")}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    tab === "register" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Daftar Akun Baru
                </button>
                <button
                  onClick={() => setTab("login")}
                  className={`flex-1 py-2 rounded-lg transition-all ${
                    tab === "login" ? "bg-white text-slate-900 shadow-xs" : "text-slate-500 hover:text-slate-800"
                  }`}
                >
                  Masuk (Login)
                </button>
              </div>

              {tab === "register" ? (
                <div className="space-y-4 text-xs">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Formulir Pendaftaran</h3>
                    <p className="text-slate-500 text-xs">Pendaftaran staf finance CV ASIA PLASTIK</p>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      defaultValue="Ahmad Fauzi"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Alamat Email</label>
                    <input
                      type="email"
                      defaultValue="ahmad@asiaplastik.com"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp Aktif</label>
                    <input
                      type="tel"
                      defaultValue="087711223344"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none"
                    />
                  </div>

                  {/* Channel selection right on the drawer */}
                  <div className="pt-2">
                    <label className="block font-bold text-slate-700 mb-2">Kirim OTP Verifikasi Ke:</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setChannel("wa")}
                        className={`p-2.5 rounded-lg border text-center transition-all ${
                          channel === "wa"
                            ? "border-emerald-500 bg-emerald-50/50 text-emerald-800 font-bold"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <MessageCircle className="w-4 h-4 mx-auto mb-1 text-emerald-600" />
                        <span>WhatsApp</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setChannel("email")}
                        className={`p-2.5 rounded-lg border text-center transition-all ${
                          channel === "email"
                            ? "border-sky-500 bg-sky-50/50 text-sky-800 font-bold"
                            : "border-slate-200 text-slate-600 hover:border-slate-300"
                        }`}
                      >
                        <Mail className="w-4 h-4 mx-auto mb-1 text-sky-600" />
                        <span>Email</span>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => setMode("otp")}
                    className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-lg shadow-sm flex items-center justify-center gap-1.5 mt-4"
                  >
                    <span>Daftar & Minta Kode OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-4 text-xs">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">Masuk ke Sistem</h3>
                    <p className="text-slate-500 text-xs">Autentikasi akun terverifikasi</p>
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email / No WhatsApp</label>
                    <input
                      type="text"
                      placeholder="Email atau No WA"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Kata Sandi</label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 outline-none"
                    />
                  </div>
                  <button
                    onClick={() => setMode("otp")}
                    className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-lg shadow-sm"
                  >
                    Masuk
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* OTP Screen inside Drawer */
            <div className="mt-8 space-y-6">
              <button
                onClick={() => setMode("form")}
                className="text-xs text-slate-500 hover:text-slate-800 flex items-center gap-1 font-semibold"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Kembali ke formulir
              </button>

              <div>
                <h3 className="text-xl font-bold text-slate-900">Input Kode OTP</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Kode verifikasi 6 digit telah dikirimkan ke{" "}
                  <strong>{channel === "wa" ? "WhatsApp (087711223344)" : "Email (ahmad@asiaplastik.com)"}</strong>
                </p>
              </div>

              {isSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-sm text-emerald-900">Verifikasi Sukses</h4>
                  <p className="text-xs text-emerald-700">Akun Anda sekarang aktif.</p>
                  <Link href="/" className="inline-block px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg">
                    Buka Dashboard
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-between gap-1.5">
                    {[0, 1, 2, 3, 4, 5].map((i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        defaultValue={i === 0 ? "5" : i === 1 ? "2" : ""}
                        className="w-11 h-11 text-center text-base font-bold font-mono bg-slate-50 border border-slate-200 rounded-lg focus:border-sky-500 outline-none"
                      />
                    ))}
                  </div>

                  <div className="flex justify-between text-xs text-slate-500">
                    <span>Sisa waktu: <strong className="text-sky-600">01:59</strong></span>
                    <button className="text-sky-600 font-bold hover:underline">Kirim Ulang</button>
                  </div>

                  <button
                    onClick={() => setIsSuccess(true)}
                    className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-lg shadow-sm"
                  >
                    Verifikasi Akun Sekarang
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Drawer Footer */}
        <div className="pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
          Enkripsi TLS 1.3 • CV ASIA PLASTIK Cloud Accounting
        </div>
      </div>
    </div>
  );
}

