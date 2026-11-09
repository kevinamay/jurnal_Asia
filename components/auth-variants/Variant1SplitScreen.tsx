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
  KeyRound,
  CheckCircle2,
  RefreshCw,
  Building2,
} from "lucide-react";

export function Variant1SplitScreen() {
  const [view, setView] = useState<"login" | "register" | "otp-method" | "otp-verify">("register");
  const [otpMethod, setOtpMethod] = useState<"whatsapp" | "email">("whatsapp");
  const [formData, setFormData] = useState({
    name: "Kevin Pratama",
    email: "kevin@asiaplastik.com",
    whatsapp: "081234567890",
  });
  const [otpCode, setOtpCode] = useState(["", "", "", "", "", ""]);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleOtpInput = (index: number, val: string) => {
    if (val.length > 1) val = val[val.length - 1];
    const newOtp = [...otpCode];
    newOtp[index] = val;
    setOtpCode(newOtp);
    // Auto-focus next input
    if (val && index < 5) {
      const nextInput = document.getElementById(`v1-otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-slate-50 font-sans text-slate-900">
      {/* Left Column: Visual Brand Hero (Light Blue theme) */}
      <div className="lg:w-1/2 bg-gradient-to-br from-sky-500 via-sky-600 to-sky-700 text-white p-8 lg:p-12 flex flex-col justify-between relative overflow-hidden">
        {/* Subtle decorative background circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-sky-400/20 blur-3xl pointer-events-none"></div>

        {/* Top: Logo & Entity badge */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="bg-white/95 backdrop-blur-sm px-4 py-2 rounded-xl shadow-lg inline-block">
            <Image
              src="/logos/logo.webp"
              alt="Logo CV ASIA PLASTIK"
              width={180}
              height={60}
              className="h-8 w-auto object-contain"
              priority
            />
          </div>
          <span className="text-xs font-semibold bg-white/15 px-3 py-1 rounded-full border border-white/20 text-white">
            ERP Internal v2.4
          </span>
        </div>

        {/* Middle: Headline & Value Proposition */}
        <div className="relative z-10 my-12 max-w-lg">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-sky-200 bg-sky-800/40 px-3 py-1 rounded-full border border-sky-300/20 mb-4">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-300" />
            Portal Finansial Terenkripsi 2FA
          </span>
          <h1 className="text-3xl lg:text-4xl font-extrabold tracking-tight text-white leading-tight">
            Sistem Informasi Akuntansi & Manajemen Kas
          </h1>
          <p className="mt-4 text-sky-100 text-sm leading-relaxed">
            Pencatatan jurnal umum, monitoring arus kas harian, dan pembukuan terpusat resmi untuk seluruh tim operasional <strong>CV ASIA PLASTIK</strong>.
          </p>

          {/* Mini Feature Highlights */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/15 text-xs">
              <CheckCircle2 className="w-4 h-4 text-sky-200 shrink-0" />
              <span>Verifikasi Keamanan Ganda via WhatsApp OTP resmi & Email Kantor</span>
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-xl border border-white/15 text-xs">
              <CheckCircle2 className="w-4 h-4 text-sky-200 shrink-0" />
              <span>Audit Trail terintegrasi dengan standar pembukuan PSAK Indonesia</span>
            </div>
          </div>
        </div>

        {/* Bottom: Footer Info */}
        <div className="relative z-10 pt-6 border-t border-white/15 text-xs text-sky-200 flex items-center justify-between">
          <span>&copy; 2026 CV ASIA PLASTIK. Hak Cipta Dilindungi.</span>
          <span className="text-white font-medium">Bantuan Tim IT: ext. 104</span>
        </div>
      </div>

      {/* Right Column: Form Card */}
      <div className="lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md bg-white rounded-2xl p-8 border border-slate-200/90 shadow-soft">
          {/* STEP 1: LOGIN */}
          {view === "login" && (
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Masuk ke Akun Anda</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Masukkan email atau nomor WhatsApp yang telah terverifikasi
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setView("otp-method");
                }}
                className="space-y-4 text-xs"
              >
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Email / No. WhatsApp
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="nama@asiaplastik.com / 0812..."
                      defaultValue="kevin@asiaplastik.com"
                      required
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Kata Sandi
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      placeholder="••••••••"
                      defaultValue="password123"
                      required
                      className="w-full pl-9 pr-3 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs pt-1">
                  <label className="flex items-center gap-2 cursor-pointer text-slate-600">
                    <input type="checkbox" className="rounded border-slate-300 text-sky-500 focus:ring-sky-500" defaultChecked />
                    <span>Ingat saya</span>
                  </label>
                  <a href="#" className="font-semibold text-sky-600 hover:underline">
                    Lupa sandi?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg shadow-sm shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Masuk Sekarang</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                Belum memiliki akun staf?{" "}
                <button
                  onClick={() => setView("register")}
                  className="font-bold text-sky-600 hover:underline"
                >
                  Daftar Akun Baru
                </button>
              </div>
            </div>
          )}

          {/* STEP 2: REGISTER (Nama, Email, No WA) */}
          {view === "register" && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 px-2 py-0.5 rounded border border-sky-200">
                  Desain 1: Split Screen Modern
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">Pendaftaran Akun Staf</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Lengkapi data diri Anda. Akun memerlukan verifikasi kode OTP sebelum aktif.
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setView("otp-method");
                }}
                className="space-y-3.5 text-xs"
              >
                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nama Lengkap <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Masukkan nama lengkap sesuai KTP"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Alamat Email <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      placeholder="nama@asiaplastik.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nomor WhatsApp Aktif <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="tel"
                      placeholder="08xxxxxxxxxx (untuk kirim kode OTP)"
                      value={formData.whatsapp}
                      onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Kata Sandi <span className="text-rose-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="password"
                      placeholder="Minimal 8 karakter"
                      defaultValue="Password123!"
                      required
                      className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                    />
                  </div>
                </div>

                <div className="p-3 bg-sky-50 rounded-lg border border-sky-100 text-[11px] text-sky-800 flex items-start gap-2">
                  <KeyRound className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <span>
                    Setelah menekan tombol daftar, sistem akan mengirimkan kode OTP ke WhatsApp atau Email pilihan Anda.
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-lg shadow-sm shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Lanjutkan ke Pemilihan OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

              <div className="pt-4 border-t border-slate-100 text-center text-xs text-slate-500">
                Sudah memiliki akun?{" "}
                <button
                  onClick={() => setView("login")}
                  className="font-bold text-sky-600 hover:underline"
                >
                  Masuk di sini
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: OTP CHANNEL PICKER (WhatsApp vs Email) */}
          {view === "otp-method" && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-sky-50 text-sky-700 px-2 py-0.5 rounded border border-sky-200">
                  Langkah 2: Saluran Verifikasi
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">Pilih Saluran Kirim OTP</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Pilih ke mana kode rahasia 6-digit OTP ingin dikirimkan untuk memverifikasi akun Anda.
                </p>
              </div>

              <div className="space-y-3">
                {/* Channel Option 1: WhatsApp */}
                <div
                  onClick={() => setOtpMethod("whatsapp")}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    otpMethod === "whatsapp"
                      ? "border-emerald-500 bg-emerald-50/50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-emerald-500 text-white flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Kirim via WhatsApp (Instan)</h4>
                      <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                        +{formData.whatsapp || "081234567890"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      otpMethod === "whatsapp" ? "border-emerald-500 bg-emerald-500" : "border-slate-300"
                    }`}
                  >
                    {otpMethod === "whatsapp" && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                  </div>
                </div>

                {/* Channel Option 2: Email */}
                <div
                  onClick={() => setOtpMethod("email")}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex items-center justify-between ${
                    otpMethod === "email"
                      ? "border-sky-500 bg-sky-50/50 shadow-sm"
                      : "border-slate-200 hover:border-slate-300 bg-white"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">Kirim via Email Resmi</h4>
                      <p className="text-[11px] text-slate-500 truncate max-w-[200px] mt-0.5">
                        {formData.email || "kevin@asiaplastik.com"}
                      </p>
                    </div>
                  </div>
                  <div
                    className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                      otpMethod === "email" ? "border-sky-500 bg-sky-500" : "border-slate-300"
                    }`}
                  >
                    {otpMethod === "email" && <span className="w-1.5 h-1.5 bg-white rounded-full"></span>}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setView("register")}
                  className="w-1/3 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                >
                  Kembali
                </button>
                <button
                  type="button"
                  onClick={() => setView("otp-verify")}
                  className="w-2/3 py-2.5 px-4 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-lg shadow-sm shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
                >
                  <span>Kirim Kode OTP</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: OTP VERIFICATION (6 Digits) */}
          {view === "otp-verify" && (
            <div className="space-y-6">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded border border-emerald-200">
                  Langkah 3: Masukkan Kode OTP
                </span>
                <h2 className="text-2xl font-bold text-slate-900 mt-2">Verifikasi 6-Digit OTP</h2>
                <p className="text-xs text-slate-500 mt-1">
                  Kode 6-digit telah dikirimkan ke{" "}
                  <strong className="text-slate-800">
                    {otpMethod === "whatsapp" ? `WhatsApp (${formData.whatsapp})` : `Email (${formData.email})`}
                  </strong>
                </p>
              </div>

              {isSuccess ? (
                <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-center space-y-2">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                  <h4 className="font-bold text-sm text-emerald-900">Akun Berhasil Diverifikasi!</h4>
                  <p className="text-xs text-emerald-700">
                    Selamat datang di Portal Akuntansi CV ASIA PLASTIK. Mengarahkan Anda ke Dashboard...
                  </p>
                  <Link
                    href="/"
                    className="inline-block mt-2 px-4 py-2 bg-emerald-600 text-white text-xs font-bold rounded-lg"
                  >
                    Buka Dashboard Keuangan
                  </Link>
                </div>
              ) : (
                <div className="space-y-5">
                  {/* 6 Digit Inputs */}
                  <div className="flex justify-between gap-2">
                    {otpCode.map((digit, idx) => (
                      <input
                        key={idx}
                        id={`v1-otp-${idx}`}
                        type="text"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpInput(idx, e.target.value)}
                        className="w-12 h-12 text-center text-lg font-bold font-mono bg-slate-50 border-2 border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:border-sky-500 focus:bg-white focus:ring-2 focus:ring-sky-500/20"
                      />
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span>
                      Kirim ulang kode dalam: <strong className="text-sky-600 font-mono">01:45</strong>
                    </span>
                    <button className="text-sky-600 font-semibold hover:underline flex items-center gap-1">
                      <RefreshCw className="w-3 h-3" /> Kirim Ulang
                    </button>
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setView("otp-method")}
                      className="w-1/3 py-2.5 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                    >
                      Ubah Saluran
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setIsVerifying(true);
                        setTimeout(() => {
                          setIsVerifying(false);
                          setIsSuccess(true);
                        }, 800);
                      }}
                      className="w-2/3 py-2.5 px-4 bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold rounded-lg shadow-sm shadow-sky-500/20 transition-all flex items-center justify-center gap-2"
                    >
                      <span>{isVerifying ? "Memverifikasi..." : "Verifikasi & Aktifkan"}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

