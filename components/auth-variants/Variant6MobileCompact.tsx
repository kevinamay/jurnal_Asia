"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  User,
  Lock,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  Key,
} from "lucide-react";

export function Variant6MobileCompact() {
  const [isOtpStep, setIsOtpStep] = useState(false);
  const [channel, setChannel] = useState<"wa" | "email">("wa");
  const [isVerified, setIsVerified] = useState(false);

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-900">
      <div className="w-full max-w-sm bg-white rounded-2xl p-6 border border-slate-200 shadow-soft">
        {/* Brand Header */}
        <div className="text-center pb-5 mb-5 border-b border-slate-100">
          <Image
            src="/logos/logo.webp"
            alt="CV ASIA PLASTIK"
            width={160}
            height={55}
            className="h-8 w-auto object-contain mx-auto mb-2"
            priority
          />
          <span className="text-[10px] font-bold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
            Desain 6: Compact Quick-Entry
          </span>
        </div>

        {!isOtpStep ? (
          /* REGISTRATION FORM */
          <div className="space-y-4 text-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">Daftar Akun Baru</h2>
              <p className="text-slate-500 text-[11px]">Masukkan identitas untuk mendapatkan OTP</p>
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                defaultValue="Eko Prasetyo"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Email Perusahaan</label>
              <input
                type="email"
                defaultValue="eko@asiaplastik.com"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-500"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp Aktif</label>
              <input
                type="tel"
                defaultValue="082133445566"
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-sky-500"
              />
            </div>

            {/* Compact Channel Selector Pills */}
            <div className="pt-1">
              <label className="block font-bold text-slate-700 mb-1.5">Pilihan Pengiriman OTP:</label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setChannel("wa")}
                  className={`flex-1 py-1.5 px-2 rounded-lg border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                    channel === "wa"
                      ? "border-emerald-500 bg-emerald-50 text-emerald-800 shadow-xs"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                  <span>WhatsApp</span>
                </button>

                <button
                  type="button"
                  onClick={() => setChannel("email")}
                  className={`flex-1 py-1.5 px-2 rounded-lg border text-[11px] font-bold flex items-center justify-center gap-1.5 transition-all ${
                    channel === "email"
                      ? "border-sky-500 bg-sky-50 text-sky-800 shadow-xs"
                      : "border-slate-200 text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  <Mail className="w-3.5 h-3.5 text-sky-600" />
                  <span>Email</span>
                </button>
              </div>
            </div>

            <button
              onClick={() => setIsOtpStep(true)}
              className="w-full py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 mt-2"
            >
              <span>Kirim OTP & Lanjut</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ) : (
          /* OTP SCREEN */
          <div className="space-y-4 text-xs">
            <div>
              <h2 className="text-base font-bold text-slate-900">Verifikasi OTP</h2>
              <p className="text-slate-500 text-[11px] mt-0.5">
                Kode dikirim ke {channel === "wa" ? "WhatsApp (082133445566)" : "Email (eko@asiaplastik.com)"}
              </p>
            </div>

            {isVerified ? (
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                <CheckCircle2 className="w-7 h-7 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-xs text-emerald-900">Verifikasi Selesai!</h4>
                <Link href="/" className="inline-block px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-xs">
                  Masuk Dashboard
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex justify-between gap-1">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <input
                      key={i}
                      type="text"
                      maxLength={1}
                      defaultValue={i === 0 ? "4" : i === 1 ? "1" : ""}
                      className="w-10 h-10 text-center font-bold font-mono bg-slate-50 border border-slate-200 rounded-lg text-base focus:border-sky-500 outline-none"
                    />
                  ))}
                </div>

                <div className="flex justify-between text-[11px] text-slate-500">
                  <span>Batas: <strong className="text-sky-600">01:40</strong></span>
                  <button className="text-sky-600 font-bold hover:underline">Kirim Ulang</button>
                </div>

                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => setIsOtpStep(false)}
                    className="w-1/3 py-2 bg-slate-100 text-slate-700 font-bold rounded-lg"
                  >
                    Batal
                  </button>
                  <button
                    onClick={() => setIsVerified(true)}
                    className="w-2/3 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg shadow-sm"
                  >
                    Verifikasi
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

