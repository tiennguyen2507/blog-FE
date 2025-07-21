"use client";

import { Sidebar } from "@/components/shared/sidebar";
import { Topbar } from "@/components/shared/topbar";
import { useEffect, useState } from "react";
import httpRequest from "@/lib/httpRequest";
import { useRouter } from "next/navigation";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await httpRequest.get("/auth/info");
        if (typeof window !== "undefined" && res?.data) {
          localStorage.setItem("user", JSON.stringify(res.data));
        }
        setLoading(false);
      } catch {
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
        }
        router.replace("/login");
      }
    }
    fetchUser();
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <span>Loading...</span>
      </div>
    );
  }

  return (
    <div className="relative flex h-screen overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-auto">
        <Topbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
