
"use client";
import { useState } from "react";
import { Button } from "@/src/Components";
import { BillingAddress } from "@/src/Types/Users";
import { DivideIcon } from "@heroicons/react/24/outline";

interface BillingAddressSectionProps  {
  billingAddress?: BillingAddress;
  isUpdating: boolean;
  isEditing: boolean;
  formData: BillingAddress;
  onEdit: () => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof BillingAddress, value: string | number) => void;
}

export const BillingAddressSection  = ({
  billingAddress,
  isUpdating,
  isEditing,
  formData,
  onEdit,
  onCancel,
  onSubmit,
  onChange,
}: BillingAddressSectionProps ) => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-6">
      {!isEditing ? (
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-medium">Adresse de facturation</h3>
          
            <Button onClick={onEdit} variant="primary">
              Modifier
            </Button>
        </div>    
      ) : (
      <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm mb-4">
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Rue</label>
            <input
              type="text"
              value={formData.street}
              onChange={(e) => onChange("street", e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Ville</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => onChange("city", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Code postal</label>
              <input
                type="number"
                value={formData.postal_code}
                onChange={(e) => onChange("postal_code", Number(e.target.value))}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Département</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => onChange("state", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Pays</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => onChange("country", e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>
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
      </div>
      )}
      {!isEditing?(
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-2">
          {billingAddress ? (
            <div className="space-y-1">
              <p>{billingAddress.street}</p>
              <p>{billingAddress.postal_code} {billingAddress.city}</p>
              <p>{billingAddress.country}</p>
            </div>
          ) : (
            <p className="text-gray-500">Aucune adresse de facturation</p>
          )}
        </div>
      ) : null}
      
    </div>
  );
};
