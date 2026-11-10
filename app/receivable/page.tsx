"use client";

import { useState } from "react";
import { formatIDR } from "@/lib/utils";
import {
  ArrowDownLeft,
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
} from "lucide-react";

interface InvoiceAR {
  id: string;
  invoiceNumber: string;
  customer: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: "Paid" | "Pending" | "Overdue";
  aging: string;
}

const INVOICES_AR: InvoiceAR[] = [];

export default function ReceivablePage() {
  const [invoices] = useState<InvoiceAR[]>(INVOICES_AR);

  const totalOutstanding = invoices
    .filter((i) => i.status !== "Paid")
    .reduce((acc, curr) => acc + curr.remainingAmount, 0);

  const overdueTotal = invoices
    .filter((i) => i.status === "Overdue")
    .reduce((acc, curr) => acc + curr.remainingAmount, 0);

  const collectedMTD = invoices
    .filter((i) => i.status === "Paid")
    .reduce((acc, curr) => acc + curr.paidAmount, 0);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Metric summary (1 col mobile, 2 col tablet, 3 col desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Total Piutang Belum Tertagih
          </span>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">
            {formatIDR(totalOutstanding)}
          </div>
          <span className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> {invoices.filter((i) => i.status !== "Paid").length} Invoice aktif menunggu pembayaran
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Piutang Jatuh Tempo (Overdue)
          </span>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">
            {formatIDR(overdueTotal)}
          </div>
          <span className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" /> {invoices.filter((i) => i.status === "Overdue").length} Invoice melewati batas kredit
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-soft sm:col-span-2 lg:col-span-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Pelunasan Bulan Ini (MTD)
          </span>
          <div className="text-xl sm:text-2xl font-bold text-emerald-600 font-mono">
            {formatIDR(collectedMTD)}
          </div>
          <span className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Pembayaran piutang terverifikasi
          </span>
        </div>
      </div>

      {/* Invoices Table with Horizontal Scroll on Mobile */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-soft overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Daftar Tagihan Penjualan (Invoices)</h3>
            <p className="text-xs text-slate-500">Monitor status pembayaran dan umur piutang pelanggan</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-full sm:w-auto px-3 py-1.5 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-lg shadow-xs flex items-center justify-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Buat Tagihan Baru
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[650px]">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3 px-4">No. Invoice</th>
                <th className="py-3 px-4">Pelanggan / Klien</th>
                <th className="py-3 px-4">Tgl Terbit</th>
                <th className="py-3 px-4">Jatuh Tempo</th>
                <th className="py-3 px-4 text-right">Total Nilai</th>
                <th className="py-3 px-4 text-right">Sisa Piutang</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {invoices.length > 0 ? (
                invoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-sky-600">{inv.invoiceNumber}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{inv.customer}</td>
                    <td className="py-3 px-4 text-slate-500">{inv.issueDate}</td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{inv.dueDate}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {formatIDR(inv.totalAmount)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {formatIDR(inv.remainingAmount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {inv.status === "Paid" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Lunas
                        </span>
                      )}
                      {inv.status === "Pending" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Menunggu
                        </span>
                      )}
                      {inv.status === "Overdue" && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          {inv.aging}
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-500 bg-slate-50/30">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3 px-4">
                      <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center text-sky-500 border border-sky-100">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">
                          Belum Ada Tagihan Piutang
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Belum ada transaksi piutang penjualan (A/R) yang tercatat untuk periode ini.
                        </p>
                      </div>
                      <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-lg shadow-sm transition-all">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Buat Tagihan Baru</span>
                      </button>
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
