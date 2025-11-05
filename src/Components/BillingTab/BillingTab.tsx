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
  });

  // État initial pour les données du formulaire
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

  // Réinitialiser les données du formulaire à partir des props
  const resetFormData = (type: "billing_address" | "payment_method") => {
    setFormData({
      ...formData,
      [type]: data[type],
    });
  };

  // Gestion des changements dans les formulaires
  const handleChange = (
    type: "billing_address" | "payment_method",
    field: string,
    value: any
  ) => {
    setFormData((prev) => ({
      ...prev,
      [type]: {
        ...prev[type],
        [field]: value,
      },
    }));
  };

  // Gestion de la soumission des modifications
  const handleSubmit = async (
    e: React.FormEvent,
    type: "billing" | "payment"
  ) => {
    e.preventDefault();
    const payload = {
      [type === "billing" ? "billing_address" : "payment_method"]:
        formData[type === "billing" ? "billing_address" : "payment_method"],
    };

    const result = await onEdit(payload);
    if (result?.success) {
      setEditMode({ ...editMode, [type]: false });
    }
  };

  // Annulation de l'édition
  const handleCancel = (type: "billing" | "payment") => {
    setEditMode({ ...editMode, [type]: false });
    resetFormData(type === "billing" ? "billing_address" : "payment_method");
  };

  return (
    <div className="bg-blue-50 rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Facturation</h2>

      {/* Section Abonnements */}
      <div className="mb-8">
        {data.subscriptions.map((subscription) => (
          <div key={subscription.id} className="rounded-lg">
            <SubscriptionInfo
              subscriptions={{
                id: subscription.id,
                service_id: subscription.service_id,
                status: subscription.status,
                start_date: subscription.start_date,
                end_date: subscription.end_date,
                next_payment_date: subscription.next_payment_date,
                created_at: subscription.created_at,
                service: subscription.service,
              }}
            />
          </div>
        ))}
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
        onChange={(field, value) => handleChange("billing_address", field, value)}
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
            handleChange("payment_method", "details", { ...formData.payment_method.details, ...value });
          } else {
            handleChange("payment_method", field, value);
          }
        }}
      />
    </div>
  );
}
