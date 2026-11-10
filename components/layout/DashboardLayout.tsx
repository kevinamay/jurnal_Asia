"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { AccountingProvider } from "@/context/AccountingContext";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const isAuthRoute =
    pathname === "/" ||
    pathname.startsWith("/auth") ||
    pathname.startsWith("/login") ||
    pathname.startsWith("/register");

  if (isAuthRoute) {
    return (
      <AccountingProvider>
        <div className="min-h-screen font-sans text-slate-900 antialiased">
          {children}
        </div>
      </AccountingProvider>
    );
  }

  return (
    <AccountingProvider>
      <div className="flex min-h-screen bg-slate-50 font-sans text-slate-900 antialiased overflow-x-hidden">
        {/* Responsive Sidebar (Fixed on desktop, drawer on mobile/tablet) */}
        <Sidebar
          isOpen={mobileSidebarOpen}
          onClose={() => setMobileSidebarOpen(false)}
        />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 w-full">
          {/* Sticky Top Header */}
          <Topbar onToggleSidebar={() => setMobileSidebarOpen((prev) => !prev)} />

          {/* Dynamic Page Content with Responsive Padding */}
          <main className="flex-1 p-3 sm:p-5 lg:p-6 max-w-7xl w-full mx-auto space-y-4 sm:space-y-6">
            {children}
          </main>
        </div>
      </div>
    </AccountingProvider>
  );
}
