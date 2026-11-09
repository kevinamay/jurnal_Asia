"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  User,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  ExternalLink,
} from "lucide-react";

export function Variant2GlassCard() {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Register, 2: Channel, 3: OTP
  const [channel, setChannel] = useState<"wa" | "email">("wa");
  const [isSuccess, setIsSuccess] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");

  // OTP State
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [simulatedOtp, setSimulatedOtp] = useState<string | null>(null);
  const [isSimulated, setIsSimulated] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [countdown, setCountdown] = useState(300); // 5 menit

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown untuk OTP
  useEffect(() => {
    if (step !== 3 || countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, [step, countdown]);

  const formatCountdown = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Validasi Step 1
  const handleProceedToStep2 = () => {
    setErrorMessage("");
    if (!fullName.trim()) {
      setErrorMessage("Harap masukkan nama lengkap staf.");
      return;
    }
    if (!email.trim() || !email.includes("@")) {
      setErrorMessage("Harap masukkan email perusahaan yang valid.");
      return;
    }
    if (!phone.trim() || phone.replace(/[^0-9]/g, "").length < 9) {
      setErrorMessage("Harap masukkan nomor WhatsApp aktif yang valid.");
      return;
    }
    setStep(2);
  };

  // Kirim OTP via API Backend
  const handleSendOtp = async () => {
    setIsSending(true);
    setErrorMessage("");
    setStatusMessage("");

    const target = channel === "wa" ? phone : email;

    try {
      const response = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target,
          channel,
          fullName,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.message || "Gagal mengirimkan kode OTP. Silakan coba lagi.");
        setIsSending(false);
        return;
      }

      setIsSimulated(Boolean(data.simulated));
      if (data.otp) {
        setSimulatedOtp(data.otp);
      } else {
        setSimulatedOtp(null);
      }

      setStatusMessage(data.message || "Kode OTP berhasil dikirimkan.");
      setOtp(["", "", "", "", "", ""]);
      setCountdown(300);
      setStep(3);
    } catch (err) {
      console.error("Error sending OTP:", err);
      setErrorMessage("Koneksi gagal saat menghubungi server pengiriman OTP.");
    } finally {
      setIsSending(false);
    }
  };

  // Tangani input OTP (auto-focus ke kotak berikutnya)
  const handleOtpChange = (index: number, val: string) => {
    setErrorMessage("");
    // Handle paste dari seluruh 6 angka
    if (val.length > 1) {
      const cleaned = val.replace(/[^0-9]/g, "").slice(0, 6);
      const newOtp = [...otp];
      for (let i = 0; i < 6; i++) {
        newOtp[i] = cleaned[i] || "";
      }
      setOtp(newOtp);
      const nextIndex = Math.min(cleaned.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const singleDigit = val.replace(/[^0-9]/g, "");
    const newOtp = [...otp];
    newOtp[index] = singleDigit;
    setOtp(newOtp);

    // Otomatis pindah fokus ke input selanjutnya
    if (singleDigit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Isi otomatis kode jika dalam mode pengujian simulasi
  const fillSimulatedOtp = (code: string) => {
    const chars = code.split("");
    const newOtp = [...otp];
    for (let i = 0; i < 6; i++) {
      newOtp[i] = chars[i] || "";
    }
    setOtp(newOtp);
    inputRefs.current[5]?.focus();
  };

  // Verifikasi OTP ke Backend
  const handleVerifyOtp = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) {
      setErrorMessage("Masukkan 6-digit kode OTP secara lengkap.");
      return;
    }

    setIsVerifying(true);
    setErrorMessage("");

    const target = channel === "wa" ? phone : email;

    try {
      const response = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          target,
          otp: enteredOtp,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.message || "Kode OTP tidak sesuai atau sudah kadaluarsa.");
        setIsVerifying(false);
        return;
      }

      setIsSuccess(true);
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setErrorMessage("Terjadi kesalahan saat memverifikasi kode dengan server.");
    } finally {
      setIsVerifying(false);
    }
  };

  // Format link WhatsApp Web langsung untuk pengujian instan
  const getWaDirectLink = () => {
    let clean = phone.replace(/[^0-9]/g, "");
    if (clean.startsWith("0")) clean = "62" + clean.slice(1);
    else if (!clean.startsWith("62")) clean = "62" + clean;
    const msg = `[CV. ASIA PLASTIK - SISTEM KEAMANAN]\nHalo ${fullName || "Staf"},\nKode OTP verifikasi Anda adalah: ${simulatedOtp || "123456"}\n(Berlaku 5 menit)`;
    return `https://wa.me/${clean}?text=${encodeURIComponent(msg)}`;
  };

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
            <span className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${step >= 1 ? "bg-sky-500 text-white" : "bg-slate-200"}`}>1</span>
            <span className="w-3 h-0.5 bg-slate-200"></span>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${step >= 2 ? "bg-sky-500 text-white" : "bg-slate-200"}`}>2</span>
            <span className="w-3 h-0.5 bg-slate-200"></span>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${step >= 3 ? "bg-sky-500 text-white" : "bg-slate-200"}`}>3</span>
          </div>
        </div>

        {/* Global Error Banner */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

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
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Masukkan nama lengkap staf"
                    className="w-full pl-9 pr-3 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Email Perusahaan</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@asiaplastik.com"
                    className="w-full pl-9 pr-3 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Nomor WhatsApp Aktif</label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Contoh: 082244109503"
                    className="w-full pl-9 pr-3 py-2.5 bg-white/70 border border-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={handleProceedToStep2}
              className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-sm shadow-sky-500/30 transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer active:scale-[0.99]"
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
                <p className="text-[10px] text-slate-500 mt-0.5 break-all">
                  {phone ? `Kirim instan ke ${phone}` : "Kirim instan ke nomor WhatsApp terdaftar"}
                </p>
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
                <p className="text-[10px] text-slate-500 mt-0.5 break-all">
                  {email ? `Kirim ke ${email}` : "Kirim ke email kantor staf terdaftar"}
                </p>
              </button>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => {
                  setErrorMessage("");
                  setStep(1);
                }}
                disabled={isSending}
                className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                Kembali
              </button>
              <button
                type="button"
                onClick={handleSendOtp}
                disabled={isSending}
                className="w-2/3 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.99]"
              >
                {isSending ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Menghubungi Server OTP...</span>
                  </>
                ) : (
                  <>
                    <span>Kirim Kode OTP</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
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
                <strong className="text-slate-800">
                  {channel === "wa"
                    ? `WhatsApp (${phone})`
                    : `Email (${email})`}
                </strong>
              </p>
            </div>

            {/* Mode Banner Simulasi atau Sukses */}
            {isSimulated && simulatedOtp && (
              <div className="p-3.5 bg-amber-50/80 border border-amber-200 rounded-2xl text-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-900 text-[11px] flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
                    {channel === "wa" ? "Gateway WhatsApp Belum Terhubung" : "Layanan Email Belum Terhubung"}
                  </span>
                  <button
                    type="button"
                    onClick={() => fillSimulatedOtp(simulatedOtp)}
                    className="font-mono font-bold text-xs text-sky-700 bg-white hover:bg-sky-50 px-2.5 py-1 rounded-lg border border-sky-300 shadow-2xs transition-all cursor-pointer"
                    title="Klik untuk memasukkan kode secara otomatis"
                  >
                    OTP: <span className="text-sky-600 underline">{simulatedOtp}</span> (Isi Otomatis)
                  </button>
                </div>
                <p className="text-[11px] text-amber-800 leading-relaxed">
                  {channel === "wa"
                    ? "Pesan otomatis ke WhatsApp HP memerlukan API Gateway (Fonnte/Wablas). Untuk pengujian real-time tanpa setup, Anda bisa klik tombol kirim langsung di bawah atau isi kode simulasi di atas."
                    : "Pengiriman otomatis ke inbox email staf memerlukan pengaturan Gmail SMTP (App Password) atau Resend API Key di file .env.local. Gunakan kode simulasi di atas untuk langsung menguji verifikasi."}
                </p>
                {channel === "wa" && (
                  <a
                    href={getWaDirectLink()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[11px] font-bold text-emerald-700 bg-emerald-100 hover:bg-emerald-200 px-3 py-1.5 rounded-xl border border-emerald-300 transition-colors"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Buka & Kirim Pesan ke WhatsApp ({phone}) Sekarang</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </a>
                )}
              </div>
            )}

            {!isSimulated && statusMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>{statusMessage}</span>
              </div>
            )}

            {isSuccess ? (
              <div className="p-5 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 animate-in fade-in duration-300">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-emerald-950">Akun Berhasil Diaktifkan!</h4>
                <p className="text-xs text-emerald-700">
                  Verifikasi 2-faktor selesai. Anda sekarang memiliki otorisasi penuh untuk mengakses portal akuntansi.
                </p>
                <Link
                  href="/dashboard"
                  className="inline-block mt-3 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all"
                >
                  Buka Dashboard Finansial
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {/* 6 Digit Input Boxes */}
                <div className="flex justify-center gap-2">
                  {[0, 1, 2, 3, 4, 5].map((i) => (
                    <input
                      key={i}
                      ref={(el) => {
                        inputRefs.current[i] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={6}
                      value={otp[i]}
                      onChange={(e) => handleOtpChange(i, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(i, e)}
                      className="w-11 h-12 text-center text-lg font-bold font-mono bg-white border border-slate-200 rounded-xl focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none shadow-2xs transition-all"
                    />
                  ))}
                </div>

                {/* Countdown and Resend */}
                <div className="flex items-center justify-between text-xs text-slate-500 px-1">
                  <span>
                    Masa berlaku:{" "}
                    <strong className="text-sky-600 font-mono font-bold">
                      {formatCountdown(countdown)}
                    </strong>
                  </span>
                  <button
                    type="button"
                    onClick={handleSendOtp}
                    disabled={isSending || countdown > 240}
                    className="text-sky-600 hover:underline font-bold disabled:opacity-40 disabled:hover:no-underline cursor-pointer"
                  >
                    {isSending ? "Mengirim ulang..." : "Kirim Ulang"}
                  </button>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMessage("");
                      setStep(2);
                    }}
                    disabled={isVerifying}
                    className="w-1/3 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors cursor-pointer"
                  >
                    Ganti Jalur
                  </button>
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    disabled={isVerifying}
                    className="w-2/3 py-2.5 bg-sky-500 hover:bg-sky-600 disabled:opacity-60 text-white text-xs font-bold rounded-xl shadow-sm flex items-center justify-center gap-1.5 transition-all cursor-pointer active:scale-[0.99]"
                  >
                    {isVerifying ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Memvalidasi Kode...</span>
                      </>
                    ) : (
                      <span>Konfirmasi OTP</span>
                    )}
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
