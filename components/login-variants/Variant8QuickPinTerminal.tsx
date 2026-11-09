"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  User,
  Delete,
  ArrowRight,
  ShieldCheck,
  Building,
  RotateCcw,
} from "lucide-react";

export function Variant8QuickPinTerminal() {
  const router = useRouter();
  const [nik, setNik] = useState("AP-20491");
  const [pin, setPin] = useState(["", "", "", ""]);
  const [activePinIndex, setActivePinIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const handleKeypadPress = (val: string) => {
    if (activePinIndex < 4) {
      const nextPin = [...pin];
      nextPin[activePinIndex] = val;
      setPin(nextPin);
      setActivePinIndex(activePinIndex + 1);

      // Auto-submit when 4th digit entered
      if (activePinIndex === 3) {
        setIsLoading(true);
        setTimeout(() => {
          router.push("/dashboard");
        }, 600);
      }
    }
  };

  const handleClear = () => {
    setPin(["", "", "", ""]);
    setActivePinIndex(0);
  };

  const handleDelete = () => {
    if (activePinIndex > 0) {
      const nextPin = [...pin];
      nextPin[activePinIndex - 1] = "";
      setPin(nextPin);
      setActivePinIndex(activePinIndex - 1);
    }
  };

  return (
    <div className="min-h-screen w-full bg-slate-50 flex flex-col items-center justify-center p-4 font-sans text-slate-900 pb-24">
      <div className="w-full max-w-sm space-y-5">
        {/* Top Logo */}
        <div className="text-center space-y-1.5">
          <div className="bg-white px-5 py-2 rounded-2xl shadow-soft border border-slate-200/80 inline-block">
            <Image
              src="/logos/logo.webp"
              alt="CV ASIA PLASTIK"
              width={160}
              height={55}
              className="h-7 w-auto object-contain mx-auto"
              priority
            />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Terminal Akses Cepat Staf</h2>
          <p className="text-xs text-slate-500">Masukkan NIK dan 4 digit PIN Otorisasi</p>
        </div>

        {/* Main Terminal Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-soft space-y-5">
          {/* NIK Field */}
          <div>
            <label className="block text-[11px] font-bold text-slate-600 mb-1">
              Nomor Induk Karyawan (NIK)
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={nik}
                onChange={(e) => setNik(e.target.value)}
                placeholder="Contoh: AP-20491"
                className="w-full pl-9 pr-3 py-2 text-xs font-mono font-bold bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 outline-none"
              />
            </div>
          </div>

          {/* 4 Digit PIN Dots */}
          <div className="space-y-2 text-center">
            <label className="block text-xs font-bold text-slate-700">
              PIN Keamanan Karyawan
            </label>
            <div className="flex justify-center gap-3 py-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className={`w-11 h-12 rounded-xl flex items-center justify-center font-mono font-bold text-lg border transition-all ${
                    pin[i]
                      ? "bg-sky-50 border-sky-400 text-sky-700 shadow-xs"
                      : i === activePinIndex
                      ? "border-sky-500 ring-2 ring-sky-300/40 bg-white"
                      : "border-slate-200 bg-slate-50 text-slate-400"
                  }`}
                >
                  {pin[i] ? "●" : ""}
                </div>
              ))}
            </div>
          </div>

          {/* Tactile Numeric Keypad */}
          <div className="grid grid-cols-3 gap-2 pt-1">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => (
              <button
                key={digit}
                type="button"
                onClick={() => handleKeypadPress(String(digit))}
                disabled={isLoading}
                className="h-12 rounded-xl bg-slate-50 hover:bg-sky-50 hover:border-sky-200 active:bg-sky-100 border border-slate-200 text-slate-800 font-bold text-base transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
              >
                {digit}
              </button>
            ))}

            <button
              type="button"
              onClick={handleClear}
              title="Reset PIN"
              className="h-12 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-500 text-xs font-bold transition-all flex items-center justify-center cursor-pointer active:scale-95"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            <button
              type="button"
              onClick={() => handleKeypadPress("0")}
              disabled={isLoading}
              className="h-12 rounded-xl bg-slate-50 hover:bg-sky-50 hover:border-sky-200 active:bg-sky-100 border border-slate-200 text-slate-800 font-bold text-base transition-all flex items-center justify-center cursor-pointer shadow-xs active:scale-95"
            >
              0
            </button>

            <button
              type="button"
              onClick={handleDelete}
              title="Hapus Digit Terakhir"
              className="h-12 rounded-xl bg-slate-50 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200 border border-slate-200 text-slate-500 text-xs font-bold transition-all flex items-center justify-center cursor-pointer active:scale-95"
            >
              <Delete className="w-4 h-4" />
            </button>
          </div>

          {/* Alternative action */}
          <div className="pt-2 text-center text-[11px] text-slate-500">
            <span>Staf kantor tanpa PIN? </span>
            <Link href="/auth?variant=1" className="font-bold text-sky-600 hover:underline">
              Gunakan Email Perusahaan
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
