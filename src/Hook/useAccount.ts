// src/hooks/useAccount.ts
import { useUser } from "@/src/Hook/useUser";
import { useState } from "react";
import { updateProfile, updateBilling } from "@/src/lib/api";
import { Role, User } from "@/src/Types/Users";

export function useAccount() {
  const { userData, loading, error, mutate } = useUser();
  const [activeTab, setActiveTab] = useState("profile");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleProfileUpdate = async (updatedData: {
    email: string;
    phone: string;
    name: string;
    role: Role;
  }) => {
    if(!userData?.id) {
      console.error('User data is not available');
      return { success: false, message: "Utilisateur non trouvé" };
    }

    setIsUpdating(true);
    try {
      await updateProfile(userData.id, updatedData);
      await mutate();
      return { success: true, message: "Profil mis à jour avec succès !" };
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      return { success: false, message: "Erreur lors de la mise à jour du profil" };
    } finally {
      setIsUpdating(false);
    }
  };

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
        card_last_four?: string;
        card_brand?: string;
        paypal_email?: string;
      };
      is_default?: boolean;
    };
    subscription?: {  // Nouveau type pour le champ subscription
      plan?: string;
      start_date?: Date;
      end_date?: Date;
      next_payment_date?: Date;
      status?: string;
    };
  }) => {
    if (!userData?.id) {
      console.error('User data is not available');
      return { success: false, message: "Utilisateur non trouvé" };
    }

    setIsUpdating(true);
    try {
      // Transformation des données pour correspondre à l'API
      const apiData = {
        ...updatedData,
        // Si on veut mettre à jour uniquement le plan d'abonnement
        ...(updatedData.subscription?.plan && {
          subscription: {
            ...userData.subscription,
            ...updatedData.subscription,
            // Conversion des dates en ISOString pour l'API
            ...(updatedData.subscription?.start_date && { start_date: updatedData.subscription.start_date.toISOString() }),
            ...(updatedData.subscription?.end_date && { end_date: updatedData.subscription.end_date.toISOString() }),
            ...(updatedData.subscription?.next_payment_date && { next_payment_date: updatedData.subscription.next_payment_date.toISOString() })
          }
        })
      };

      const response = await fetch(`/api/users/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error("Échec de la mise à jour des informations de facturation");
      }

      await mutate();
      return { success: true, message: "Informations de facturation mises à jour !" };
    } catch (error) {
      console.error("Erreur:", error);
      return { success: false, message: "Erreur lors de la mise à jour" };
    } finally {
      setIsUpdating(false);
    }
  };

  // Nouvelle fonction pour mettre à jour spécifiquement l'abonnement
  const handleSubscriptionUpdate = async (updatedSubscription: {
    plan?: string;
    status?: string;
    end_date?: Date;
    next_payment_date?: Date;
    start_date?: Date;
  }) => {
    if (!userData?.id) {
      console.error('User data is not available');
      return { success: false, message: "Utilisateur non trouvé" };
    }

    setIsUpdating(true);
    try {
      // Préparation des données avec conversion des dates
      const subscriptionData = {
        ...userData.subscription,
        ...updatedSubscription,
        ...(updatedSubscription.start_date && { start_date: updatedSubscription.start_date.toISOString() }),
        ...(updatedSubscription.end_date && { end_date: updatedSubscription.end_date.toISOString() }),
        ...(updatedSubscription.next_payment_date && { next_payment_date: updatedSubscription.next_payment_date.toISOString() })
      };

      const response = await fetch(`/api/users/${userData.id}/subscription`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          subscription: subscriptionData
        }),
      });

      if (!response.ok) {
        throw new Error("Échec de la mise à jour de l'abonnement");
      }

      await mutate();
      return { success: true, message: "Abonnement mis à jour avec succès !" };
    } catch (error) {
      console.error("Erreur lors de la mise à jour de l'abonnement:", error);
      return { success: false, message: "Erreur lors de la mise à jour de l'abonnement" };
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    userData,
    loading,
    error,
    activeTab,
    setActiveTab,
    isUpdating,
    handleProfileUpdate,
    handleBillingUpdate,
    handleSubscriptionUpdate,  // Nouvelle fonction exportée
  };
}
