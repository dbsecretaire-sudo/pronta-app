"use client";
import { useState } from "react";
import { Button } from "@/src/Components";
import { Role } from "../Types/Users";

interface ProfileFieldProps {
  label: string;
  value: string;
  type?: string;
  options?: Array<{ value: string; label: string }>;
  onChange?: (value: string) => void;
  editMode: boolean;
  required?: boolean;
}

const ProfileField = ({ label, value, type = "text", options, onChange, editMode, required }: ProfileFieldProps) => {
  if (editMode) {
    if (options) {
      return (
        <div>
          <label className="block text-sm font-medium text-gray-700">{label}</label>
          <select
            value={value}
            onChange={(e) => onChange?.(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required={required}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      );
    }

    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        <input
          type={type}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          required={required}
        />
      </div>
    );
  }

  return (
    <div>
      <p className="text-sm font-medium text-gray-500">{label}</p>
      <p>{value || "Non renseigné"}</p>
    </div>
  );
};

const roleOptions = [
  { value: "ADMIN", label: "Administrateur" },
  { value: "CLIENT", label: "Client" },
  { value: "SECRETARY", label: "Secrétaire" },
  { value: "SUPERVISOR", label: "Superviseur" },
];

const getRoleLabel = (role: Role) => {
  return roleOptions.find(option => option.value === role)?.label || role || "Non spécifié";
};

interface ProfileTabProps {
  data: {
    email: string;
    phone: string;
    name: string;
    role: Role;
  };
  onEdit: (data: { email: string; phone: string; name: string; role: Role }) => Promise<{ success: boolean; message: string }>;
  isUpdating?: boolean;
}

export function ProfileTab({ data, onEdit, isUpdating = false }: ProfileTabProps) {
  const [formData, setFormData] = useState(data);
  const [editMode, setEditMode] = useState(false);

  const handleChange = (field: keyof typeof formData) => (value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onEdit(formData);
  };

  const fields = [
    { name: "name", label: "Nom complet", required: true },
    { name: "email", label: "Email", type: "email", required: true },
    { name: "phone", label: "Téléphone", type: "tel" },
    { name: "role", label: "Rôle d'accès", options: roleOptions },
  ];

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-6">Informations personnelles</h2>

      {editMode ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          {fields.map((field) => (
            <ProfileField
              key={field.name}
              label={field.label}
              value={field.name === "role" ? formData.role : formData[field.name as keyof typeof formData]}
              type={field.type}
              options={field.options}
              onChange={handleChange(field.name as keyof typeof formData)}
              editMode={editMode}
              required={field.required}
            />
          ))}

          <div className="flex space-x-3 pt-2">
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
          {fields.map((field) => (
            <ProfileField
              key={field.name}
              label={field.label}
              value={field.name === "role" ? getRoleLabel(formData.role) : formData[field.name as keyof typeof formData]}
              editMode={editMode}
            />
          ))}

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
