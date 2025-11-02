"use client";
import { useState } from "react";
import { Button } from "@/src/Components";
import { PaymentMethod } from "@/src/Types/Users";

interface PaymentMethodSectionProps {
  paymentMethod?: PaymentMethod;
  isUpdating: boolean;
  isEditing: boolean;
  formData: PaymentMethod;
  onEdit: () => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof PaymentMethod, value: any) => void;
}

export const PaymentMethodSection = ({
  paymentMethod,
  isUpdating,
  isEditing,
  formData,
  onEdit,
  onCancel,
  onSubmit,
  onChange,
}: PaymentMethodSectionProps) => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Méthode de paiement</h3>
        {!isEditing ? (
          <Button onClick={onEdit} variant="primary">
            Modifier
          </Button>
        ) : null}
      </div>
      {isEditing ? (
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type de paiement</label>
            <select
              value={formData.type}
              onChange={(e) => onChange("type", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="">Sélectionnez un type</option>
              <option value="credit_card">Carte de crédit</option>
              <option value="paypal">PayPal</option>
              <option value="bank_transfer">Virement bancaire</option>
            </select>
          </div>
          {formData.type === 'credit_card' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Derniers chiffres de la carte</label>
              <input
                type="text"
                value={formData.details?.card_last_four || ''}
                onChange={(e) => onChange("details", { ...formData.details, card_last_four: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="1234"
                maxLength={4}
              />
            </div>
          )}
          {formData.type === 'paypal' && (
            <div>
              <label className="block text-sm font-medium text-gray-700">Email PayPal</label>
              <input
                type="email"
                value={formData.details?.paypal_email || ''}
                onChange={(e) => onChange("details", { ...formData.details, paypal_email: e.target.value })}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                placeholder="votre@email.com"
              />
            </div>
          )}
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              id="default-payment"
              checked={formData.is_default || false}
              onChange={(e) => onChange("is_default", e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="default-payment" className="text-sm text-gray-700">
              Méthode de paiement par défaut
            </label>
          </div>
          <div className="flex space-x-3">
            <Button type="submit" disabled={isUpdating} variant="primary">
              {isUpdating ? "Enregistrement..." : "Enregistrer"}
            </Button>
            <Button type="button" onClick={onCancel} variant="secondary">
              Annuler
            </Button>
          </div>
        </form>
      ) : (
        <div>
          {paymentMethod ? (
            <div>
              {paymentMethod.type && (
                <>
                  <p className="capitalize mb-1">
                    {paymentMethod.type.replace('_', ' ')}
                    {paymentMethod.is_default && (
                      <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                        Par défaut
                      </span>
                    )}
                  </p>
                  {paymentMethod.type === 'credit_card' && paymentMethod.details?.card_last_four && (
                    <p>•••• {paymentMethod.details.card_last_four}</p>
                  )}
                  {paymentMethod.type === 'paypal' && paymentMethod.details?.paypal_email && (
                    <p>{paymentMethod.details.paypal_email}</p>
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
  );
};
