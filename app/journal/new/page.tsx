import { JournalEntryForm } from "@/components/journal/JournalEntryForm";
import Link from "next/link";
import { ArrowLeft, BookOpenCheck, History, HelpCircle } from "lucide-react";

export default function NewJournalPage() {
  return (
    <div className="space-y-6">
      {/* Navigation Breadcrumb & Page Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Link href="/" className="hover:text-sky-600 transition-colors">
            Dashboard
          </Link>
          <span>/</span>
          <Link href="/ledger" className="hover:text-sky-600 transition-colors">
            Buku Besar
          </Link>
          <span>/</span>
          <span className="font-semibold text-slate-800">Input Jurnal Umum</span>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/ledger"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <History className="w-3.5 h-3.5 text-slate-400" />
            <span>Lihat Riwayat Jurnal</span>
          </Link>
          <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-600 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
            <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            <span>Pedoman COA</span>
          </button>
        </div>
      </div>

      {/* Interactive Journal Entry Form */}
      <JournalEntryForm />
    </div>
  );
}

