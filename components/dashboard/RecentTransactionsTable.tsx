"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  ArrowUpRight,
  ArrowDownLeft,
  FileText,
  ChevronRight,
  Download,
  Eye,
} from "lucide-react";
import { Transaction } from "@/lib/mock-data";
import { formatIDR } from "@/lib/utils";
import { useAccounting } from "@/context/AccountingContext";

export function RecentTransactionsTable() {
  const { transactions } = useAccounting();
  const [filterType, setFilterType] = useState<"all" | "income" | "expense" | "pending">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTransactions = transactions.filter((tx) => {
    const matchesFilter =
      filterType === "all"
        ? true
        : filterType === "income"
        ? tx.type === "income"
        : filterType === "expense"
        ? tx.type === "expense"
        : tx.status === "Pending" || tx.status === "Overdue";

    const matchesSearch =
      tx.refNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.contact.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.category.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesFilter && matchesSearch;
  });

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-soft overflow-hidden">
      {/* Table Header & Controls */}
      <div className="p-5 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Aktivitas Transaksi Finansial Terkini</h2>
            <span className="text-xs font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              {filteredTransactions.length} Rekord
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar mutasi jurnal, faktur penjualan, dan pengeluaran beban operasional
          </p>
        </div>

        {/* Filter controls & Search */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Filter Pills */}
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium text-slate-600">
            <button
              onClick={() => setFilterType("all")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filterType === "all" ? "bg-white text-slate-900 font-bold shadow-xs" : ""
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilterType("income")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filterType === "income" ? "bg-white text-emerald-700 font-bold shadow-xs" : ""
              }`}
            >
              Pemasukan
            </button>
            <button
              onClick={() => setFilterType("expense")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filterType === "expense" ? "bg-white text-rose-700 font-bold shadow-xs" : ""
              }`}
            >
              Pengeluaran
            </button>
            <button
              onClick={() => setFilterType("pending")}
              className={`px-2.5 py-1 rounded-md transition-all ${
                filterType === "pending" ? "bg-white text-amber-700 font-bold shadow-xs" : ""
              }`}
            >
              Pending
            </button>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter mitra/no. ref..."
              className="pl-8 pr-3 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
            />
          </div>

          <button
            title="Export CSV/Excel"
            className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Table Element */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-slate-50/80 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200/80 text-[11px]">
            <tr>
              <th className="py-3 px-4">No. Referensi</th>
              <th className="py-3 px-4">Tanggal</th>
              <th className="py-3 px-4">Keterangan / Mitra Bisnis</th>
              <th className="py-3 px-4">Akun Terkait</th>
              <th className="py-3 px-4 text-right">Jumlah (IDR)</th>
              <th className="py-3 px-4 text-center">Status</th>
              <th className="py-3 px-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 font-sans">
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-400">
                  <FileText className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                  <p className="font-semibold text-slate-600">Belum ada transaksi yang tercatat</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Gunakan tombol &apos;Entri Jurnal Baru&apos; untuk mulai mencatat transaksi akuntansi periode ini.
                  </p>
                </td>
              </tr>
            ) : (
              filteredTransactions.map((tx) => (
                <tr
                  key={tx.id}
                  className="hover:bg-sky-50/30 transition-colors group"
                >
                  {/* Reference Number */}
                  <td className="py-3.5 px-4 font-mono font-semibold text-slate-800">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-slate-400 group-hover:text-sky-500" />
                      {tx.refNumber}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-4 text-slate-600 whitespace-nowrap">
                    {tx.date}
                  </td>

                  {/* Description / Client */}
                  <td className="py-3.5 px-4 font-medium text-slate-900 max-w-xs truncate">
                    <div>
                      <p className="font-semibold text-slate-800 truncate">{tx.contact}</p>
                      <p className="text-[10px] text-slate-400 truncate">{tx.category}</p>
                    </div>
                  </td>

                  {/* Account */}
                  <td className="py-3.5 px-4 text-slate-600">
                    <span className="inline-block px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[11px] font-medium border border-slate-200/60">
                      {tx.account}
                    </span>
                  </td>

                  {/* Amount (Right aligned) */}
                  <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono font-bold">
                    <span
                      className={`inline-flex items-center justify-end gap-1 ${
                        tx.type === "income" ? "text-emerald-600" : "text-slate-900"
                      }`}
                    >
                      {tx.type === "income" ? "+" : "-"}
                      {formatIDR(tx.amount)}
                    </span>
                  </td>

                  {/* Status Badge */}
                  <td className="py-3.5 px-4 text-center">
                    {tx.status === "Paid" && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Lunas
                      </span>
                    )}
                    {tx.status === "Pending" && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Menunggu
                      </span>
                    )}
                    {tx.status === "Overdue" && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                        Jatuh Tempo
                      </span>
                    )}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-center">
                    <button
                      title="Lihat Detail Transaksi"
                      className="p-1 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded transition-colors"
                    >
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Pagination / Summary Footer */}
      <div className="p-3 bg-slate-50/60 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500">
        <span>
          Menampilkan <strong className="text-slate-700">{filteredTransactions.length}</strong> dari {transactions.length} entri transaksi
        </span>
        {transactions.length > 0 && (
          <div className="flex items-center gap-1">
            <button
              disabled
              className="px-2.5 py-1 rounded border border-slate-200 text-slate-300 cursor-not-allowed bg-white"
            >
              Sebelumnya
            </button>
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-700 hover:bg-slate-100 bg-white font-medium">
              1
            </button>
            <button className="px-2.5 py-1 rounded border border-slate-200 text-slate-700 hover:bg-slate-100 bg-white font-medium">
              Selanjutnya
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

