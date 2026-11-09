"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpenCheck,
  FileSpreadsheet,
  ArrowDownLeft,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  ShieldCheck,
  HelpCircle,
  Settings,
  KeyRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  {
    group: "MENU UTAMA",
    items: [
      {
        label: "Dashboard",
        href: "/dashboard",
        icon: LayoutDashboard,
        badge: null,
      },
      {
        label: "Jurnal Umum (Entry)",
        href: "/journal/new",
        icon: BookOpenCheck,
        badge: "Input",
      },
      {
        label: "Buku Besar (Ledger)",
        href: "/ledger",
        icon: FileSpreadsheet,
        badge: null,
      },
    ],
  },
  {
    group: "OPERASIONAL KEUANGAN",
    items: [
      {
        label: "Piutang Usaha (A/R)",
        href: "/receivable",
        icon: ArrowDownLeft,
        badge: "14",
      },
      {
        label: "Hutang Usaha (A/P)",
        href: "/payable",
        icon: ArrowUpRight,
        badge: "5",
      },
      {
        label: "Laporan Keuangan",
        href: "/reports",
        icon: BarChart3,
        badge: null,
      },
    ],
  },
  {
    group: "AKSES & KEAMANAN",
    items: [
      {
        label: "Halaman Login",
        href: "/login",
        icon: KeyRound,
        badge: null,
      },
      {
        label: "Registrasi Staf (2FA)",
        href: "/register",
        icon: KeyRound,
        badge: "2FA",
      },
    ],
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-white border-r border-slate-200/90 flex flex-col shrink-0 h-screen sticky top-0 z-40 select-none">
      {/* Brand & Company Switcher */}
      <div className="p-4 border-b border-slate-100">
        {/* Brand Logo */}
        <Link href="/dashboard" className="flex items-center mb-3 hover:opacity-90 transition-opacity">
          <Image
            src="/logos/logo.webp"
            alt="Logo"
            width={271}
            height={92}
            className="h-9 w-auto max-w-[200px] object-contain"
            priority
          />
        </Link>

        {/* Active Company Card */}
        <div className="bg-slate-50 hover:bg-slate-100/80 transition-colors border border-slate-200/80 rounded-lg p-2 flex items-center justify-between cursor-pointer">
          <div className="truncate">
            <p className="text-xs font-semibold text-slate-800 truncate">CV ASIA PLASTIK</p>
            <p className="text-[10px] text-slate-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block"></span>
              IDR • Head Office
            </p>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
        </div>
      </div>

      {/* Navigation Sections */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {NAV_ITEMS.map((section, idx) => (
          <div key={idx}>
            <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-slate-400 mb-2">
              {section.group}
            </p>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive =
                  item.href === "/"
                    ? pathname === "/" || pathname === "/dashboard"
                    : pathname.startsWith(item.href);

                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center justify-between px-3 py-2 text-sm font-medium rounded-lg transition-all",
                        isActive
                          ? "bg-sky-500 text-white font-semibold shadow-sm shadow-sky-500/20"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-50"
                      )}
                    >
                      <div className="flex items-center gap-2.5">
                        <Icon
                          className={cn(
                            "w-4 h-4 transition-colors",
                            isActive ? "text-white" : "text-slate-400 group-hover:text-slate-600"
                          )}
                        />
                        <span>{item.label}</span>
                      </div>

                      {item.badge && (
                        <span
                          className={cn(
                            "text-[10px] font-bold px-1.5 py-0.5 rounded-full",
                            isActive
                              ? "bg-white/20 text-white"
                              : "bg-slate-100 text-slate-600 border border-slate-200"
                          )}
                        >
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Footer Info & Quick System Status */}
      <div className="p-3 border-t border-slate-100 bg-slate-50/50 space-y-2">
        <div className="bg-white border border-slate-200/80 rounded-lg p-2.5">
          <div className="flex items-center justify-between text-xs mb-1">
            <span className="font-medium text-slate-700">Tahun Buku 2026</span>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded border border-emerald-200">
              Terbuka
            </span>
          </div>
          <p className="text-[11px] text-slate-500">Kunci Buku Terakhir: 31 Okt 2026</p>
          <div className="mt-2 pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
              Audit Trail Aktif
            </span>
            <span className="text-slate-400 font-mono text-[10px]">v2.4</span>
          </div>
        </div>

        <div className="flex items-center justify-between px-1 text-slate-400 text-xs">
          <Link href="/settings" className="hover:text-slate-600 flex items-center gap-1 transition-colors">
            <Settings className="w-3.5 h-3.5" /> Pengaturan
          </Link>
          <button className="hover:text-slate-600 flex items-center gap-1 transition-colors">
            <HelpCircle className="w-3.5 h-3.5" /> Bantuan
          </button>
        </div>
      </div>
    </aside>
  );
}

