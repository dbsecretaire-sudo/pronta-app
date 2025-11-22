import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AuthProvider } from "@/src/context/authContext";
import { verifyAndDecodeToken } from "@/src/lib/auth";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
export const dynamic = 'force-dynamic';
export default async function ProntaCallsLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken ?? null;
  
  const { valid, payload } = verifyAndDecodeToken(accessToken);
  if (!valid) {
    redirect('/login');
  }

  return (
    <AuthProvider accessToken={accessToken} session={session}>
      {children}
    </AuthProvider>
  );
}
