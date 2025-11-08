// src/Hook/useServices.ts
import { useState, useEffect } from 'react';
import { Service } from '@/src/Types/Services';
import { User } from '../Types/Users';
import {
  fetchUser,
  fetchAllServices,
  subscribeToService,
  deactivateUserService,
  reactivateUserService,
} from '@/src/lib/api';

export const useServices = (userId: string | undefined, status: string) => {
  const [sO, setSO] = useState<Service[]>([]);
  const [sN, setSN] = useState<Service[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

      const [fetchedUser, allServices] = await Promise.all([
        fetchUser(Number(userId)),
        fetchAllServices(),
      ]);

      setUser(fetchedUser);

      const servicesWithStatus = allServices.map(service => {
        return {
          ...service,
          isSubscribed: fetchedUser.service_ids.includes(service.id),
        };
      });

      const sO = servicesWithStatus.filter(service => 
        service.isSubscribed === true
      );

      const sN = servicesWithStatus.filter(service => 
        service.isSubscribed === false
      );

      setSO(sO);
      setSN(sN); 

    } catch (error) {
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
      if (!userId) throw new Error("User ID is required");

      await subscribeToService(Number(userId), service.id);

      await refreshServices();
    } catch (error) {
      console.error("Erreur lors de l'abonnement:", error);
      setError(error instanceof Error ? error.message : "Échec de l'abonnement au service.");
    }
  };

  const handleDeactivate = async (service: Service) => {
    if (!userId) return;

    try {
      if (!user?.service_ids.includes(service.id)) {
        setError("Vous n'êtes pas abonné à ce service.");
        return;
      }

      await deactivateUserService(Number(userId), service.id);

      await refreshServices();
    } catch (error) {
      console.error("Erreur lors de la désactivation:", error);
      setError(error instanceof Error ? error.message : "Échec de la désactivation.");
    }
  };

  const handleReactivate = async (service: Service) => {
    if (!userId) return;

    try {
      await reactivateUserService(Number(userId), service.id);

      await refreshServices();
    } catch (error) {
      console.error("Erreur lors de la réactivation:", error);
      let errorMessage = "Échec de la réactivation.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    }
  };

  return { sO, sN, loading, error, handleSubscribe, handleDeactivate, handleReactivate };
};
