// src/app/admin/layout.tsx
import { redirect } from "next/navigation";
import { getSession } from "next-auth/react";
export const dynamic = 'force-dynamic';
export default async function SecretaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  if (session?.user.role !== 'SECRETARY') {
    redirect('/unauthorized');
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
