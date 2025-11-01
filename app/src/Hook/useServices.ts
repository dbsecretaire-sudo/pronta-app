// app/hooks/useServices.ts
import { useState, useEffect } from 'react';
import { Service, AvailableService } from '@/app/src/Types/Services/index';
import { fetchUserServices, fetchAllServices, subscribeToService } from '@/app/src/lib/api';

export const useServices = (userId: string | undefined, status: string) => {
  const [services, setServices] = useState<Service[]>([]);
  const [availableServices, setAvailableServices] = useState<AvailableService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "loading" || status === "unauthenticated") {
      setLoading(false);
      return;
    }
    if (status === "authenticated" && userId) {
      const fetchData = async () => {
        try {
          const [subscribedServicesData, allServices] = await Promise.all([
            fetchUserServices(userId),
            fetchAllServices(),
          ]);
          const subscribedServices = Array.isArray(subscribedServicesData)
            ? subscribedServicesData.map((subscription: any) => subscription.service)
            : [];
          const servicesWithStatus = allServices.map((service: AvailableService) => ({
            ...service,
            isSubscribed: subscribedServices.some((s: Service) => s.id === service.id),
          }));
          setServices(subscribedServices);
          setAvailableServices(servicesWithStatus);
        } catch (error) {
          console.error("Erreur lors de la récupération des données:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [status, userId]);

  const handleSubscribe = async (serviceId: number) => {
    try {
      await subscribeToService(serviceId);
      const [subscribedServicesData, allServices] = await Promise.all([
        fetchUserServices(userId!),
        fetchAllServices(),
      ]);
      const subscribedServices = subscribedServicesData.map((subscription: any) => subscription.service);
      const servicesWithStatus = allServices.map((service: AvailableService) => ({
        ...service,
        isSubscribed: subscribedServices.some((s: Service) => s.id === service.id),
      }));
      setServices(subscribedServices);
      setAvailableServices(servicesWithStatus);
    } catch (error) {
      console.error("Erreur lors de l'abonnement:", error);
    }
  };

  return { services, availableServices, loading, handleSubscribe };
};
