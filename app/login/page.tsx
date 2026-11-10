import { Suspense } from "react";
import { Variant3Minimalist } from "@/components/login-variants/Variant3Minimalist";

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen w-full bg-slate-50" />}>
      <Variant3Minimalist />
    </Suspense>
  );
}
