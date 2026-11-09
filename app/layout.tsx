import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "KledoFlow Financials | Internal Accounting & Cashflow Dashboard",
  description:
    "Internal accounting and financial management system for recording general journal entries, tracking cash flow, and general ledger reconciliation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`scroll-smooth ${plusJakartaSans.variable}`}>
      <body className="font-sans antialiased bg-slate-50 text-slate-900 selection:bg-sky-100 selection:text-sky-900">
        <DashboardLayout>{children}</DashboardLayout>
      </body>
    </html>
  );
}
