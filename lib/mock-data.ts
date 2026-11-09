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
    value: 842500000,
    formattedValue: "Rp 842.500.000",
    change: "+18.4%",
    isPositive: true,
    comparison: "vs bulan lalu",
    iconName: "TrendingUp",
    accentColor: "sky",
  },
  {
    id: "cash-inflow",
    title: "Net Cash Inflow",
    value: 324150000,
    formattedValue: "Rp 324.150.000",
    change: "+12.1%",
    isPositive: true,
    comparison: "vs bulan lalu",
    iconName: "ArrowDownLeft",
    accentColor: "emerald",
  },
  {
    id: "pending-invoices",
    title: "Pending Invoices (A/R)",
    value: 158400000,
    formattedValue: "Rp 158.400.000",
    change: "-5.2%",
    isPositive: true, // fewer pending invoices is positive for A/R collection
    comparison: "14 invoice menunggu",
    iconName: "Clock",
    accentColor: "amber",
  },
  {
    id: "expenses",
    title: "Total Expenses",
    value: 518350000,
    formattedValue: "Rp 518.350.000",
    change: "+3.8%",
    isPositive: false,
    comparison: "dalam batas anggaran",
    iconName: "CreditCard",
    accentColor: "rose",
  },
];

export const CASH_FLOW_DATA = [
  { month: "Mei 2026", income: 680000000, expense: 490000000, net: 190000000 },
  { month: "Jun 2026", income: 720000000, expense: 510000000, net: 210000000 },
  { month: "Jul 2026", income: 750000000, expense: 480000000, net: 270000000 },
  { month: "Agu 2026", income: 790000000, expense: 530000000, net: 260000000 },
  { month: "Sep 2026", income: 810000000, expense: 540000000, net: 270000000 },
  { month: "Okt 2026", income: 842500000, expense: 518350000, net: 324150000 },
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

export const RECENT_TRANSACTIONS: Transaction[] = [
  {
    id: "tx-1",
    refNumber: "INV-2026/11-0089",
    date: "08 Nov 2026",
    contact: "PT Digital Sinergi Nusantara",
    category: "Pendapatan Jasa Implementasi",
    account: "Bank BCA Giro",
    type: "income",
    amount: 125000000,
    status: "Paid",
  },
  {
    id: "tx-2",
    refNumber: "BILL-2026/11-0045",
    date: "07 Nov 2026",
    contact: "PT Telkom Indonesia (IndiBiz)",
    category: "Beban Utilitas & Internet",
    account: "Kas Operasional",
    type: "expense",
    amount: 14750000,
    status: "Paid",
  },
  {
    id: "tx-3",
    refNumber: "INV-2026/11-0088",
    date: "06 Nov 2026",
    contact: "CV Mandiri Sejahtera Abadi",
    category: "Pendapatan Penjualan Produk",
    account: "Piutang Usaha (A/R)",
    type: "income",
    amount: 48500000,
    status: "Pending",
  },
  {
    id: "tx-4",
    refNumber: "BILL-2026/11-0044",
    date: "05 Nov 2026",
    contact: "Gedung Cyber One (PT Menara Graha)",
    category: "Beban Sewa Kantor Q4",
    account: "Bank Mandiri Bisnis",
    type: "expense",
    amount: 65000000,
    status: "Paid",
  },
  {
    id: "tx-5",
    refNumber: "INV-2026/10-0075",
    date: "28 Okt 2026",
    contact: "PT Mitra Perkasa Logistik",
    category: "Pendapatan Jasa Implementasi",
    account: "Piutang Usaha (A/R)",
    type: "income",
    amount: 32000000,
    status: "Overdue",
  },
  {
    id: "tx-6",
    refNumber: "BILL-2026/10-0043",
    date: "27 Okt 2026",
    contact: "PT Graha Media Solusi",
    category: "Beban Pemasaran & Iklan",
    account: "Hutang Usaha (A/P)",
    type: "expense",
    amount: 22400000,
    status: "Pending",
  },
  {
    id: "tx-7",
    refNumber: "INV-2026/10-0074",
    date: "25 Okt 2026",
    contact: "PT Global Retailindo Utama",
    category: "Pendapatan Penjualan Produk",
    account: "Bank BCA Giro",
    type: "income",
    amount: 89000000,
    status: "Paid",
  },
  {
    id: "tx-8",
    refNumber: "JV-2026/10-0021",
    date: "24 Okt 2026",
    contact: "Penyesuaian Biaya Sewa Dibayar Dimuka",
    category: "Jurnal Penyesuaian",
    account: "Beban Sewa Kantor",
    type: "expense",
    amount: 15000000,
    status: "Paid",
  },
];

export const BANK_BALANCES = [
  {
    id: "bca",
    bankName: "BCA Corporate Giro",
    accountNumber: "872-0918-291",
    balance: 1450000000,
    type: "Giro Operasional Utama",
    status: "Active",
  },
  {
    id: "mandiri",
    bankName: "Mandiri Bisnis Giro",
    accountNumber: "131-00-982173-1",
    balance: 820500000,
    type: "Giro Payroll & Pajak",
    status: "Active",
  },
  {
    id: "petty",
    bankName: "Kas Kecil (Petty Cash)",
    accountNumber: "KAS-HO-JKT",
    balance: 18250000,
    type: "Operasional Harian Kantor",
    status: "Active",
  },
];

