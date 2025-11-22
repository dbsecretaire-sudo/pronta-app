import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { AuthProvider } from "@/src/context/authContext";
import {
  fetchUser,
  fetchAllServices,
} from '@/src/lib/api';
import { NavBar, ServiceForm } from "@/src/Components";
import { TabProvider } from '@/src/context/TabContext';
import { verifyAndDecodeToken } from "@/src/lib/auth";
import { redirect } from "next/navigation";
export const dynamic = 'force-dynamic';
export default async function DashboardLayout({ children }: { children: React.ReactNode}) {

  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken ?? null;

  const { valid, payload } = verifyAndDecodeToken(accessToken);
  console.log('valide', valid);
  if (!valid) {
    redirect('/login');
  }

  return (
    <AuthProvider accessToken={accessToken} session={session}> 
      <TabProvider>
        {children}
      </TabProvider>
    </AuthProvider>
  );
}
