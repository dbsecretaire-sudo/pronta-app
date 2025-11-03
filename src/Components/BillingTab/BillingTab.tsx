"use client";
import { useState } from "react";
import { SubscriptionInfo } from "./SubscriptionInfo";
import { BillingAddressSection } from "./BillingAddressSection";
import { PaymentMethodSection } from "./PaymentMethodSection";
import { BillingTabProps } from "./types";

export function BillingTab({ data, onEdit, isUpdating = false }: BillingTabProps) {
  // État pour gérer les modes d'édition
  const [editMode, setEditMode] = useState({
    billing: false,
    payment: false,
    subscription: false,
    selectedSubscriptionId: null as number | null
  });

  // État initial avec gestion des abonnements multiples
  const [formData, setFormData] = useState({
    billing_address: data.billing_address || {
      street: "",
      city: "",
      state: "",
      postal_code: 0,
      country: "",
    },
    payment_method: data.payment_method || {
      type: "",
      details: {},
      is_default: false,
    },
  });



  // Gestion de la soumission des modifications
  const handleSubmit = async (e: React.FormEvent, type: "billing" | "payment" | "subscription") => {
    e.preventDefault();

    let payload = {};
    let result;

    if (type === "billing") {
      payload = { billing_address: formData.billing_address };
    } else if (type === "payment") {
      payload = { payment_method: formData.payment_method };
    } 
    // else if (type === "subscription" && editMode.selectedSubscriptionId) {
    //   // Pour les abonnements, on appelle un endpoint spécifique
    //   const subscriptionData = {
    //     ...formData.subscriptions.find(sub => sub.id === editMode.selectedSubscriptionId),
    //     start_date: new Date(formData.subscriptions.find(sub => sub.id === editMode.selectedSubscriptionId)?.start_date || "").toISOString(),
    //     end_date: formData.subscriptions.find(sub => sub.id === editMode.selectedSubscriptionId)?.end_date ?
    //       new Date(formData.subscriptions.find(sub => sub.id === editMode.selectedSubscriptionId)?.end_date || "").toISOString() : undefined,
    //     next_payment_date: formData.subscriptions.find(sub => sub.id === editMode.selectedSubscriptionId)?.next_payment_date ?
    //       new Date(formData.subscriptions.find(sub => sub.id === editMode.selectedSubscriptionId)?.next_payment_date || "").toISOString() : undefined
    //   };

    //   // Appel API spécifique pour mettre à jour un abonnement
    //   const response = await fetch(`/api/users/subscriptions/${editMode.selectedSubscriptionId}`, {
    //     method: "PUT",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: JSON.stringify(subscriptionData),
    //   });

    //   if (!response.ok) {
    //     throw new Error("Échec de la mise à jour de l'abonnement");
    //   }

    //   result = { success: true, message: "Abonnement mis à jour avec succès !" };
    // } 
    else {
      // Pour les autres types, on utilise la fonction onEdit fournie
      result = await onEdit(payload);
    }

    if (result?.success) {
      setEditMode({
        ...editMode,
        [type]: false,
        selectedSubscriptionId: null
      });
    }

    alert(result?.message);
  };

  // Gestion des changements dans les formulaires
  const handleChange = (
    type: "billing_address" | "payment_method" | "subscription",
    field: string,
    value: any,
    subscriptionId?: number
  ) => {
    // if (type === "subscription" && subscriptionId !== undefined) {
    //   setFormData({
    //     ...formData,
    //     subscriptions: formData.subscriptions.map(sub =>
    //       sub.id === subscriptionId ? { ...sub, [field]: value } : sub
    //     )
    //   });
    // } else {
      setFormData({
        ...formData,
        [type]: {
          ...formData[type as "billing_address" | "payment_method"],
          [field]: value,
        },
      });
    
  };

  // // Début de l'édition d'un abonnement spécifique
  // const handleEditSubscription = (subscriptionId: number) => {
  //   setEditMode({
  //     ...editMode,
  //     subscription: true,
  //     selectedSubscriptionId: subscriptionId
  //   });
  // };

  // Annulation de l'édition
  const handleCancel = (type: "billing" | "payment" | "subscription") => {

      setEditMode({ ...editMode, [type]: false });
      setFormData({
        ...formData,
        [type]: data[type as "billing_address" | "payment_method"]
      });
    
  };

  // Création d'un nouvel abonnement
  const handleCreateSubscription = async () => {
    try {
      const newSubscription = {
        plan: "Nouveau plan",
        status: "active",
        start_date: new Date().toISOString(),
        end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 an plus tard
        next_payment_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 jours plus tard
      };

      const response = await fetch(`/api/users/${data.id}/subscriptions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSubscription),
      });

      if (!response.ok) {
        throw new Error("Échec de la création de l'abonnement");
      }

      const createdSubscription = await response.json();
      alert("Abonnement créé avec succès !");

      // Rafraîchir les données
      if (onEdit) {
        await onEdit({ refresh: true });
      }
    } catch (error) {
      console.error("Erreur lors de la création de l'abonnement:", error);
      alert("Erreur lors de la création de l'abonnement");
    }
  };

  // Suppression d'un abonnement
  const handleDeleteSubscription = async (subscriptionId: number) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet abonnement ?")) {
      return;
    }

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

      alert("Abonnement supprimé avec succès !");

      // Rafraîchir les données
      if (onEdit) {
        await onEdit({ refresh: true });
      }
    } catch (error) {
      console.error("Erreur lors de la suppression de l'abonnement:", error);
      alert("Erreur lors de la suppression de l'abonnement");
    }
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-6">
      <h2 className="flex justify-between items-center mb-4">Facturation</h2>

      {/* Section Abonnements */}
      <div className="mb-8">
        {/* Liste des abonnements */}
        <div className="space-y-4">
          {data.subscriptions.map((subscription) => (
            <div key={subscription.id || Math.random()} className="border rounded-lg p-4">
              <SubscriptionInfo
                serviceName={subscription.plan}
                subscriptions={[{
                    id: subscription.id,  // Assurez-vous que cet ID existe
                    plan: subscription.plan,
                    status: subscription.status,
                    start_date: subscription.start_date,
                    end_date: subscription.end_date,
                    next_payment_date: subscription.next_payment_date,
                    created_at: subscription.created_at
                    // user_id n'est pas requis pour l'affichage
                  }]}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Section Adresse de facturation */}
      <BillingAddressSection
        billingAddress={data.billing_address}
        isUpdating={isUpdating}
        isEditing={editMode.billing}
        formData={formData.billing_address}
        onEdit={() => setEditMode({ ...editMode, billing: true })}
        onCancel={() => handleCancel("billing")}
        onSubmit={(e) => handleSubmit(e, "billing")}
        onChange={(field, value) =>
          handleChange("billing_address", field, value)
        }
      />

      {/* Section Méthode de paiement */}
      <PaymentMethodSection
        paymentMethod={data.payment_method}
        isUpdating={isUpdating}
        isEditing={editMode.payment}
        formData={formData.payment_method}
        onEdit={() => setEditMode({ ...editMode, payment: true })}
        onCancel={() => handleCancel("payment")}
        onSubmit={(e) => handleSubmit(e, "payment")}
        onChange={(field, value) => {
          if (field === "details") {
            handleChange("payment_method", "details", value);
          } else {
            handleChange("payment_method", field, value);
          }
        }}
      />
    </div>
  );
}
