"use client";
import { useState, useEffect } from "react";
import { emptyClient } from "@/app/Types/Clients/index";
import FormInput from "@/app/Types/Components/FormInput/FormInput";
import { ClientFormData, ClientFormProps, validateClientForm } from "@/app/Types/Components/Clients/index";

export default function ClientForm({
  client = emptyClient,
  onSubmit,
  isLoading = false,
}: ClientFormProps) {
  const [formData, setFormData] = useState<ClientFormData>(client);
  const [errors, setErrors] = useState({
    name: "",
    email: "",
  });

  useEffect(() => {
    if (client) {
      setFormData(client);
    }
  }, [client]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Réinitialiser les erreurs
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { isValid, errors: newErrors } = validateClientForm(formData);
    setErrors(newErrors);
    if (isValid) {
      await onSubmit(formData); // Appelle la fonction passée en prop
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <FormInput
        label="Nom complet *"
        name="name"
        value={formData.name}
        onChange={handleChange}
        error={errors.name}
        className="mb-4"
      />

      <FormInput
        label="Email *"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={errors.email}
        className="mb-4"
      />

      <FormInput
        label="Téléphone"
        name="phone"
        type="tel"
        value={formData.phone || ""}
        onChange={handleChange}
        className="mb-4"
      />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Adresse
        </label>
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
            isLoading ? 'bg-blue-400' : 'bg-blue-600 hover:bg-blue-700'
          }`}
        >
          {isLoading ? 'Enregistrement...' : 'Enregistrer'}
        </button>
      </div>
    </form>
  );
}
