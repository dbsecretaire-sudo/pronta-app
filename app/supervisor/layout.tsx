// src/app/admin/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getRoleByUserId } from "@/src/lib/api";
import { getServerToken, verifyAndDecodeToken } from "@/src/lib/auth";
import { getSession } from "next-auth/react";
export const dynamic = 'force-dynamic';
export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  
  if (session?.user.role !== 'SUPERVISOR') {
    redirect('/unauthorized');
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
