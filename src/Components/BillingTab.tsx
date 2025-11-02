// src/components/BillingTab.tsx
import { useState } from "react";
import { Button } from "@/src/Components";

interface BillingTabProps {
  data: {
    subscription_plan?: string;
    subscription_end_date?: Date;
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
  };
  onEdit: (data: {
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
  }) => Promise<{ success: boolean; message: string }>;
  isUpdating?: boolean;
}

export function BillingTab({ data, onEdit, isUpdating = false }: BillingTabProps) {
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    subscription_plan: data.subscription_plan || "",
    billing_address: data.billing_address || {
      street: "",
      city: "",
      state: "",
      postal_code: 0,
      country: ""
    },
    payment_method: data.payment_method || {
      type: "",
      details: {},
      is_default: false
    }
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await onEdit(formData);
    if (result.success) {
      setEditMode(false);
    }
    alert(result.message);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Facturation</h2>

      {/* Abonnement */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center">
          <span className="font-medium">Plan actuel</span>
          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
            {formData.subscription_plan || "Aucun"}
          </span>
        </div>
        {data.subscription_end_date && (
          <p className="text-sm text-gray-600 mt-2">
            Valide jusqu'au {new Date(data.subscription_end_date).toLocaleDateString('fr-FR')}
          </p>
        )}
      </div>

      {/* Adresse de facturation */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Adresse de facturation</h3>
          {!editMode && (
            <Button
              onClick={() => setEditMode(true)}
              className="text-blue-600 text-sm bg-transparent hover:bg-blue-50"
            >
              Modifier
            </Button>
          )}
        </div>

        {editMode ? (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Rue</label>
              <input
                type="text"
                value={formData.billing_address.street}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    billing_address: {
                      ...formData.billing_address,
                      street: e.target.value
                    }
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Ville</label>
                <input
                  type="text"
                  value={formData.billing_address.city}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      billing_address: {
                        ...formData.billing_address,
                        city: e.target.value
                      }
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Code postal</label>
                <input
                  type="number"
                  value={formData.billing_address.postal_code}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      billing_address: {
                        ...formData.billing_address,
                        postal_code: Number(e.target.value)
                      }
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Pays</label>
                <input
                  type="text"
                  value={formData.billing_address.country}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      billing_address: {
                        ...formData.billing_address,
                        country: e.target.value
                      }
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                type="submit"
                disabled={isUpdating}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isUpdating ? "Enregistrement..." : "Enregistrer"}
              </Button>
              <Button
                type="button"
                onClick={() => {
                  setEditMode(false);
                  setFormData({
                    subscription_plan: data.subscription_plan || "",
                    billing_address: data.billing_address || {
                      street: "",
                      city: "",
                      state: "",
                      postal_code: 0,
                      country: ""
                    },
                    payment_method: data.payment_method || {
                      type: "",
                      details: {},
                      is_default: false
                    }
                  });
                }}
                className="bg-gray-200 hover:bg-gray-300"
              >
                Annuler
              </Button>
            </div>
          </form>
        ) : (
          <div>
            {data.billing_address ? (
              <div className="space-y-1">
                <p>{data.billing_address.street}</p>
                <p>{data.billing_address.postal_code} {data.billing_address.city}</p>
                <p>{data.billing_address.country}</p>
              </div>
            ) : (
              <p className="text-gray-500">Aucune adresse de facturation</p>
            )}
          </div>
        )}
      </div>

      {/* Méthode de paiement */}
      {data.payment_method && (
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium mb-2">Méthode de paiement</h3>
              <p className="capitalize">{data.payment_method.type.replace('_', ' ')}</p>
              {data.payment_method.type === 'credit_card' && (
                <p>•••• {data.payment_method.details?.card_last_four}</p>
              )}
              {data.payment_method.type === 'paypal' && (
                <p>{data.payment_method.details?.paypal_email}</p>
              )}
            </div>
            <Button
              onClick={() => alert("Fonctionnalité à implémenter")}
              className="text-blue-600 text-sm bg-transparent hover:bg-blue-50"
            >
              Modifier
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
