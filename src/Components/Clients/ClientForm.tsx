"use client";
import { useState, useEffect } from "react";
import { ClientFormData, ClientFormProps, validateClientForm, FormInput } from "@/src/Components";
import { emptyClient } from "@/src/Types/Clients/index";

const formFields = [
  {
    label: "Nom complet *",
    name: "name",
    type: "text",
    required: true,
  },
  {
    label: "Email *",
    name: "email",
    type: "email",
    required: true,
  },
  {
    label: "Téléphone",
    name: "phone",
    type: "tel",
  },
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {formFields.map((field) => (
        <FormInput
          key={field.name}
          label={field.label}
          name={field.name}
          type={field.type}
          value={formData[field.name as keyof ClientFormData] || ""}
          onChange={handleChange}
          error={errors[field.name]}
          className="mb-4"
        />
      ))}

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">Adresse</label>
        <textarea
          name="address"
          value={formData.address || ""}
          onChange={handleChange}
          rows={3}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <FormInput
        label="Entreprise"
        name="company"
        value={formData.company || ""}
        onChange={handleChange}
        className="mb-6"
      />

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
