// src/Hook/useServices.ts
import { useState, useEffect } from 'react';
import { Service, AvailableService } from '@/src/Types/Services';
import { UserService, UserServiceWithDetails } from '@/src/Types/UserServices';
import { fetchUserServices, fetchAllServices, subscribeToService, deactivateUserService, reactivateUserService, updateUserSubscription } from '@/src/lib/api';

export const useServices = (userId: string | undefined, status: string) => {
  const [services, setServices] = useState<Service[]>([]);
  const [availableServices, setAvailableServices] = useState<AvailableService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userServices, setUserServices] = useState<UserServiceWithDetails[]>([]);
  const now = new Date();
  const endDate = new Date(now);
  endDate.setMonth(now.getMonth() + 1);

  const fetchData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const [fetchedUserServices, allServices] = await Promise.all([
        fetchUserServices(Number(userId)),
        fetchAllServices(),
      ]);

      setUserServices(fetchedUserServices);

      // Services abonnés et actifs (pour la section "Mes services")
      const subscribedServices = Array.isArray(fetchedUserServices)
        ? fetchedUserServices
            .filter((us: UserServiceWithDetails) => us.is_active)
            .map((us: UserServiceWithDetails) => us.service)
        : [];

      // Services avec statut (pour la section "Services disponibles")
      const servicesWithStatus = allServices.map((service: Service) => {
        const userService = fetchedUserServices.find(
          (us: UserServiceWithDetails) => us.service_id === service.id
        );

        return {
          ...service,
          isSubscribed: !!userService,
          isActive: userService?.is_active ?? false,
          userService,  // ✅ Peut être undefined pour les services non abonnés
        };
      });

      // Filtre les services disponibles
      const availableServices = servicesWithStatus.filter(
        (s: UserService) => !s.subscription_date || (s.subscription_date && !s.is_active)
      );

      setServices(subscribedServices);
      setAvailableServices(availableServices);
    } catch (error) {
      console.error("Erreur:", error);
      setError("Impossible de charger les services.");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (status === "loading" || status === "unauthenticated") {
      setLoading(false);
      return;
    }
    if (status === "authenticated" && userId) {
      fetchData();
    }
  }, [status, userId]);

  const refreshServices = async () => {
    await fetchData();
  };

  const handleSubscribe = async (service: Service) => {
    try {
      
      await subscribeToService(service.id);
      await updateUserSubscription(Number(userId), {
        subscription_plan: undefined,
        subscription_end_date: undefined,
        next_payment_date: undefined,
        subscription_status: "cancelled",
      })
      await refreshServices();
    } catch (error) {
      console.error("Erreur lors de l'abonnement:", error);
      setError("Échec de l'abonnement au service.");
    }
  };

  const handleDeactivate = async (service: Service) => {
    if (!userId) return;

    try {
      // Vérifie si l'utilisateur a un abonnement ACTIF à ce service
      const userService = availableServices.find(
        (s) => s.id === service.id
      )?.userService;

      if (!userService) {
        setError("Vous n'êtes pas abonné à ce service.");
        return;
      }

      if (!userService.is_active) {
        setError("Cet abonnement est déjà désactivé.");
        return;
      }

      await deactivateUserService(Number(userId), service.id);
      await updateUserSubscription(Number(userId), {
        subscription_plan: undefined,
        subscription_end_date: undefined,
        next_payment_date: undefined,
        subscription_status: "cancelled",
      })
      await refreshServices();
    } catch (error) {
      console.error("Erreur lors de la désactivation:", error);
      setError(error instanceof Error ? error.message : "Échec de la désactivation.");
    }
  };

  const handleReactivate = async (service: Service) => {
    if (!userId) return;
    console.log("service: ", service);
    try {
      await reactivateUserService(Number(userId), service.id);
      await updateUserSubscription(Number(userId), {
        subscription_plan: service.name,
        subscription_end_date: endDate,
        next_payment_date: new Date(endDate),
        subscription_status: "active",
      });
      await refreshServices();
    } catch (error) {
      console.error("Erreur lors de la réactivation:", error);
      let errorMessage = "Échec de la réactivation.";
      if (error instanceof Error) {
        errorMessage = error.message;
        if (error.message.includes("reactivate")) {
          errorMessage = "Échec de la réactivation du service.";
        } else if (error.message.includes("subscription")) {
          errorMessage = "Échec de la mise à jour de l'abonnement.";
        }
      }
      setError(errorMessage);
    }
  }

  return { services, availableServices, loading, error, handleSubscribe, handleDeactivate, handleReactivate};
};
