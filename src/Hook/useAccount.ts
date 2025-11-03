// src/hooks/useAccount.ts
import { useUser } from "@/src/Hook/useUser";
import { useState } from "react";
import { Role, User } from "@/src/Types/Users";

export function useAccount() {
  const { userData, loading, error, mutate } = useUser();
  const [activeTab, setActiveTab] = useState("profile");
  const [isUpdating, setIsUpdating] = useState(false);

  // Mise à jour du profil utilisateur (sans toucher aux abonnements)
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
      const response = await fetch(`/api/users/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
      });

      if (!response.ok) {
        throw new Error("Échec de la mise à jour du profil");
      }

      await mutate();
      return { success: true, message: "Profil mis à jour avec succès !" };
    } catch (error) {
      console.error("Erreur lors de la mise à jour:", error);
      return { success: false, message: "Erreur lors de la mise à jour du profil" };
    } finally {
      setIsUpdating(false);
    }
  };

  // Mise à jour des informations de facturation (sans toucher aux abonnements)
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
  }) => {
    if (!userData?.id) {
      console.error('User data is not available');
      return { success: false, message: "Utilisateur non trouvé" };
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/users/${userData.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData),
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

  // Création d'un nouvel abonnement
  const handleCreateSubscription = async (subscriptionData: {
    plan: string;
    status?: string;
    start_date?: Date;
    end_date?: Date;
    next_payment_date?: Date;
  }) => {
    if (!userData?.id) {
      console.error('User data is not available');
      return { success: false, message: "Utilisateur non trouvé" };
    }

    setIsUpdating(true);
    try {
      // Préparation des données avec conversion des dates
      const apiData = {
        ...subscriptionData,
        ...(subscriptionData.start_date && { start_date: subscriptionData.start_date.toISOString() }),
        ...(subscriptionData.end_date && { end_date: subscriptionData.end_date.toISOString() }),
        ...(subscriptionData.next_payment_date && { next_payment_date: subscriptionData.next_payment_date.toISOString() }),
        user_id: userData.id
      };

      const response = await fetch(`/api/users/${userData.id}/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
      });

      if (!response.ok) {
        throw new Error("Échec de la création de l'abonnement");
      }

      await mutate();
      return { success: true, message: "Abonnement créé avec succès !" };
    } catch (error) {
      console.error("Erreur lors de la création de l'abonnement:", error);
      return { success: false, message: "Erreur lors de la création de l'abonnement" };
    } finally {
      setIsUpdating(false);
    }
  };

  // Mise à jour d'un abonnement spécifique
  const handleUpdateSubscription = async (subscriptionId: number, updatedSubscription: {
    plan?: string;
    status?: string;
    start_date?: Date;
    end_date?: Date;
    next_payment_date?: Date;
  }) => {
    if (!userData?.id) {
      console.error('User data is not available');
      return { success: false, message: "Utilisateur non trouvé" };
    }

    setIsUpdating(true);
    try {
      // Préparation des données avec conversion des dates
      const apiData = {
        ...updatedSubscription,
        ...(updatedSubscription.start_date && { start_date: updatedSubscription.start_date.toISOString() }),
        ...(updatedSubscription.end_date && { end_date: updatedSubscription.end_date.toISOString() }),
        ...(updatedSubscription.next_payment_date && { next_payment_date: updatedSubscription.next_payment_date.toISOString() })
      };

      const response = await fetch(`/api/users/subscriptions/${subscriptionId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(apiData),
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

  // Suppression d'un abonnement
  const handleDeleteSubscription = async (subscriptionId: number) => {
    if (!userData?.id) {
      console.error('User data is not available');
      return { success: false, message: "Utilisateur non trouvé" };
    }

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/users/subscriptions/${subscriptionId}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Échec de la suppression de l'abonnement");
      }

      await mutate();
      return { success: true, message: "Abonnement supprimé avec succès !" };
    } catch (error) {
      console.error("Erreur lors de la suppression de l'abonnement:", error);
      return { success: false, message: "Erreur lors de la suppression de l'abonnement" };
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
    // handleCreateSubscription,    // Nouvelle fonction pour créer un abonnement
    // handleUpdateSubscription,    // Nouvelle fonction pour mettre à jour un abonnement
    // handleDeleteSubscription,    // Nouvelle fonction pour supprimer un abonnement
  };
}
