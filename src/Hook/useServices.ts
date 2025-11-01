// src/Hook/useServices.ts
import { useState, useEffect } from 'react';
import { Service, AvailableService } from '@/src/Types/Services/index';
import { UserServiceWithDetails } from '@/src/Types/UserServices';
import { fetchUserServices, fetchAllServices, subscribeToService, deactivateUserService } from '@/src/lib/api';

export const useServices = (userId: string | undefined, status: string) => {
  const [services, setServices] = useState<Service[]>([]);
  const [availableServices, setAvailableServices] = useState<AvailableService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Récupère les abonnements utilisateur (user_services) avec isActive
      const [userServices, allServices] = await Promise.all([
        fetchUserServices(userId), // Retourne UserService[] (avec isActive)
        fetchAllServices(),
      ]);

      // Extraire les services abonnés (avec isActive)
      const subscribedServices = Array.isArray(userServices)
      ? userServices
          .filter((us: UserServiceWithDetails) => us.is_active)
          .map((us: UserServiceWithDetails) => us.service) // ✅ Retourne Service
      : [];

      // Met à jour le statut des services disponibles
      const servicesWithStatus = allServices.map((service: AvailableService) => ({
        ...service,
        isSubscribed: userServices.some((us: UserServiceWithDetails) => us.service_id === service.id),
        userService: userServices.find((us: UserServiceWithDetails) => us.service_id === service.id), // ✅ Ajoute l'abonnement complet
      }));

      setServices(subscribedServices);
      setAvailableServices(servicesWithStatus);
    } catch (error) {
      console.error("Erreur lors de la récupération des données:", error);
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

  const handleSubscribe = async (serviceId: number) => {
    try {
      await subscribeToService(serviceId);
      await refreshServices();
    } catch (error) {
      console.error("Erreur lors de l'abonnement:", error);
      setError("Échec de l'abonnement au service.");
    }
  };

  const handleDeactivate = async (serviceId: number) => {
    if (!userId) return;

    try {
      // Vérifie si l'utilisateur a un abonnement ACTIF à ce service
      const userService = availableServices.find(
        (s) => s.id === serviceId
      )?.userService;

      if (!userService) {
        setError("Vous n'êtes pas abonné à ce service.");
        return;
      }

      if (!userService.is_active) {
        setError("Cet abonnement est déjà désactivé.");
        return;
      }

      await deactivateUserService(Number(userId), serviceId);
      await refreshServices();
    } catch (error) {
      console.error("Erreur lors de la désactivation:", error);
      setError(error instanceof Error ? error.message : "Échec de la désactivation.");
    }
  };

  return { services, availableServices, loading, error, handleSubscribe, handleDeactivate };
};
