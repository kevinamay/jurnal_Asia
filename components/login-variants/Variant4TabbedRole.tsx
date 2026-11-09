"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Briefcase,
  Layers,
  Crown,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";

type RoleKey = "finance" | "logistics" | "executive";

const ROLES: {
  id: RoleKey;
  label: string;
  badge: string;
  icon: typeof Briefcase;
  sampleEmail: string;
  hint: string;
}[] = [
  {
    id: "finance",
    label: "Akuntansi & Pajak",
    badge: "Level 1 • Ledger & Kas",
    icon: Briefcase,
    sampleEmail: "akunting@asiaplastik.com",
    hint: "Otorisasi entri jurnal umum, buku besar, dan rekonsiliasi bank",
  },
  {
    id: "logistics",
    label: "Gudang & Logistik",
    badge: "Level 2 • Pallet & A/R",
    icon: Layers,
    sampleEmail: "gudang.rungkut@asiaplastik.com",
    hint: "Pencatatan faktur pengiriman pallet & verifikasi tanda terima barang",
  },
  {
    id: "executive",
    label: "Direksi & Manajer",
    badge: "Level 3 • Full Access",
    icon: Crown,
    sampleEmail: "direksi@asiaplastik.com",
    hint: "Akses laporan laba rugi konsolidasi, neraca, dan persetujuan pengeluaran",
  },
];

export function Variant4TabbedRole() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<RoleKey>("finance");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState(ROLES[0].sampleEmail);
  const [password, setPassword] = useState("••••••••••••");
  const [isLoading, setIsLoading] = useState(false);

  const selectedRoleMeta = ROLES.find((r) => r.id === activeRole) || ROLES[0];

  const handleRoleChange = (role: RoleKey) => {
    setActiveRole(role);
    const meta = ROLES.find((r) => r.id === role);
    if (meta) setEmail(meta.sampleEmail);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-sky-50/60 via-slate-50 to-white flex flex-col items-center justify-center p-4 font-sans text-slate-900 pb-24">
      <div className="w-full max-w-lg space-y-5">
        {/* Top Logo */}
        <div className="text-center">
          <div className="bg-white px-5 py-2.5 rounded-2xl shadow-soft border border-slate-200/80 inline-block mb-2">
            <Image
              src="/logos/logo.webp"
              alt="CV ASIA PLASTIK"
              width={180}
              height={60}
              className="h-8 w-auto object-contain mx-auto"
              priority
            />
          </div>
          <h2 className="text-lg font-bold text-slate-900">Portal Akses Berdasarkan Divisi</h2>
          <p className="text-xs text-slate-500">Pilih divisi kerja Anda untuk memuat otorisasi yang sesuai</p>
        </div>

        {/* 3 Role Selection Tabs */}
        <div className="grid grid-cols-3 gap-2 bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200/80">
          {ROLES.map((role) => {
            const Icon = role.icon;
            const isSelected = activeRole === role.id;
            return (
              <button
                key={role.id}
                type="button"
                onClick={() => handleRoleChange(role.id)}
                className={`flex flex-col items-center justify-center py-2.5 px-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-white text-sky-700 shadow-sm border border-slate-200/80 scale-[1.02]"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/50"
                }`}
              >
                <Icon className={`w-4 h-4 mb-1 ${isSelected ? "text-sky-600" : "text-slate-400"}`} />
                <span className="text-[11px] leading-tight text-center">{role.label}</span>
              </button>
            );
          })}
        </div>

        {/* Main Card */}
        <div className="bg-white rounded-3xl p-7 border border-slate-200 shadow-soft space-y-5">
          {/* Active Role Meta Callout */}
          <div className="p-3 bg-sky-50/70 border border-sky-100 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-[10px] font-bold text-sky-700 uppercase tracking-wider block">
                {selectedRoleMeta.badge}
              </span>
              <p className="text-[11px] text-slate-600 mt-0.5">{selectedRoleMeta.hint}</p>
            </div>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shrink-0"></span>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-slate-700 mb-1">
                Email / NIK Divisi {selectedRoleMeta.label}
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all"
                  required
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block font-bold text-slate-700">Kata Sandi</label>
                <Link href="/auth?forgot=true" className="text-[11px] font-semibold text-sky-600 hover:underline">
                  Lupa kata sandi?
                </Link>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 outline-none transition-all font-mono"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 mt-4 cursor-pointer active:scale-[0.99]"
            >
              {isLoading ? (
                <span>Mengautentikasi...</span>
              ) : (
                <>
                  <span>Otorisasi & Masuk Portal</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Perlu bantuan akses akun?</span>
            <Link href="mailto:it@asiaplastik.com" className="font-bold text-sky-600 hover:underline">
              Hubungi Admin IT
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
