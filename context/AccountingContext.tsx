"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  RECENT_TRANSACTIONS,
  BANK_BALANCES,
  Transaction,
  CHART_OF_ACCOUNTS,
} from "@/lib/mock-data";

export interface JournalLine {
  accountId: string;
  description: string;
  debit: number | "";
  credit: number | "";
}

export interface NewJournalPayload {
  referenceNumber: string;
  transactionDate: string;
  journalType: string;
  generalDescription: string;
  lines: JournalLine[];
}

interface AccountingContextType {
  transactions: Transaction[];
  addJournalEntry: (payload: NewJournalPayload) => void;
  bankBalances: typeof BANK_BALANCES;
  revenueMTD: number;
  cashInflow: number;
  totalExpenses: number;
  pendingInvoicesAmount: number;
}

const AccountingContext = createContext<AccountingContextType | undefined>(undefined);

const STORAGE_KEY = "kledoflow_transactions_v1";

export function AccountingProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(RECENT_TRANSACTIONS);
  const [bankBalances, setBankBalances] = useState(BANK_BALANCES);

  // Load from localStorage if available
  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTransactions(parsed);
        }
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  // Save to localStorage when transactions change
  const saveTransactions = (newTxList: Transaction[]) => {
    setTransactions(newTxList);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newTxList));
    } catch {
      // Ignore
    }
  };

  const addJournalEntry = (payload: NewJournalPayload) => {
    // Determine primary line amounts
    let totalDebit = 0;
    let primaryAccount = "Jurnal Umum";
    let isIncome = false;

    payload.lines.forEach((line) => {
      const d = typeof line.debit === "number" ? line.debit : parseFloat(line.debit as string) || 0;
      if (d > 0) {
        totalDebit += d;
      }
      const acc = CHART_OF_ACCOUNTS.find((a) => a.code === line.accountId);
      if (acc?.category === "Pendapatan") {
        isIncome = true;
      }
      if (acc) {
        primaryAccount = acc.name;
      }
    });

    const newTx: Transaction = {
      id: `tx-${Date.now()}`,
      refNumber: payload.referenceNumber,
      date: new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(payload.transactionDate)),
      contact: payload.generalDescription || "Entri Jurnal Memorial",
      category: payload.journalType,
      account: primaryAccount,
      type: isIncome ? "income" : "expense",
      amount: totalDebit,
      status: "Paid",
    };

    saveTransactions([newTx, ...transactions]);
  };

  // Calculate live metrics
  const revenueMTD = transactions
    .filter((t) => t.type === "income")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const cashInflow = transactions
    .filter((t) => t.type === "income" && t.status === "Paid")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense" && t.status === "Paid")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const pendingInvoicesAmount = transactions
    .filter((t) => t.status === "Pending" || t.status === "Overdue")
    .reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <AccountingContext.Provider
      value={{
        transactions,
        addJournalEntry,
        bankBalances,
        revenueMTD,
        cashInflow,
        totalExpenses,
        pendingInvoicesAmount,
      }}
    >
      {children}
    </AccountingContext.Provider>
  );
}

export function useAccounting() {
  const ctx = useContext(AccountingContext);
  if (!ctx) {
    throw new Error("useAccounting must be used within AccountingProvider");
  }
  return ctx;
}

