"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  User,
  Mail,
  Phone,
  Lock,
  MessageSquare,
  Check,
  ArrowRight,
  ShieldAlert,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";

export function Variant3WizardStepper() {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [selectedChannel, setSelectedChannel] = useState<"whatsapp" | "email">("whatsapp");
  const [isSuccess, setIsSuccess] = useState(false);

  const steps = [
    { num: 1, title: "Data Staf", desc: "Identitas dasar" },
    { num: 2, title: "Kanal OTP", desc: "Pilih WhatsApp / Email" },
    { num: 3, title: "Verifikasi", desc: "Input kode 6-digit" },
  ];

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col justify-between p-6 lg:p-12 font-sans text-slate-900">
      {/* Top Header */}
      <div className="max-w-4xl w-full mx-auto flex items-center justify-between pb-6 border-b border-slate-200">
        <div className="flex items-center gap-3">
          <Image
            src="/logos/logo.webp"
            alt="Logo CV ASIA PLASTIK"
            width={160}
            height={50}
            className="h-8 w-auto object-contain"
            priority
          />
          <span className="text-xs font-semibold text-slate-500 pl-3 border-l border-slate-200">
            Pusat Registrasi Akses Akuntansi
          </span>
        </div>
        <span className="text-xs font-bold px-3 py-1 bg-sky-50 text-sky-700 border border-sky-200 rounded-full">
          Desain 3: Multi-Step Wizard
        </span>
      </div>

      {/* Main Container */}
      <div className="max-w-2xl w-full mx-auto my-8">
        {/* Horizontal Wizard Progress Bar */}
        <div className="grid grid-cols-3 gap-2 mb-8">
          {steps.map((st) => (
            <div
              key={st.num}
              className={`p-3 rounded-xl border-2 transition-all ${
                currentStep === st.num
                  ? "border-sky-500 bg-white shadow-soft"
                  : currentStep > st.num
                  ? "border-emerald-400 bg-emerald-50/40 text-emerald-800"
                  : "border-slate-200 bg-white/60 text-slate-400"
              }`}
            >
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                    currentStep === st.num
                      ? "bg-sky-500 text-white"
                      : currentStep > st.num
                      ? "bg-emerald-500 text-white"
                      : "bg-slate-200 text-slate-600"
                  }`}
                >
                  {currentStep > st.num ? <Check className="w-3.5 h-3.5 stroke-[3]" /> : st.num}
                </span>
                <span className="font-bold text-xs">{st.title}</span>
              </div>
              <p className="text-[10px] text-slate-500 truncate">{st.desc}</p>
            </div>
          ))}
        </div>

        {/* Wizard Step Content Card */}
        <div className="bg-white rounded-2xl p-8 border border-slate-200/90 shadow-soft">
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Langkah 1: Identitas & Kontak</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Gunakan nomor WhatsApp aktif untuk kemudahan pengiriman token autentikasi.
                </p>
              </div>

              <div className="space-y-4 text-xs">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Nama Staf Finance</label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      defaultValue="Budi Santoso"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Email Resmi</label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="email"
                        defaultValue="budi@asiaplastik.com"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp</label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="tel"
                        defaultValue="085211223344"
                        className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Buat Kata Sandi Akun</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      defaultValue="Rahasia123!"
                      className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 flex justify-end">
                <button
                  onClick={() => setCurrentStep(2)}
                  className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2"
                >
                  <span>Selanjutnya: Tentukan Kanal OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Langkah 2: Pilih Metode Pengiriman OTP</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Sistem tidak akan langsung mengizinkan login sebelum kode OTP yang dikirimkan terverifikasi.
                </p>
              </div>

              <div className="space-y-3">
                <div
                  onClick={() => setSelectedChannel("whatsapp")}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                    selectedChannel === "whatsapp"
                      ? "border-emerald-500 bg-emerald-50/50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center shrink-0">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900">Kirim ke WhatsApp (Rekomendasi Cepat)</h4>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        99% Terkirim &lt; 5 Detik
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Kode akan dikirim langsung oleh WhatsApp Bot resmi CV ASIA PLASTIK ke nomor <strong>085211223344</strong>.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => setSelectedChannel("email")}
                  className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                    selectedChannel === "email"
                      ? "border-sky-500 bg-sky-50/50"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="w-10 h-10 rounded-xl bg-sky-500 text-white flex items-center justify-center shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-xs text-slate-900">Kirim ke Email Perusahaan</h4>
                      <span className="text-[10px] font-bold text-sky-700 bg-sky-100 px-2 py-0.5 rounded">
                        Email Resmi
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">
                      Kode dikirimkan via inbox surel ke <strong>budi@asiaplastik.com</strong>.
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-3 flex items-center justify-between">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg"
                >
                  Kembali
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2"
                >
                  <span>Kirim Kode Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Langkah 3: Masukkan 6-Digit Kode</h2>
                <p className="text-xs text-slate-500 mt-0.5">
                  Periksa pesan masuk di{" "}
                  <strong>{selectedChannel === "whatsapp" ? "WhatsApp (085211223344)" : "Email (budi@asiaplastik.com)"}</strong>
                </p>
              </div>

              {isSuccess ? (
                <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-3">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="text-base font-bold text-emerald-900">Autentikasi Berhasil</h4>
                  <p className="text-xs text-emerald-700">Akun staf finance telah terhubung dan diverifikasi resmi.</p>
                  <Link href="/" className="inline-block px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-lg">
                    Lanjut ke Dashboard CV ASIA PLASTIK
                  </Link>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex justify-center gap-2.5">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        defaultValue={i === 1 ? "8" : i === 2 ? "1" : ""}
                        className="w-12 h-12 text-center text-lg font-bold font-mono bg-slate-50 border-2 border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 outline-none"
                      />
                    ))}
                  </div>

                  <p className="text-center text-xs text-slate-500">
                    Belum menerima pesan? <button className="text-sky-600 font-bold hover:underline">Kirim Ulang (01:30)</button>
                  </p>

                  <div className="pt-3 flex items-center justify-between">
                    <button
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2 bg-slate-100 text-slate-700 text-xs font-bold rounded-lg"
                    >
                      Ubah Kanal
                    </button>
                    <button
                      onClick={() => setIsSuccess(true)}
                      className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2"
                    >
                      <span>Verifikasi & Masuk Dashboard</span>
                      <Check className="w-4 h-4 stroke-[3]" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="max-w-4xl w-full mx-auto text-center text-xs text-slate-400 pt-4">
        &copy; 2026 CV ASIA PLASTIK • Sistem Keuangan Internal Terproteksi 2FA
      </div>
    </div>
  );
}

