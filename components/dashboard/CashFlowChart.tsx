"use client";

import { useState, useEffect } from "react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { CASH_FLOW_DATA } from "@/lib/mock-data";
import { formatCompactIDR, formatIDR } from "@/lib/utils";
import { ArrowUpRight, TrendingUp, Calendar } from "lucide-react";
import { useAccounting } from "@/context/AccountingContext";

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    name: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    const income = payload.find((p) => p.name === "Pendapatan (Income)")?.value || 0;
    const expense = payload.find((p) => p.name === "Beban (Expenses)")?.value || 0;
    const net = income - expense;

    return (
      <div className="bg-white p-3.5 rounded-lg shadow-lg border border-slate-200 text-xs min-w-[220px]">
        <p className="font-bold text-slate-800 mb-2 border-b border-slate-100 pb-1 flex items-center justify-between">
          <span>Periode {label}</span>
          <span className="text-[10px] font-normal text-slate-400">Kas Riil</span>
        </p>
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-sm bg-sky-500 inline-block"></span>
              Pendapatan:
            </span>
            <span className="font-bold text-slate-900 font-mono">{formatIDR(income)}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-slate-600">
              <span className="w-2.5 h-2.5 rounded-sm bg-rose-400 inline-block"></span>
              Pengeluaran:
            </span>
            <span className="font-bold text-slate-900 font-mono">{formatIDR(expense)}</span>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
            <span className="font-semibold text-slate-700">Surplus Bersih:</span>
            <span
              className={`font-bold font-mono ${
                net >= 0 ? "text-emerald-600" : "text-rose-600"
              }`}
            >
              {formatIDR(net)}
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function CashFlowChart() {
  const [mounted, setMounted] = useState(false);
  const [viewMode, setViewMode] = useState<"6m" | "ytd">("6m");
  const { revenueMTD, totalExpenses } = useAccounting();

  useEffect(() => {
    setMounted(true);
  }, []);

  const chartData = CASH_FLOW_DATA.map((item) => {
    if (item.month === "Nov 2026") {
      return {
        ...item,
        income: revenueMTD,
        expense: totalExpenses,
        net: revenueMTD - totalExpenses,
      };
    }
    return item;
  });

  const totalIncome = chartData.reduce((acc, curr) => acc + curr.income, 0);
  const totalExpense = chartData.reduce((acc, curr) => acc + curr.expense, 0);
  const avgIncome = CASH_FLOW_DATA.length ? Math.round(totalIncome / CASH_FLOW_DATA.length) : 0;
  const avgExpense = CASH_FLOW_DATA.length ? Math.round(totalExpense / CASH_FLOW_DATA.length) : 0;
  const avgNet = avgIncome - avgExpense;

  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-soft">
      {/* Chart Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base font-bold text-slate-900">Arus Kas & Proyeksi Finansial</h2>
            <span className="text-[10px] font-semibold text-sky-700 bg-sky-50 px-2 py-0.5 rounded border border-sky-200">
              Income vs Expenses
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Komparasi perputaran kas masuk dan keluar selama 6 bulan terakhir
          </p>
        </div>

        {/* View mode toggle & Summary Badge */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium text-slate-600">
            <button
              onClick={() => setViewMode("6m")}
              className={`px-3 py-1 rounded-md transition-all ${
                viewMode === "6m"
                  ? "bg-white text-slate-900 font-bold shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              6 Bulan Terakhir
            </button>
            <button
              onClick={() => setViewMode("ytd")}
              className={`px-3 py-1 rounded-md transition-all ${
                viewMode === "ytd"
                  ? "bg-white text-slate-900 font-bold shadow-xs"
                  : "hover:text-slate-900"
              }`}
            >
              YTD (Tahun 2026)
            </button>
          </div>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-[280px] w-full">
        {mounted ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
              barGap={6}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11, fontWeight: 500 }}
                dy={6}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: "#64748b", fontSize: 11 }}
                tickFormatter={(value) => formatCompactIDR(value)}
                dx={-4}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                verticalAlign="top"
                align="right"
                iconType="circle"
                wrapperStyle={{ paddingBottom: 15, fontSize: 12, fontWeight: 500 }}
              />
              <Bar
                name="Pendapatan (Income)"
                dataKey="income"
                fill="#0ea5e9"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                name="Beban (Expenses)"
                dataKey="expense"
                fill="#f43f5e"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-full w-full flex items-center justify-center text-slate-400 text-xs">
            Memuat grafik arus kas...
          </div>
        )}
      </div>

      {/* Quick Summary Footer under chart */}
      <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-sky-500"></div>
          <span className="text-slate-500">Rata-rata Pendapatan:</span>
          <span className="font-bold text-slate-800 font-mono">{formatIDR(avgIncome)} / bln</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-rose-500"></div>
          <span className="text-slate-500">Rata-rata Pengeluaran:</span>
          <span className="font-bold text-slate-800 font-mono">{formatIDR(avgExpense)} / bln</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
          <span className="text-slate-500">Rata-rata Surplus:</span>
          <span className={`font-bold font-mono ${avgNet >= 0 ? "text-emerald-600" : "text-rose-600"}`}>
            {avgNet > 0 ? "+" : ""}{formatIDR(avgNet)} / bln
          </span>
        </div>
      </div>
    </div>
  );
}

