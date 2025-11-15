"use client";
import { usePathname, useRouter } from "next/navigation";
import { useAuthCheck } from "@/src/Hook/useAuthCheck";
import { useServices } from '@/src/Hook/useServices';
import { NavBar } from "@/src/Components";
import { TabProvider } from "@/src/context/TabContext";
import { useEffect, useState } from "react";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  // Tous les hooks doivent être appelés au début, sans condition
  const { status, loading: authLoading, error, data, user } = useAuthCheck();
  const [isAuthenticated, setIsAuthenticated] = useState<Boolean>();
  const router = useRouter();
  const pathname = usePathname();
  const isInService = pathname.includes('/dashboard/Services/');

 useEffect(() => {
    setIsAuthenticated(status === 'authenticated');
  }, [status]);

  // Utilisez directement user?.id si disponible, sinon undefined
  const userId = user?.id;

  // Utilisez useServices uniquement si userId est défini
  const { sO, loading: servicesLoading } = useServices(
    isAuthenticated ? userId?.toString() : undefined,
    isAuthenticated ? 'authenticated' : 'unauthenticated'
  );

  // Vérification de la session et redirection si nécessaire
  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      router.push('/login');
    }
  }, [isAuthenticated, authLoading, router]);

  // Retour conditionnel après tous les hooks
  if (authLoading || servicesLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Chargement...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Calcul des données après les hooks
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
