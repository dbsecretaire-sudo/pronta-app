"use client";
import { useState } from "react";
import { SubscriptionInfo } from "./SubscriptionInfo";
import { BillingAddressSection } from "./BillingAddressSection";
import { PaymentMethodSection } from "./PaymentMethodSection";
import { BillingTabProps } from "./types";

export function BillingTab({ data, onEdit, isUpdating = false }: BillingTabProps) {
  const [editMode, setEditMode] = useState({
    billing: false,
    payment: false,
  });
  const [formData, setFormData] = useState({
    subscription_plan: data.subscription_plan || "",
    next_payment_date: data.next_payment_date || undefined,
    subscription_end_date: data.subscription_end_date || undefined,
    subscription_status: data.subscription_status || "",
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

  const handleSubmit = async (e: React.FormEvent, type: "billing" | "payment") => {
    e.preventDefault();
    const payload = type === "billing" ? { billing_address: formData.billing_address } : { payment_method: formData.payment_method };
    const result = await onEdit(payload);
    if (result.success) {
      setEditMode({ ...editMode, [type]: false });
    }
    alert(result.message);
  };

  const handleChange = (type: "billing_address" | "payment_method", field: string, value: any) => {
    setFormData({
      ...formData,
      [type]: {
        ...formData[type],
        [field]: value,
      },
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Facturation</h2>
      <SubscriptionInfo
        serviceName={formData.subscription_plan}
        subscriptionStatus={data.subscription_status}
        subscriptionStartDate={data.subscription_start_date}
        nextPaymentDate={data.next_payment_date}
        subscriptionEndDate={data.subscription_end_date}
        subscriptionPlan={formData.subscription_plan}
      />
      <BillingAddressSection
        billingAddress={data.billing_address}
        isUpdating={isUpdating}
        isEditing={editMode.billing}
        formData={formData.billing_address}
        onEdit={() => setEditMode({ ...editMode, billing: true })}
        onCancel={() => {
          setEditMode({ ...editMode, billing: false });
          setFormData({
            ...formData,
            billing_address: data.billing_address || {
              street: "",
              city: "",
              state: "",
              postal_code: 0,
              country: "",
            },
          });
        }}
        onSubmit={(e) => handleSubmit(e, "billing")}
        onChange={(field, value) =>
          setFormData({
            ...formData,
            billing_address: {
              ...formData.billing_address,
              [field]: value,
            },
          })
        }
      />
      <PaymentMethodSection
        paymentMethod={data.payment_method}
        isUpdating={isUpdating}
        isEditing={editMode.payment}
        formData={formData.payment_method}
        onEdit={() => setEditMode({ ...editMode, payment: true })}
        onCancel={() => {
          setEditMode({ ...editMode, payment: false });
          setFormData({
            ...formData,
            payment_method: data.payment_method || {
              type: "",
              details: {},
              is_default: false,
            },
          });
        }}
        onSubmit={(e) => handleSubmit(e, "payment")}
        onChange={(field, value) => {
          if (field === "details") {
            setFormData({
              ...formData,
              payment_method: {
                ...formData.payment_method,
                details: value,
              },
            });
          } else {
            setFormData({
              ...formData,
              payment_method: {
                ...formData.payment_method,
                [field]: value,
              },
            });
          }
        }}
      />
    </div>
  );
}
