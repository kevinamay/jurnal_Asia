export interface Account {
  code: string;
  name: string;
  category: "Aset" | "Kewajiban" | "Ekuitas" | "Pendapatan" | "Beban";
}

export const CHART_OF_ACCOUNTS: Account[] = [
  // Aset (1)
  { code: "1-10001", name: "Kas Operasional", category: "Aset" },
  { code: "1-10002", name: "Bank BCA Giro (IDR)", category: "Aset" },
  { code: "1-10003", name: "Bank Mandiri Bisnis", category: "Aset" },
  { code: "1-10100", name: "Piutang Usaha (A/R)", category: "Aset" },
  { code: "1-10200", name: "Persediaan Barang Dagang", category: "Aset" },
  { code: "1-10300", name: "Pajak Dibayar di Muka (PPh 23)", category: "Aset" },
  { code: "1-10800", name: "Perlengkapan Kantor", category: "Aset" },
  { code: "1-20001", name: "Aset Tetap - Komputer & Server", category: "Aset" },
  { code: "1-20002", name: "Akumulasi Penyusutan Aset Tetap", category: "Aset" },
  
  // Kewajiban (2)
  { code: "2-10001", name: "Hutang Usaha (A/P)", category: "Kewajiban" },
  { code: "2-10002", name: "Hutang Gaji Karyawan", category: "Kewajiban" },
  { code: "2-10003", name: "Hutang Pajak PPh 21/23", category: "Kewajiban" },
  { code: "2-10004", name: "Pendapatan Diterima di Muka", category: "Kewajiban" },

  // Ekuitas (3)
  { code: "3-10001", name: "Modal Disetor", category: "Ekuitas" },
  { code: "3-20001", name: "Laba Ditahan (Retained Earnings)", category: "Ekuitas" },

  // Pendapatan (4)
  { code: "4-10001", name: "Pendapatan Penjualan Produk", category: "Pendapatan" },
  { code: "4-10002", name: "Pendapatan Jasa Implementasi", category: "Pendapatan" },
  { code: "4-20001", name: "Pendapatan Bunga Rekening Giro", category: "Pendapatan" },

  // Beban (5 & 6)
  { code: "5-10001", name: "Beban Pokok Penjualan (HPP)", category: "Beban" },
  { code: "6-10001", name: "Beban Gaji & Tunjangan", category: "Beban" },
  { code: "6-10002", name: "Beban Sewa Kantor", category: "Beban" },
  { code: "6-10003", name: "Beban Utilitas, Internet & Server", category: "Beban" },
  { code: "6-10004", name: "Beban Perlengkapan & ATK", category: "Beban" },
  { code: "6-10005", name: "Beban Perjalanan Dinas & Transport", category: "Beban" },
  { code: "6-10006", name: "Beban Pemasaran & Promosi", category: "Beban" },
];

export const METRIC_CARDS = [
  {
    id: "revenue",
    title: "Total Revenue (MTD)",
    value: 0,
    formattedValue: "Rp 0",
    change: "0%",
    isPositive: true,
    comparison: "periode berjalan",
    iconName: "TrendingUp",
    accentColor: "sky",
  },
  {
    id: "cash-inflow",
    title: "Net Cash Inflow",
    value: 0,
    formattedValue: "Rp 0",
    change: "0%",
    isPositive: true,
    comparison: "kas masuk terverifikasi",
    iconName: "ArrowDownLeft",
    accentColor: "emerald",
  },
  {
    id: "pending-invoices",
    title: "Pending Invoices (A/R)",
    value: 0,
    formattedValue: "Rp 0",
    change: "0 invoice",
    isPositive: true,
    comparison: "menunggu pelunasan",
    iconName: "Clock",
    accentColor: "amber",
  },
  {
    id: "expenses",
    title: "Total Expenses",
    value: 0,
    formattedValue: "Rp 0",
    change: "0%",
    isPositive: true,
    comparison: "dalam batas anggaran",
    iconName: "CreditCard",
    accentColor: "rose",
  },
];

export const CASH_FLOW_DATA = [
  { month: "Jun 2026", income: 0, expense: 0, net: 0 },
  { month: "Jul 2026", income: 0, expense: 0, net: 0 },
  { month: "Agu 2026", income: 0, expense: 0, net: 0 },
  { month: "Sep 2026", income: 0, expense: 0, net: 0 },
  { month: "Okt 2026", income: 0, expense: 0, net: 0 },
  { month: "Nov 2026", income: 0, expense: 0, net: 0 },
];

export interface Transaction {
  id: string;
  refNumber: string;
  date: string;
  contact: string;
  category: string;
  account: string;
  type: "income" | "expense";
  amount: number;
  status: "Paid" | "Pending" | "Overdue";
}

export const RECENT_TRANSACTIONS: Transaction[] = [];

export const BANK_BALANCES = [
  {
    id: "bca",
    bankName: "BCA Corporate Giro",
    accountNumber: "872-0918-291",
    balance: 0,
    type: "Giro Operasional Utama",
    status: "Active",
  },
  {
    id: "mandiri",
    bankName: "Mandiri Bisnis Giro",
    accountNumber: "131-00-982173-1",
    balance: 0,
    type: "Giro Payroll & Pajak",
    status: "Active",
  },
  {
    id: "petty",
    bankName: "Kas Kecil (Petty Cash)",
    accountNumber: "KAS-HO-SBY",
    balance: 0,
    type: "Operasional Harian Pabrik",
    status: "Active",
  },
];

