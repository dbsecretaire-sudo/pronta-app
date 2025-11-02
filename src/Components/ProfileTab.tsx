// src/components/ProfileTab.tsx
"use client";
import { useState } from "react";
import { Button } from "@/src/Components";

interface ProfileTabProps {
  data: {
    email: string;
    phone: string;
    company: string;
  };
  onEdit: (data: { email: string; phone: string; company: string }) => Promise<{ success: boolean; message: string }>;
  isUpdating?: boolean;
}

export function ProfileTab({ data, onEdit, isUpdating = false }: ProfileTabProps) {
  const [formData, setFormData] = useState(data);
  const [editMode, setEditMode] = useState(false);

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
      <h2 className="text-xl font-semibold mb-6">Informations personnelles</h2>

      {editMode ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Entreprise</label>
            <input
              type="text"
              value={formData.company}
              onChange={(e) => setFormData({...formData, company: e.target.value})}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
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
                setFormData(data);
              }}
              className="bg-gray-200 hover:bg-gray-300"
            >
              Annuler
            </Button>
          </div>
        </form>
      ) : (
        <div className="space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Email</p>
            <p>{data.email}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Téléphone</p>
            <p>{data.phone || "Non renseigné"}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Entreprise</p>
            <p>{data.company || "Non renseigné"}</p>
          </div>
          <Button
            onClick={() => setEditMode(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white mt-4"
          >
            Modifier
          </Button>
        </div>
      )}
    </div>
  );
}
