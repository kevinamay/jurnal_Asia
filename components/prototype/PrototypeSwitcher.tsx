"use client";

import { useEffect } from "react";
import { ChevronLeft, ChevronRight, Sparkles, Layers } from "lucide-react";

export interface VariantInfo {
  id: string;
  name: string;
  description: string;
}

interface PrototypeSwitcherProps {
  variants: VariantInfo[];
  currentVariant: string;
  onSelectVariant: (id: string) => void;
}

export function PrototypeSwitcher({
  variants,
  currentVariant,
  onSelectVariant,
}: PrototypeSwitcherProps) {
  const currentIndex = variants.findIndex((v) => v.id === currentVariant);
  const current = variants[currentIndex] || variants[0];

  const handlePrev = () => {
    const prevIndex = (currentIndex - 1 + variants.length) % variants.length;
    onSelectVariant(variants[prevIndex].id);
  };

  const handleNext = () => {
    const nextIndex = (currentIndex + 1) % variants.length;
    onSelectVariant(variants[nextIndex].id);
  };

  // Keyboard navigation (Left / Right arrow) when not typing in an input
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
  }, [currentIndex, variants]);

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 select-none pointer-events-auto">
      {/* Main floating control pill */}
      <div className="bg-slate-900/95 backdrop-blur-md text-white border border-slate-700/80 rounded-2xl p-1.5 shadow-2xl flex items-center gap-2 text-xs">
        {/* Left Arrow */}
        <button
          onClick={handlePrev}
          title="Desain Sebelumnya (Tekan tombol panah kiri ←)"
          className="p-1.5 hover:bg-slate-800 rounded-xl transition-colors text-slate-300 hover:text-white"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Current Variant Badge & Title */}
        <div className="px-3 py-1 flex items-center gap-2.5 min-w-[240px] justify-center text-center">
          <span className="w-5 h-5 rounded-md bg-sky-500 text-white font-bold flex items-center justify-center text-[11px] shadow-sm">
            {current.id}
          </span>
          <div className="text-left">
            <p className="font-bold text-white text-[11px] leading-tight flex items-center gap-1.5">
              <span>{current.name}</span>
            </p>
            <p className="text-[10px] text-sky-400 font-medium truncate max-w-[200px]">
              {current.description}
            </p>
          </div>
        </div>

        {/* Right Arrow */}
        <button
          onClick={handleNext}
          title="Desain Berikutnya (Tekan tombol panah kanan →)"
          className="p-1.5 hover:bg-slate-800 rounded-xl transition-colors text-slate-300 hover:text-white"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        <div className="h-5 w-[1px] bg-slate-700 mx-0.5"></div>

        {/* Quick Numeric Jump Buttons (1 to 8) */}
        <div className="flex items-center gap-1 px-1">
          {variants.map((v, i) => (
            <button
              key={v.id}
              onClick={() => onSelectVariant(v.id)}
              className={`w-6 h-6 rounded-lg text-[10px] font-bold transition-all ${
                v.id === currentVariant
                  ? "bg-sky-500 text-white shadow-sm ring-2 ring-sky-300/40"
                  : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white"
              }`}
              title={`Pindah ke ${v.name}`}
            >
              {v.id}
            </button>
          ))}
        </div>
      </div>

      {/* Floating tip helper */}
      <div className="text-[10px] font-semibold text-slate-600 bg-white/90 backdrop-blur-sm border border-slate-200/80 px-2.5 py-0.5 rounded-full shadow-xs">
        Gunakan tombol panah keyboard <kbd className="px-1 py-0.5 bg-slate-100 rounded text-slate-800 font-mono">←</kbd> <kbd className="px-1 py-0.5 bg-slate-100 rounded text-slate-800 font-mono">→</kbd> untuk mengganti desain
      </div>
    </div>
  );
}

