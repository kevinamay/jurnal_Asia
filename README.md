# Jurnal Asia (CV ASIA PLASTIK - Dashboard Keuangan)

A modern, robust, and highly functional Internal Financial & Accounting Dashboard built with **Next.js 14 (App Router)**, **Tailwind CSS**, **Lucide React**, **Recharts**, and **React Hook Form**. Inspired by enterprise accounting software like Jurnal.id, focused on rapid data entry and clear financial visibility.

---

## 🚀 Fitur Utama

- **Financial Overview Dashboard (`/` & `/dashboard`):**
  - Metric cards: Total Revenue (MTD), Net Cash Inflow, Pending Invoices (A/R), Total Expenses.
  - Cash Flow Projections Chart: Komparasi 6 bulan perputaran kas masuk (Income) vs kas keluar (Expense) berbasis Recharts.
  - Ringkasan Saldo Bank & Kas Kecil (BCA Giro, Mandiri Bisnis, Petty Cash) secara real-time.
  - Tabel Mutasi Transaksi & Faktur terkini dengan filter status (Lunas, Menunggu, Jatuh Tempo).

- **Input Jurnal Umum Manual (`/journal/new`):**
  - Dynamic Line Items (Debet & Kredit) berbasis **React Hook Form** (`useFieldArray`).
  - Dropdown Chart of Accounts (COA) terstandarisasi (Aset, Kewajiban, Ekuitas, Pendapatan, Beban).
  - Validasi keseimbangan real-time (*Balance Guard*) dan fitur *Auto-Balance*.

- **Buku Besar / General Ledger (`/ledger`):**
  - Mutasi akun perkiraan, saldo awal, dan saldo kumulatif per periode.

- **Manajemen Operasional Finansial:**
  - Piutang Usaha / Accounts Receivable (`/receivable`).
  - Hutang Usaha / Accounts Payable (`/payable`).
  - Pusat Laporan Keuangan Standar PSAK (`/reports`).

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS with custom light-blue fintech theme (`sky-500` / `#0ea5e9`)
- **Icons:** Lucide React
- **Visualisasi Grafik:** Recharts
- **Form Management:** React Hook Form
- **Tipografi:** Plus Jakarta Sans & monospace untuk nominal mata uang

---

## 🏁 Memulai Pengembangan Lokal

1. **Clone repository:**
   ```bash
   git clone https://github.com/kevinamay/jurnal_Asia.git
   cd jurnal_Asia
   ```

2. **Install dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan development server:**
   ```bash
   npm run dev
   ```

4. Buka [http://localhost:3000](http://localhost:3000) di browser Anda.
