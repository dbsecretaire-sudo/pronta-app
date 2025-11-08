// src/components/admin/ResourceEditForm.tsx
'use client';

import { useState, useEffect, ChangeEvent, JSX } from 'react';
import { useRouter } from 'next/navigation';
import { updateResource, getResourceById, createResource } from '@/src/lib/admin/api';
import { useServices } from '@/src/Hook/useServices';
import { useSession } from 'next-auth/react';
import { User } from '@/src/Types/Users';
import { fetchAllClients, fetchUsers } from '@/src/lib/api';
import { Client, CreateClient, ClientFormData, Address } from "@/src/lib/schemas/clients";

interface ResourceEditFormProps {
  resourceName: string;
  id?: number;
}

export function ResourceEditForm({ resourceName, id }: ResourceEditFormProps) {
  const { data: session, status } = useSession();
  const { s } = useServices(session?.user.id, status);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(!!id);
  const [users, setUsers] = useState<User[]>([]);
  const router = useRouter();
  
useEffect(() => {
    const initialize = async () => {
      try {
        // Charge les données initiales si c'est une édition
        if (id) {
          const data = await getResourceById(resourceName, id);
          // Normalise les données pour l'adresse
          const normalizedData = {
            ...data,
            address: data.address ? (
              typeof data.address === 'string' ?
                JSON.parse(data.address) :
                data.address
            ) : {
              street: '',
              city: '',
              postalCode: '',
              country: 'France'
            }
          };
          setFormData(normalizedData);
        } else {
          // Valeurs par défaut pour la création
          const defaults: Record<string, Partial<ClientFormData>> = {
            clients: {
              name: '',
              email: '',
              phone: '',
              company: '',
              address: {
                street: '',
                city: '',
                postalCode: '',
                country: 'France'
              }
            }
          };
          setFormData(defaults[resourceName] || {});
        }

        // Charge les utilisateurs et clients
        const [usersData] = await Promise.all([
          fetchUsers(),
        ]);
        setUsers(usersData);
      } catch (error) {
        console.error('Error initializing form:', error);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, [resourceName, id, session?.user.id]);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;

    // Gestion des checkboxes simples
    if (target.type === 'checkbox' && !name.endsWith('[]')) {
      setFormData(prev => ({ ...prev, [name]: target.checked }));
    }
    // Gestion des select multiples (ex: service_ids[])
    else if (target instanceof HTMLSelectElement && target.multiple) {
      const selectedOptions = Array.from(target.options)
        .filter((option) => option.selected)
        .map((option) => parseInt(option.value));

      setFormData((prev) => ({
        ...prev,
        [name.replace('[]', '')]: selectedOptions,
      }));
    }
    // Gestion des champs de type number
    else if (type === 'number') {
      setFormData(prev => ({ ...prev, [name]: value === '' ? 0 : parseInt(value) }));
    }
    // Gestion des champs d'adresse (ex: address.street)
    else if (name.startsWith('address.')) {
      const fieldName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        address: {
          ...prev.address,
          [fieldName]: value
        }
      }));
    }
    // Cas standard (text, email, etc.)
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Prépare les données à envoyer
      const dataToSend: CreateClient = {
        user_id: Number(formData.user_id),
        name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        company: formData.company || undefined
      };

      if (id) {
        await updateResource(resourceName, id, dataToSend);
      } else {
        const formDataToSend = new FormData();
        Object.entries(dataToSend).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            if (key === 'address' && typeof value === 'object') {
              formDataToSend.append(key, JSON.stringify(value));
            } else {
              formDataToSend.append(key, String(value));
            }
          }
        });
        await createResource(resourceName, undefined, formDataToSend);
      }
      router.push(`/admin/${resourceName}`);
      router.refresh();
    } catch (error) {
      console.error('Error saving resource:', error);
    }
  }

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
            <div>
              <label htmlFor="user_id" className="block mb-1">Utilisateur</label>
              <select
                id="user_id"
                name="user_id"
                className="w-full p-2 border rounded"
                defaultValue={formData.user_id || ''}
                required
              >
                <option value="">Sélectionnez un utilisateur</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.name} (ID: {user.id})
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                name="name"
                defaultValue={formData.name || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
            <label htmlFor="email" className="block mb-1">Email</label>
            <input type="email" id="email" name="email" className="w-full p-2 border rounded" defaultValue={formData.email || ''} onChange={handleChange} required />
          </div>
          <div>
            <label htmlFor="phone" className="block mb-1">Téléphone</label>
            <input type="text" id="phone" name="phone" className="w-full p-2 border rounded" defaultValue={formData.phone || ''} onChange={handleChange} required />
          </div>
          <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800">Adresse</h3>

            <div className="space-y-3">
              {/* Rue */}
              <div>
                <label htmlFor="street" className="block mb-1 text-sm font-medium text-gray-700">Rue*</label>
                <input
                  type="text"
                  id="street"
                  name="address.street"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue={formData.address.street || ''}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Code postal + Ville */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="postalCode" className="block mb-1 text-sm font-medium text-gray-700">Code postal*</label>
                  <input
                    type="text"
                    id="postalCode"
                    name="address.postalCode"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={formData.address.postalCode || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block mb-1 text-sm font-medium text-gray-700">Ville*</label>
                  <input
                    type="text"
                    id="city"
                    name="address.city"
                    className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={formData.address.city || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Pays */}
              <div>
                <label htmlFor="country" className="block mb-1 text-sm font-medium text-gray-700">Pays*</label>
                <input
                  type="text"
                  id="country"
                  name="address.country"
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
                  defaultValue={formData.address.country || ''}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Champ caché pour stocker l'objet complet */}
            <input
              type="hidden"
              name="address"
              value={formData.address ? JSON.stringify(formData.address) : ''}
            />
          </div>
          <div>
            <label htmlFor="company" className="block mb-1">Companie</label>
            <input type="text" id="company" name="company" className="w-full p-2 border rounded" defaultValue={formData.company || ''} onChange={handleChange} required />
          </div>
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
                defaultValue={formData.phoneNumber || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            {/* Autres champs spécifiques aux appels */}
          </>
        );

      case 'users':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                defaultValue={formData.email || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
              <input
                type="text"
                name="name"
                defaultValue={formData.name || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Rôle</label>
              <select
                name="role"
                defaultValue={formData.role || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="ADMIN">Administrateur</option>
                <option value="SECRETARY">Secrétaire</option>
                <option value="CLIENT">Client</option>
                <option value="SUPERVISOR">Superviseur</option>
              </select>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <input
                  type="checkbox"
                  name="can_write"
                  checked={Boolean(formData.can_write)}
                  onChange={handleChange}
                  className="mr-2 h-4 w-4 text-blue-600"
                />
                Peut écrire
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <input
                  type="checkbox"
                  name="can_delete"
                  checked={Boolean(formData.can_delete)}
                  onChange={handleChange}
                  className="mr-2 h-4 w-4 text-blue-600"
                />
                Peut supprimer
              </label>
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Services liés</label>
              <select
                name="service_ids[]"
                multiple
                defaultValue={formData.service_ids || []}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                {/* Les options seront ajoutées dynamiquement */}
                {s.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>

          {/* Autres champs pour les utilisateurs */}
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
