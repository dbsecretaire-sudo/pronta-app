// src/components/BillingTab.tsx
"use client";
import { useState } from "react";
import { Button } from "@/src/Components";
import { BillingAddress, PaymentMethod } from "../Types/Users";

interface BillingTabProps {
  data: {
    subscription_plan?: string;
    subscription_end_date?: Date;
    subscription_start_date?: Date;
    next_payment_date?: Date;
    subscription_status?: string;
    service_name?: string;
    billing_address?: BillingAddress;
    payment_method?: PaymentMethod;
  };
  onEdit: (data: {
    subscription_plan?: string;
    billing_address?: BillingAddress;
    payment_method?: PaymentMethod;
  }) => Promise<{ success: boolean; message: string }>;
  isUpdating?: boolean;
}

export function BillingTab({ data, onEdit, isUpdating = false }: BillingTabProps) {
  const [editMode, setEditMode] = useState({
    billing: false,
    payment: false
  });

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

  const handleSubmit = async (e: React.FormEvent, type: 'billing' | 'payment') => {
    e.preventDefault();
    const result = await onEdit(formData);
    if (result.success) {
      setEditMode({ ...editMode, [type]: false });
    }
    alert(result.message);
  };

  // Statuts de souscription avec couleurs associées
  const getStatusStyle = (status?: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'cancelled':
        return 'bg-gray-100 text-gray-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Statuts de souscription lisibles
  const getStatusLabel = (status?: string) => {
    switch (status) {
      case 'active': return 'Actif';
      case 'paid': return 'Payé';
      case 'overdue': return 'En retard';
      case 'cancelled': return 'Annulé';
      case 'pending': return 'En attente';
      default: return 'Inconnu';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Facturation</h2>

      {/* Abonnement et informations de service */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="space-y-3">
          {data.service_name && (
            <>
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-medium">Service souscrit</h3>
                  <p className="font-semibold text-lg">{data.service_name}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(data.subscription_status)}`}>
                  {getStatusLabel(data.subscription_status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {data.subscription_start_date && (
                  <div>
                    <p className="text-gray-500">Date de souscription</p>
                    <p>{new Date(data.subscription_start_date).toLocaleDateString('fr-FR')}</p>
                  </div>
                )}

                {data.next_payment_date && (
                  <div>
                    <p className="text-gray-500">Prochaine échéance</p>
                    <p>{new Date(data.next_payment_date).toLocaleDateString('fr-FR')}</p>
                  </div>
                )}

                {data.subscription_end_date && (
                  <div>
                    <p className="text-gray-500">Fin d'abonnement</p>
                    <p>{new Date(data.subscription_end_date).toLocaleDateString('fr-FR')}</p>
                  </div>
                )}
              </div>
            </>
          )}

          {!data.service_name && (
            <div className="flex justify-between items-center">
              <span className="font-medium">Plan actuel</span>
              <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {formData.subscription_plan || "Aucun"}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Adresse de facturation */}
      <div className="bg-blue-50 p-4 rounded-lg mb-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Adresse de facturation</h3>
          {!editMode.billing ? (
            <Button
              onClick={() => setEditMode({ ...editMode, billing: true })}
              variant="primary"
            >
              Modifier
            </Button>
          ) : null}
        </div>

        {editMode.billing ? (
          <form onSubmit={(e) => handleSubmit(e, 'billing')} className="space-y-4">
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  setEditMode({ ...editMode, billing: false });
                  setFormData({
                    ...formData,
                    billing_address: data.billing_address || {
                      street: "",
                      city: "",
                      state: "",
                      postal_code: 0,
                      country: ""
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
      <div className="bg-blue-50 p-4 rounded-lg">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Méthode de paiement</h3>
          {!editMode.payment ? (
            <Button
              onClick={() => setEditMode({ ...editMode, payment: true })}
              variant="primary"
            >
              Modifier
            </Button>
          ) : null}
        </div>

        {editMode.payment ? (
          <form onSubmit={(e) => handleSubmit(e, 'payment')} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Type de paiement</label>
              <select
                value={formData.payment_method.type}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payment_method: {
                      ...formData.payment_method,
                      type: e.target.value
                    }
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              >
                <option value="">Sélectionnez un type</option>
                <option value="credit_card">Carte de crédit</option>
                <option value="paypal">PayPal</option>
                <option value="bank_transfer">Virement bancaire</option>
              </select>
            </div>

            {formData.payment_method.type === 'credit_card' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Derniers chiffres de la carte</label>
                <input
                  type="text"
                  value={formData.payment_method.details?.card_last_four || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      payment_method: {
                        ...formData.payment_method,
                        details: {
                          ...formData.payment_method.details,
                          card_last_four: e.target.value
                        }
                      }
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="1234"
                  maxLength={4}
                />
              </div>
            )}

            {formData.payment_method.type === 'paypal' && (
              <div>
                <label className="block text-sm font-medium text-gray-700">Email PayPal</label>
                <input
                  type="email"
                  value={formData.payment_method.details?.paypal_email || ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      payment_method: {
                        ...formData.payment_method,
                        details: {
                          ...formData.payment_method.details,
                          paypal_email: e.target.value
                        }
                      }
                    })
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  placeholder="votre@email.com"
                />
              </div>
            )}

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="default-payment"
                checked={formData.payment_method.is_default || false}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    payment_method: {
                      ...formData.payment_method,
                      is_default: e.target.checked
                    }
                  })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="default-payment" className="text-sm text-gray-700">
                Méthode de paiement par défaut
              </label>
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
                  setEditMode({ ...editMode, payment: false });
                  setFormData({
                    ...formData,
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
            {data.payment_method ? (
              <div>
                {data.payment_method.type && (
                  <>
                    <p className="capitalize mb-1">
                      {data.payment_method.type.replace('_', ' ')}
                      {data.payment_method.is_default && (
                        <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                          Par défaut
                        </span>
                      )}
                    </p>
                    {data.payment_method.type === 'credit_card' && data.payment_method.details?.card_last_four && (
                      <p>•••• {data.payment_method.details.card_last_four}</p>
                    )}
                    {data.payment_method.type === 'paypal' && data.payment_method.details?.paypal_email && (
                      <p>{data.payment_method.details.paypal_email}</p>
                    )}
                  </>
                )}
              </div>
            ) : (
              <p className="text-gray-500">Aucune méthode de paiement</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
