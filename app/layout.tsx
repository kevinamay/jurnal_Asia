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
  title: "Portal Asia Plastik | Sistem Akuntansi & Manajemen Keuangan Internal",
  description:
    "Sistem akuntansi dan manajemen keuangan internal CV. Asia Plastik untuk pencatatan jurnal umum, monitoring kas, dan rekonsiliasi buku besar.",
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
