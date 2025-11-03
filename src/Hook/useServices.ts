// src/Hook/useServices.ts
import { useState, useEffect } from 'react';
import { Service, AvailableService } from '@/src/Types/Services';
import { UserService, UserServiceWithDetails } from '@/src/Types/UserServices';
import { fetchUserServices, fetchAllServices, subscribeToService, deactivateUserService, reactivateUserService, updateUserSubscription, deleteSubscription, createSubscription, getSubscriptionByPlan } from '@/src/lib/api';

export const useServices = (userId: string | undefined, status: string) => {
  const [services, setServices] = useState<Service[]>([]);
  const [availableServices, setAvailableServices] = useState<AvailableService[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userServices, setUserServices] = useState<UserServiceWithDetails[]>([]);
  const now = new Date();
  const nextDate = new Date(now);
  nextDate.setMonth(now.getMonth() + 1);
  const endDate = new Date(now);
  endDate.setFullYear(now.getFullYear() + 1);

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
     //je souscris à un abonnement// 
    try {
      
      await subscribeToService(service.id);
   
      const existingSubscription = await getSubscriptionByPlan(Number(userId), service.name);

      if (existingSubscription === null) {
      throw new Error("Impossible de vérifier les abonnements existants.");
    }

    if (existingSubscription.length === 0) {
      // Cas 1 : Aucun abonnement existant → Créer un nouvel abonnement
      await createSubscription({
        user_id: Number(userId),
        plan: service.name,
        start_date: now,
        end_date: endDate,
        next_payment_date: nextDate,
        status: "active",
      });
    } else {
      // Cas 2 : Abonnement(s) existant(s) → Mettre à jour le premier abonnement trouvé
      // (Tu peux aussi choisir de tous les mettre à jour ou de gérer différemment)
      const firstSubscription = existingSubscription[0];
      await updateUserSubscription(firstSubscription.id, {
        user_id: Number(userId),
        plan: service.name,
        start_date: now,
        end_date: endDate,
        next_payment_date: nextDate,
        status: "active",
      });
    }
    
      await refreshServices();
    } catch (error) {
      console.error("Erreur lors de l'abonnement:", error);
      setError("Échec de l'abonnement au service.");
    }
  };

  const handleDeactivate = async (service: Service) => {
    //je désactive un abonnement// 
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
      
      const existingSubscription = await getSubscriptionByPlan(Number(userId), service.name);
      if (existingSubscription && existingSubscription.length > 0) {
      const firstSubscription = existingSubscription[0];
      
      await updateUserSubscription(firstSubscription.id, {
        user_id: Number(userId),
        plan: service.name,
        end_date: now, // Date de fin = maintenant
        next_payment_date: null,
        status: "cancelled",
      });
    }
      await refreshServices();
    } catch (error) {
      console.error("Erreur lors de la désactivation:", error);
      setError(error instanceof Error ? error.message : "Échec de la désactivation.");
    }
  };

  const handleReactivate = async (service: Service) => {
    //je réactive un abonnement// 
    if (!userId) return;

    try {
      await reactivateUserService(Number(userId), service.id);

      const existingSubscription = await getSubscriptionByPlan(Number(userId), service.name);
      if (existingSubscription && existingSubscription.length > 0) {
      const firstSubscription = existingSubscription[0];
      await updateUserSubscription(firstSubscription.id, {
        user_id: Number(userId),
        plan: service.name,
        start_date: now,
        end_date: endDate,
        next_payment_date: nextDate,
        status: "active",
      });
    } else {
      // Cas rare : Le service est marqué comme abonné mais aucun abonnement n'est trouvé
      // → Créer un nouvel abonnement
      await createSubscription({
        user_id: Number(userId),
        plan: service.name,
        start_date: now,
        end_date: endDate,
        next_payment_date: nextDate,
        status: "active",
      });
    }
   
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
