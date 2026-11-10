"use client";

import { useState } from "react";
import { useForm, useFieldArray, useWatch } from "react-hook-form";
import {
  Plus,
  Trash2,
  Save,
  CheckCircle2,
  AlertCircle,
  RotateCcw,
  Calendar,
  FileText,
  FileCheck,
  ArrowRight,
  Info,
  Scale,
} from "lucide-react";
import { CHART_OF_ACCOUNTS } from "@/lib/mock-data";
import { formatIDR } from "@/lib/utils";
import { useAccounting } from "@/context/AccountingContext";

export interface JournalLineItem {
  accountId: string;
  description: string;
  debit: number | "";
  credit: number | "";
}

export interface JournalFormData {
  transactionDate: string;
  referenceNumber: string;
  journalType: string;
  generalDescription: string;
  lines: JournalLineItem[];
}

const DEFAULT_ROWS: JournalLineItem[] = [
  { accountId: "1-10001", description: "", debit: "", credit: "" },
  { accountId: "1-10002", description: "", debit: "", credit: "" },
];

export function JournalEntryForm() {
  const { addJournalEntry } = useAccounting();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState<string | null>(null);

  const today = new Date().toISOString().split("T")[0];

  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm<JournalFormData>({
    defaultValues: {
      transactionDate: today,
      referenceNumber: `JV-${new Date().getFullYear()}/${(new Date().getMonth() + 1)
        .toString()
        .padStart(2, "0")}-0001`,
      journalType: "Jurnal Umum",
      generalDescription: "",
      lines: DEFAULT_ROWS,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lines",
  });

  const watchedLines = useWatch({ control, name: "lines" }) || [];

  // Calculate total debit, credit and balance difference
  const totalDebit = watchedLines.reduce((acc, row) => {
    const val = typeof row?.debit === "number" ? row.debit : parseFloat(row?.debit as string) || 0;
    return acc + val;
  }, 0);

  const totalCredit = watchedLines.reduce((acc, row) => {
    const val = typeof row?.credit === "number" ? row.credit : parseFloat(row?.credit as string) || 0;
    return acc + val;
  }, 0);

  const difference = Math.abs(totalDebit - totalCredit);
  const isBalanced = totalDebit > 0 && totalCredit > 0 && difference === 0;

  // Auto-balance helper: adds balancing line
  const handleAutoBalance = () => {
    if (totalDebit > totalCredit) {
      append({
        accountId: "4-10001",
        description: "Penyeimbang kredit",
        debit: "",
        credit: totalDebit - totalCredit,
      });
    } else if (totalCredit > totalDebit) {
      append({
        accountId: "1-10002",
        description: "Penyeimbang debit",
        debit: totalCredit - totalDebit,
        credit: "",
      });
    }
  };

  const onSubmit = async (data: JournalFormData) => {
    if (!isBalanced) {
      alert("Peringatan: Jurnal tidak seimbang. Total Debit dan Total Kredit harus bernilai sama persis sebelum dapat disimpan.");
      return;
    }

    setIsSubmitting(true);
    // Add to shared accounting context & localStorage
    addJournalEntry({
      referenceNumber: data.referenceNumber,
      transactionDate: data.transactionDate,
      journalType: data.journalType,
      generalDescription: data.generalDescription,
      lines: data.lines,
    });

    await new Promise((res) => setTimeout(res, 600));
    setIsSubmitting(false);

    setSaveSuccess(
      `Jurnal Umum nomor ${data.referenceNumber} senilai ${formatIDR(
        totalDebit
      )} berhasil dibukukan dan diposting ke Buku Besar!`
    );
  };

  return (
    <div className="space-y-6">
      {/* Success Notification Banner */}
      {saveSuccess && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-xl flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Entri Jurnal Berhasil Diposting</h4>
              <p className="text-xs text-emerald-700 mt-0.5">{saveSuccess}</p>
            </div>
          </div>
          <button
            onClick={() => setSaveSuccess(null)}
            className="text-xs font-semibold px-3 py-1 bg-white border border-emerald-300 rounded-md hover:bg-emerald-100 text-emerald-800 transition-colors"
          >
            Tutup
          </button>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Card 1: Header Metadata Information */}
        <div className="bg-white rounded-xl p-6 border border-slate-200/90 shadow-soft">
          <div className="flex items-center justify-between pb-4 mb-5 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileText className="w-4 h-4 text-sky-500" />
                Informasi & Header Transaksi
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Pastikan nomor referensi dan tanggal transaksi sesuai dengan dokumen sumber / invoice fisik
              </p>
            </div>

            <span className="text-xs font-semibold px-2.5 py-1 rounded bg-slate-100 text-slate-700 border border-slate-200">
              Mata Uang: IDR (Rupiah)
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Reference Number */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                No. Referensi / Voucher <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  {...register("referenceNumber", { required: true })}
                  className="w-full px-3 py-2 text-xs font-mono font-semibold bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>
            </div>

            {/* Transaction Date */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tanggal Transaksi <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="date"
                  {...register("transactionDate", { required: true })}
                  className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                />
              </div>
            </div>

            {/* Journal Type */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Tipe Jurnal
              </label>
              <select
                {...register("journalType")}
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              >
                <option value="Jurnal Umum">Jurnal Umum (General)</option>
                <option value="Jurnal Penyesuaian">Jurnal Penyesuaian (Adjustment)</option>
                <option value="Jurnal Pembalik">Jurnal Pembalik (Reversing)</option>
                <option value="Jurnal Penutup">Jurnal Penutup (Closing)</option>
              </select>
            </div>

            {/* Tag / Divisi */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Departemen / Proyek
              </label>
              <select
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              >
                <option value="ALL">Operasional Kantor Pusat</option>
                <option value="IT">Divisi Teknologi & Produk</option>
                <option value="MKT">Divisi Penjualan & Marketing</option>
                <option value="GA">Divisi Umum & Legal</option>
              </select>
            </div>

            {/* General Description */}
            <div className="md:col-span-4 mt-1">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Keterangan Transaksi Keseluruhan <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                {...register("generalDescription", { required: true })}
                placeholder="Tuliskan keterangan detail transaksi untuk memudahkan proses audit trail..."
                className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Line Items Table (Dynamic Rows) */}
        <div className="bg-white rounded-xl border border-slate-200/90 shadow-soft overflow-hidden">
          <div className="p-4 bg-slate-50/70 border-b border-slate-200/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-sky-500" />
              <h3 className="text-sm font-bold text-slate-900">Rincian Akun Jurnal (Debet & Kredit)</h3>
            </div>
            <div className="text-xs text-slate-500 flex items-center gap-2">
              <span>Minimal 2 baris transaksi</span>
              <button
                type="button"
                onClick={handleAutoBalance}
                disabled={isBalanced || difference === 0}
                className="text-xs font-semibold px-2.5 py-1 bg-white border border-sky-300 text-sky-600 rounded-md hover:bg-sky-50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                Seimbangkan Otomatis
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100/80 text-slate-600 font-semibold uppercase tracking-wider border-b border-slate-200 text-[11px]">
                <tr>
                  <th className="py-2.5 px-3 w-10 text-center">#</th>
                  <th className="py-2.5 px-3 w-72">Akun Perkiraan (COA)</th>
                  <th className="py-2.5 px-3 min-w-[200px]">Deskripsi Baris</th>
                  <th className="py-2.5 px-3 w-48 text-right">Debit (IDR)</th>
                  <th className="py-2.5 px-3 w-48 text-right">Kredit (IDR)</th>
                  <th className="py-2.5 px-3 w-12 text-center">Aksi</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100">
                {fields.map((field, index) => (
                  <tr key={field.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Index */}
                    <td className="py-3 px-3 text-center text-slate-400 font-mono text-xs font-bold">
                      {index + 1}
                    </td>

                    {/* Account Dropdown */}
                    <td className="py-3 px-3">
                      <select
                        {...register(`lines.${index}.accountId` as const, { required: true })}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                      >
                        <option value="">Pilih Akun Perkiraan...</option>
                        <optgroup label="1 - Aset Lancar & Tetap">
                          {CHART_OF_ACCOUNTS.filter((a) => a.category === "Aset").map((a) => (
                            <option key={a.code} value={a.code}>
                              {a.code} - {a.name}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="2 - Kewajiban / Hutang">
                          {CHART_OF_ACCOUNTS.filter((a) => a.category === "Kewajiban").map((a) => (
                            <option key={a.code} value={a.code}>
                              {a.code} - {a.name}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="3 - Modal / Ekuitas">
                          {CHART_OF_ACCOUNTS.filter((a) => a.category === "Ekuitas").map((a) => (
                            <option key={a.code} value={a.code}>
                              {a.code} - {a.name}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="4 - Pendapatan">
                          {CHART_OF_ACCOUNTS.filter((a) => a.category === "Pendapatan").map((a) => (
                            <option key={a.code} value={a.code}>
                              {a.code} - {a.name}
                            </option>
                          ))}
                        </optgroup>
                        <optgroup label="5 & 6 - Beban Pokok & Operasional">
                          {CHART_OF_ACCOUNTS.filter((a) => a.category === "Beban").map((a) => (
                            <option key={a.code} value={a.code}>
                              {a.code} - {a.name}
                            </option>
                          ))}
                        </optgroup>
                      </select>
                    </td>

                    {/* Line Description */}
                    <td className="py-3 px-3">
                      <input
                        type="text"
                        placeholder="Keterangan per baris (opsional)"
                        {...register(`lines.${index}.description` as const)}
                        className="w-full px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-md text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                      />
                    </td>

                    {/* Debit Input */}
                    <td className="py-3 px-3">
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold">
                          Rp
                        </span>
                        <input
                          type="number"
                          step="any"
                          placeholder="0"
                          {...register(`lines.${index}.debit` as const, {
                            valueAsNumber: true,
                            onChange: (e) => {
                              // If debit has value, clear credit for standard entry ergonomics
                              if (e.target.value && Number(e.target.value) > 0) {
                                setValue(`lines.${index}.credit`, "");
                              }
                            },
                          })}
                          className="w-full pl-8 pr-2.5 py-1.5 text-xs font-mono font-bold text-right bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                        />
                      </div>
                    </td>

                    {/* Credit Input */}
                    <td className="py-3 px-3">
                      <div className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-[10px] font-bold">
                          Rp
                        </span>
                        <input
                          type="number"
                          step="any"
                          placeholder="0"
                          {...register(`lines.${index}.credit` as const, {
                            valueAsNumber: true,
                            onChange: (e) => {
                              // If credit has value, clear debit
                              if (e.target.value && Number(e.target.value) > 0) {
                                setValue(`lines.${index}.debit`, "");
                              }
                            },
                          })}
                          className="w-full pl-8 pr-2.5 py-1.5 text-xs font-mono font-bold text-right bg-white border border-slate-200 rounded-md text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500"
                        />
                      </div>
                    </td>

                    {/* Remove Action */}
                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => remove(index)}
                        disabled={fields.length <= 2}
                        title="Hapus baris ini"
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded transition-colors disabled:opacity-30 disabled:hover:text-slate-400 disabled:hover:bg-transparent"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>

              {/* Table Footer: Totals and Balance indicator */}
              <tfoot className="bg-slate-50/90 border-t-2 border-slate-300 font-mono">
                <tr>
                  <td colSpan={3} className="py-3 px-4 text-right font-sans font-bold text-slate-700 text-xs">
                    TOTAL PERHITUNGAN:
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-sm text-slate-900">
                    {formatIDR(totalDebit)}
                  </td>
                  <td className="py-3 px-3 text-right font-bold text-sm text-slate-900">
                    {formatIDR(totalCredit)}
                  </td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Add Row Button Toolbar */}
          <div className="p-3 bg-white border-t border-slate-100 flex items-center justify-between">
            <button
              type="button"
              onClick={() =>
                append({
                  accountId: "",
                  description: "",
                  debit: "",
                  credit: "",
                })
              }
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-sky-600 bg-sky-50 hover:bg-sky-100 rounded-lg border border-sky-200 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Tambah Baris Baru (Add Row)</span>
            </button>

            {/* Quick helper indicator */}
            <span className="text-[11px] text-slate-400">
              Gunakan tombol Tab pada keyboard untuk berpindah antar kolom input
            </span>
          </div>
        </div>

        {/* Card 3: Balancing Status and Action Buttons */}
        <div className="bg-white rounded-xl p-5 border border-slate-200/90 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Balance verification indicator */}
          <div className="flex items-center gap-3">
            {isBalanced ? (
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 text-emerald-800 rounded-lg border border-emerald-200 text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  JURNAL SEIMBANG (BALANCE): Debit & Kredit seimbang pada <strong>{formatIDR(totalDebit)}</strong>
                </span>
              </div>
            ) : (
              <div className="flex items-center gap-2 px-3 py-2 bg-rose-50 text-rose-800 rounded-lg border border-rose-200 text-xs font-semibold">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>
                  TIDAK SEIMBANG: Selisih sebesar <strong>{formatIDR(difference)}</strong>. Jurnal tidak dapat disimpan sebelum seimbang.
                </span>
              </div>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => reset()}
              className="px-4 py-2 text-xs font-semibold text-slate-600 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors"
            >
              Reset Form
            </button>
            <button
              type="button"
              className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            >
              Simpan sebagai Draf
            </button>
            <button
              type="submit"
              disabled={!isBalanced || isSubmitting}
              className="inline-flex items-center gap-2 px-5 py-2 text-xs font-bold text-white bg-sky-500 hover:bg-sky-600 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg shadow-sm shadow-sky-500/20 transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{isSubmitting ? "Memposting..." : "Simpan & Posting Jurnal"}</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

