"use client";

import { formatIDR } from "@/lib/utils";
import { ArrowUpRight, Plus, Download, Clock, CheckCircle2, AlertCircle } from "lucide-react";

const BILLS_AP = [
  {
    id: "bill-1",
    billNumber: "BILL-2026/11-0044",
    vendor: "Gedung Cyber One (PT Menara Graha)",
    issueDate: "01 Nov 2026",
    dueDate: "05 Nov 2026",
    totalAmount: 65000000,
    paidAmount: 65000000,
    remainingAmount: 0,
    status: "Paid",
  },
  {
    id: "bill-2",
    billNumber: "BILL-2026/11-0045",
    vendor: "PT Telkom Indonesia (IndiBiz)",
    issueDate: "03 Nov 2026",
    dueDate: "07 Nov 2026",
    totalAmount: 14750000,
    paidAmount: 14750000,
    remainingAmount: 0,
    status: "Paid",
  },
  {
    id: "bill-3",
    billNumber: "BILL-2026/10-0043",
    vendor: "PT Graha Media Solusi",
    issueDate: "27 Okt 2026",
    dueDate: "15 Nov 2026",
    totalAmount: 22400000,
    paidAmount: 0,
    remainingAmount: 22400000,
    status: "Pending",
  },
  {
    id: "bill-4",
    billNumber: "BILL-2026/11-0048",
    vendor: "PT Sumber Kertas & Percetakan Jaya",
    issueDate: "05 Nov 2026",
    dueDate: "19 Nov 2026",
    totalAmount: 8900000,
    paidAmount: 0,
    remainingAmount: 8900000,
    status: "Pending",
  },
];

export default function PayablePage() {
  const totalPayablePending = 31300000;

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Total Hutang Belum Dibayar
          </span>
          <div className="text-2xl font-bold text-slate-900 font-mono">
            {formatIDR(totalPayablePending)}
          </div>
          <span className="text-xs text-amber-600 font-medium mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5" /> 5 Tagihan vendor jatuh tempo minggu ini
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Pembayaran Selesai Bulan Ini (MTD)
          </span>
          <div className="text-2xl font-bold text-emerald-600 font-mono">
            {formatIDR(79750000)}
          </div>
          <span className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Tagihan utilitas & sewa kantor
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Efisiensi Kas Keluar
          </span>
          <div className="text-2xl font-bold text-sky-600 font-mono">98.5%</div>
          <span className="text-xs text-slate-500 font-medium mt-1">
            Tidak ada penalti denda keterlambatan
          </span>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200/90 shadow-soft overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Daftar Tagihan Pemasok (Accounts Payable)</h3>
            <p className="text-xs text-slate-500">Jadwal jatuh tempo pembayaran beban operasional dan vendor</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-3 py-1.5 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-lg shadow-xs flex items-center gap-1.5">
              <Plus className="w-3.5 h-3.5" /> Catat Tagihan Vendor
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3 px-4">No. Tagihan (Bill)</th>
                <th className="py-3 px-4">Vendor / Pemasok</th>
                <th className="py-3 px-4">Tgl Terbit</th>
                <th className="py-3 px-4">Jatuh Tempo</th>
                <th className="py-3 px-4 text-right">Total Tagihan</th>
                <th className="py-3 px-4 text-right">Sisa Hutang</th>
                <th className="py-3 px-4 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {BILLS_AP.map((bill) => (
                <tr key={bill.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3 px-4 font-mono font-bold text-sky-600">{bill.billNumber}</td>
                  <td className="py-3 px-4 font-semibold text-slate-800">{bill.vendor}</td>
                  <td className="py-3 px-4 text-slate-500">{bill.issueDate}</td>
                  <td className="py-3 px-4 text-slate-700 font-medium">{bill.dueDate}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    {formatIDR(bill.totalAmount)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                    {formatIDR(bill.remainingAmount)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {bill.status === "Paid" ? (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Dibayar Lunas
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                        Menunggu Bayar
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

