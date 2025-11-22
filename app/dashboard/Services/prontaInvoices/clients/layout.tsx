import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AuthProvider } from "@/src/context/authContext";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function ClientsLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken ?? null;

  return (
    <AuthProvider accessToken={accessToken} session={session}>
        {children}
    </AuthProvider>
  );
}
