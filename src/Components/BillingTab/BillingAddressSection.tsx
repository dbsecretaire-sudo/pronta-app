"use client";
import { Button } from "@/src/Components";
import { BillingAddress } from "@/src/Types/Users";

interface BillingAddressSectionProps {
  billingAddress?: BillingAddress;
  isUpdating: boolean;
  isEditing: boolean;
  formData: BillingAddress;
  onEdit: () => void;
  onCancel: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onChange: (field: keyof BillingAddress, value: string | number) => void;
}

const addressFields = [
  { name: "street", label: "Rue", type: "text", required: true, cols: "full" },
  { name: "city", label: "Ville", type: "text", required: true, cols: "half" },
  { name: "postal_code", label: "Code postal", type: "number", required: true, cols: "half" },
  { name: "state", label: "Département", type: "text", required: true, cols: "half" },
  { name: "country", label: "Pays", type: "text", required: true, cols: "half" },
];

export const BillingAddressSection = ({
  billingAddress,
  isUpdating,
  isEditing,
  formData,
  onEdit,
  onCancel,
  onSubmit,
  onChange,
}: BillingAddressSectionProps) => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-medium">Adresse de facturation</h3>
        {!isEditing ? (
          <Button onClick={onEdit} variant="primary">
            Modifier
          </Button>
        ) : null}
      </div>

      {isEditing ? (
        <div className="space-y-3 p-4 bg-white rounded-lg shadow-sm mb-4">
          <form onSubmit={onSubmit} className="space-y-4">
            {addressFields.map((field) => (
              <div
                key={field.name}
                className={field.cols === "half" ? "md:w-1/2 md:inline-block" : "w-full"}
              >
                <label className="block text-sm font-medium text-gray-700">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={formData[field.name as keyof BillingAddress]}
                  onChange={(e) =>
                    onChange(
                      field.name as keyof BillingAddress,
                      field.type === "number" ? Number(e.target.value) : e.target.value
                    )
                  }
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                  required={field.required}
                />
              </div>
            ))}

            <div className="flex space-x-3 pt-2">
              <Button type="submit" disabled={isUpdating} variant="primary">
                {isUpdating ? "Enregistrement..." : "Enregistrer"}
              </Button>
              <Button type="button" onClick={onCancel} variant="secondary">
                Annuler
              </Button>
            </div>
          </form>
        </div>
      ) : (
        <div className="bg-gray-50 p-3 rounded-lg border border-gray-200 mt-2">
          {billingAddress ? (
            <div className="space-y-1">
              <p>{billingAddress.street}</p>
              <p>
                {billingAddress.postal_code} {billingAddress.city}
              </p>
              <p>{billingAddress.state}</p>
              <p>{billingAddress.country}</p>
            </div>
          ) : (
            <p className="text-gray-500">Aucune adresse de facturation</p>
          )}
        </div>
      )}
    </div>
  );
};
