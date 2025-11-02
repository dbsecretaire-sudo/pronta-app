// src/hooks/useAccount.ts
import { useUser } from "@/src/Hook/useUser";
import { useState } from "react";
import { updateProfile, updateBilling } from "@/src/lib/api";

export function useAccount() {
  const { userData, loading, error, mutate } = useUser();
  const [activeTab, setActiveTab] = useState("profile");
  const [isUpdating, setIsUpdating] = useState(false);

  const handleProfileUpdate = async (updatedData: {
    email: string;
    phone: string;
    company: string;
  }) => {
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
    subscription_plan?: string;
    billing_address?: {
      street: string;
      city: string;
      state: string;
      postal_code: number;
      country: string;
    };
    payment_method?: {
      type: string;
      details: {
        card_last_four?: string;
        card_brand?: string;
        paypal_email?: string;
      };
      is_default: boolean;
    };
  }) => {
    setIsUpdating(true);
    try {
      await updateBilling(userData.id, updatedData);
      await mutate();
      return { success: true, message: "Informations de facturation mises à jour !" };
    } catch (error) {
      console.error("Erreur:", error);
      return { success: false, message: "Erreur lors de la mise à jour" };
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
  };
}
