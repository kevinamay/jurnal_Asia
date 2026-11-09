"use client";

import { useState } from "react";
import { CHART_OF_ACCOUNTS } from "@/lib/mock-data";
import { formatIDR } from "@/lib/utils";
import {
  FileSpreadsheet,
  Search,
  Filter,
  Download,
  Printer,
  Calendar,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

const MOCK_LEDGER_ENTRIES = [
  {
    id: "l-1",
    date: "01 Nov 2026",
    ref: "JV-2026/11-0001",
    description: "Saldo Awal Bulan November 2026",
    debit: 1400000000,
    credit: 0,
    balance: 1400000000,
  },
  {
    id: "l-2",
    date: "03 Nov 2026",
    ref: "INV-2026/11-0085",
    description: "Penerimaan Pelunasan PT Cahaya Abadi",
    debit: 75000000,
    credit: 0,
    balance: 1475000000,
  },
  {
    id: "l-3",
    date: "05 Nov 2026",
    ref: "BILL-2026/11-0044",
    description: "Pembayaran Sewa Kantor Gedung Cyber One",
    debit: 0,
    credit: 65000000,
    balance: 1410000000,
  },
  {
    id: "l-4",
    date: "08 Nov 2026",
    ref: "INV-2026/11-0089",
    description: "Penerimaan Pembayaran PT Digital Sinergi",
    debit: 125000000,
    credit: 0,
    balance: 1535000000,
  },
  {
    id: "l-5",
    date: "08 Nov 2026",
    ref: "BILL-2026/11-0045",
    description: "Pembayaran Tagihan Telkom & Internet",
    debit: 0,
    credit: 14750000,
    balance: 1520250000,
  },
];

export default function LedgerPage() {
  const [selectedAccount, setSelectedAccount] = useState("1-10002");

  const accountInfo = CHART_OF_ACCOUNTS.find((a) => a.code === selectedAccount) || {
    code: "1-10002",
    name: "Bank BCA Giro (IDR)",
    category: "Aset",
  };

  return (
    <div className="space-y-6">
      {/* Account Selector and Period Filter */}
      <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1">
                Pilih Akun Perkiraan (COA)
              </label>
              <select
                value={selectedAccount}
                onChange={(e) => setSelectedAccount(e.target.value)}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-50 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 min-w-[280px]"
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
              <div className="flex items-center gap-2">
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

          <div className="flex items-center gap-2 self-end lg:self-center">
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

        {/* Selected Account Summary Card */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <span className="text-slate-500 text-[11px] block">Kode & Nama Akun</span>
            <span className="font-bold text-slate-900 text-sm">{accountInfo.code}</span>
            <span className="text-slate-700 block truncate">{accountInfo.name}</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <span className="text-slate-500 text-[11px] block">Saldo Awal (01 Nov)</span>
            <span className="font-bold text-slate-900 text-sm font-mono">Rp 1.400.000.000</span>
            <span className="text-slate-500 text-[10px]">Posisi Normal: Debit</span>
          </div>
          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200/80">
            <span className="text-slate-500 text-[11px] block">Total Mutasi Debet / Kredit</span>
            <span className="font-bold text-emerald-600 font-mono text-xs block">+Rp 200.000.000 (D)</span>
            <span className="font-bold text-rose-600 font-mono text-xs block">-Rp 79.750.000 (K)</span>
          </div>
          <div className="bg-sky-50 p-3 rounded-lg border border-sky-200">
            <span className="text-sky-800 text-[11px] font-bold block">Saldo Akhir Berjalan</span>
            <span className="font-extrabold text-sky-900 text-base font-mono">Rp 1.520.250.000</span>
            <span className="text-sky-700 text-[10px]">Real-time per 09 Nov 2026</span>
          </div>
        </div>
      </div>

      {/* Ledger Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-soft overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
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
              {MOCK_LEDGER_ENTRIES.map((entry) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

