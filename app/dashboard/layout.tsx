"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/app/lib/auth";
import Navbar from "@/app/components/Navbar";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    if (!checkAuth()) router.push("/login");
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar />
      <main className="p-6">{children}</main>
    </div>
  );
}
