"use client";

import { useState } from "react";
import { formatIDR } from "@/lib/utils";
import {
  ArrowDownLeft,
  Search,
  Plus,
  Filter,
  Download,
  AlertCircle,
  CheckCircle2,
  Clock,
} from "lucide-react";
import Link from "next/link";

const INVOICES_AR = [
  {
    id: "inv-1",
    invoiceNumber: "INV-2026/11-0088",
    customer: "CV Mandiri Sejahtera Abadi",
    issueDate: "06 Nov 2026",
    dueDate: "20 Nov 2026",
    totalAmount: 48500000,
    paidAmount: 0,
    remainingAmount: 48500000,
    status: "Pending",
    aging: "1-15 Hari",
  },
  {
    id: "inv-2",
    invoiceNumber: "INV-2026/10-0075",
    customer: "PT Mitra Perkasa Logistik",
    issueDate: "15 Okt 2026",
    dueDate: "30 Okt 2026",
    totalAmount: 32000000,
    paidAmount: 0,
    remainingAmount: 32000000,
    status: "Overdue",
    aging: "10 Hari Terlambat",
  },
  {
    id: "inv-3",
    invoiceNumber: "INV-2026/10-0071",
    customer: "PT Nusantara Prima Solusindo",
    issueDate: "10 Okt 2026",
    dueDate: "24 Okt 2026",
    totalAmount: 77900000,
    paidAmount: 0,
    remainingAmount: 77900000,
    status: "Overdue",
    aging: "16 Hari Terlambat",
  },
  {
    id: "inv-4",
    invoiceNumber: "INV-2026/11-0089",
    customer: "PT Digital Sinergi Nusantara",
    issueDate: "25 Okt 2026",
    dueDate: "08 Nov 2026",
    totalAmount: 125000000,
    paidAmount: 125000000,
    remainingAmount: 0,
    status: "Paid",
    aging: "Lunas",
  },
];

export default function ReceivablePage() {
  const [filter, setFilter] = useState("all");

  const totalOutstanding = 158400000;
  const overdueTotal = 109900000;

  return (
    <div className="space-y-6">
      {/* Metric summary */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Total Piutang Belum Tertagih
          </span>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {formatIDR(totalOutstanding)}
          </div>
          <span className="text-xs text-amber-600 font-medium mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> 14 Invoice aktif menunggu pembayaran
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Piutang Jatuh Tempo (Overdue)
          </span>
          <div className="text-2xl font-bold text-rose-600 font-mono">
            {formatIDR(overdueTotal)}
          </div>
          <span className="text-xs text-rose-600 font-medium mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" /> 2 Invoice melewati batas kredit
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Pelunasan Bulan Ini (MTD)
          </span>
          <div className="text-2xl font-bold text-emerald-600 font-mono">
            {formatIDR(284000000)}
          </div>
          <span className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Tertagih tepat waktu
          </span>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-soft overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Daftar Tagihan Penjualan (Invoices)</h3>
            <p className="text-xs text-slate-500">Monitor status pembayaran dan umur piutang pelanggan</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-lg shadow-xs flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Buat Tagihan Baru
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
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
              {INVOICES_AR.map((inv) => (
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

