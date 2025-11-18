// src/app/admin/layout.tsx
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import { getRoleByUserId } from "@/src/lib/api";
import { getServerToken, verifyAndDecodeToken } from "@/src/lib/auth";

export default async function SecretaryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  // const accessToken = session?.accessToken ?? null;
  const accessToken = await getServerToken();

  const { valid, payload } = verifyAndDecodeToken(accessToken);
  if (!valid) {
    redirect('/login');
  }

  const role = await getRoleByUserId(Number(session?.user.id), accessToken);
  if (role.role !== 'SECRETARY') {
    redirect('/unauthorized');
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
