"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import {
  LOGIN_VARIANTS_META,
  PrototypeLoginSwitcher,
  Variant1SplitHero,
  Variant2Glassmorphism,
  Variant3Minimalist,
  Variant4TabbedRole,
  Variant5DualMethod,
  Variant6BentoGrid,
  Variant7SlideOver,
  Variant8QuickPinTerminal,
} from "@/components/login-variants";

function LoginPrototypeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const variantParam = searchParams.get("variant") || "1";
  const [currentVariant, setCurrentVariant] = useState(variantParam);

  useEffect(() => {
    if (variantParam && ["1", "2", "3", "4", "5", "6", "7", "8"].includes(variantParam)) {
      setCurrentVariant(variantParam);
    }
  }, [variantParam]);

  const handleSelectVariant = (id: string) => {
    setCurrentVariant(id);
    router.replace(`?variant=${id}`, { scroll: false });
  };

  return (
    <div className="relative min-h-screen">
      {/* 8 Radically Different Login Design Variants */}
      {currentVariant === "1" && <Variant1SplitHero />}
      {currentVariant === "2" && <Variant2Glassmorphism />}
      {currentVariant === "3" && <Variant3Minimalist />}
      {currentVariant === "4" && <Variant4TabbedRole />}
      {currentVariant === "5" && <Variant5DualMethod />}
      {currentVariant === "6" && <Variant6BentoGrid />}
      {currentVariant === "7" && <Variant7SlideOver />}
      {currentVariant === "8" && <Variant8QuickPinTerminal />}

      {/* Floating Prototype Switcher Bar */}
      <PrototypeLoginSwitcher
        currentVariant={currentVariant}
        onSelectVariant={handleSelectVariant}
      />
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Memuat prototipe desain login...</div>}>
      <LoginPrototypeContent />
    </Suspense>
  );
}
