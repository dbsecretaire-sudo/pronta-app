// src/app/dashboard/layout.tsx
"use client";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useServices } from '@/src/Hook/useServices';
import { NavBar } from "@/src/Components";
import { fetchUserServices } from "@/src/lib/api";
import { useCallback, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isInService = pathname.includes('/dashboard/Services/');
  const { data: session, status } = useSession();
  const [refreshKey, setRefreshKey] = useState(0);
  const { availableServices, loading: servicesLoading } = useServices(
    session?.user?.id,
    status,
    refreshKey
  );

  const userServices = availableServices
    .filter(service => service.userService?.is_active)
    .map(service => ({
      name: service.name,
      path: service.route || `/dashboard/services/${service.id}`,
      icon: service.icon || "🔧"
    }));

    const refreshServices = useCallback(async () => {
      if (status !== "authenticated" || !session?.user?.id) {
        console.warn("Session ou ID utilisateur non disponible, rafraîchissement annulé.");
        return;
      }
      try {
        await fetchUserServices(Number(session.user.id));
        setRefreshKey(prev => prev + 1); // Force le rechargement de `useServices`
      } catch (error) {
        console.error("Erreur:", error);
      }
    }, [session?.user?.id, status]);


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
