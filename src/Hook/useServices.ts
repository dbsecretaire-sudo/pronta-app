// src/Hook/useServices.ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import { Service } from '@/src/lib/schemas/services';
import { User } from '../lib/schemas';
import {
  fetchUser,
  fetchAllServices,
  subscribeToService,
  deactivateUserService,
  reactivateUserService,
  createSubscription,
  updateUserSubscription,
  getSubscriptionByService,
} from '@/src/lib/api';
import { useAuthCheck } from './useAuthCheck';
import { useRouter } from 'next/navigation';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';


export const useServices = (userIdVerified: string | undefined, status: string) => {
  const router = useRouter();
  const { data: session } = useAuthCheck();
  const [sO, setSO] = useState<Service[]>([]);
  const [sN, setSN] = useState<Service[]>([]);
  const [s, setS] = useState<Service[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const now = new Date();
  const nextDate = new Date(now);
  nextDate.setMonth(now.getMonth() + 1);
  const endDate = new Date(now);
  endDate.setFullYear(now.getFullYear() + 1);

  const fetchData = useCallback(async () => {
    if (!session?.user.id || isNaN(Number(session?.user.id))) {
      setError("ID utilisateur invalide");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const userIdNumber = Number(session?.user.id);
      const [fetchedUser, allServices] = await Promise.all([
        fetchUser(userIdNumber),
        fetchAllServices(session?.accessToken ?? null),
      ]);
      setUser(fetchedUser);
      setS(allServices);

      const servicesWithStatus = allServices.map(service => {
        return {
          ...service,
          isSubscribed: fetchedUser.service_ids !== null && fetchedUser.service_ids.includes(service.id),
        };
      });

      const subscribedServices = servicesWithStatus.filter(service =>
        service.isSubscribed === true && service.is_active === true
      );
      const unSubscribedServices = servicesWithStatus.filter(service =>
        service.isSubscribed === false && service.is_active === true
      );

      setSO(subscribedServices);
      setSN(unSubscribedServices);
    } catch (error) {
      setError("Impossible de charger les services.");
    } finally {
      setLoading(false);
    }
  }, [session?.user.id]);

  useEffect(() => {

    if (status === "authenticated" && session?.user.id && !isNaN(Number(session?.user.id))) {
      fetchData();
    } else {
      setLoading(false);
    }
  }, [status, session?.user.id, fetchData]);

  const refreshServices = async () => {
    await fetchData();
  };

  const handleSubscribe = async (service: Service) => {
    try {
      if (!session?.user.id) throw new Error("User ID is required");
      const subscription = await getSubscriptionByService(Number(session?.user.id), Number(service.id));
      if (subscription?.id) {
        await updateUserSubscription(subscription.id, {
          user_id: Number(session?.user.id),
          service_id: Number(service.id),
          start_date: now,
          end_date: endDate,
          next_payment_date: nextDate,
          status: 'active',
        });
      } else {
        await createSubscription({
          user_id: Number(session?.user.id),
          service_id: Number(service.id),
          start_date: now,
          end_date: endDate,
          next_payment_date: nextDate,
          status: 'active',
        });
      }
      await reactivateUserService(Number(session?.user.id), service.id);
      await refreshServices();
    } catch (error) {
      setError(error instanceof Error ? error.message : "Échec de l'abonnement au service.");
    }
  };

  const handleDeactivate = async (service: Service) => {
    if (!session?.user.id) return;
    try {
      if (!user?.service_ids?.includes(service.id)) {
        setError("Vous n'êtes pas abonné à ce service.");
        return;
      }
      await deactivateUserService(Number(session?.user.id), service.id);
      await refreshServices();
    } catch (error) {
      console.error("Erreur lors de la désactivation:", error);
      setError(error instanceof Error ? error.message : "Échec de la désactivation.");
    }
  };

  const handleReactivate = async (service: Service) => {
    if (!session?.user.id) return;
    try {
      await reactivateUserService(Number(session?.user.id), service.id);
      await refreshServices();
    } catch (error) {
      let errorMessage = "Échec de la réactivation.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      setError(errorMessage);
    }
  };


  return { s, sO, sN, loading, error, handleSubscribe, handleDeactivate, handleReactivate };
};
