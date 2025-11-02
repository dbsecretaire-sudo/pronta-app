"use client";
import { useState } from "react";

type ProfileData = {
  email: string;
  phone: string;
  company: string;
};

type ProfileTabProps = {
  data: ProfileData;
  onEdit: (updatedData: ProfileData) => Promise<void>;
};

export function ProfileTab({ data, onEdit }: ProfileTabProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<ProfileData>({ ...data });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    await onEdit(editData);
    setIsEditing(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            {isEditing ? (
              <input
                type="email"
                name="email"
                value={editData.email}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              />
            ) : (
              <p className="mt-1">{data.email}</p>
            )}
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Téléphone</label>
            {isEditing ? (
              <input
                type="text"
                name="phone"
                value={editData.phone}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              />
            ) : (
              <p className="mt-1">{data.phone}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Entreprise</label>
          {isEditing ? (
            <input
              type="text"
              name="company"
              value={editData.company}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
            />
          ) : (
            <p className="mt-1">{data.company}</p>
          )}
        </div>
        <div className="mt-6 flex space-x-3">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Sauvegarder
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditData({ ...data });
                }}
                className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Annuler
              </button>
            </>
          ) : (
            <button
              onClick={handleEdit}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Modifier les informations
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
