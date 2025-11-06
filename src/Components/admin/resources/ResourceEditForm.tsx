// src/components/admin/ResourceEditForm.tsx
'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { useRouter } from 'next/navigation';
import { updateResource, getResourceById, createResource } from '@/src/lib/admin/api';

interface ResourceEditFormProps {
  resourceName: string;
  id?: number;
}

export function ResourceEditForm({ resourceName, id }: ResourceEditFormProps) {
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(!!id);
  const router = useRouter();

  useEffect(() => {
    const initializeForm = async () => {
      if (id) {
        try {
          const data = await getResourceById(resourceName, id);
          setFormData(data);
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      } else {
        const defaults: Record<string, any> = {
          clients: {
            name: '',
            email: '',
            phone: '',
            company: '',
            address: ''
          },
          calls: {
            phoneNumber: '',
            type: 'incoming',
            duration: 0,
            date: new Date().toISOString(),
            summary: ''
          }
        };
        setFormData(defaults[resourceName] || {});
      }
      setIsLoading(false);
    };
    initializeForm();
  }, [resourceName, id]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    // Gestion spéciale pour les checkboxes
    if ((e.target as HTMLInputElement).type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    }
    // Gestion spéciale pour les champs de type number
    else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? 0 : parseInt(value) }));
    }
    // Cas standard
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  try {
    if (id) {
      await updateResource(resourceName, id, formData);
    } else {
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, String(value));
      });
      await createResource(resourceName, undefined, formDataToSend);
    }
    router.push(`/admin/${resourceName}`);
    router.refresh();
  } catch (error) {
    console.error('Error saving resource:', error);
  }
};

  const renderInputField = (key: string, value: any) => {
    // Déterminez le type de champ en fonction de la valeur
    if (typeof value === 'boolean') {
      return (
        <input
          type="checkbox"
          name={key}
          checked={Boolean(value)}
          onChange={handleChange}
          className="h-4 w-4 text-blue-600"
        />
      );
    }

    if (typeof value === 'number') {
      return (
        <input
          type="number"
          name={key}
          value={value}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      );
    }

    // Pour les dates, on pourrait ajouter un cas spécial
    if (key.toLowerCase().includes('date') && typeof value === 'string') {
      return (
        <input
          type="datetime-local"
          name={key}
          value={new Date(value).toISOString().slice(0, 16)}
          onChange={handleChange}
          className="w-full p-2 border rounded"
        />
      );
    }

    // Cas par défaut (text, email, etc.)
    return (
      <input
        type="text"
        name={key}
        value={String(value)}
        onChange={handleChange}
        className="w-full p-2 border rounded"
      />
    );
  };

  const renderFields = () => {
    if (isLoading) {
      return <div>Chargement...</div>;
    }

    switch (resourceName) {
      case 'clients':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                name="name"
                value={formData.name || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            {/* Autres champs spécifiques aux clients */}
          </>
        );

      case 'calls':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Numéro de téléphone</label>
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            {/* Autres champs spécifiques aux appels */}
          </>
        );

      default:
        return (
          <>
            {Object.entries(formData).map(([key, value]) => {
              if (key === 'id') return null;

              return (
                <div key={key} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </label>
                  {renderInputField(key, value)}
                </div>
              );
            })}
          </>
        );
    }
  };

  if (isLoading) {
    return <div className="p-8">Chargement...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 capitalize">
        {id ? `Modifier ${resourceName} #${id}` : `Nouveau ${resourceName}`}
      </h1>

      {renderFields()}

      <div className="flex space-x-4 mt-6">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {id ? 'Enregistrer' : 'Créer'}
        </button>
        <button
          type="button"
          onClick={() => router.push(`/admin/${resourceName}`)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
