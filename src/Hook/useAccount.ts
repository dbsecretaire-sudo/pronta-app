// src/hooks/useAccount.ts
'use client'
import { useEffect, useState } from "react";
import { useUser } from "@/src/Hook/useUser";
import { useSubscription } from "./useSubscriptions";
import { useTab } from '@/src/context/TabContext';
import { useServices } from "./useServices";
import { useAuthCheck } from "@/src/Hook/useAuthCheck";
import { useRouter } from "next/navigation";

export function useAccount() {
  const router = useRouter();
  const { data: session, status } = useAuthCheck();

  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const userIdVerified = isAuthChecked && status === 'authenticated' ? session?.id : undefined;

    // Attendre que l'authentification soit vérifiée
// useEffect(() => {
//     // Si la session n'est pas chargée ou n'existe pas
//     if (status === 'unauthenticated' || !session) {
      
//       router.push('/login');
//       return;
//     }

//   }, [session, status, router]);

  const { userData, loading, error, mutate } = useUser();
  const { activeTab, setActiveTab } = useTab();
  const [isUpdating, setIsUpdating] = useState(false); 
  const { sO } = useServices(userIdVerified, status);
  const { subscriptionServices } = useSubscription(userIdVerified, sO);

  // Fonction générique pour les mises à jour
  const updateUser = async <T extends object>( updatedData: T, successMessage: string, errorMessage: string ) => {

    if (!userData?.id) { return { success: false, message: "Utilisateur non trouvé" };    }

    setIsUpdating(true);
    
    try {
      const response = await fetch(`/api/user/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error(errorMessage);
      }

      await mutate();
      return { success: true, message: successMessage };
    } catch (error) {
      return { success: false, message: errorMessage };
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
