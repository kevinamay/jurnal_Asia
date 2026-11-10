"use client";

import { useState } from "react";
import { formatIDR } from "@/lib/utils";
import { ArrowUpRight, Plus, Download, Clock, CheckCircle2, AlertCircle, FileText } from "lucide-react";

interface BillAP {
  id: string;
  billNumber: string;
  vendor: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: "Paid" | "Pending";
}

const BILLS_AP: BillAP[] = [];

export default function PayablePage() {
  const [bills] = useState<BillAP[]>(BILLS_AP);

  const totalPayablePending = bills
    .filter((b) => b.status === "Pending")
    .reduce((acc, curr) => acc + curr.remainingAmount, 0);

  const totalPaidMTD = bills
    .filter((b) => b.status === "Paid")
    .reduce((acc, curr) => acc + curr.paidAmount, 0);

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
          <span className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> {bills.filter((b) => b.status === "Pending").length} Tagihan vendor menunggu verifikasi
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Pembayaran Selesai Bulan Ini (MTD)
          </span>
          <div className="text-2xl font-bold text-emerald-600 font-mono">
            {formatIDR(totalPaidMTD)}
          </div>
          <span className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Tagihan terverifikasi lunas
          </span>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Efisiensi Kas Keluar
          </span>
          <div className="text-2xl font-bold text-sky-600 font-mono">100%</div>
          <span className="text-xs text-slate-500 font-medium mt-1">
            Tidak ada penalti keterlambatan pembayaran
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
              {bills.length > 0 ? (
                bills.map((bill) => (
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
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-slate-500 bg-slate-50/30">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3">
                      <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center text-sky-500 border border-sky-100">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">
                          Belum Ada Tagihan Hutang
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Belum ada catatan tagihan hutang vendor (A/P) pada periode berjalan.
                        </p>
                      </div>
                      <button className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-lg shadow-sm transition-all">
                        <Plus className="w-3.5 h-3.5" />
                        <span>Catat Tagihan Vendor</span>
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
