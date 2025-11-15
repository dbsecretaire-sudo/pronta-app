// src/app/admin/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getRoleByUserId } from "@/src/lib/api";
import { AuthProvider } from "@/src/context/AuthContext";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    redirect('/login');
  }

  let role;
  try {
    role = await getRoleByUserId(Number(session.user.id));
  } catch (error) {
    console.error("Erreur lors de la récupération du rôle :", error);
    redirect('/error');
  }
  console.log(role)

  if (role?.role !== 'ADMIN') {
    redirect('/unauthorized');
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <main className="flex-1 p-8">
        <AuthProvider initialSession={session}>
          {children}
        </AuthProvider>
      </main>
    </div>
  );
}
