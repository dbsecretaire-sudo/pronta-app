"use client";
import { useState, useEffect } from "react";
import { ClientFormData, ClientFormProps, validateClientForm, FormInput } from "@/src/Components";
import { emptyClient } from "@/src/Types/Clients/index";
import { AddressSchema } from "@/src/lib/schemas/clients";
import FormAddress from "../FormInput/FormAddress";

const formFields = [
  { label: "Nom complet *",  name: "name",  type: "text",  required: true, },
  { label: "Email *", name: "email", type: "email", required: true, },
  { label: "Téléphone", name: "phone", type: "tel", },
];

export default function ClientForm({
  client = emptyClient,
  onSubmit,
  isLoading = false,
}: ClientFormProps) {
  const [formData, setFormData] = useState<ClientFormData>(client);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Réinitialiser le formulaire si le client change
  useEffect(() => {
    setFormData(client);
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));

    // Réinitialiser les erreurs pour ce champ
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateClientForm(formData);
    setErrors(validationErrors);

    if (isValid) {
      await onSubmit(formData);
    }
  };

const addressValues = formData.address
  ? AddressSchema.parse(formData.address)
  : {
      street: "",
      city: "",
      state: "",
      postalCode: "",
      country: "",
    };

const addressErrors = typeof errors.address === 'object'
  ? errors.address
  : { street: "", city: "", state: "", postalCode: "", country: "" };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Champs simples */}
      {formFields.map((field) => {
        const value = formData[field.name as keyof ClientFormData];
        const safeValue = typeof value === 'string' || typeof value === 'number' ? value : '';
        return (
          <FormInput
            key={field.name}
            label={field.label}
            name={field.name}
            type={field.type}
            value={safeValue}
            onChange={handleChange}
            error={errors[field.name]}
            className="mb-4"
          />
        );
      })}

      {/* Section Adresse */}
      <div className="mb-4 p-4 border border-gray-200 rounded-lg">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Adresse</h3>
        <FormAddress
          label="Adresse"
          value={addressValues}
          onChange={handleChange}
          errors={addressErrors}
        />
      </div>

      {/* Champ Entreprise */}
      <FormInput
        label="Entreprise"
        name="company"
        value={formData.company || ""}
        onChange={handleChange}
        className="mb-6"
      />

      {/* Boutons */}
      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={`px-4 py-2 rounded-md text-sm font-medium text-white ${
            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}
