"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FileText,
  Stamp,
  Shield,
  CheckCircle2,
  ArrowRight,
  MessageCircle,
  Mail,
  Printer,
} from "lucide-react";

export function Variant7LedgerStyle() {
  const [step, setStep] = useState<"form" | "otp">("form");
  const [channel, setChannel] = useState<"wa" | "email">("wa");
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <div className="min-h-screen w-full bg-slate-100/80 p-4 sm:p-8 flex items-center justify-center font-sans text-slate-900">
      <div className="w-full max-w-2xl bg-white rounded-xl border-2 border-slate-300 shadow-elevation overflow-hidden">
        {/* Document Header Bar */}
        <div className="bg-slate-50 border-b-2 border-slate-300 p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Image
              src="/logos/logo.webp"
              alt="CV ASIA PLASTIK"
              width={160}
              height={50}
              className="h-8 w-auto object-contain"
              priority
            />
            <div>
              <p className="text-[11px] font-mono text-slate-500 uppercase">FORMULIR RESMI-REG/2026</p>
              <h2 className="text-sm font-bold text-slate-900">Permohonan Registrasi Akses Akuntansi</h2>
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-200">
              Desain 7: Accounting Ledger Document
            </span>
            <p className="text-[10px] text-slate-400 font-mono mt-0.5">CV ASIA PLASTIK • HEAD OFFICE</p>
          </div>
        </div>

        {/* Document Body */}
        <div className="p-6 sm:p-8">
          {step === "form" ? (
            <div className="space-y-6">
              <div className="border border-slate-200 rounded-lg overflow-hidden text-xs">
                <table className="w-full text-left">
                  <tbody className="divide-y divide-slate-200">
                    <tr className="bg-slate-50/50">
                      <td className="p-3 w-44 font-bold text-slate-700 bg-slate-100/70 border-r border-slate-200">
                        Nama Pemohon
                      </td>
                      <td className="p-2">
                        <input
                          type="text"
                          defaultValue="Hendra Wijaya"
                          className="w-full p-1.5 bg-white border border-slate-200 rounded outline-none"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-700 bg-slate-100/70 border-r border-slate-200">
                        Alamat Email Kantor
                      </td>
                      <td className="p-2">
                        <input
                          type="email"
                          defaultValue="hendra@asiaplastik.com"
                          className="w-full p-1.5 bg-white border border-slate-200 rounded outline-none"
                        />
                      </td>
                    </tr>
                    <tr className="bg-slate-50/50">
                      <td className="p-3 font-bold text-slate-700 bg-slate-100/70 border-r border-slate-200">
                        Nomor WhatsApp Resmi
                      </td>
                      <td className="p-2">
                        <input
                          type="tel"
                          defaultValue="081800112233"
                          className="w-full p-1.5 bg-white border border-slate-200 rounded outline-none"
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="p-3 font-bold text-slate-700 bg-slate-100/70 border-r border-slate-200">
                        Kanal Pengiriman OTP
                      </td>
                      <td className="p-3 flex gap-4">
                        <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                          <input
                            type="radio"
                            name="chn"
                            checked={channel === "wa"}
                            onChange={() => setChannel("wa")}
                            className="text-sky-600 focus:ring-sky-500"
                          />
                          <span>WhatsApp (081800112233)</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer font-medium">
                          <input
                            type="radio"
                            name="chn"
                            checked={channel === "email"}
                            onChange={() => setChannel("email")}
                            className="text-sky-600 focus:ring-sky-500"
                          />
                          <span>Email (hendra@asiaplastik.com)</span>
                        </label>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Approval stamp area note */}
              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-800 flex items-center justify-between">
                <span>Setelah pengajuan dikirim, sistem akan memvalidasi kode OTP 6-digit sebelum akun aktif.</span>
                <span className="font-mono text-[10px] text-amber-600 font-bold">OTORISASI WAJIB</span>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setStep("otp")}
                  className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-lg shadow-sm flex items-center gap-2"
                >
                  <span>Kirim Permohonan & Dapatkan OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            /* OTP VERIFICATION IN LEDGER STYLE */
            <div className="space-y-6">
              <div className="text-center">
                <h3 className="text-lg font-bold text-slate-900">Verifikasi Kode Pengesahan (OTP)</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Masukkan kode token keamanan yang dikirimkan ke{" "}
                  <strong>{channel === "wa" ? "WhatsApp" : "Email"}</strong>
                </p>
              </div>

              {isSuccess ? (
                <div className="p-6 bg-emerald-50 border-2 border-emerald-300 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-base text-emerald-900">Pengesahan Akun Disetujui</h4>
                  <p className="text-xs text-emerald-700">Akun Anda telah sah dan terdaftar pada sistem akuntansi.</p>
                  <Link href="/" className="inline-block px-5 py-2 bg-emerald-600 text-white font-bold text-xs rounded-lg mt-2">
                    Masuk ke Dashboard
                  </Link>
                </div>
              ) : (
                <div className="max-w-md mx-auto space-y-4">
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <input
                        key={i}
                        type="text"
                        maxLength={1}
                        defaultValue={i === 1 ? "9" : i === 2 ? "3" : ""}
                        className="w-11 h-12 text-center text-lg font-bold font-mono border-2 border-slate-300 rounded-lg outline-none focus:border-sky-500"
                      />
                    ))}
                  </div>

                  <div className="flex justify-between items-center text-xs text-slate-500">
                    <span>Masa Aktif Token: <strong className="text-sky-600 font-mono">01:45</strong></span>
                    <button className="text-sky-600 font-bold hover:underline">Kirim Token Baru</button>
                  </div>

                  <div className="flex justify-between gap-3 pt-3">
                    <button
                      onClick={() => setStep("form")}
                      className="px-4 py-2 border border-slate-300 text-slate-700 font-bold text-xs rounded-lg"
                    >
                      Koreksi Data
                    </button>
                    <button
                      onClick={() => setIsSuccess(true)}
                      className="px-6 py-2 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-lg shadow-sm"
                    >
                      Sahkan & Verifikasi
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Document Footer */}
        <div className="bg-slate-50 border-t border-slate-200 p-3 text-center text-[10px] text-slate-400 font-mono">
          DOKUMEN RESMI INTERNAL • PT/CV ASIA PLASTIK FINANCIAL AUDIT SYSTEM
        </div>
      </div>
    </div>
  );
}

