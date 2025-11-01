// src/Hook/useServices.ts
import { useState, useEffect } from 'react';
import { Service, AvailableService } from '@/src/Types/Services/index';
import { fetchUserServices, fetchAllServices, subscribeToService, deactivateUserService  } from '@/src/lib/api';

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

  // Fonction pour rafraîchir les données après une modification
  const refreshServices = async () => {
    if (!userId) return;
    try {
      const [subscribedServicesData, allServices] = await Promise.all([
        fetchUserServices(userId),
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
      console.error("Erreur lors du rafraîchissement des services:", error);
    }
  };

  const handleSubscribe = async (serviceId: number) => {
    try {
      await subscribeToService(serviceId);
      await refreshServices();
    } catch (error) {
      console.error("Erreur lors de l'abonnement:", error);
    }
  };

  // Nouvelle fonction pour se désabonner
  const handleDeactivate = async (serviceId: number) => {
    try {
      await deactivateUserService(serviceId);
      await refreshServices(); // Rafraîchit la liste après désactivation
    } catch (error) {
      console.error("Erreur lors de la désactivation du service:", error);
    }
  };

  return { services, availableServices, loading, handleSubscribe, handleDeactivate };
};
