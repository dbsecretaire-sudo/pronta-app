import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AuthProvider } from "@/src/context/authContext";
import { getServerSession } from "next-auth";

export default async function ProntaCallsLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken ?? null;

  return (
    <AuthProvider accessToken={accessToken}>
      {children}
    </AuthProvider>
  );
}
