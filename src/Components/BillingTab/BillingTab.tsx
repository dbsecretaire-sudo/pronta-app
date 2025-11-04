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
  const handleSubmit = async (e: React.FormEvent, type: "billing" | "payment") => {
    e.preventDefault();
    let payload = {};
    if (type === "billing") {
      payload = { billing_address: formData.billing_address };
    } else if (type === "payment") {
      payload = { payment_method: formData.payment_method };
    }
    // Appelle onEdit dans tous les cas
    const result = await onEdit(payload);
    if (result?.success) {
      setEditMode({
        ...editMode,
        [type]: false,
        selectedSubscriptionId: null
      });
    }
  };

  // Gestion des changements dans les formulaires
  const handleChange = (
    type: "billing_address" | "payment_method" | "subscription",
    field: string,
    value: any,
  ) => {
  
      setFormData({
        ...formData,
        [type]: {
          ...formData[type as "billing_address" | "payment_method"],
          [field]: value,
        },
      });
    
  };

  // Annulation de l'édition
  const handleCancel = (type: "billing" | "payment") => {

      setEditMode({ ...editMode, [type]: false });
      setFormData({
        ...formData,
        [type]: data[type as "billing_address" | "payment_method"]
      });
    
  };

  return (
    <div className="bg-blue-50 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Facturation</h2>

      {/* Section Abonnements */}
      <div className="mb-8">
        {/* Liste des abonnements */}
        <div className="">
          {data.subscriptions.map((subscription) => (
            <div key={subscription.id || Math.random()} className="rounded-lg ">
              <SubscriptionInfo
                subscriptions={{
                    id: subscription.id,  // Assurez-vous que cet ID existe
                    service_id: subscription.service_id,
                    status: subscription.status,
                    start_date: subscription.start_date,
                    end_date: subscription.end_date,
                    next_payment_date: subscription.next_payment_date,
                    created_at: subscription.created_at,
                    service: subscription.service
                  }}
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
