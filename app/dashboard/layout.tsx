// src/app/dashboard/layout.tsx
"use client";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useServices } from '@/src/Hook/useServices';
import { NavBar, ServiceItem } from "@/src/Components";
import { fetchUserServices } from "@/src/lib/api";
import { useEffect, useState } from "react";
import { UserServiceWithDetails } from "@/src/Types/UserServices";
import { AvailableService, Service } from "@/src/Types/Services";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isInService = pathname.includes('/dashboard/Services/');
  const { data: session, status } = useSession();
  const { availableServices, loading: servicesLoading } = useServices(
    session?.user?.id,
    status
  );
  const [userServices, setUserServices] = useState<ServiceItem[]>([])

  const transformToServiceItem = (services: AvailableService[]): ServiceItem[] => {
    return services
      .filter(service => service.userService?.is_active)
      .map(service => ({
        name: service.name,
        path: service.route || `/dashboard/services/${service.id}`,
        icon: service.icon || "🔧"
      }));
  }

  const refreshServices = async () => {
    try {
      const services = await fetchUserServices(Number(session?.user?.id));
      // ✅ Transforme les services en ServiceItem[]
      const transformedServices = services.map((service: { id: any; name: any; route: any; icon: any; }) => ({
        id: service.id,
        name: service.name,
        path: service.route || `/dashboard/services/${service.id}`,
        icon: service.icon || "🔧"
      }));
      setUserServices(transformedServices);
    } catch (error) {
      console.error("Erreur lors du rafraîchissement des services:", error);
    }
  };

  useEffect(() => {
    refreshServices();
  }, []);

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

  if (status === "unauthenticated") {
    return null;
  }

  return (
    <NavBar
      showLogo={true}
      logoText="Pronta"
      isInService={isInService}
      userServices={userServices}
      onRefreshServices={refreshServices}
    >
      {children}
    </NavBar>    
  );
}
