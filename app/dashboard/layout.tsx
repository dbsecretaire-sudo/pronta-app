import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { AuthProvider } from "@/src/context/authContext";
import {
  fetchUser,
  fetchAllServices,
} from '@/src/lib/api';
import { NavBar, ServiceForm } from "@/src/Components";
import { TabProvider } from '@/src/context/TabContext';
import { getServerToken, verifyAndDecodeToken } from "@/src/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardLayout({ children }: { children: React.ReactNode }, req: Request) {

  const session = await getServerSession(authOptions);
  // const accessToken = session?.accessToken ?? null;
   const accessToken = await getServerToken(req);
   console.log(accessToken);
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
