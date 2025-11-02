// src/app/dashboard/layout.tsx
"use client";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useServices } from '@/src/Hook/useServices';
import { NavBar } from "@/src/Components";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname();
  const isInService = pathname.includes('/dashboard/Services/');
  const { data: session, status } = useSession();
  const { availableServices, loading: servicesLoading } = useServices(
    session?.user?.id,
    status
  );

  // Filtrer et mapper les services actifs
  const userServices = availableServices
    .filter(service => service.userService?.is_active)
    .map(service => ({
      name: service.name,
      path: service.route || `/dashboard/services/${service.id}`,
      icon: service.icon || "🔧"
    }));

  // États de chargement
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
    <div className="flex flex-col min-h-screen">

        <NavBar
          showLogo={true}
          logoText="Pronta"
          isInService={isInService}
          userServices={userServices}
        />
      

      {/* Contenu principal avec marge si navbar est affichée */}
      <main className={`flex-1 transition-all duration-200`}>
        {children}
      </main>
    </div>
  );
}
