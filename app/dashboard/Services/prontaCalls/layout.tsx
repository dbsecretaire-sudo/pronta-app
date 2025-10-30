"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { checkAuth } from "@/app/lib/auth";
import Navbar from "@/app/components/Navbar";


export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (!checkAuth()) {
      router.push("/login");
    }
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [router]);

  return (
    <div className="min-h-screen bg-gray-100 ">
      <div className={`flex h-screen ${isMobile ? "flex-col" : "flex-row"}`}>
        <Navbar children={undefined} />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
