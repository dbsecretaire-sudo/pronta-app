// src/hooks/useAccount.ts
'use client';
import { useEffect, useState } from "react";
import { useUser } from "@/src/Hook/useUser";
import { useSubscription } from "./useSubscriptions";
import { useTab } from '@/src/context/TabContext';
import { useServices } from "./useServices";
import { useAuthCheck } from "@/src/Hook/useAuthCheck";
import { useRouter } from "next/navigation";
import { getSession } from 'next-auth/react';

export function useAccount(accessToken: string |null) {
  const router = useRouter();
  const { data: session, status } = useAuthCheck(accessToken);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Vérifie l'authentification au chargement
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      setIsAuthChecked(true);
    }
  }, [status, router]);

  const userIdVerified = session?.user.id;
  const { userData, loading, error, mutate } = useUser(accessToken);
  const { activeTab, setActiveTab } = useTab();
  const { sO } = useServices(session?.user.id, status, accessToken);
  const { subscriptionServices } = useSubscription(session?.user.id, sO, accessToken);

  // Fonction générique pour les mises à jour
  const updateUser = async <T extends object>(
    updatedData: T,
    successMessage: string,
    errorMessage: string
  ) => {
    if (!userData?.id) {
      return { success: false, message: "Utilisateur non trouvé" };
    }

    setIsUpdating(true);

    try {
      // 2. Envoie la requête avec le token dans l'Authorization header
      const response = await fetch(`/api/user/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`, // <-- Utilise le token
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || errorMessage);
      }

      // 3. Met à jour les données locales après succès
      await mutate();
      return { success: true, message: successMessage };
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      return { success: false, message: error instanceof Error ? error.message : errorMessage };
    } finally {
      setIsUpdating(false);
    }
  };

  // Mise à jour du profil
  const handleProfileUpdate = async (updatedData: { email: string; name: string }) =>
    updateUser(
      updatedData,
      "Profil mis à jour avec succès !",
      "Échec de la mise à jour du profil"
    );

  // Mise à jour des informations de facturation
  const handleBillingUpdate = async (updatedData: {
    billing_address?: {
      street?: string;
      city?: string;
      state?: string;
      postal_code?: number;
      country?: string;
    };
    payment_method?: {
      type?: string;
      details?: {
        card_number?: string;
        card_last_four?: string;
        card_brand?: string;
        paypal_email?: string;
      };
      is_default?: boolean;
    };
  }) =>
    updateUser(
      updatedData,
      "Informations de facturation mises à jour !",
      "Échec de la mise à jour des informations de facturation"
    );

  return {
    userData,
    loading,
    error,
    activeTab,
    setActiveTab,
    isUpdating,
    handleProfileUpdate,
    handleBillingUpdate,
    subscriptionServices,
  };
}
