"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  BANK_BALANCES,
  Transaction,
  CHART_OF_ACCOUNTS,
} from "@/lib/mock-data";
import { db } from "@/lib/firebase";
import {
  collection,
  doc,
  setDoc,
  updateDoc,
  onSnapshot,
} from "firebase/firestore";

export interface InvoiceAR {
  id: string;
  invoiceNumber: string;
  customer: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: "Paid" | "Pending" | "Overdue";
  aging?: string;
  createdAt?: string;
}

export interface BillAP {
  id: string;
  billNumber: string;
  vendor: string;
  issueDate: string;
  dueDate: string;
  totalAmount: number;
  paidAmount: number;
  remainingAmount: number;
  status: "Paid" | "Pending";
  category?: string;
  createdAt?: string;
}

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
  invoices: InvoiceAR[];
  bills: BillAP[];
  addJournalEntry: (payload: NewJournalPayload) => Promise<void>;
  addInvoice: (invoice: {
    invoiceNumber: string;
    customer: string;
    issueDate: string;
    dueDate: string;
    totalAmount: number;
    paidAmount?: number;
    status?: "Paid" | "Pending" | "Overdue";
    aging?: string;
  }) => Promise<void>;
  updateInvoiceStatus: (id: string, newStatus: "Paid" | "Pending" | "Overdue") => Promise<void>;
  addBill: (bill: {
    billNumber: string;
    vendor: string;
    issueDate: string;
    dueDate: string;
    totalAmount: number;
    paidAmount?: number;
    status?: "Paid" | "Pending";
    category?: string;
  }) => Promise<void>;
  updateBillStatus: (id: string, newStatus: "Paid" | "Pending") => Promise<void>;
  getLedgerEntries: (accountCode: string) => LedgerEntry[];
  bankBalances: typeof BANK_BALANCES;
  revenueMTD: number;
  cashInflow: number;
  totalExpenses: number;
  pendingInvoicesAmount: number;
  totalPayableAmount: number;
  isSyncing: boolean;
}

const AccountingContext = createContext<AccountingContextType | undefined>(undefined);

const STORAGE_KEY = "asia_plastik_clean_v2";
const STORAGE_JOURNALS_KEY = "asia_plastik_clean_journals_v2";
const STORAGE_INVOICES_KEY = "asia_plastik_clean_invoices_v2";
const STORAGE_BILLS_KEY = "asia_plastik_clean_bills_v2";

export function AccountingProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [journalEntries, setJournalEntries] = useState<StoredJournalEntry[]>([]);
  const [invoices, setInvoices] = useState<InvoiceAR[]>([]);
  const [bills, setBills] = useState<BillAP[]>([]);
  const [bankBalances] = useState(BANK_BALANCES);
  const [isSyncing, setIsSyncing] = useState<boolean>(true);

  // 1. Inisialisasi dari localStorage (offline/instant cache) & hubungkan realtime listener Firebase Firestore
  useEffect(() => {
    try {
      const savedTx = localStorage.getItem(STORAGE_KEY);
      if (savedTx) {
        const parsed = JSON.parse(savedTx);
        if (Array.isArray(parsed) && parsed.length > 0) setTransactions(parsed);
      }
      const savedJn = localStorage.getItem(STORAGE_JOURNALS_KEY);
      if (savedJn) {
        const parsed = JSON.parse(savedJn);
        if (Array.isArray(parsed) && parsed.length > 0) setJournalEntries(parsed);
      }
      const savedInv = localStorage.getItem(STORAGE_INVOICES_KEY);
      if (savedInv) {
        const parsed = JSON.parse(savedInv);
        if (Array.isArray(parsed) && parsed.length > 0) setInvoices(parsed);
      }
      const savedBills = localStorage.getItem(STORAGE_BILLS_KEY);
      if (savedBills) {
        const parsed = JSON.parse(savedBills);
        if (Array.isArray(parsed) && parsed.length > 0) setBills(parsed);
      }
    } catch {
      // Abaikan error parsing cache lokal
    }

    // Hubungkan realtime sync listener multi-user Firestore
    let unsubJournals = () => {};
    let unsubTransactions = () => {};
    let unsubInvoices = () => {};
    let unsubBills = () => {};

    try {
      unsubJournals = onSnapshot(
        collection(db, "journals"),
        (snapshot) => {
          const list: StoredJournalEntry[] = [];
          snapshot.forEach((d) => {
            list.push(d.data() as StoredJournalEntry);
          });
          list.sort(
            (a, b) =>
              new Date(b.createdAt || b.transactionDate).getTime() -
              new Date(a.createdAt || a.transactionDate).getTime()
          );
          setJournalEntries(list);
          try {
            localStorage.setItem(STORAGE_JOURNALS_KEY, JSON.stringify(list));
          } catch {}
          setIsSyncing(false);
        },
        (err) => {
          console.warn("Firestore journals onSnapshot warning:", err);
          setIsSyncing(false);
        }
      );

      unsubTransactions = onSnapshot(
        collection(db, "transactions"),
        (snapshot) => {
          const list: Transaction[] = [];
          snapshot.forEach((d) => {
            list.push(d.data() as Transaction);
          });
          setTransactions(list);
          try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
          } catch {}
        },
        (err) => {
          console.warn("Firestore transactions onSnapshot warning:", err);
        }
      );

      unsubInvoices = onSnapshot(
        collection(db, "invoices"),
        (snapshot) => {
          const list: InvoiceAR[] = [];
          snapshot.forEach((d) => {
            list.push(d.data() as InvoiceAR);
          });
          list.sort(
            (a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
          );
          setInvoices(list);
          try {
            localStorage.setItem(STORAGE_INVOICES_KEY, JSON.stringify(list));
          } catch {}
        },
        (err) => {
          console.warn("Firestore invoices onSnapshot warning:", err);
        }
      );

      unsubBills = onSnapshot(
        collection(db, "bills"),
        (snapshot) => {
          const list: BillAP[] = [];
          snapshot.forEach((d) => {
            list.push(d.data() as BillAP);
          });
          list.sort(
            (a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime()
          );
          setBills(list);
          try {
            localStorage.setItem(STORAGE_BILLS_KEY, JSON.stringify(list));
          } catch {}
        },
        (err) => {
          console.warn("Firestore bills onSnapshot warning:", err);
        }
      );
    } catch (err) {
      console.warn("Error subscribing to Firestore collections:", err);
      setIsSyncing(false);
    }

    return () => {
      unsubJournals();
      unsubTransactions();
      unsubInvoices();
      unsubBills();
    };
  }, []);

  // Post Jurnal Baru & Sinkronisasi ke Firestore (Multi-User)
  const addJournalEntry = async (payload: NewJournalPayload) => {
    let totalDebit = 0;
    let primaryAccount = "Jurnal Umum";
    let isIncome = false;
    let arAmount = 0;
    let apAmount = 0;

    const cleanedLines = payload.lines.map((line) => {
      const d = typeof line.debit === "number" ? line.debit : parseFloat(line.debit as string) || 0;
      const c = typeof line.credit === "number" ? line.credit : parseFloat(line.credit as string) || 0;
      if (line.accountId === "1-10100" && d > 0) arAmount += d;
      if (line.accountId === "2-10001" && c > 0) apAmount += c;
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

    const newTxId = `tx-${Date.now()}`;
    const newTx: Transaction = {
      id: newTxId,
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

    const newJournalId = `je-${Date.now()}`;
    const newJournal: StoredJournalEntry = {
      id: newJournalId,
      referenceNumber: payload.referenceNumber,
      transactionDate: payload.transactionDate,
      journalType: payload.journalType,
      generalDescription: payload.generalDescription,
      lines: cleanedLines,
      createdAt: new Date().toISOString(),
    };

    // Update state dan cache lokal segera
    const updatedTxs = [newTx, ...transactions];
    const updatedJournals = [newJournal, ...journalEntries];
    setTransactions(updatedTxs);
    setJournalEntries(updatedJournals);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTxs));
      localStorage.setItem(STORAGE_JOURNALS_KEY, JSON.stringify(updatedJournals));
    } catch {}

    // Simpan ke Firestore (agar multi-user di perangkat lain langsung melihat)
    try {
      await setDoc(doc(db, "journals", newJournalId), newJournal);
      await setDoc(doc(db, "transactions", newTxId), newTx);

      // Jika jurnal menyertakan Piutang Usaha (1-10100), buat invoice piutang terpusat
      if (arAmount > 0) {
        const autoInv: InvoiceAR = {
          id: `inv-${Date.now()}`,
          invoiceNumber: payload.referenceNumber,
          customer: payload.generalDescription || "Klien Penjualan",
          issueDate: payload.transactionDate,
          dueDate: payload.transactionDate,
          totalAmount: arAmount,
          paidAmount: 0,
          remainingAmount: arAmount,
          status: "Pending",
          aging: "0 Hari",
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, "invoices", autoInv.id), autoInv);
      }

      // Jika jurnal menyertakan Hutang Usaha (2-10001), buat tagihan hutang terpusat
      if (apAmount > 0) {
        const autoBill: BillAP = {
          id: `bill-${Date.now()}`,
          billNumber: payload.referenceNumber,
          vendor: payload.generalDescription || "Vendor Operasional",
          issueDate: payload.transactionDate,
          dueDate: payload.transactionDate,
          totalAmount: apAmount,
          paidAmount: 0,
          remainingAmount: apAmount,
          status: "Pending",
          category: payload.journalType,
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, "bills", autoBill.id), autoBill);
      }
    } catch (err) {
      console.warn("Gagal menyimpan ke Firestore:", err);
    }
  };

  // Tambah Invoice Piutang Terpusat (A/R)
  const addInvoice = async (invoiceData: {
    invoiceNumber: string;
    customer: string;
    issueDate: string;
    dueDate: string;
    totalAmount: number;
    paidAmount?: number;
    status?: "Paid" | "Pending" | "Overdue";
    aging?: string;
  }) => {
    const id = `inv-${Date.now()}`;
    const paidAmount =
      invoiceData.paidAmount || (invoiceData.status === "Paid" ? invoiceData.totalAmount : 0);
    const remainingAmount = Math.max(0, invoiceData.totalAmount - paidAmount);
    const status = invoiceData.status || (remainingAmount === 0 ? "Paid" : "Pending");

    const newInvoice: InvoiceAR = {
      id,
      invoiceNumber: invoiceData.invoiceNumber,
      customer: invoiceData.customer,
      issueDate: invoiceData.issueDate,
      dueDate: invoiceData.dueDate,
      totalAmount: invoiceData.totalAmount,
      paidAmount,
      remainingAmount,
      status,
      aging: invoiceData.aging || "0 Hari",
      createdAt: new Date().toISOString(),
    };

    const newTx: Transaction = {
      id: `tx-${id}`,
      refNumber: newInvoice.invoiceNumber,
      date: new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(newInvoice.issueDate)),
      contact: newInvoice.customer,
      category: "Piutang Usaha",
      account: "Piutang Usaha (A/R)",
      type: "income",
      amount: newInvoice.totalAmount,
      status: newInvoice.status === "Paid" ? "Paid" : "Pending",
    };

    // Jurnal double-entry otomatis untuk piutang
    const newJournal: StoredJournalEntry = {
      id: `je-${id}`,
      referenceNumber: newInvoice.invoiceNumber,
      transactionDate: newInvoice.issueDate,
      journalType: "Faktur Piutang Penjualan",
      generalDescription: `Penjualan Produk ke ${newInvoice.customer}`,
      lines: [
        {
          accountId: "1-10100",
          description: `Piutang Usaha - ${newInvoice.customer}`,
          debit: newInvoice.totalAmount,
          credit: 0,
        },
        {
          accountId: "4-10001",
          description: `Pendapatan Penjualan (${newInvoice.invoiceNumber})`,
          debit: 0,
          credit: newInvoice.totalAmount,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    const updatedInvoices = [newInvoice, ...invoices];
    const updatedTxs = [newTx, ...transactions];
    const updatedJournals = [newJournal, ...journalEntries];

    setInvoices(updatedInvoices);
    setTransactions(updatedTxs);
    setJournalEntries(updatedJournals);

    try {
      localStorage.setItem(STORAGE_INVOICES_KEY, JSON.stringify(updatedInvoices));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTxs));
      localStorage.setItem(STORAGE_JOURNALS_KEY, JSON.stringify(updatedJournals));
    } catch {}

    try {
      await setDoc(doc(db, "invoices", id), newInvoice);
      await setDoc(doc(db, "transactions", newTx.id), newTx);
      await setDoc(doc(db, "journals", newJournal.id), newJournal);
    } catch (err) {
      console.warn("Firestore invoice sync error:", err);
    }
  };

  // Update Status Invoice Piutang (misal Lunas)
  const updateInvoiceStatus = async (
    id: string,
    newStatus: "Paid" | "Pending" | "Overdue"
  ) => {
    const target = invoices.find((i) => i.id === id);
    if (!target) return;

    const isPaid = newStatus === "Paid";
    const paidAmount = isPaid ? target.totalAmount : 0;
    const remainingAmount = isPaid ? 0 : target.totalAmount;

    const updatedInvoices = invoices.map((inv) =>
      inv.id === id
        ? { ...inv, status: newStatus, paidAmount, remainingAmount }
        : inv
    );

    const updatedTxs = transactions.map((tx) =>
      tx.refNumber === target.invoiceNumber
        ? { ...tx, status: (isPaid ? "Paid" : "Pending") as "Paid" | "Pending" }
        : tx
    );

    setInvoices(updatedInvoices);
    setTransactions(updatedTxs);

    try {
      localStorage.setItem(STORAGE_INVOICES_KEY, JSON.stringify(updatedInvoices));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTxs));
    } catch {}

    try {
      await updateDoc(doc(db, "invoices", id), {
        status: newStatus,
        paidAmount,
        remainingAmount,
      });

      const txDoc = transactions.find((t) => t.refNumber === target.invoiceNumber);
      if (txDoc) {
        await updateDoc(doc(db, "transactions", txDoc.id), {
          status: isPaid ? "Paid" : "Pending",
        });
      }

      // Bukukan jurnal pelunasan piutang (Kas Bank bertambah Debit, Piutang berkurang Kredit)
      if (isPaid) {
        const payJournal: StoredJournalEntry = {
          id: `je-pay-${Date.now()}`,
          referenceNumber: `REC-${target.invoiceNumber}`,
          transactionDate: new Date().toISOString().split("T")[0],
          journalType: "Pelunasan Piutang Usaha",
          generalDescription: `Penerimaan Pelunasan Invoice ${target.invoiceNumber} (${target.customer})`,
          lines: [
            {
              accountId: "1-10002", // Bank BCA Giro
              description: `Penerimaan Kas/Bank dari ${target.customer}`,
              debit: target.totalAmount,
              credit: 0,
            },
            {
              accountId: "1-10100", // Piutang Usaha
              description: `Pelunasan Piutang ${target.invoiceNumber}`,
              debit: 0,
              credit: target.totalAmount,
            },
          ],
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, "journals", payJournal.id), payJournal);
        setJournalEntries((prev) => [payJournal, ...prev]);
      }
    } catch (err) {
      console.warn("Firestore invoice update error:", err);
    }
  };

  // Tambah Tagihan Hutang Terpusat (A/P)
  const addBill = async (billData: {
    billNumber: string;
    vendor: string;
    issueDate: string;
    dueDate: string;
    totalAmount: number;
    paidAmount?: number;
    status?: "Paid" | "Pending";
    category?: string;
  }) => {
    const id = `bill-${Date.now()}`;
    const paidAmount =
      billData.paidAmount || (billData.status === "Paid" ? billData.totalAmount : 0);
    const remainingAmount = Math.max(0, billData.totalAmount - paidAmount);
    const status = billData.status || (remainingAmount === 0 ? "Paid" : "Pending");

    const newBill: BillAP = {
      id,
      billNumber: billData.billNumber,
      vendor: billData.vendor,
      issueDate: billData.issueDate,
      dueDate: billData.dueDate,
      totalAmount: billData.totalAmount,
      paidAmount,
      remainingAmount,
      status,
      category: billData.category || "Hutang Usaha",
      createdAt: new Date().toISOString(),
    };

    const newTx: Transaction = {
      id: `tx-${id}`,
      refNumber: newBill.billNumber,
      date: new Intl.DateTimeFormat("id-ID", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }).format(new Date(newBill.issueDate)),
      contact: newBill.vendor,
      category: newBill.category || "Hutang Usaha",
      account: "Hutang Usaha (A/P)",
      type: "expense",
      amount: newBill.totalAmount,
      status: newBill.status === "Paid" ? "Paid" : "Pending",
    };

    const newJournal: StoredJournalEntry = {
      id: `je-${id}`,
      referenceNumber: newBill.billNumber,
      transactionDate: newBill.issueDate,
      journalType: "Tagihan Pemasok (A/P)",
      generalDescription: `Tagihan Vendor ${newBill.vendor}`,
      lines: [
        {
          accountId: "5-10001", // Beban Pokok Penjualan / Biaya
          description: `Beban Vendor - ${newBill.vendor} (${newBill.billNumber})`,
          debit: newBill.totalAmount,
          credit: 0,
        },
        {
          accountId: "2-10001", // Hutang Usaha (Kredit)
          description: `Hutang Pemasok - ${newBill.vendor}`,
          debit: 0,
          credit: newBill.totalAmount,
        },
      ],
      createdAt: new Date().toISOString(),
    };

    const updatedBills = [newBill, ...bills];
    const updatedTxs = [newTx, ...transactions];
    const updatedJournals = [newJournal, ...journalEntries];

    setBills(updatedBills);
    setTransactions(updatedTxs);
    setJournalEntries(updatedJournals);

    try {
      localStorage.setItem(STORAGE_BILLS_KEY, JSON.stringify(updatedBills));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTxs));
      localStorage.setItem(STORAGE_JOURNALS_KEY, JSON.stringify(updatedJournals));
    } catch {}

    try {
      await setDoc(doc(db, "bills", id), newBill);
      await setDoc(doc(db, "transactions", newTx.id), newTx);
      await setDoc(doc(db, "journals", newJournal.id), newJournal);
    } catch (err) {
      console.warn("Firestore bill sync error:", err);
    }
  };

  // Update Status Hutang (misal Bayar Lunas)
  const updateBillStatus = async (id: string, newStatus: "Paid" | "Pending") => {
    const target = bills.find((b) => b.id === id);
    if (!target) return;

    const isPaid = newStatus === "Paid";
    const paidAmount = isPaid ? target.totalAmount : 0;
    const remainingAmount = isPaid ? 0 : target.totalAmount;

    const updatedBills = bills.map((b) =>
      b.id === id ? { ...b, status: newStatus, paidAmount, remainingAmount } : b
    );

    const updatedTxs = transactions.map((tx) =>
      tx.refNumber === target.billNumber
        ? { ...tx, status: (isPaid ? "Paid" : "Pending") as "Paid" | "Pending" }
        : tx
    );

    setBills(updatedBills);
    setTransactions(updatedTxs);

    try {
      localStorage.setItem(STORAGE_BILLS_KEY, JSON.stringify(updatedBills));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTxs));
    } catch {}

    try {
      await updateDoc(doc(db, "bills", id), {
        status: newStatus,
        paidAmount,
        remainingAmount,
      });

      const txDoc = transactions.find((t) => t.refNumber === target.billNumber);
      if (txDoc) {
        await updateDoc(doc(db, "transactions", txDoc.id), {
          status: isPaid ? "Paid" : "Pending",
        });
      }

      // Bukukan jurnal pelunasan hutang (Hutang Usaha berkurang Debit, Kas Bank berkurang Kredit)
      if (isPaid) {
        const payJournal: StoredJournalEntry = {
          id: `je-pay-bill-${Date.now()}`,
          referenceNumber: `PAY-${target.billNumber}`,
          transactionDate: new Date().toISOString().split("T")[0],
          journalType: "Pelunasan Hutang Pemasok",
          generalDescription: `Pembayaran Tagihan ${target.billNumber} (${target.vendor})`,
          lines: [
            {
              accountId: "2-10001", // Hutang Usaha (Debit)
              description: `Pelunasan Hutang ke ${target.vendor}`,
              debit: target.totalAmount,
              credit: 0,
            },
            {
              accountId: "1-10002", // Bank BCA Giro (Kredit)
              description: `Pembayaran via Bank BCA Giro`,
              debit: 0,
              credit: target.totalAmount,
            },
          ],
          createdAt: new Date().toISOString(),
        };
        await setDoc(doc(db, "journals", payJournal.id), payJournal);
        setJournalEntries((prev) => [payJournal, ...prev]);
      }
    } catch (err) {
      console.warn("Firestore bill update error:", err);
    }
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

  // Metrik finansial real-time
  const revenueMTD = transactions
    .filter((t) => t.type === "income" && t.status === "Paid")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const cashInflow = transactions
    .filter((t) => t.type === "income" && t.status === "Paid")
    .reduce((acc, curr) => acc + curr.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense" && t.status === "Paid")
    .reduce((acc, curr) => acc + curr.amount, 0);

  // Jika ada invoice terpusat, gunakan sisa piutang invoice belum lunas
  const pendingInvoicesAmount =
    invoices.length > 0
      ? invoices.filter((i) => i.status !== "Paid").reduce((acc, curr) => acc + curr.remainingAmount, 0)
      : transactions
          .filter((t) => t.status === "Pending" || t.status === "Overdue")
          .reduce((acc, curr) => acc + curr.amount, 0);

  const totalPayableAmount = bills
    .filter((b) => b.status === "Pending")
    .reduce((acc, curr) => acc + curr.remainingAmount, 0);

  return (
    <AccountingContext.Provider
      value={{
        transactions,
        journalEntries,
        invoices,
        bills,
        addJournalEntry,
        addInvoice,
        updateInvoiceStatus,
        addBill,
        updateBillStatus,
        getLedgerEntries,
        bankBalances,
        revenueMTD,
        cashInflow,
        totalExpenses,
        pendingInvoicesAmount,
        totalPayableAmount,
        isSyncing,
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
