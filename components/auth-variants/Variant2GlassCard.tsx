"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  Phone,
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Loader2,
  HelpCircle,
} from "lucide-react";

export function Variant2GlassCard() {
  const router = useRouter();
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Register, 2: Channel, 3: OTP
  const [channel, setChannel] = useState<"wa" | "email">("wa");
  const [isSuccess, setIsSuccess] = useState(false);

  // Form Fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // OTP State
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
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
    if (!password) {
      setErrorMessage("Harap buat kata sandi untuk akun staf Anda.");
      return;
    }
    if (password.length < 6) {
      setErrorMessage("Kata sandi minimal harus terdiri dari 6 karakter.");
      return;
    }
    if (!confirmPassword) {
      setErrorMessage("Harap masukkan konfirmasi kata sandi.");
      return;
    }
    if (password !== confirmPassword) {
      setErrorMessage("Konfirmasi kata sandi tidak cocok. Silakan periksa kembali.");
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

      if (data.verificationToken) {
        setVerificationToken(data.verificationToken);
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
          verificationToken,
          userProfile: {
            fullName,
            email,
            phone,
            password,
            channel,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        setErrorMessage(data.message || "Kode OTP tidak sesuai atau sudah kadaluarsa.");
        setIsVerifying(false);
        return;
      }

      setIsSuccess(true);
      // Skema redirect: Saat OTP sudah benar, email otomatis aktif dan pengguna dialihkan ke halaman login
      setTimeout(() => {
        router.push(`/login?verified=true&email=${encodeURIComponent(email || "")}`);
      }, 1500);
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setErrorMessage("Terjadi kesalahan saat memverifikasi kode dengan server.");
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-sky-100/70 via-white to-sky-50 flex flex-col items-center justify-center p-4 relative overflow-hidden font-sans py-12">
      {/* Decorative gradient ambient orbs & glow (Putih & Biru Muda) */}
      <div className="absolute -top-24 -left-24 w-96 h-96 bg-sky-200/50 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-sky-300/35 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[38rem] h-[38rem] bg-gradient-to-tr from-sky-100/40 via-sky-200/20 to-transparent rounded-full blur-3xl pointer-events-none"></div>

      {/* Subtle modern texture overlay */}
      <div
        className="absolute inset-0 bg-[radial-gradient(#0284c7_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.035] pointer-events-none"
        aria-hidden="true"
      ></div>

      {/* Brand Header */}
      <div className="relative z-10 mb-6 text-center">
        <div className="bg-white/85 backdrop-blur-md px-5 py-2 rounded-2xl shadow-xs border border-sky-100/80 inline-block">
          <Image
            src="/logos/logo.webp"
            alt="CV ASIA PLASTIK"
            width={170}
            height={58}
            className="h-8 w-auto object-contain mx-auto"
            priority
          />
        </div>
      </div>

      {/* Main Glassmorphism Card */}
      <div className="relative z-10 w-full max-w-lg bg-white/95 backdrop-blur-xl rounded-3xl p-8 border border-white/90 shadow-[0_20px_45px_rgba(14,165,233,0.08),0_2px_6px_rgba(15,23,42,0.04)]">
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
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50/80 border border-slate-200/90 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
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
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50/80 border border-slate-200/90 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
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
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50/80 border border-slate-200/90 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Kata Sandi Akun</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-9 py-2.5 bg-slate-50/80 border border-slate-200/90 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all font-mono text-xs"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block font-bold text-slate-700">Konfirmasi Kata Sandi</label>
                  {confirmPassword && (
                    <span
                      className={`text-[10px] font-semibold ${
                        password === confirmPassword ? "text-emerald-600" : "text-rose-500"
                      }`}
                    >
                      {password === confirmPassword ? "✓ Cocok" : "✕ Tidak cocok"}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`w-full pl-9 pr-9 py-2.5 bg-slate-50/80 border rounded-xl focus:bg-white focus:ring-2 outline-none transition-all font-mono text-xs ${
                      confirmPassword && password !== confirmPassword
                        ? "border-rose-300 focus:border-rose-500 focus:ring-rose-500/20"
                        : "border-slate-200/90 focus:border-sky-500 focus:ring-sky-500/20"
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
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

            {/* Notifikasi Status Pengiriman OTP & Petunjuk Kode Demo */}
            <div className="p-3.5 rounded-2xl bg-sky-50 border border-sky-200/80 text-sky-900 text-xs space-y-2.5 shadow-2xs">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <p className="font-semibold text-sky-950">Mode Pengujian Sistem (Sandbox)</p>
                  <p className="text-[11px] text-sky-700 leading-relaxed">
                    Pengiriman chat WhatsApp resmi ke nomor fisik membutuhkan token API gateway berbayar. Untuk pengujian saat ini, silakan gunakan kode OTP di bawah ini:
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between bg-white/95 px-3 py-2 rounded-xl border border-sky-200/90 shadow-2xs">
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-500 font-medium">Kode OTP:</span>
                  <span className="text-sm font-mono font-bold text-sky-700 tracking-widest bg-sky-50 px-2 py-0.5 rounded-md border border-sky-200">
                    123456
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setOtp(["1", "2", "3", "4", "5", "6"]);
                    setErrorMessage("");
                  }}
                  className="px-2.5 py-1 bg-sky-500 hover:bg-sky-600 text-white font-bold text-[11px] rounded-lg shadow-2xs transition-all cursor-pointer active:scale-95"
                >
                  Isi Otomatis
                </button>
              </div>
            </div>

            {isSuccess ? (
              <div className="p-6 bg-emerald-50/90 border border-emerald-200/90 rounded-2xl text-center space-y-3 animate-in fade-in zoom-in-95 duration-300">
                <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-2xs">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <h4 className="font-bold text-sm text-emerald-950">Email & Akun Berhasil Diaktifkan!</h4>
                  <p className="text-xs text-emerald-700 mt-1 leading-relaxed">
                    Verifikasi OTP sukses. Status email Anda telah AKTIF di database Firebase. Mengalihkan Anda ke halaman login...
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href={`/login?verified=true&email=${encodeURIComponent(email || "")}`}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-sm shadow-sky-500/25 transition-all active:scale-[0.99]"
                  >
                    <span>Masuk ke Halaman Login Sekarang</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
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

      {/* Bottom Help Desk */}
      <div className="relative z-10 text-center mt-6">
        <Link
          href="mailto:it-support@asiaplastik.com"
          className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-sky-700 transition-colors bg-white/70 backdrop-blur-xs px-3.5 py-1.5 rounded-full border border-sky-100/80 shadow-2xs"
        >
          <HelpCircle className="w-3.5 h-3.5 text-sky-500" />
          <span>Pusat Bantuan IT Pabrik Surabaya</span>
        </Link>
      </div>
    </div>
  );
}
