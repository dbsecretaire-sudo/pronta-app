// app/dashboard/layout.tsx
"use client";
import { usePathname } from "next/navigation";
import Navbar from "@/app/Types/Components/NavBar/index";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isInService = pathname.includes('/dashboard/Services/');

  // Items de navigation pour le dashboard principal
  const navItems = [
    { name: "Tableau de bord", path: "/dashboard", icon: "📊" },
    { name: "Mon compte", path: "/dashboard/account", icon: "👤" }
  ];

  // Services disponibles (pourrait être récupéré via API)
  const services = [
    {
      name: "Pronta Calls",
      path: "/dashboard/Services/prontaCalls",
      icon: "📞"
    }
    // Ajoutez d'autres services ici
  ];

  // Combiner les items de navigation avec les services
  const allNavItems = [...navItems];
  if (!isInService) {
    allNavItems.splice(1, 0, ...services.map(service => ({
      name: service.name,
      path: service.path,
      icon: service.icon
    })));
  }

  return (
    <Navbar
      navItems={allNavItems}
      showServicesSection={!isInService}
      isInService={isInService}
    >
        {children}
    </Navbar>
  );
}
