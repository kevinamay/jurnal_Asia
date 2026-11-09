"use client";

import { Suspense, useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PrototypeSwitcher, VariantInfo } from "@/components/prototype/PrototypeSwitcher";

import { Variant2GlassCard } from "@/components/auth-variants/Variant2GlassCard";
import { Variant6MobileCompact } from "@/components/auth-variants/Variant6MobileCompact";

const VARIANTS: VariantInfo[] = [
  {
    id: "2",
    name: "Desain 2: Glassmorphism Stepper",
    description: "Kartu melayang dengan efek frosted glass & ambient mesh",
  },
  {
    id: "6",
    name: "Desain 6: Compact Quick-Entry",
    description: "Kartu ringkas terfokus pada kecepatan ketik & pill kanal",
  },
];

function AuthPrototypeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const variantParam = searchParams.get("variant");
  const initialVariant = variantParam === "6" ? "6" : "2";
  const [currentVariant, setCurrentVariant] = useState(initialVariant);

  useEffect(() => {
    if (variantParam === "6" || variantParam === "2") {
      setCurrentVariant(variantParam);
    }
  }, [variantParam]);

  const handleSelectVariant = (id: string) => {
    setCurrentVariant(id);
    router.replace(`/auth?variant=${id}`, { scroll: false });
  };

  return (
    <div className="relative min-h-screen">
      {/* Active Prototype Variant Rendering */}
      {currentVariant === "6" ? <Variant6MobileCompact /> : <Variant2GlassCard />}

      {/* Floating Bottom Bar Switcher (Keyboard ← → Enabled) */}
      <PrototypeSwitcher
        variants={VARIANTS}
        currentVariant={currentVariant}
        onSelectVariant={handleSelectVariant}
      />
    </div>
  );
}

export default function AuthPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Memuat prototipe desain...</div>}>
      <AuthPrototypeContent />
    </Suspense>
  );
}
