import { MetricCards } from "@/components/dashboard/MetricCards";
import { CashFlowChart } from "@/components/dashboard/CashFlowChart";
import { BankAccountsSummary } from "@/components/dashboard/BankAccountsSummary";
import { RecentTransactionsTable } from "@/components/dashboard/RecentTransactionsTable";
import Link from "next/link";
import { Plus, Download, Filter, AlertTriangle, ArrowUpRight } from "lucide-react";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Quick Action & Status Callout Banner */}
      <div className="bg-gradient-to-r from-sky-500/10 via-sky-50 to-white border border-sky-100 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-sky-500 text-white flex items-center justify-center shrink-0 shadow-sm shadow-sky-500/30">
            <Plus className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              Periode Akuntansi Berjalan: November 2026
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              14 faktur menunggu verifikasi pelunasan dan 3 entri draf jurnal siap diposting ke Buku Besar.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/journal/new"
            className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-lg shadow-sm shadow-sky-500/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Entri Jurnal Baru</span>
          </Link>
          <Link
            href="/reports"
            className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors"
          >
            <span>Laporan Neraca</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
          </Link>
        </div>
      </div>

      {/* Row 1: 4 Key Financial Metric Cards */}
      <MetricCards />

      {/* Row 2: Cash Flow Projections (8 cols) & Real-time Bank Balances (4 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8">
          <CashFlowChart />
        </div>
        <div className="lg:col-span-4">
          <BankAccountsSummary />
        </div>
      </div>

      {/* Row 3: Recent Transactions & Invoices Table */}
      <RecentTransactionsTable />
    </div>
  );
}
