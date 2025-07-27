"use client";

import { Footer } from "@/components/feature/Footer";
import { Topbar } from "@/components/shared/topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <Topbar />
      <main className="flex-1 p-4">
        <div className="container mx-auto max-w-7xl min-h-[calc(100vh-80px)]">
          {children}
        </div>
      </main>
      <Footer />
    </div>
  );
}
