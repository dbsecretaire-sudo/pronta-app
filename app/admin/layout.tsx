// src/app/admin/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/login');
  }

  // Maintenant TypeScript connaît la propriété role
  console.log(session.user.role);
  if (session.user.role !== 'ADMIN') {
    redirect('/unauthorized');
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
