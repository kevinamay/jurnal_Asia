"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { PrototypeSwitcher, VariantInfo } from "@/components/prototype/PrototypeSwitcher";

import { Variant1SplitScreen } from "@/components/auth-variants/Variant1SplitScreen";
import { Variant2GlassCard } from "@/components/auth-variants/Variant2GlassCard";
import { Variant3WizardStepper } from "@/components/auth-variants/Variant3WizardStepper";
import { Variant4DrawerModal } from "@/components/auth-variants/Variant4DrawerModal";
import { Variant5BentoEnterprise } from "@/components/auth-variants/Variant5BentoEnterprise";
import { Variant6MobileCompact } from "@/components/auth-variants/Variant6MobileCompact";
import { Variant7LedgerStyle } from "@/components/auth-variants/Variant7LedgerStyle";
import { Variant8FullPortal } from "@/components/auth-variants/Variant8FullPortal";

const VARIANTS: VariantInfo[] = [
  {
    id: "1",
    name: "Desain 1: Split Screen ERP",
    description: "Hero panel biru muda dengan formulir pendaftaran putih elegan",
  },
  {
    id: "2",
    name: "Desain 2: Glassmorphism Stepper",
    description: "Kartu melayang dengan efek frosted glass & ambient mesh",
  },
  {
    id: "3",
    name: "Desain 3: Multi-Step Wizard",
    description: "Alur tahapan terstruktur dengan selektor kartu WA/Email",
  },
  {
    id: "4",
    name: "Desain 4: Slide-over Drawer",
    description: "Panel geser samping modern dengan latar belakang dashboard",
  },
  {
    id: "5",
    name: "Desain 5: Bento Grid Enterprise",
    description: "Layout modular bento dengan kartu keamanan & helpdesk IT",
  },
  {
    id: "6",
    name: "Desain 6: Compact Quick-Entry",
    description: "Kartu ringkas terfokus pada kecepatan ketik & pill kanal",
  },
  {
    id: "7",
    name: "Desain 7: Accounting Ledger Doc",
    description: "Gaya formulir otorisasi voucher akuntansi resmi",
  },
  {
    id: "8",
    name: "Desain 8: Interactive Portal",
    description: "Portal lengkap dengan visualisator arsitektur alur OTP",
  },
];

function AuthPrototypeContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const variantParam = searchParams.get("variant") || "1";
  const [currentVariant, setCurrentVariant] = useState(variantParam);

  const handleSelectVariant = (id: string) => {
    setCurrentVariant(id);
    router.replace(`/auth?variant=${id}`, { scroll: false });
  };

  return (
    <div className="relative min-h-screen">
      {/* Active Prototype Variant Rendering */}
      {currentVariant === "1" && <Variant1SplitScreen />}
      {currentVariant === "2" && <Variant2GlassCard />}
      {currentVariant === "3" && <Variant3WizardStepper />}
      {currentVariant === "4" && <Variant4DrawerModal />}
      {currentVariant === "5" && <Variant5BentoEnterprise />}
      {currentVariant === "6" && <Variant6MobileCompact />}
      {currentVariant === "7" && <Variant7LedgerStyle />}
      {currentVariant === "8" && <Variant8FullPortal />}

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

