"use client";
import { useState } from "react";

interface FormData {
  name: string;
  description: string;
  route: string;
  price: number;
  unit: string;
  icon: string;
}

interface ServiceFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  initialData?: FormData;
  isSubmitting: boolean;
  error: string | null;
}

export default function ServiceForm({
  onSubmit,
  onCancel,
  initialData = {
    name: "",
    description: "",
    route: "",
    price: 0,
    unit: "",
    icon: "🔧",
  },
  isSubmitting,
  error,
}: ServiceFormProps) {
  const [formData, setFormData] = useState<FormData>(initialData);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "price" ? Number(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Nom du service *</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Ex: Nettoyage de printemps"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Description</label>
        <textarea
          name="description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Décrivez le service..."
          rows={3}
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Route</label>
        <textarea
          name="route"
          value={formData.route}
          onChange={handleInputChange}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Ex: /dashboard/service/nouveauService"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Prix (€) *</label>
        <input
          type="number"
          name="price"
          value={formData.price}
          onChange={handleInputChange}
          className="w-full border rounded-lg px-3 py-2"
          min="0"
          step="0.01"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Unité</label>
        <input
          name="unit"
          value={formData.unit}
          onChange={handleInputChange}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Ex: heure, mois, ..."
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Icône (emoji)</label>
        <input
          type="text"
          name="icon"
          value={formData.icon}
          onChange={handleInputChange}
          className="w-full border rounded-lg px-3 py-2"
          placeholder="Ex: 🧹"
          maxLength={2}
        />
      </div>

      <div className="flex justify-end gap-2">
        <button
          type="button"
          className="px-4 py-2 text-gray-600"
          onClick={onCancel}
        >
          Annuler
        </button>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
          disabled={isSubmitting}
        >
          {isSubmitting ? "En cours..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
