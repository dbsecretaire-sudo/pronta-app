"use client";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useServices } from '@/src/Hook/useServices';
import { NavBar } from "@/src/Components/index";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isInService = pathname.includes('/dashboard/Services/');
  const { data: session, status } = useSession();
  const { availableServices, loading } = useServices(session?.user?.id, status);

  // Items de navigation statiques
  const navItems = [
    { name: "Tableau de bord", path: "/dashboard", icon: "📊" },
    { name: "Mon compte", path: "/dashboard/account", icon: "👤" }
  ];

  // Filtrer les services disponibles qui sont actifs (souscrits et is_active = true)
  const subscribedAndActiveServices = availableServices.filter(
    (service) => service.userService?.is_active
  );

  // Mapper les services disponibles et actifs pour la navbar
  const dynamicServices = subscribedAndActiveServices.map(service => ({
    name: service.name,
    path: `/dashboard/Services/${service.id}`, // ou service.slug si disponible
    icon: service.icon || "🔧" // icône par défaut si non fournie
  }));

  // Combiner les items de navigation avec les services souscrits et actifs
  const allNavItems = [...navItems];
  if (!isInService && !loading) {
    // Insérer les services après le premier item
    allNavItems.splice(1, 0, ...dynamicServices);
  }

  // Affichage d'un état de chargement si nécessaire
  if (loading) return <div>Chargement de la navigation...</div>;

  return (
    <NavBar
      navItems={allNavItems}
      showServicesSection={!isInService && dynamicServices.length > 0}
      isInService={isInService}
    >
      {children}
    </NavBar>
  );
}
