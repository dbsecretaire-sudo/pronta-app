import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { AuthProvider } from "@/src/context/authContext";
import {
  fetchUser,
  fetchAllServices,
} from '@/src/lib/api';
import { NavBar, ServiceForm } from "@/src/Components";
import { TabProvider } from '@/src/context/TabContext';
import { getServerToken, getServerTokenBis, verifyAndDecodeToken } from "@/src/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { getToken } from "next-auth/jwt";

export default async function DashboardLayout({ children }: { children: React.ReactNode}) {
 const cookieStore = await cookies();
 const req = {
    cookies: Object.fromEntries(
      cookieStore.getAll().map((cookie) => [cookie.name, cookie.value])
    ),
    headers: {
      host: process.env.NEXTAUTH_URL || "fr.pronta.corsica",
      "x-forwarded-proto": "https",
    },
  } as any;

    const token = await getToken({ req, secret: authOptions.secret });

console.log('cookie token', token)
  const session = await getServerSession(authOptions);
  // const accessToken = session?.accessToken ?? null;
   const accessToken = await getServerToken();
   console.log(accessToken);
   const accessTokenbid = await getServerTokenBis();
  const { valid, payload } = verifyAndDecodeToken(accessToken);
  console.log('valide', valid);
  if (!valid) {
    redirect('/login');
  }

  const allServices = await fetchAllServices(accessToken);
  const fetchedUser = await fetchUser(Number(session?.user.id), accessToken);
  const servicesWithStatus = allServices.map((service: any) => {
    return {
      ...service,
      isSubscribed: fetchedUser.service_ids !== null && fetchedUser.service_ids.includes(service.id),
    };
  });

  const subscribedServices = servicesWithStatus.filter((service : any) =>
    service.isSubscribed === true && service.is_active === true
  );

  // Calcul des données après les hooks
  const userServices = subscribedServices.map((service: any) => ({
    name: service.name,
    path: service.route || `/dashboard/services/${service.id}`,
    icon: service.icon || "🔧"
  }));


  return (
  <AuthProvider accessToken={accessToken}> 
    <NavBar
      showLogo={true}
      logoText="Pronta"
      userServices={userServices}
      accessToken={accessToken}
    >
      <TabProvider>

    {children}
      </TabProvider>
      </NavBar>
  </AuthProvider>
   
  );
}
