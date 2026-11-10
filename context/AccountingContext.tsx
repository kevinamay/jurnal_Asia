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

export interface StoredJournalEntry {
  id: string;
  referenceNumber: string;
  transactionDate: string;
  journalType: string;
  generalDescription: string;
  lines: {
    accountId: string;
    description: string;
    debit: number;
    credit: number;
  }[];
  createdAt: string;
}

export interface LedgerEntry {
  id: string;
  date: string;
  ref: string;
  description: string;
  debit: number;
  credit: number;
  balance: number;
}

interface AccountingContextType {
  transactions: Transaction[];
  journalEntries: StoredJournalEntry[];
  addJournalEntry: (payload: NewJournalPayload) => void;
  getLedgerEntries: (accountCode: string) => LedgerEntry[];
  bankBalances: typeof BANK_BALANCES;
  revenueMTD: number;
  cashInflow: number;
  totalExpenses: number;
  pendingInvoicesAmount: number;
}

const AccountingContext = createContext<AccountingContextType | undefined>(undefined);

const STORAGE_KEY = "asia_plastik_clean_v2";
const STORAGE_JOURNALS_KEY = "asia_plastik_clean_journals_v2";

export function AccountingProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>(RECENT_TRANSACTIONS);
  const [journalEntries, setJournalEntries] = useState<StoredJournalEntry[]>([]);
  const [bankBalances, setBankBalances] = useState(BANK_BALANCES);

  // Load from localStorage if available (hanya data bersih baru)
  useEffect(() => {
    try {
      // Hapus cache lama jika ada
      localStorage.removeItem("asia_plastik_transactions_v1");
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setTransactions(parsed);
        }
      } else {
        setTransactions([]);
      }

      const savedJournals = localStorage.getItem(STORAGE_JOURNALS_KEY);
      if (savedJournals) {
        const parsedJournals = JSON.parse(savedJournals);
        if (Array.isArray(parsedJournals)) {
          setJournalEntries(parsedJournals);
        }
      } else {
        setJournalEntries([]);
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

  const saveJournals = (newJournals: StoredJournalEntry[]) => {
    setJournalEntries(newJournals);
    try {
      localStorage.setItem(STORAGE_JOURNALS_KEY, JSON.stringify(newJournals));
    } catch {
      // Ignore
    }
  };

  const addJournalEntry = (payload: NewJournalPayload) => {
    // Determine primary line amounts
    let totalDebit = 0;
    let primaryAccount = "Jurnal Umum";
    let isIncome = false;

    const cleanedLines = payload.lines.map((line) => {
      const d = typeof line.debit === "number" ? line.debit : parseFloat(line.debit as string) || 0;
      const c = typeof line.credit === "number" ? line.credit : parseFloat(line.credit as string) || 0;
      return {
        accountId: line.accountId,
        description: line.description || "",
        debit: d,
        credit: c,
      };
    });

    cleanedLines.forEach((line) => {
      if (line.debit > 0) {
        totalDebit += line.debit;
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

    const newJournal: StoredJournalEntry = {
      id: `je-${Date.now()}`,
      referenceNumber: payload.referenceNumber,
      transactionDate: payload.transactionDate,
      journalType: payload.journalType,
      generalDescription: payload.generalDescription,
      lines: cleanedLines,
      createdAt: new Date().toISOString(),
    };

    saveTransactions([newTx, ...transactions]);
    saveJournals([newJournal, ...journalEntries]);
  };

  const getLedgerEntries = (accountCode: string): LedgerEntry[] => {
    const matching: {
      id: string;
      date: string;
      ref: string;
      description: string;
      debit: number;
      credit: number;
      timestamp: number;
    }[] = [];

    journalEntries.forEach((entry) => {
      entry.lines.forEach((line, idx) => {
        if (line.accountId === accountCode) {
          matching.push({
            id: `${entry.id}-${idx}`,
            date: entry.transactionDate,
            ref: entry.referenceNumber,
            description: line.description || entry.generalDescription || "Jurnal Memorial",
            debit: line.debit,
            credit: line.credit,
            timestamp: new Date(entry.transactionDate).getTime() || 0,
          });
        }
      });
    });

    // Urutkan kronologis
    matching.sort((a, b) => a.timestamp - b.timestamp);

    const account = CHART_OF_ACCOUNTS.find((a) => a.code === accountCode);
    const isDebitNormal = !account || account.category === "Aset" || account.category === "Beban";

    let runningBalance = 0;
    return matching.map((item) => {
      if (isDebitNormal) {
        runningBalance += item.debit - item.credit;
      } else {
        runningBalance += item.credit - item.debit;
      }
      return {
        id: item.id,
        date: new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }).format(new Date(item.date)),
        ref: item.ref,
        description: item.description,
        debit: item.debit,
        credit: item.credit,
        balance: runningBalance,
      };
    });
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
        journalEntries,
        addJournalEntry,
        getLedgerEntries,
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

