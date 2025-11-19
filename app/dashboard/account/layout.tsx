import Link from "next/link";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AuthProvider } from "@/src/context/authContext";

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const currentSession = await getServerSession(authOptions);
  const accessToken = currentSession?.accessToken ?? null;
  return (
    <AuthProvider accessToken={accessToken}>

      {children}
    </AuthProvider>
  );
}
