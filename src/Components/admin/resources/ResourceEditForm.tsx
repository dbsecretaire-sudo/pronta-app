// src/components/admin/ResourceEditForm.tsx
'use client';

import { useState, useEffect, ChangeEvent, JSX } from 'react';
import { useRouter } from 'next/navigation';
import { updateResource, getResourceById, createResource } from '@/src/lib/admin/api';
import { useServices } from '@/src/Hook/useServices';
import { useAuthCheck } from "@/src/Hook/useAuthCheck";
import { User, UserWithSubscriptions } from '@/src/lib/schemas/users';
import { createSubscription, fetchAllClients, fetchUsers, getSubscriptionByService, updateUserSubscription } from '@/src/lib/api';
import { TrashIcon } from '@heroicons/react/16/solid';
import { Invoice, CreateInvoice, InvoiceItem, CreateInvoiceSchema } from '@/src/lib/schemas/invoices';
import { Client, CreateClient, ClientFormData, Address, CreateClientSchema } from "@/src/lib/schemas/clients";
import { CreateUser, CreateUserSchema, PaymentMethod } from '@/src/lib/schemas/users';
import { CreateCall, CreateCallSchema } from '@/src/lib/schemas/calls';
import { CreateService, CreateServiceSchema } from '@/src/lib/schemas/services';
import { CreateCalendarEvent, CreateCalendarEventSchema } from '@/src/lib/schemas/calendar';
import { z } from "zod";
import { CreateSubscription, CreateSubscriptionSchema } from '@/src/lib/schemas/subscription';

interface ResourceEditFormProps {
  resourceName: string;
  id?: number;
}

type CreateResourceData =
  | CreateClient
  | CreateInvoice
  | CreateUser
  | CreateCall
  | CreateService
  | CreateCalendarEvent
  | CreateSubscription
  | Record<string, any>;

export function ResourceEditForm({ resourceName, id }: ResourceEditFormProps) {
  const { data: session, status } = useAuthCheck();

  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const userIdVerified = isAuthChecked && status === 'authenticated' ? session?.id : undefined;

    // Attendre que l'authentification soit vérifiée
  useEffect(() => {
    if (status !== 'loading') {
      setIsAuthChecked(true);
    }
  }, [status]);

  const { s } = useServices(userIdVerified, status);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(!!id);
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const router = useRouter();
  const [errors, setErrors] = useState<{ duration?: string }>({});

  const now = new Date();
  const nextDate = new Date(now);
  nextDate.setMonth(now.getMonth() + 1);
  const endDate = new Date(now);
  endDate.setFullYear(now.getFullYear() + 1);

  useEffect(() => {
  const initialize = async () => {
    try {
      if (id) {
        const data = await getResourceById(resourceName, id);
        const normalizedData = {
          ...data,
          address: data.address ?
            (typeof data.address === 'string' ? JSON.parse(data.address) : data.address) :
            { street: '', city: '', postalCode: '', country: 'France' },
          billing_address: data.billing_address ?
            (typeof data.billing_address === 'string' ? JSON.parse(data.billing_address) : data.billing_address) :
            { street: '', city: '', postalCode: '', country: 'France' },
          payment_method: data.payment_method ?
            (typeof data.payment_method === 'string' ? JSON.parse(data.payment_method) : data.payment_method) :
            {
              type: "", // Type par défaut
              details: {
                card_number: "",
                card_last_four: "",
                card_brand: "",
                paypal_email: "",
              }
            },
          service_ids: data.service_ids ? data.service_ids : [],
          removedServiceIds: [],

        };
        setFormData(normalizedData);
      } else {
        // Valeurs par défaut pour la création
        const defaults: Record<string, any> = {
          clients: {
            name: '',email: '',phone: '',company: '',address: {street: '',city: '',postalCode: '',country: 'France'}
          },
          users: {email: '',name: '',role: '',can_write: false,can_delete: false,
            billing_address: {street: '',city: '',postalCode: '',country: 'France'},
            payment_method: {type: "",
              details: {
                card_number: "",
                card_last_four: "",
                card_brand: "",
                paypal_email: "",
              }
            },
            service_ids: [],
            removedServiceIds: [],
          },
          // Ajoutez d'autres ressources si nécessaire
        };
        setFormData(defaults[resourceName] || {});
      }
      // Charge les utilisateurs et clients
      const [usersData, clientsData] = await Promise.all([
        fetchUsers(session?.accessToken ?? null),
        fetchAllClients(session?.accessToken ?? null),
      ]);
      setUsers(usersData);
      setClients(clientsData);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  };
  initialize();
}, [resourceName, id, userIdVerified]);

  useEffect(() => {
    if (formData.duration !== undefined && formData.duration !== '') {
      const durationStr = String(formData.duration);
      if (!/^[0-5]?[0-9]:[0-5][0-9]$/.test(durationStr) &&
          typeof formData.duration !== 'number') {
        setErrors(prev => ({ ...prev, duration: 'Format MM:SS requis (ex: 03:20)' }));
      } else {
        setErrors(prev => ({ ...prev, duration: undefined }));
      }
    }
  }, [formData.duration]);

  function formatSecondsToMMSS(seconds: number | string | undefined): string {
    if (!seconds) return '';
    const numSeconds = typeof seconds === 'string' ? parseInt(seconds) : seconds;
    if (isNaN(numSeconds)) return '';

    const minutes = Math.floor(numSeconds / 60);
    const remainingSeconds = numSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  }

  // Convertit "MM:SS" en secondes (pour la soumission)
  function parseMMSSToSeconds(mmss: string): number {
    const [minutes, seconds] = mmss.split(':').map(Number);
    return (minutes || 0) * 60 + (seconds || 0);
  }

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    const target = e.target as HTMLInputElement;

    // Gestion des checkboxes multiples
    if (type === "checkbox" && name === "service_ids[]") {
      const serviceId = parseInt(value, 10);
      setFormData((prev) => {
        const updatedServiceIds = target.checked
          ? [...prev.service_ids, serviceId] // Ajoute l'ID
          : prev.service_ids.filter((id: number) => id !== serviceId); // Retire l'ID

        // Met à jour les services retirés
        const removedServiceIds = target.checked
          ? prev.removedServiceIds?.filter((id: number) => id !== serviceId) // Retire de la liste des retirés si coché
          : [...(prev.removedServiceIds || []), serviceId]; // Ajoute à la liste des retirés si décoché

        return {
          ...prev,
          service_ids: updatedServiceIds,
          removedServiceIds: removedServiceIds,
        };
      });
    }
    // Gestion des select multiples (ex: service_ids[])
    // else if (target instanceof HTMLSelectElement && target.multiple) {
    //   const selectedOptions = Array.from(target.options)
    //     .filter((option) => option.selected)
    //     .map((option) => parseInt(option.value));

    //   setFormData((prev) => ({
    //     ...prev,
    //     [name.replace('[]', '')]: selectedOptions,
    //   }));
    // }
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
    // Gestion des décimales
    else if (target.name === "amount" || target.name === "unit_price" ){
      setFormData(prev => ({ ...prev, [name]: value === '' ? 0.00 : parseFloat(value) }));
    }
    // Gestion des durées
    else  if (name === 'duration') {
    // Si l'utilisateur saisit "3", on le transforme en "03:00" après 2 caractères
      if (value.length === 2 && !value.includes(':') && !isNaN(Number(value))) {
        const minutes = value.padStart(2, '0');
        setFormData(prev => ({
          ...prev,
          duration: parseMMSSToSeconds(`${minutes}:00`),
        }));
        return;
      }

      // Sinon, mise à jour normale
      setFormData(prev => ({
        ...prev,
        [name]: value.includes(':')
          ? parseMMSSToSeconds(value)
          : value, // Garde la string si incomplète
      }));
    }
    // Gestion des champs d'adresse (ex: address.street)
    else if (name.startsWith('billing_address.')) {
      const fieldName = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        billing_address: {
          ...prev.billing_address,
          [fieldName]: value
        }
      }));
    }
    //Gestion des modes de paiements
    else if (name === "payment_method.type") {
      setFormData(prev => ({
        ...prev,
        payment_method: {
          ...prev.payment_method,
          type: value
        }
      }));
    }

  else if (name.startsWith('payment_method.details.')) {
    const fieldName = name.split('.')[2]; // Ex: "card_number"
    setFormData(prev => ({
      ...prev,
      payment_method: {
        ...prev.payment_method,
        details: {
          ...prev.payment_method.details,
          [fieldName]: value, // Met à jour le sous-champ spécifique
        }
      }
    }));
  }
    // Cas standard (text, email, etc.)
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...formData.items];
    newItems[index] = { ...newItems[index], [field]: value };

    // Recalcule le total de l'item
    if (field === 'quantity' || field === 'unit_price') {
      newItems[index].total = newItems[index].quantity * newItems[index].unit_price;
    }

    // Met à jour le state
    setFormData({
      ...formData,
      items: newItems,
      amount: newItems.reduce((sum, item) => sum + (item.total || 0), 0) // Recalcule le montant total
    });
  };

// Fonction pour ajouter un nouvel item
const addItem = () => {
  setFormData({
    ...formData,
    items: [
      ...formData.items,
      { description: '', quantity: 1, unit_price: 0, total: 0 }
    ]
  });
};

// Fonction pour supprimer un item
const removeItem = (index: number) => {
  const newItems = [...formData.items];
  newItems.splice(index, 1);
  setFormData({
    ...formData,
    items: newItems,
    amount: newItems.reduce((sum, item) => sum + (item.total || 0), 0) // Recalcule le montant total
  });
};

const getCreateSchema = (resourceName: string) => {
  switch (resourceName) {
    case 'clients':
      return CreateClientSchema;
    case 'invoices':
      return CreateInvoiceSchema;
    case 'users':
      return CreateUserSchema;
    case 'calls':
      return CreateCallSchema;
    case 'services' :
      return CreateServiceSchema;
    case 'calendar' :
      return CreateCalendarEventSchema;
    case 'subscriptions' :
      return CreateSubscriptionSchema
    default:
      throw new Error(`No schema defined for resource: ${resourceName}`);
  }
};
const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  try {
    // 1. Obtiens le schéma correspondant (si tu utilises Zod)
    const createSchema = getCreateSchema(resourceName);

    // 2. Prépare les données selon le type de ressource
    let dataToSend: CreateResourceData = {};

    // Clients
    if (resourceName === 'clients') {
      dataToSend = {
        user_id: formData.user_id.toString(),
        name: formData.name || '',
        email: formData.email || '',
        phone: formData.phone || undefined,
        address: formData.address || undefined,
        company: formData.company || undefined,
      };
    }
    // Factures
    else if (resourceName === 'invoices') {
      // Valide et formate la date
      const dueDate = formData.due_date ?
        new Date(formData.due_date).toISOString() :
        new Date().toISOString();

      // Calcule le montant total
      const totalAmount = formData.items?.reduce(
        (sum: number, item: any) => sum + (item.quantity * item.unit_price),
        0
      ) || 0;

      dataToSend = {
        user_id: formData.user_id.toString(),
        client_id: formData.client_id.toString(),
        client_name: formData.client_name || '',
        amount: totalAmount.toString(),
        status: formData.status || 'draft',
        due_date: dueDate,
        items: formData.items || [],
      };
    }
      // Utilisateurs
    if (resourceName === 'users') {
      // Récupère les services cochés
      const selectedServiceIds = formData.service_ids || [];
      const removedServiceIds = formData.removedServiceIds || [];

      // Pour chaque service coché, vérifie s'il existe déjà une subscription
      const updatedSubscriptions = await Promise.all([
        // Met à jour les abonnements des services cochés
        ...selectedServiceIds.map(async (serviceId: number) => {
          const existingSubscription = await getSubscriptionByService(formData.id, serviceId);
          if (existingSubscription) {
            return await updateUserSubscription(existingSubscription.id, {
              user_id: formData.id,
              service_id: serviceId,
              status: 'active', // Statut actif si le service est coché
              start_date: formData.user_subscriptions?.find((sub: {service_id: number}) => sub.service_id === serviceId)?.start_date || new Date().toISOString().split('T')[0],
              end_date: formData.user_subscriptions?.find((sub: {service_id: number}) => sub.service_id === serviceId)?.end_date || endDate.toISOString().split('T')[0],
              next_payment_date: formData.user_subscriptions?.find((sub: {service_id: number}) => sub.service_id === serviceId)?.next_payment_date || nextDate.toISOString().split('T')[0],
            });
          } else {
            return await createSubscription({
              user_id: formData.id,
              service_id: serviceId,
              status: 'active', // Statut actif pour les nouveaux abonnements
              start_date: new Date().toISOString().split('T')[0],
              end_date: endDate.toISOString().split('T')[0],
              next_payment_date: nextDate.toISOString().split('T')[0],
            });
          }
        }),
        // Désactive les abonnements des services retirés
        ...removedServiceIds.map(async (serviceId: number) => {
          const existingSubscription = await getSubscriptionByService(formData.id, serviceId);
          if (existingSubscription) {
            return await updateUserSubscription(existingSubscription.id, {
              user_id: formData.id,
              service_id: serviceId,
              status: 'cancelled', // Statut inactif si le service est retiré
              end_date: new Date().toISOString().split('T')[0], // Met fin aujourd'hui
            });
          }
          return null;
        }).filter(Boolean), // Filtre les valeurs null
      ]);

      // Prépare les données à envoyer
      dataToSend = {
        email: formData.email || '',
        name: formData.name || '',
        role: formData.role || '',
        can_write: Boolean(formData.can_write),
        can_delete: Boolean(formData.can_delete),
        billing_address: typeof formData.billing_address === 'string' ? JSON.parse(formData.billing_address) : formData.billing_address,
        payment_method: typeof formData.payment_method === 'string' ? JSON.parse(formData.payment_method) : formData.payment_method,
        service_ids: selectedServiceIds, // Utilise les IDs des services cochés
        user_subscriptions: updatedSubscriptions, // Ajoute les subscriptions mises à jour/créées
      };
    }
    // Appels
    else if (resourceName === 'calls') {
      dataToSend = {
        user_id: formData.user_id.toString(),
        name: formData.name || '',
        phone: formData.phone || '',
        phone_number: formData.phone_number || formData.phone || '', // Utilise phone_number ou phone
        date: formData.date ? new Date(formData.date).toISOString() : new Date().toISOString(),
        type: formData.type || '',
        summary: formData.summary || '',
        duration: formData.duration,
        contact_name: formData.contact_name || '',
        client_id: formData.client_id.toString(),
      };
    }
    // Services
    else if (resourceName === 'services'){
      dataToSend = {
        name: formData.name,
        description: formData.description,
        route: formData.route,
        icon: formData.icon,
        price: formData.price,
        unit: formData.unit,
        is_active: formData.is_active,
      }
    }
    // Calendar
    else if (resourceName === 'calendar'){
      dataToSend = {
        user_id : formData.user_id.toString(),
        title:  formData.title,
        start_time: formData.start_time ? new Date(formData.start_time).toISOString() : new Date().toISOString(),
        end_time: formData.end_time ? new Date(formData.end_time).toISOString() : new Date().toISOString(),
        description: formData.description,
      }
    }
    // Subscriptions
    else if (resourceName === 'subscriptions') {
      dataToSend = {
        user_id: Number(formData.user_id),
        service_id: Number(formData.service_id),
        status: formData.status,
        start_date: formData.start_date,
        end_date: formData.end_date,
        next_payment_date: formData.next_payment_date,
      }
    }
    // Autres ressources
    else {
      dataToSend = { ...formData };
    }

    // 3. Valide les données avec Zod (si tu utilises la validation)
    if (createSchema) {
      const validatedData = createSchema.parse(dataToSend);
      dataToSend = validatedData;
    }

    // 4. Soumets les données
    if (id) {
      // Mise à jour
      await updateResource(resourceName, id, dataToSend);
    } else {
      // Création
      if (resourceName === 'clients') {
        // Pour les clients, utilise FormData
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
    }

    // 5. Redirige après succès
    router.push(`/admin/${resourceName}`);
    router.refresh();
  } catch (error) {

    // Affiche une erreur à l'utilisateur
    if (error instanceof Error) {
      alert(error.message);
    } else {
      alert('Une erreur est survenue');
    }
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
            <div>
              <label htmlFor="user_id" className="block mb-1">Utilisateur</label>
              <select
                id="user_id"
                name="user_id"
                className="w-full p-2 border rounded"
                defaultValue={formData.user_id || ''}  // Convertir en chaîne
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez un utilisateur</option>
                {users.filter((user) => user.role === "CLIENT").sort((a, b) => a.id - b.id).map((user) => (
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
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                  className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Utilisateur</label>
              <select
                name="user_id"
                defaultValue={formData.user_id || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Sélectionnez un utilisateur</option>
                {users
                  .filter(user => ['ADMIN', 'SECRETARY', 'SUPERVISOR'].includes(user.role))
                  .map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <select
                name="client_id"
                defaultValue={formData.client_id || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Sélectionnez un client</option>
                {users
                  .filter(user => ['CLIENT'].includes(user.role))
                  .map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
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
              <label htmlFor="phone" className="block mb-1">Numéro de téléphone</label>
              <input type="text" id="phone" name="phone" className="w-full p-2 border rounded" defaultValue={formData.phone || ''} onChange={handleChange} required />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du contact</label>
              <input
                type="text"
                name="contact_name"
                defaultValue={formData.contact_name || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
              <input
                type="datetime-local"
                name="date"
                defaultValue={formData.date ? new Date(formData.date).toISOString().slice(0, 16) : ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="type" className="block mb-1">Type</label>
              <select
                id="type"
                name="type"
                className="w-full p-2 border rounded"
                defaultValue={formData.type || ''}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez un type</option>
                <option value="incoming">Entrant</option>
                <option value="outgoing">Sortant</option>
                <option value="missed">Manqué</option>
              </select>
            </div>
            <div>
              <label htmlFor="summary" className="block mb-1">Résumé</label>
              <input type="text" id="summary" name="summary" className="w-full p-2 border rounded" defaultValue={formData.summary || ''} onChange={handleChange} required />
            </div>
            <div>
              <label htmlFor="duration" className="block mb-1">
                Durée <span className="text-gray-500 text-xs">(format MM:SS, ex: 03:20 pour 3 minutes et 20 secondes)</span>
              </label>
              <input
                type="text"
                id="duration"
                name="duration"
                className={`w-full p-2 border rounded ${errors.duration ? 'border-red-500' : ''}`}
                defaultValue={formatSecondsToMMSS(formData.duration)} // Affiche au format MM:SS
                onChange={handleChange}
                placeholder="Ex: 03:20"
                pattern="^[0-9]{1,2}(:[0-5][0-9])?$"
                required
              />
              {errors.duration && (
                <p className="mt-1 text-sm text-red-600">
                  Format invalide. Utilisez MM:SS (ex: 03:20).
                </p>
              )}
            </div>
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
                <option value="MODERATOR">Modérateur</option>
                <option value="SUPERVISOR">Superviseur</option>
              </select>
            </div>
            <div className="space-y-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h3 className="text-lg font-semibold text-blue-800">Adresse de facturation</h3>

            <div className="space-y-3">
              {/* Rue */}
              <div>
                <label htmlFor="street" className="block mb-1 text-sm font-medium text-gray-700">Rue*</label>
                <input
                  type="text"
                  id="street"
                  name="billing_address.street"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  defaultValue={formData.billing_address.street || ''}
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
                    name="billing_address.postalCode"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={formData.billing_address.postalCode || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block mb-1 text-sm font-medium text-gray-700">Ville*</label>
                  <input
                    type="text"
                    id="city"
                    name="billing_address.city"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    defaultValue={formData.billing_address.city || ''}
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
                  name="billing_address.country"
                  className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
                  defaultValue={formData.billing_address.country || ''}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Champ caché pour stocker l'objet complet */}
            <input
              type="hidden"
              name="billing_address"
              value={formData.billing_address ? JSON.stringify(formData.billing_address) : ''}
            />
          </div>

            <div>
              <label htmlFor="payment_method.type" className="block mb-1">Méthode de paiement</label>
              <select
                id="payment_method.type"
                name="payment_method.type"
                value={formData?.payment_method?.type || ""}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Sélectionnez un type</option>
                <option value="credit_card">Carte de crédit</option>
                <option value="paypal">Paypal</option>
                <option value="bank_transfer">Virement bancaire</option>
                <option value="other">Autre</option>
              </select>
            </div>

            {/* Sous-champs pour la carte de crédit */}
            {formData.payment_method.type === "credit_card" && (
              <div className="mt-2">
                <label htmlFor="payment_method.details.card_number" className="block mb-1">Numéro de carte</label>
                <input
                  type="text"
                  id="payment_method.details.card_number"
                  name="payment_method.details.card_number"
                  defaultValue={formData.payment_method?.details?.card_number || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="1234 5678 9012 3456"
                />
                <label htmlFor="payment_method.details.card_last_four" className="block mb-1">4 derniers chiffres</label>
                <input
                  type="text"
                  id="payment_method.details.card_last_four"
                  name="payment_method.details.card_last_four"
                  defaultValue={formData.payment_method?.details?.card_last_four || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="3456"
                />
                <label htmlFor="payment_method.details.card_brand" className="block mb-1">Marque de la carte</label>
                <input
                  type="text"
                  id="payment_method.details.card_brand"
                  name="payment_method.details.card_brand"
                  defaultValue={formData.payment_method?.details?.card_brand || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="Visa, Mastercard, etc."
                />
              </div>
            )}

            {/* Sous-champs pour PayPal */}
            {formData.payment_method.type === "paypal" && (
              <div className="mt-2">
                <label htmlFor="payment_method.details.paypal_email" className="block mb-1">Email PayPal</label>
                <input
                  type="email"
                  id="payment_method.details.paypal_email"
                  name="payment_method.details.paypal_email"
                  defaultValue={formData.payment_method?.details?.paypal_email || ""}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  placeholder="votre@email.com"
                />
              </div>
            )}

            {/* Champ caché pour stocker l'objet complet */}
            <input
              type="hidden"
              name="payment_method"
              value={formData.payment_method ? JSON.stringify(formData.payment_method) : ''}
            />
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
              <div className="space-y-2">
                {s.map((service) => (
                  <div key={service.id} className="flex items-center">
                    <input
                      type="checkbox"
                      id={`service_${service.id}`}
                      name="service_ids[]"
                      value={service.id}
                      checked={formData.service_ids?.includes(service.id) || false}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor={`service_${service.id}`} className="ml-2 text-sm text-gray-700">
                      {service.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>
        </>
      );

      case 'invoices':
        return (
          <>
            {/* Champ Utilisateur */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Utilisateur</label>
              <select
                name="user_id"
                defaultValue={formData.user_id || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Sélectionnez un utilisateur</option>
                {users
                  .filter(user => ['ADMIN', 'SECRETARY', 'SUPERVISOR'].includes(user.role))
                  .map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
              </select>
            </div>

            {/* Champ Client */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <select
                name="client_id"
                defaultValue={formData.client_id || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Sélectionnez un client</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.email})
                  </option>
                ))}
              </select>
            </div>

            {/* Champ Nom du client */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Nom du client</label>
              <input
                type="text"
                name="client_name"
                defaultValue={formData.client_name || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Champ Montant */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Montant (€)</label>
              <input
                type="number"
                name="amount"
                step="0.01"
                value={formData.amount || 0}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
                readOnly // Le montant est calculé automatiquement
              />
            </div>

            {/* Champ Statut */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
              <select
                name="status"
                defaultValue={formData.status || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Sélectionnez un statut</option>
                <option value="draft">Brouillon</option>
                <option value="sent">Envoyée</option>
                <option value="paid">Payée</option>
                <option value="cancelled">Annulée</option>
                <option value="overdue">En retard</option>
              </select>
            </div>

            {/* Champ Date d'échéance */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date d'échéance</label>
              <input
                type="datetime-local"
                name="due_date"
                defaultValue={formData.due_date ? new Date(formData.due_date).toISOString().slice(0, 16) : ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Section des items de facture */}
            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-3">Items de la facture</label>

              {/* Vérifie que formData.items existe et est un tableau */}
              {formData.items?.length > 0 ? (
                formData.items.map((item: InvoiceItem, index: number) => (
                  <div key={item.id || index} className="p-4 mb-4 border rounded-lg bg-white">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      {/* Description */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                        <input
                          type="text"
                          name={`items[${index}].description`}
                          value={item.description || ''}
                          onChange={(e) => handleItemChange(index, 'description', e.target.value)}
                          className="w-full p-2 border rounded"
                          required
                        />
                      </div>

                      {/* Quantité */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Quantité</label>
                        <input
                          type="number"
                          name={`items[${index}].quantity`}
                          value={item.quantity || 1}
                          onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                          className="w-full p-2 border rounded"
                          min="1"
                          required
                        />
                      </div>

                      {/* Prix unitaire */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Prix unitaire (€)</label>
                        <input
                          type="number"
                          name={`items[${index}].unit_price`}
                          step="0.01"
                          value={item.unit_price || 0}
                          onChange={(e) => handleItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)}
                          className="w-full p-2 border rounded"
                          min="0"
                          required
                        />
                      </div>

                      {/* Total (calculé automatiquement) */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Total (€)</label>
                        <input
                          type="number"
                          name={`items[${index}].total`}
                          step="0.01"
                          value={(item.quantity || 1) * (item.unit_price || 0)}
                          readOnly
                          className="w-full p-2 border rounded bg-gray-100"
                        />
                      </div>
                    </div>

                    {/* Bouton pour supprimer l'item */}
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="mt-2 text-sm text-red-600 hover:text-red-900 flex items-center"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" /> Supprimer
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500">Aucun item trouvé.</p>
              )}

              {/* Bouton pour ajouter un nouvel item */}
              <button
                type="button"
                onClick={addItem}
                className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
              >
                + Ajouter un item
              </button>
            </div>

            {/* Champ caché pour les items (pour la soumission) */}
            <input
              type="hidden"
              name="items"
              value={JSON.stringify(formData.items || [])}
            />
          </>
        );
   
      case 'services':
        return (
          <>
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                name="description"
                defaultValue={formData.description || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Route</label>
              <input
                type="text"
                name="route"
                defaultValue={formData.route || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Icon</label>
              <input
                type="text"
                name="icon"
                defaultValue={formData.icon || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Prix</label>
              <input
                type="number"
                name="price"
                defaultValue={formData.price || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div>
              <label htmlFor="unit" className="block mb-1">Unité</label>
              <select
                id="unit"
                name="unit"
                className="w-full p-2 border rounded"
                defaultValue={formData.unit || ''}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez une unité</option>
                <option value="appel">Appel</option>
                <option value="heure">Heure</option>
                <option value="jour">Jour</option>
                <option value="semaine">Semaine</option>
                <option value="mois">Mois</option>
                <option value="année">Année</option>
                <option value="projet">Projet</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={Boolean(formData.is_active)}
                  onChange={handleChange}
                  className="mr-2 h-4 w-4 text-blue-600"
                />
                Actif
              </label>
            </div>
          </>
        );

      case 'calendar':
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <select
                name="user_id"
                defaultValue={formData.user_id || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Sélectionnez un client</option>
                {users
                  // .filter(user => ['CLIENT'].includes(user.role))
                  .map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Titre</label>
              <input
                type="text"
                name="title"
                defaultValue={formData.title || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
              <input
                type="datetime-local"
                name="start_time"
                defaultValue={formData.start_time ? new Date(formData.start_time).toISOString().slice(0, 16) : ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <input
                type="datetime-local"
                name="end_time"
                defaultValue={formData.end_time ? new Date(formData.end_time).toISOString().slice(0, 16) : ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                name="description"
                defaultValue={formData.description || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          </>
        );

      case 'subscriptions' :
        return (
          <>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Client</label>
              <select
                name="user_id"
                defaultValue={formData.user_id || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Sélectionnez un client</option>
                {users
                  .map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Service</label>
              <select
                name="service_id"
                defaultValue={formData.service_id || ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              >
                <option value="">Sélectionnez un service</option>
                {s.map((service) => (
                  <option key={service.id} value={service.id}>
                    {service.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block mb-1">Statut</label>
              <select
                id="status"
                name="status"
                className="w-full p-2 border rounded"
                defaultValue={formData.status || ''}
                onChange={handleChange}
                required
              >
                <option value="">Sélectionnez un statut</option>
                <option value="active">Actif</option>
                <option value="paid">Payé</option>
                <option value="overdue">En retard</option>
                <option value="cancelled">Annulé</option>
                <option value="pending">Suspendu</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de début</label>
              <input
                type="datetime-local"
                name="start_date"
                defaultValue={formData.start_date ? new Date(formData.start_date).toISOString().slice(0, 16) : ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date de fin</label>
              <input
                type="datetime-local"
                name="end_date"
                defaultValue={formData.end_date ? new Date(formData.end_date).toISOString().slice(0, 16) : ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">Date du prochain paiement</label>
              <input
                type="datetime-local"
                name="next_payment_date"
                defaultValue={formData.next_payment_date ? new Date(formData.next_payment_date).toISOString().slice(0, 16) : ''}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
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
