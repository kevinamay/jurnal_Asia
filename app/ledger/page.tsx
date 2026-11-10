"use client";

import { useState } from "react";
import { CHART_OF_ACCOUNTS } from "@/lib/mock-data";
import { formatIDR } from "@/lib/utils";
import { useAccounting } from "@/context/AccountingContext";
import {
  FileSpreadsheet,
  Download,
  Printer,
  Calendar,
  PlusCircle,
  Inbox,
} from "lucide-react";
import Link from "next/link";

export default function LedgerPage() {
  const [selectedAccount, setSelectedAccount] = useState("1-10002");
  const { getLedgerEntries } = useAccounting();

  const accountInfo = CHART_OF_ACCOUNTS.find((a) => a.code === selectedAccount) || {
    code: "1-10002",
    name: "Bank BCA Giro (IDR)",
    category: "Aset",
  };

  const isDebitNormal =
    accountInfo.category === "Aset" || accountInfo.category === "Beban";

  const ledgerEntries = getLedgerEntries(selectedAccount);

  const totalDebit = ledgerEntries.reduce((sum, item) => sum + item.debit, 0);
  const totalCredit = ledgerEntries.reduce((sum, item) => sum + item.credit, 0);
  const saldoAwal = 0;
  const saldoAkhir = isDebitNormal
    ? saldoAwal + totalDebit - totalCredit
    : saldoAwal + totalCredit - totalDebit;

  const todayFormatted = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date());

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Account Selector and Period Filter */}
      <div className="bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="w-full sm:w-auto">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Pilih Akun Perkiraan (COA)
              </label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="w-full sm:w-auto min-w-0 sm:min-w-[280px] px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              >
                {CHART_OF_ACCOUNTS.map((acc) => (
                  <option key={acc.code} value={acc.code}>
                    {acc.code} - {acc.name} ({acc.category})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Periode Mutasi
              </label>
              <div className="flex flex-wrap items-center gap-2">
                <input
                  type="date"
                  defaultValue="2026-11-01"
                  className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
                <span className="text-slate-400 text-xs">s/d</span>
                <input
                  type="date"
                  defaultValue="2026-11-30"
                  className="px-2.5 py-1.5 text-xs bg-slate-50 border border-slate-300 rounded-lg text-slate-800"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start sm:self-end lg:self-center">
            <button
              title="Cetak Laporan Buku Besar"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak</span>
            </button>
            <button
              title="Export Excel"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Ekspor Excel</span>
            </button>
            <Link
              href="/journal/new"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-lg shadow-xs transition-colors"
            >
              <span>+ Input Jurnal</span>
            </Link>
          </div>
        </div>

        {/* Selected Account Summary Card (Responsive Grid: 1 col on mobile, 2 col on tablet, 4 col on desktop) */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <span className="text-slate-500 text-[11px] block">Kode & Nama Akun</span>
            <span className="font-bold text-slate-900 text-sm">{accountInfo.code}</span>
            <span className="text-slate-700 block truncate">{accountInfo.name}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <span className="text-slate-500 text-[11px] block">Saldo Awal (01 Nov)</span>
            <span className="font-bold text-slate-900 text-sm font-mono">{formatIDR(saldoAwal)}</span>
            <span className="text-slate-500 text-[10px]">
              Posisi Normal: {isDebitNormal ? "Debit" : "Kredit"}
            </span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <span className="text-slate-500 text-[11px] block">Total Mutasi Debet / Kredit</span>
            <span className="font-bold text-emerald-600 font-mono text-xs block">
              +{formatIDR(totalDebit)} (D)
            </span>
            <span className="font-bold text-rose-600 font-mono text-xs block">
              -{formatIDR(totalCredit)} (K)
            </span>
          </div>
          <div className="bg-sky-50 p-3 rounded-lg border border-sky-200">
            <span className="text-sky-800 text-[11px] font-bold block">Saldo Akhir Berjalan</span>
            <span className="font-extrabold text-sky-900 text-base font-mono">
              {formatIDR(saldoAkhir)}
            </span>
            <span className="text-sky-700 text-[10px]">Real-time per {todayFormatted}</span>
          </div>
        </div>
      </div>

      {/* Ledger Table with Horizontal Scroll for Mobile */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">No. Bukti / Ref</th>
                <th className="py-3 px-4">Keterangan Transaksi</th>
                <th className="py-3 px-4 text-right">Debit (IDR)</th>
                <th className="py-3 px-4 text-right">Kredit (IDR)</th>
                <th className="py-3 px-4 text-right">Saldo Kumulatif (IDR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {ledgerEntries.length > 0 ? (
                ledgerEntries.map((entry) => (
                  <tr key={entry.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 text-slate-600 whitespace-nowrap">{entry.date}</td>
                    <td className="py-3 px-4 font-mono font-semibold text-sky-600 hover:underline cursor-pointer">
                      {entry.ref}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">{entry.description}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                      {entry.debit > 0 ? formatIDR(entry.debit) : "-"}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-800">
                      {entry.credit > 0 ? formatIDR(entry.credit) : "-"}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-extrabold text-slate-900 bg-slate-50/50">
                      {formatIDR(entry.balance)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-16 text-center text-slate-500 bg-slate-50/30">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3 px-4">
                      <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center text-sky-500 border border-sky-100">
                        <FileSpreadsheet className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">
                          Belum Ada Mutasi Buku Besar
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Belum ada transaksi debit atau kredit untuk akun{" "}
                          <span className="font-semibold text-slate-700">
                            {accountInfo.code} - {accountInfo.name}
                          </span>{" "}
                          pada periode ini.
                        </p>
                      </div>
                      <Link
                        href="/journal/new"
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-lg shadow-sm transition-all"
                      >
                        <PlusCircle className="w-3.5 h-3.5" />
                        <span>Input Jurnal Baru</span>
                      </Link>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
