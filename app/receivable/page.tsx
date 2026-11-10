"use client";

import { useState } from "react";
import { formatIDR } from "@/lib/utils";
import {
  Plus,
  AlertCircle,
  CheckCircle2,
  Clock,
  FileText,
  Search,
  X,
  Check,
} from "lucide-react";
import { useAccounting } from "@/context/AccountingContext";

export default function ReceivablePage() {
  const { invoices, addInvoice, updateInvoiceStatus, isSyncing } = useAccounting();
  const [filterStatus, setFilterStatus] = useState<"all" | "Pending" | "Overdue" | "Paid">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    invoiceNumber: "",
    customer: "",
    issueDate: today,
    dueDate: today,
    totalAmount: "",
    status: "Pending" as "Paid" | "Pending",
  });

  const handleOpenModal = () => {
    const nextNum = (invoices.length + 1).toString().padStart(4, "0");
    setFormData({
      invoiceNumber: `INV-2026/11-${nextNum}`,
      customer: "",
      issueDate: today,
      dueDate: today,
      totalAmount: "",
      status: "Pending",
    });
    setIsModalOpen(true);
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.totalAmount.replace(/[^0-9]/g, "")) || 0;
    if (!formData.customer.trim() || amount <= 0) {
      alert("Harap isi nama pelanggan dan nominal tagihan yang valid.");
      return;
    }

    setIsSubmitting(true);
    await addInvoice({
      invoiceNumber: formData.invoiceNumber.trim(),
      customer: formData.customer.trim(),
      issueDate: formData.issueDate,
      dueDate: formData.dueDate,
      totalAmount: amount,
      status: formData.status,
    });
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  // Metrics
  const totalOutstanding = invoices
    .filter((i) => i.status !== "Paid")
    .reduce((acc, curr) => acc + curr.remainingAmount, 0);

  const overdueTotal = invoices
    .filter((i) => i.status === "Overdue")
    .reduce((acc, curr) => acc + curr.remainingAmount, 0);

  const collectedMTD = invoices
    .filter((i) => i.status === "Paid")
    .reduce((acc, curr) => acc + curr.paidAmount, 0);

  // Filter & Search
  const filteredInvoices = invoices.filter((inv) => {
    const matchesFilter = filterStatus === "all" ? true : inv.status === filterStatus;
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Metric summary (1 col mobile, 2 col tablet, 3 col desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Total Piutang Belum Tertagih
          </span>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">
            {formatIDR(totalOutstanding)}
          </div>
          <span className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />{" "}
            {invoices.filter((i) => i.status !== "Paid").length} Invoice aktif menunggu pembayaran
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Piutang Jatuh Tempo (Overdue)
          </span>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">
            {formatIDR(overdueTotal)}
          </div>
          <span className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1">
            <AlertCircle className="w-3.5 h-3.5 text-slate-400" />{" "}
            {invoices.filter((i) => i.status === "Overdue").length} Invoice melewati batas kredit
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-soft sm:col-span-2 lg:col-span-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Pelunasan Bulan Ini (MTD)
          </span>
          <div className="text-xl sm:text-2xl font-bold text-emerald-600 font-mono">
            {formatIDR(collectedMTD)}
          </div>
          <span className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Pembayaran piutang terverifikasi
          </span>
        </div>
      </div>

      {/* Invoices Table with Horizontal Scroll on Mobile */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-soft overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">Daftar Tagihan Penjualan (Invoices)</h3>
              <span className="text-[11px] font-semibold bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full border border-sky-100">
                Terpusat (Multi-User)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Monitor status pembayaran dan umur piutang pelanggan PT / CV secara real-time
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Filter Pills */}
            <div className="inline-flex rounded-lg bg-slate-100 p-0.5 text-xs font-medium text-slate-600">
              <button
                onClick={() => setFilterStatus("all")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  filterStatus === "all" ? "bg-white text-slate-900 font-bold shadow-xs" : ""
                }`}
              >
                Semua ({invoices.length})
              </button>
              <button
                onClick={() => setFilterStatus("Pending")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  filterStatus === "Pending" ? "bg-white text-amber-700 font-bold shadow-xs" : ""
                }`}
              >
                Menunggu
              </button>
              <button
                onClick={() => setFilterStatus("Paid")}
                className={`px-2.5 py-1 rounded-md transition-all ${
                  filterStatus === "Paid" ? "bg-white text-emerald-700 font-bold shadow-xs" : ""
                }`}
              >
                Lunas
              </button>
            </div>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari invoice / klien..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 w-36 sm:w-48"
              />
            </div>

            {/* Button Buat Tagihan */}
            <button
              onClick={handleOpenModal}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Buat Tagihan Baru
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3 px-4">No. Invoice</th>
                <th className="py-3 px-4">Pelanggan / Klien</th>
                <th className="py-3 px-4">Tgl Terbit</th>
                <th className="py-3 px-4">Jatuh Tempo</th>
                <th className="py-3 px-4 text-right">Total Nilai</th>
                <th className="py-3 px-4 text-right">Sisa Piutang</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi Pelunasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredInvoices.length > 0 ? (
                filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-sky-600">{inv.invoiceNumber}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{inv.customer}</td>
                    <td className="py-3 px-4 text-slate-500">{inv.issueDate}</td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{inv.dueDate}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {formatIDR(inv.totalAmount)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {formatIDR(inv.remainingAmount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {inv.status === "Paid" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Lunas
                        </span>
                      )}
                      {inv.status === "Pending" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Menunggu
                        </span>
                      )}
                      {inv.status === "Overdue" && (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
                          {inv.aging || "Overdue"}
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {inv.status !== "Paid" ? (
                        <button
                          onClick={() => updateInvoiceStatus(inv.id, "Paid")}
                          title="Tandai Pembayaran Lunas"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-md transition-all shadow-2xs"
                        >
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Tandai Lunas</span>
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> Selesai
                        </span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-500 bg-slate-50/30">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3 px-4">
                      <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center text-sky-500 border border-sky-100">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">
                          Belum Ada Tagihan Piutang
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Belum ada transaksi piutang penjualan (A/R) yang tercatat. Klik tombol di bawah untuk membuat invoice baru yang otomatis terhubung ke sistem terpusat.
                        </p>
                      </div>
                      <button
                        onClick={handleOpenModal}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-lg shadow-sm transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Buat Tagihan Baru</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Buat Tagihan Piutang Baru */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Buat Tagihan Piutang Baru</h3>
                  <p className="text-[11px] text-slate-500">Tersinkronisasi ke Multi-User & Buku Besar</p>
                </div>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateInvoice} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Faktur / Invoice
                </label>
                <input
                  type="text"
                  required
                  value={formData.invoiceNumber}
                  onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Pelanggan / Klien (PT / Toko)
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Sumber Rejeki Plastik"
                  value={formData.customer}
                  onChange={(e) => setFormData({ ...formData, customer: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tanggal Terbit
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.issueDate}
                    onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jatuh Tempo
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.dueDate}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Total Nilai Tagihan (IDR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="Contoh: 15000000"
                    value={formData.totalAmount}
                    onChange={(e) => setFormData({ ...formData, totalAmount: e.target.value })}
                    className="w-full pl-9 pr-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Status Pembayaran Awal
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value as "Paid" | "Pending" })
                  }
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                >
                  <option value="Pending">Menunggu Pembayaran (Belum Lunas)</option>
                  <option value="Paid">Sudah Dibayar Lunas</option>
                </select>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 rounded-lg shadow-sm transition-all flex items-center gap-1.5"
                >
                  {isSubmitting ? "Menyimpan..." : "Simpan Tagihan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
