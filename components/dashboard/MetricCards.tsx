"use client";

import {
  TrendingUp,
  ArrowDownLeft,
  Clock,
  CreditCard,
  ArrowUpRight,
  LucideIcon,
} from "lucide-react";
import { METRIC_CARDS } from "@/lib/mock-data";
import { useAccounting } from "@/context/AccountingContext";
import { formatIDR } from "@/lib/utils";

const ICON_MAP: Record<string, LucideIcon> = {
  TrendingUp,
  ArrowDownLeft,
  Clock,
  CreditCard,
};

export function MetricCards() {
  const { revenueMTD, cashInflow, pendingInvoicesAmount, totalExpenses } = useAccounting();

  const dynamicCards = METRIC_CARDS.map((card) => {
    let liveVal = card.formattedValue;
    let changeVal = card.change;
    let comparisonVal = card.comparison;

    if (card.id === "revenue") {
      liveVal = formatIDR(revenueMTD);
      changeVal = revenueMTD > 0 ? "+100%" : "0%";
      comparisonVal = "periode berjalan";
    }
    if (card.id === "cash-inflow") {
      liveVal = formatIDR(cashInflow);
      changeVal = cashInflow > 0 ? "+100%" : "0%";
      comparisonVal = "kas masuk terverifikasi";
    }
    if (card.id === "pending-invoices") {
      liveVal = formatIDR(pendingInvoicesAmount);
      changeVal = pendingInvoicesAmount > 0 ? "menunggu" : "0 invoice";
      comparisonVal = "menunggu pelunasan";
    }
    if (card.id === "expenses") {
      liveVal = formatIDR(totalExpenses);
      changeVal = totalExpenses > 0 ? "+100%" : "0%";
      comparisonVal = "dalam batas anggaran";
    }

    return {
      ...card,
      formattedValue: liveVal,
      change: changeVal,
      comparison: comparisonVal,
      isPositive: true,
    };
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {dynamicCards.map((card) => {
        const Icon = ICON_MAP[card.iconName] || TrendingUp;

        return (
          <div
            key={card.id}
            className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-soft hover:shadow-elevation transition-all duration-200 relative overflow-hidden"
          >
            {/* Top Row: Title & Icon */}
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                {card.title}
              </span>
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  card.id === "revenue"
                    ? "bg-sky-50 text-sky-600 border border-sky-100"
                    : card.id === "cash-inflow"
                    ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                    : card.id === "pending-invoices"
                    ? "bg-amber-50 text-amber-600 border border-amber-100"
                    : "bg-rose-50 text-rose-600 border border-rose-100"
                }`}
              >
                <Icon className="w-4 h-4 stroke-[2.2]" />
              </div>
            </div>

            {/* Middle Row: Large Value */}
            <div className="mb-2">
              <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight font-sans">
                {card.formattedValue}
              </h3>
            </div>

            {/* Bottom Row: Trend Indicator & Comparison */}
            <div className="flex items-center gap-1.5 text-xs">
              <span
                className={`inline-flex items-center font-bold px-1.5 py-0.5 rounded text-[11px] ${
                  card.isPositive
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : "bg-rose-50 text-rose-700 border border-rose-200"
                }`}
              >
                {card.isPositive ? (
                  <ArrowUpRight className="w-3 h-3 mr-0.5 inline" />
                ) : (
                  <ArrowUpRight className="w-3 h-3 mr-0.5 inline rotate-90" />
                )}
                {card.change}
              </span>
              <span className="text-slate-500 text-[11px] truncate">{card.comparison}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

