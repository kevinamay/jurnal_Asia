"use client";

import { useState } from "react";
import { formatIDR } from "@/lib/utils";
import {
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  Search,
  X,
  Check,
} from "lucide-react";
import { useAccounting } from "@/context/AccountingContext";

export default function PayablePage() {
  const { bills, addBill, updateBillStatus, isSyncing } = useAccounting();
  const [filterStatus, setFilterStatus] = useState<"all" | "Pending" | "Paid">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const today = new Date().toISOString().split("T")[0];
  const [formData, setFormData] = useState({
    billNumber: "",
    vendor: "",
    category: "Beban Bahan Baku & Produksi",
    issueDate: today,
    dueDate: today,
    totalAmount: "",
    status: "Pending" as "Paid" | "Pending",
  });

  const handleOpenModal = () => {
    const nextNum = (bills.length + 1).toString().padStart(4, "0");
    setFormData({
      billNumber: `BILL-2026/11-${nextNum}`,
      vendor: "",
      category: "Beban Bahan Baku & Operasional",
      issueDate: today,
      dueDate: today,
      totalAmount: "",
      status: "Pending",
    });
    setIsModalOpen(true);
  };

  const handleCreateBill = async (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(formData.totalAmount.replace(/[^0-9]/g, "")) || 0;
    if (!formData.vendor.trim() || amount <= 0) {
      alert("Harap isi nama vendor dan nominal tagihan yang valid.");
      return;
    }

    setIsSubmitting(true);
    await addBill({
      billNumber: formData.billNumber.trim(),
      vendor: formData.vendor.trim(),
      category: formData.category,
      issueDate: formData.issueDate,
      dueDate: formData.dueDate,
      totalAmount: amount,
      status: formData.status,
    });
    setIsSubmitting(false);
    setIsModalOpen(false);
  };

  // Metrics
  const totalPayablePending = bills
    .filter((b) => b.status === "Pending")
    .reduce((acc, curr) => acc + curr.remainingAmount, 0);

  const totalPaidMTD = bills
    .filter((b) => b.status === "Paid")
    .reduce((acc, curr) => acc + curr.paidAmount, 0);

  const totalAllBills = bills.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const efficiencyRate =
    totalAllBills > 0 ? Math.round(((totalAllBills - totalPayablePending) / totalAllBills) * 100) : 100;

  // Filter & Search
  const filteredBills = bills.filter((bill) => {
    const matchesFilter = filterStatus === "all" ? true : bill.status === filterStatus;
    const matchesSearch =
      bill.billNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bill.vendor.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Metric summary (1 col mobile, 2 col tablet, 3 col desktop) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Total Hutang Belum Dibayar
          </span>
          <div className="text-xl sm:text-2xl font-bold text-slate-900 font-mono">
            {formatIDR(totalPayablePending)}
          </div>
          <span className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />{" "}
            {bills.filter((b) => b.status === "Pending").length} Tagihan vendor menunggu verifikasi
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-soft">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Pembayaran Selesai Bulan Ini (MTD)
          </span>
          <div className="text-xl sm:text-2xl font-bold text-emerald-600 font-mono">
            {formatIDR(totalPaidMTD)}
          </div>
          <span className="text-xs text-emerald-600 font-medium mt-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" /> Tagihan terverifikasi lunas
          </span>
        </div>

        <div className="bg-white p-4 sm:p-5 rounded-xl border border-slate-200/90 shadow-soft sm:col-span-2 lg:col-span-1">
          <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-1">
            Efisiensi Kas Keluar
          </span>
          <div className="text-xl sm:text-2xl font-bold text-sky-600 font-mono">
            {efficiencyRate}%
          </div>
          <span className="text-xs text-slate-500 font-medium mt-1">
            Jadwal pembayaran terkontrol terpusat
          </span>
        </div>
      </div>

      {/* Bills Table with Horizontal Scroll for Mobile */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-soft overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900">
                Daftar Tagihan Pemasok (Accounts Payable)
              </h3>
              <span className="text-[11px] font-semibold bg-sky-50 text-sky-700 px-2 py-0.5 rounded-full border border-sky-100">
                Terpusat (Multi-User)
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Jadwal jatuh tempo pembayaran beban operasional dan vendor secara real-time
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
                Semua ({bills.length})
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
                placeholder="Cari tagihan / vendor..."
                className="pl-8 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 w-36 sm:w-48"
              />
            </div>

            {/* Button Catat Tagihan */}
            <button
              onClick={handleOpenModal}
              className="px-3 py-1.5 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-lg shadow-xs flex items-center justify-center gap-1.5 transition-all"
            >
              <Plus className="w-3.5 h-3.5" /> Catat Tagihan Vendor
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs min-w-[720px]">
            <thead className="bg-slate-50 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200 text-[11px]">
              <tr>
                <th className="py-3 px-4">No. Tagihan (Bill)</th>
                <th className="py-3 px-4">Vendor / Pemasok</th>
                <th className="py-3 px-4">Kategori</th>
                <th className="py-3 px-4">Tgl Terbit</th>
                <th className="py-3 px-4">Jatuh Tempo</th>
                <th className="py-3 px-4 text-right">Total Tagihan</th>
                <th className="py-3 px-4 text-right">Sisa Hutang</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-center">Aksi Bayar</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filteredBills.length > 0 ? (
                filteredBills.map((bill) => (
                  <tr key={bill.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-sky-600">{bill.billNumber}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{bill.vendor}</td>
                    <td className="py-3 px-4 text-slate-500">{bill.category || "Hutang Usaha"}</td>
                    <td className="py-3 px-4 text-slate-500">{bill.issueDate}</td>
                    <td className="py-3 px-4 text-slate-700 font-medium">{bill.dueDate}</td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {formatIDR(bill.totalAmount)}
                    </td>
                    <td className="py-3 px-4 text-right font-mono font-bold text-slate-900">
                      {formatIDR(bill.remainingAmount)}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {bill.status === "Paid" ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          Dibayar Lunas
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                          Menunggu Bayar
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {bill.status !== "Paid" ? (
                        <button
                          onClick={() => updateBillStatus(bill.id, "Paid")}
                          title="Tandai Sudah Dibayar"
                          className="inline-flex items-center gap-1 px-2.5 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 rounded-md transition-all shadow-2xs"
                        >
                          <Check className="w-3 h-3 text-emerald-600" />
                          <span>Bayar Lunas</span>
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
                  <td colSpan={9} className="py-16 text-center text-slate-500 bg-slate-50/30">
                    <div className="flex flex-col items-center justify-center max-w-sm mx-auto space-y-3 px-4">
                      <div className="w-12 h-12 rounded-full bg-sky-50 flex items-center justify-center text-sky-500 border border-sky-100">
                        <FileText className="w-6 h-6" />
                      </div>
                      <div>
                        <h4 className="text-sm font-bold text-slate-800">
                          Belum Ada Tagihan Hutang
                        </h4>
                        <p className="text-xs text-slate-500 mt-1">
                          Belum ada catatan tagihan hutang vendor (A/P). Klik tombol di bawah untuk mencatat tagihan baru yang terhubung ke sistem terpusat.
                        </p>
                      </div>
                      <button
                        onClick={handleOpenModal}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-semibold text-white bg-sky-500 hover:bg-sky-600 rounded-lg shadow-sm transition-all"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Catat Tagihan Vendor</span>
                      </button>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Catat Tagihan Vendor Baru */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-sky-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Catat Tagihan Vendor (A/P)</h3>
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

            <form onSubmit={handleCreateBill} className="p-5 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor Tagihan (Bill Number)
                </label>
                <input
                  type="text"
                  required
                  value={formData.billNumber}
                  onChange={(e) => setFormData({ ...formData, billNumber: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Vendor / Pemasok
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: PT Menara Graha (Sewa Kantor)"
                  value={formData.vendor}
                  onChange={(e) => setFormData({ ...formData, vendor: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Kategori Pengeluaran
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-sky-500 bg-white"
                >
                  <option value="Beban Bahan Baku & Produksi">Beban Bahan Baku & Produksi</option>
                  <option value="Beban Sewa Kantor / Gudang">Beban Sewa Kantor / Gudang</option>
                  <option value="Beban Utilitas, Internet & Server">Beban Utilitas, Internet & Server</option>
                  <option value="Beban Perlengkapan & ATK">Beban Perlengkapan & ATK</option>
                  <option value="Beban Operasional Lainnya">Beban Operasional Lainnya</option>
                </select>
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
                  Total Tagihan (IDR)
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                    Rp
                  </span>
                  <input
                    type="number"
                    min="1"
                    required
                    placeholder="Contoh: 12000000"
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
                  <option value="Pending">Menunggu Pembayaran (Belum Bayar)</option>
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
