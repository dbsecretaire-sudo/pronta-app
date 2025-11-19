import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AuthProvider } from "@/src/context/authContext";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function InvoicesLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const currentSession = await getServerSession(authOptions);
  const accessToken = currentSession?.accessToken ?? null;

  return (
    <AuthProvider accessToken={accessToken} session={null}>
        {children}
    </AuthProvider>
  );
}
