// src/app/dashboard/layout.tsx
import { AppLayout } from "@/src/Components";
import { usePathname } from "next/navigation";
    import { useSession } from "next-auth/react";
    import { useServices } from '@/src/Hook/useServices';
export default function DashboardLayout({}) {
        const pathname = usePathname();
      const isInService = pathname.includes('/dashboard/Services/');
      const { data: session, status } = useSession();
      const { availableServices, loading: servicesLoading } = useServices(
        session?.user?.id,
        status
      );
    
      // Filtrer les services actifs
      const userServices = availableServices
        .filter(service => service.userService?.is_active)
        .map(service => ({
          name: service.name,
          path: service.route || `/dashboard/services/${service.id}`,
          icon: service.icon || "🔧"
        }));
    
      return {
        session,
        status,
        isInService,
        userServices,
        servicesLoading,
        pathname
      };
    }
    
  
