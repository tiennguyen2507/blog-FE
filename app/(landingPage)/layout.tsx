"use client";

import { Footer } from "@/components/feature/Footer";
import { Topbar } from "@/components/shared/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative flex h-screen overflow-hidden">
      <div className="flex-1 overflow-auto">
        <Topbar />
        <main className="p-2">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
