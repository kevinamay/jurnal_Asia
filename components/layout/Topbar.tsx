"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  Plus,
  Calendar,
  Search,
  Bell,
  ChevronDown,
  FilePlus2,
  Receipt,
  FileText,
  LogOut,
} from "lucide-react";
import { useState, useEffect } from "react";

const TITLE_MAP: Record<string, { title: string; subtitle: string }> = {
  "/": {
    title: "Dashboard Keuangan",
    subtitle: "Ringkasan metrik kinerja finansial, arus kas, dan aktivitas terkini",
  },
  "/dashboard": {
    title: "Dashboard Keuangan",
    subtitle: "Ringkasan metrik kinerja finansial, arus kas, dan aktivitas terkini",
  },
  "/journal/new": {
    title: "Input Jurnal Umum",
    subtitle: "Pencatatan transaksi manual debet & kredit dengan verifikasi keseimbangan",
  },
  "/ledger": {
    title: "Buku Besar (General Ledger)",
    subtitle: "Rincian mutasi akun perkiraan dan saldo kumulatif",
  },
  "/receivable": {
    title: "Piutang Usaha (Accounts Receivable)",
    subtitle: "Daftar tagihan penjualan, umur piutang, dan status pembayaran pelanggan",
  },
  "/payable": {
    title: "Hutang Usaha (Accounts Payable)",
    subtitle: "Manajemen tagihan pemasok, jadwal jatuh tempo, dan pembayaran",
  },
  "/reports": {
    title: "Laporan Finansial & Akuntansi",
    subtitle: "Neraca saldo, laba rugi, arus kas, dan laporan perubahan modal",
  },
};

interface TopbarProps {
  onToggleSidebar?: () => void;
}

export function Topbar({ onToggleSidebar }: TopbarProps) {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{
    fullName?: string;
    email?: string;
  } | null>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("asia_auth_user");
      if (saved) {
        setCurrentUser(JSON.parse(saved));
      }
    } catch {
      // Ignore
    }
  }, []);

  const handleLogout = () => {
    try {
      localStorage.removeItem("asia_auth_user");
      localStorage.removeItem("asia_current_session");
    } catch {
      // Ignore
    }
    window.location.href = "/login";
  };

  const currentRouteInfo =
    TITLE_MAP[pathname] || {
      title: "Sistem Akuntansi Internal",
      subtitle: "CV ASIA PLASTIK • Dashboard Keuangan",
    };

  const currentDateFormatted = new Intl.DateTimeFormat("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(new Date());

  const displayName = currentUser?.fullName || "Staf Keuangan";
  const userInitials =
    displayName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((w) => w[0])
      .join("")
      .toUpperCase() || "AP";

  return (
    <header className="h-16 bg-white border-b border-slate-200/90 px-3 sm:px-6 flex items-center justify-between sticky top-0 z-30 shadow-xs">
      {/* Left: Mobile Hamburger Toggle + Page Title */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <button
          type="button"
          onClick={onToggleSidebar}
          className="lg:hidden p-2 -ml-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
          aria-label="Buka Menu Navigasi"
          title="Buka Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 tracking-tight leading-none truncate">
              {currentRouteInfo.title}
            </h1>
            <span className="hidden sm:inline-flex text-[10px] sm:text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 items-center gap-1 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Live
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 mt-0.5 truncate max-w-[150px] sm:max-w-xs md:max-w-md lg:max-w-xl">
            {currentRouteInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Tools: Date, Search, Quick Action, Profile */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Date Display (Desktop only) */}
        <div className="hidden xl:flex items-center gap-2 text-xs font-medium text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-200/80">
          <Calendar className="w-3.5 h-3.5 text-slate-400" />
          <span>{currentDateFormatted}</span>
        </div>

        {/* Search Input (Medium and up) */}
        <div className="relative hidden md:block">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari transaksi / akun... (Ctrl+K)"
            className="w-44 lg:w-56 pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all"
          />
        </div>

        {/* Notifications */}
        <button
          title="Notifikasi Verifikasi Transaksi"
          className="relative p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-200"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white"></span>
        </button>

        <div className="hidden sm:block h-6 w-[1px] bg-slate-200 mx-0.5"></div>

        {/* Quick 'New Transaction' Action Button */}
        <div className="relative">
          <div className="inline-flex rounded-lg shadow-sm">
            <Link
              href="/journal/new"
              className="inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-l-lg transition-colors shadow-xs"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span className="hidden sm:inline">Transaksi Baru</span>
              <span className="sm:hidden text-[11px] font-bold">Baru</span>
            </Link>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="px-1.5 sm:px-2 py-1.5 bg-sky-600 hover:bg-sky-700 text-white rounded-r-lg border-l border-sky-400/40 transition-colors"
              title="Pilihan Transaksi Lain"
            >
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

          {dropdownOpen && (
            <div
              className="absolute right-0 mt-1.5 w-52 bg-white rounded-lg shadow-lg border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-1"
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Buat Entri Baru
              </div>
              <Link
                href="/journal/new"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-sky-50 hover:text-sky-600 font-medium"
              >
                <FilePlus2 className="w-3.5 h-3.5 text-sky-500" />
                <span>Jurnal Umum Manual</span>
              </Link>
              <Link
                href="/receivable"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-sky-50 hover:text-sky-600 font-medium"
              >
                <Receipt className="w-3.5 h-3.5 text-emerald-500" />
                <span>Faktur Penjualan (A/R)</span>
              </Link>
              <Link
                href="/payable"
                onClick={() => setDropdownOpen(false)}
                className="flex items-center gap-2 px-3 py-2 text-slate-700 hover:bg-sky-50 hover:text-sky-600 font-medium"
              >
                <FileText className="w-3.5 h-3.5 text-amber-500" />
                <span>Tagihan Pembelian (A/P)</span>
              </Link>
            </div>
          )}
        </div>

        {/* User Profile Pill with Dropdown */}
        <div className="relative">
          <div
            onClick={() => setProfileOpen(!profileOpen)}
            className="flex items-center gap-2 pl-1 sm:pl-1.5 py-1 pr-1.5 sm:pr-2 rounded-lg hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-200 cursor-pointer select-none"
          >
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-sky-100 text-sky-700 font-bold text-xs flex items-center justify-center border border-sky-300">
              {userInitials}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-bold text-slate-800 leading-tight truncate max-w-[120px]">
                {displayName}
              </p>
              <p className="text-[10px] text-slate-500 leading-tight">CV ASIA PLASTIK</p>
            </div>
            <ChevronDown className="w-3 h-3 text-slate-400 hidden sm:block" />
          </div>

          {profileOpen && (
            <div
              className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-slate-200 py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-1"
              onMouseLeave={() => setProfileOpen(false)}
            >
              <div className="px-3.5 py-2.5 border-b border-slate-100">
                <p className="font-bold text-slate-900 truncate">{displayName}</p>
                <p className="text-[11px] text-slate-500 truncate">
                  {currentUser?.email || "staf@asiaplastik.com"}
                </p>
                <span className="inline-block mt-1 text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  Sesi Aktif
                </span>
              </div>
              <div className="p-1">
                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 px-3 py-2 text-rose-600 hover:bg-rose-50 hover:text-rose-700 font-semibold rounded-lg transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Keluar Akun (Log Out)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
