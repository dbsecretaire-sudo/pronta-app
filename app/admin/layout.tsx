// src/app/admin/layout.tsx
import { getServerSession, Session } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getRoleByUserId } from "@/src/lib/api";
import React, { ReactNode } from "react";

interface AdminLayoutProps {
  children: ReactNode;
}

export default async function AdminLayout({ children }: AdminLayoutProps) {

  return (
    <div className="flex h-screen bg-gray-50">
      <main className="flex-1 p-8">
          {children}
      </main>
    </div>
  );
}
