"use client";

import {
  FileText,
  BarChart3,
  TrendingUp,
  Scale,
  DollarSign,
  Download,
  Calendar,
  ArrowRight,
  Printer,
} from "lucide-react";
import { formatIDR } from "@/lib/utils";
import { useAccounting } from "@/context/AccountingContext";

const REPORT_CARDS = [
  {
    id: "neraca",
    title: "Neraca Keuangan (Balance Sheet)",
    description: "Posisi aset, liabilitas, dan ekuitas perusahaan per tanggal tertentu",
    icon: Scale,
    updated: "Hari ini",
    badge: "Wajib Audit",
  },
  {
    id: "laba-rugi",
    title: "Laporan Laba Rugi (Profit & Loss)",
    description: "Pendapatan kotor, HPP, beban operasional, dan laba bersih berjalan",
    icon: TrendingUp,
    updated: "Hari ini",
    badge: "MTD + YTD",
  },
  {
    id: "arus-kas",
    title: "Laporan Arus Kas (Cash Flow Statement)",
    description: "Arus kas dari aktivitas operasi, investasi, dan pendanaan",
    icon: DollarSign,
    updated: "Hari ini",
    badge: "Metode Langsung",
  },
  {
    id: "neraca-saldo",
    title: "Neraca Saldo (Trial Balance)",
    description: "Daftar saldo debit dan kredit seluruh akun COA untuk memastikan keseimbangan",
    icon: BarChart3,
    updated: "Hari ini",
    badge: "Trial Balance",
  },
];

export default function ReportsPage() {
  const { revenueMTD, totalExpenses } = useAccounting();

  const hpp = 0;
  const grossProfit = revenueMTD - hpp;
  const netIncome = grossProfit - totalExpenses;

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Context */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-soft flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
        <div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900">Pusat Laporan Finansial Standar PSAK</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Laporan keuangan komprehensif siap cetak dan ekspor untuk kebutuhan manajemen dan pajak
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>Periode: Nov 2026</span>
          </button>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors">
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>Unduh Semua (ZIP)</span>
          </button>
        </div>
      </div>

      {/* Report Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
        {REPORT_CARDS.map((report) => {
          const Icon = report.icon;
          return (
            <div
              key={report.id}
              className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-soft hover:shadow-elevation hover:border-sky-300 transition-all cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-sky-50 text-sky-600 flex items-center justify-center border border-sky-100 group-hover:bg-sky-500 group-hover:text-white transition-colors">
                  <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                  {report.badge}
                </span>
              </div>

              <h3 className="text-sm font-bold text-slate-900 group-hover:text-sky-600 transition-colors">
                {report.title}
              </h3>
              <p className="text-xs text-slate-500 mt-1 mb-4 leading-relaxed">
                {report.description}
              </p>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-400">Diperbarui: {report.updated}</span>
                <span className="inline-flex items-center gap-1 font-bold text-sky-600 group-hover:translate-x-0.5 transition-transform">
                  Buka Laporan <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Snapshot Preview: Laba Rugi Berjalan */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-soft">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
          <div>
            <h3 className="text-sm font-bold text-slate-900">
              Ringkasan Laba Rugi Komparatif (MTD - November 2026)
            </h3>
            <p className="text-xs text-slate-500">Angka sebelum audit penyesuaian akhir bulan</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded border border-slate-200">
              <Printer className="w-3.5 h-3.5" />
            </button>
            <button className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded border border-slate-200">
              <Download className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-2 text-xs font-sans overflow-x-auto">
          <div className="flex items-center justify-between py-1.5 px-2 bg-slate-50 rounded font-semibold text-slate-800 min-w-[320px]">
            <span>Total Pendapatan Usaha (Revenue)</span>
            <span className="font-mono text-emerald-600 font-bold">{formatIDR(revenueMTD)}</span>
          </div>
          <div className="flex items-center justify-between py-1.5 px-2 text-slate-600 min-w-[320px]">
            <span className="pl-4">Beban Pokok Penjualan (HPP)</span>
            <span className="font-mono font-semibold">({formatIDR(hpp)})</span>
          </div>
          <div className="flex items-center justify-between py-1.5 px-2 border-t border-slate-200 font-bold text-slate-900 min-w-[320px]">
            <span>LABA KOTOR (GROSS PROFIT)</span>
            <span className="font-mono text-sky-600">{formatIDR(grossProfit)}</span>
          </div>
          <div className="flex items-center justify-between py-1.5 px-2 text-slate-600 min-w-[320px]">
            <span className="pl-4">Total Beban Operasional & Gaji</span>
            <span className="font-mono font-semibold">({formatIDR(totalExpenses)})</span>
          </div>
          <div className="flex items-center justify-between py-2 px-2 bg-sky-50 border border-sky-200 rounded font-bold text-slate-900 text-sm min-w-[320px]">
            <span className="text-sky-950 font-extrabold text-xs sm:text-sm">LABA BERSIH BERJALAN (NET INCOME)</span>
            <span className="font-mono text-emerald-600 font-extrabold text-sm sm:text-base">
              {formatIDR(netIncome)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
