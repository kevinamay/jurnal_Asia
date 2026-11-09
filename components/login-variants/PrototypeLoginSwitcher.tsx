"use client";

import { useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";
import { LOGIN_VARIANTS_META, LoginVariantMeta } from "./types";

interface PrototypeLoginSwitcherProps {
  currentVariant: string;
  onSelectVariant: (id: string) => void;
}

export function PrototypeLoginSwitcher({
  currentVariant,
  onSelectVariant,
}: PrototypeLoginSwitcherProps) {
  const currentIndex = LOGIN_VARIANTS_META.findIndex((v) => v.id === currentVariant);
  const activeIndex = currentIndex >= 0 ? currentIndex : 0;
  const current = LOGIN_VARIANTS_META[activeIndex];

  const handlePrev = useCallback(() => {
    const prevIdx =
      (activeIndex - 1 + LOGIN_VARIANTS_META.length) % LOGIN_VARIANTS_META.length;
    onSelectVariant(LOGIN_VARIANTS_META[prevIdx].id);
  }, [activeIndex, onSelectVariant]);

  const handleNext = useCallback(() => {
    const nextIdx = (activeIndex + 1) % LOGIN_VARIANTS_META.length;
    onSelectVariant(LOGIN_VARIANTS_META[nextIdx].id);
  }, [activeIndex, onSelectVariant]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      const isInput =
        activeEl?.tagName === "INPUT" ||
        activeEl?.tagName === "TEXTAREA" ||
        (activeEl as HTMLElement)?.isContentEditable;

      if (isInput) return;

      if (e.key === "ArrowLeft") {
        e.preventDefault();
        handlePrev();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        handleNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleNext, handlePrev]);

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-1.5 select-none pointer-events-auto">
      {/* Main floating control pill */}
      <div className="bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl flex items-center gap-2 text-xs">
        {/* Left Arrow */}
        <button
          type="button"
          onClick={handlePrev}
          title="Desain Sebelumnya (Tekan ←)"
          className="p-1.5 hover:bg-slate-800 rounded-xl transition-colors text-slate-300 hover:text-white cursor-pointer active:scale-95"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Current Variant Badge & Title */}
        <div className="px-3 py-1 flex items-center gap-2.5 min-w-[260px] justify-center text-center">
          <span className="w-5 h-5 rounded-md bg-sky-500 text-white font-bold flex items-center justify-center text-[11px] shadow-sm shrink-0">
            {current.number}
          </span>
          <div className="text-left">
            <p className="font-bold text-white text-[11px] leading-tight flex items-center gap-1.5">
              <span>{current.name}</span>
            </p>
            <p className="text-[10px] text-sky-400 font-medium truncate max-w-[210px]">
              {current.description}
            </p>
          </div>
        </div>

        {/* Right Arrow */}
        <button
          type="button"
          onClick={handleNext}
          title="Desain Berikutnya (Tekan →)"
          className="p-1.5 hover:bg-slate-800 rounded-xl transition-colors text-slate-300 hover:text-white cursor-pointer active:scale-95"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="h-5 w-[1px] bg-slate-700 mx-0.5"></div>

        {/* Quick Numeric Jump Buttons (1 to 8) */}
        <div className="flex items-center gap-1 px-1">
          {LOGIN_VARIANTS_META.map((meta) => {
            const isSelected = meta.id === currentVariant;
            return (
              <button
                key={meta.id}
                type="button"
                onClick={() => onSelectVariant(meta.id)}
                className={`w-6 h-6 rounded-lg text-[10px] font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-sky-500 text-white shadow-sm ring-2 ring-sky-300/40 scale-105"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
                }`}
                title={`Pindah ke ${meta.name}`}
              >
                {meta.number}
              </button>
            );
          })}
        </div>
      </div>

      {/* Floating tip helper */}
      <div className="text-[10px] font-medium text-slate-600 bg-white/90 backdrop-blur-sm border border-slate-200/80 px-2.5 py-0.5 rounded-full shadow-xs">
        Pilihan 8 Desain Login • Gunakan tombol panah <kbd className="px-1 py-0.2 bg-slate-100 rounded text-slate-800 font-mono font-semibold">←</kbd> <kbd className="px-1 py-0.2 bg-slate-100 rounded text-slate-800 font-mono font-semibold">→</kbd> untuk mengganti
      </div>
    </div>
  );
}
