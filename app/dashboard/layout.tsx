"use client";
import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useServices } from '@/src/Hook/useServices';
import { NavBar } from "@/src/Components";
import { TabProvider } from "@/src/context/TabContext";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isInService = pathname.includes('/dashboard/Services/');
  const { data: session, status } = useSession();
  const { sO, loading: servicesLoading } = useServices(session?.user?.id, status);

  // Redirige si non authentifié
  if (status === "unauthenticated") {
    router.push('/login');
    return null;
  }

  // Affiche un loader pendant le chargement
  if (status === "loading" || servicesLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  const userServices = sO.map(service => ({
    name: service.name,
    path: service.route || `/dashboard/services/${service.id}`,
    icon: service.icon || "🔧"
  }));

  return (
    <NavBar
      showLogo={true}
      logoText="Pronta"
      isInService={isInService}
      userServices={userServices}
    >
      <TabProvider>
        {children}
      </TabProvider>
    </NavBar>
  );
}
