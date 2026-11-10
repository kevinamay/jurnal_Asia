"use client";

import { Building, Wallet, ArrowUpRight, ShieldCheck, RefreshCw } from "lucide-react";
import { useAccounting } from "@/context/AccountingContext";
import { formatIDR } from "@/lib/utils";

export function BankAccountsSummary() {
  const { bankBalances } = useAccounting();
  const totalLiquidity = bankBalances.reduce((acc, curr) => acc + curr.balance, 0);

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-soft flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Kas & Rekening Bank</h3>
            <p className="text-xs text-slate-500">Saldo likuiditas riil yang siap digunakan</p>
          </div>
          <button
            title="Sinkronisasi Saldo Bank"
            className="p-1.5 text-slate-400 hover:text-sky-600 hover:bg-sky-50 rounded-lg transition-colors border border-slate-200"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Total Liquidity Callout */}
        <div className="p-3 bg-sky-50/60 rounded-lg border border-sky-100 mb-4">
          <span className="text-[11px] font-semibold text-sky-800 uppercase tracking-wider block mb-1">
            Total Likuiditas Tersedia
          </span>
          <div className="text-xl font-extrabold text-slate-900 font-sans">
            {formatIDR(totalLiquidity)}
          </div>
          <span className="text-[11px] text-sky-700 flex items-center gap-1 mt-1 font-medium">
            <ShieldCheck className="w-3.5 h-3.5 text-sky-500" />
            3 Akun Terhubung & Rekonsiliasi Otomatis
          </span>
        </div>

        {/* Account List */}
        <div className="space-y-3">
          {bankBalances.map((acc) => (
            <div
              key={acc.id}
              className="p-2.5 rounded-lg border border-slate-100 hover:border-slate-200 hover:bg-slate-50/50 transition-colors flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600 font-bold text-xs">
                  {acc.id === "petty" ? (
                    <Wallet className="w-4 h-4 text-amber-600" />
                  ) : (
                    <Building className="w-4 h-4 text-sky-600" />
                  )}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">{acc.bankName}</h4>
                  <p className="text-[10px] text-slate-400 font-mono">{acc.accountNumber}</p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs font-bold text-slate-900 block font-mono">
                  {formatIDR(acc.balance)}
                </span>
                <span className="text-[10px] text-emerald-600 font-medium">Aktif</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-slate-100 text-center">
        <a
          href="/reports"
          className="text-xs font-semibold text-sky-600 hover:text-sky-700 inline-flex items-center gap-1"
        >
          Lihat Buku Kas & Rekonsiliasi Bank <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

