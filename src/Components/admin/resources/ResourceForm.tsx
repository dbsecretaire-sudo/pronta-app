// components/ResourceForm.tsx
'use client';
import { useActionState, useEffect, useState } from 'react';
import { createResource } from '@/app/actions/admin';
import { fetchAllClients, fetchUsers } from '@/src/lib/api';
import { User } from '@/src/Types/Users';
import { Client } from '@/src/Types/Clients';
import { useServices } from '@/src/Hook/useServices';
import { useSession } from 'next-auth/react';
import { TrashIcon } from '@heroicons/react/16/solid';

interface ResourceFormProps {
  resource: string;
}

export default function ResourceForm({ resource }: ResourceFormProps) {
  const [state, formAction] = useActionState( createResource.bind(null, resource), {});
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const { data, status } = useSession();
  const {s, sN} = useServices(data?.user.id, status);

  const [items, setItems] = useState([
    { description: '', quantity: 1, unit_price: 0, total: 0 }
  ]);

  // Fonctions pour gérer les items
  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, unit_price: 0, total: 0 }]);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const updateItem = (index: number, field: string, value: string | number) => {
    const newItems = [...items];
    if (field === 'quantity' || field === 'unit_price') {
      value = parseFloat(value.toString()) || 0;
    }
    newItems[index] = { ...newItems[index], [field]: value };
    newItems[index].total = newItems[index].quantity * newItems[index].unit_price;
    setItems(newItems);
  };

  // Met à jour le montant total quand les items changent
  useEffect(() => {
    if (resource === 'invoices') {
      const totalAmount = items.reduce((sum, item) => sum + item.total, 0);
      const amountInput = document.getElementById('amount') as HTMLInputElement;
      if (amountInput) {
        amountInput.value = totalAmount.toFixed(2);
      }
    }
  }, [items, resource]);

  useEffect(() => {
    const loader = async () => {
      const data = await fetchUsers();
      const dataClients = await fetchAllClients();
      setUsers(data);
      setClients(dataClients);
    }
    loader();
  }, []);

  return (
    <form action={formAction} className="space-y-4">
      {resource === 'clients' && (
        <>
          <div>
            <label htmlFor="user_id" className="block mb-1">Utilisateur</label>
            <select
              id="user_id"
              name="user_id"
              className="w-full p-2 border rounded"
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
          <div>
            <label htmlFor="name" className="block mb-1">Nom</label>
            <input type="text" id="name" name="name" className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label htmlFor="email" className="block mb-1">Email</label>
            <input type="email" id="email" name="email" className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label htmlFor="phone" className="block mb-1">Téléphone (min 5 caractères)</label>
            <input type="text" id="phone" name="phone" className="w-full p-2 border rounded" required />
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
                  name="street"
                  className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ex: 123 Rue de Paris"
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
                    name="postalCode"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: 75000"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="city" className="block mb-1 text-sm font-medium text-gray-700">Ville*</label>
                  <input
                    type="text"
                    id="city"
                    name="city"
                    className="w-full p-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ex: Paris"
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
                  name="country"
                  className="w-full p-2 border rounded-md bg-gray-100"
                  defaultValue="France"
                  required
                />
              </div>
            </div>

            {/* Champ caché pour stocker l'objet complet */}
            <input type="hidden" name="address" value="" />
          </div>
          <div>
            <label htmlFor="company" className="block mb-1">Companie</label>
            <input type="text" id="company" name="company" className="w-full p-2 border rounded" required />
          </div>
        </>
      )} 
      
      {resource === 'calls' && (
        <>
          <div>
            <label htmlFor="user_id" className="block mb-1">Utilisateur</label>
            <select
              id="user_id"
              name="user_id"
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Sélectionnez un utilisateur</option>
              {/* Options pour les utilisateurs avec rôle ADMIN, SECRETARY ou SUPERVISOR */}
              {users
                .filter(user => ['ADMIN', 'SECRETARY', 'SUPERVISOR'].includes(user.role))
                .map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label htmlFor="client_id" className="block mb-1">Client</label>
            <select
              id="client_id"
              name="client_id"
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Sélectionnez un client</option>
              {/* Options pour les utilisateurs avec rôle CLIENT */}
              {users
                .filter(user => user.role === 'CLIENT')
                .map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label htmlFor="name" className="block mb-1">Nom</label>
            <input type="text" id="name" name="name" className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label htmlFor="phone" className="block mb-1">Téléphone</label>
            <input type="text" id="phone" name="phone" className="w-full p-2 border rounded" required />
          </div>

          {/* <div>
            <label htmlFor="phoneNumber" className="block mb-1">Téléphone 2</label>
            <input type="text" id="phoneNumber" name="phoneNumber" className="w-full p-2 border rounded" required />
          </div> */}

          <div>
            <label htmlFor="contact_name" className="block mb-1">Nom du contact</label>
            <input type="text" id="contact_name" name="contact_name" className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label htmlFor="date" className="block mb-1">Date</label>
            <input type="datetime-local" id="date" name="date" className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label htmlFor="type" className="block mb-1">Type</label>
            <select
              id="type"
              name="type"
              className="w-full p-2 border rounded"
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
            <input type="text" id="summary" name="summary" className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label htmlFor="duration" className="block mb-1">Durée (en secondes)</label>
            <input 
              type="string" 
              id="duration" 
              name="duration" 
              className="w-full p-2 border rounded" 
              placeholder="Ex: 03:20"
              pattern="[0-5][0-9]:[0-5][0-9]" // Valide le format MM:SS
              required 
            />
          </div>
          
        </>
      )}

      {resource === 'services' && (
        <>
          <div>
            <label htmlFor="name" className="block mb-1">Nom</label>
            <input type="text" id="name" name="name" className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label htmlFor="description" className="block mb-1">Description</label>
            <input type="text" id="description" name="description" className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label htmlFor="route" className="block mb-1">Route</label>
            <input type="text" id="route" name="route" className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label htmlFor="icon" className="block mb-1">Icon</label>
            <input type="text" id="icon" name="icon" className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label htmlFor="price" className="block mb-1">Prix (€)</label>
            <input
              type="number"
              id="price"
              name="price"
              step="0.01"  
              min="0"      
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
        </>
      )}

      {resource === 'calendar' && (
        <>
          <div>
            <label htmlFor="user_id" className="block mb-1">Utilisateur</label>
            <select
              id="user_id"
              name="user_id"
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Sélectionnez un utilisateur</option>
              {/* Options pour les utilisateurs avec rôle ADMIN, SECRETARY ou SUPERVISOR */}
              {users
                .map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor="title" className="block mb-1">Titre</label>
            <input type="text" id="title" name="title" className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label htmlFor="start_time" className="block mb-1">Date de départ</label>
            <input type="datetime-local" id="start_time" name="start_time" className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label htmlFor="end_time" className="block mb-1">Date de fin</label>
            <input type="datetime-local" id="end_time" name="end_time" className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label htmlFor="description" className="block mb-1">Description</label>
            <input type="text" id="description" name="description" className="w-full p-2 border rounded" required />
          </div>
        </>
      )}

      {resource === 'invoices' && (
        <>
          <div>
            <label htmlFor="user_id" className="block mb-1">Utilisateur</label>
            <select
              id="user_id"
              name="user_id"
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
          <div>
            <label htmlFor="client_id" className="block mb-1">Client représenté</label>
            <select
              id="client_id"
              name="client_id"
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Sélectionnez un client</option>
              {clients.map((client: Client) => (
                <option key={client.id} value={client.id}>
                  {client.name} ({client.email})
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="client_name" className="block mb-1">Nom à facturer</label>
            <input type="text" id="client_name" name="client_name" className="w-full p-2 border rounded" required />
          </div>
         <div>
            <label htmlFor="amount" className="block mb-1">Montant (€)</label>
            {/* Champ visible (readOnly) */}
            <input
              type="number"
              id="amount_display"
              className="w-full p-2 border rounded"
              step="0.01"
              readOnly
              value={items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
            />
            {/* Champ caché (pour la soumission) */}
            <input
              type="hidden"
              id="amount"
              name="amount"
              value={items.reduce((sum, item) => sum + item.total, 0).toFixed(2)}
            />
          </div>
          <div>
            <label htmlFor="status" className="block mb-1">Statut</label>
            <select
              id="status"
              name="status"
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
          <div>
            <label htmlFor="due_date" className="block mb-1">Date d'échéance</label>
            <input type="datetime-local" id="due_date" name="due_date" className="w-full p-2 border rounded" required />
          </div>

          {/* Section des items de facture */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <label className="block mb-3 font-medium text-gray-700">Items de la facture</label>
            <div className="space-y-4">
              {items.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg bg-white">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label htmlFor={`items[${index}].description`} className="block mb-1 text-sm font-medium text-gray-700">Description*</label>
                      <input
                        type="text"
                        id={`items[${index}].description`}
                        name={`items[${index}].description`}
                        value={item.description}
                        onChange={(e) => updateItem(index, 'description', e.target.value)}
                        className="w-full p-2 border rounded-md"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor={`items[${index}].quantity`} className="block mb-1 text-sm font-medium text-gray-700">Quantité*</label>
                      <input
                        type="number"
                        id={`items[${index}].quantity`}
                        name={`items[${index}].quantity`}
                        value={item.quantity}
                        onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                        className="w-full p-2 border rounded-md"
                        min="1"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor={`items[${index}].unit_price`} className="block mb-1 text-sm font-medium text-gray-700">Prix unitaire (€)*</label>
                      <input
                        type="number"
                        id={`items[${index}].unit_price`}
                        name={`items[${index}].unit_price`}
                        value={item.unit_price}
                        onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                        className="w-full p-2 border rounded-md"
                        step="0.01"
                        min="0"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor={`items[${index}].total`} className="block mb-1 text-sm font-medium text-gray-700">Total (€)</label>
                      <input
                        type="number"
                        id={`items[${index}].total`}
                        name={`items[${index}].total`}
                        value={item.total.toFixed(2)}
                        readOnly
                        className="w-full p-2 border rounded-md bg-gray-100"
                      />
                    </div>
                  </div>
                  {index > 0 && (
                    <button
                      type="button"
                      onClick={() => removeItem(index)}
                      className="mt-2 text-sm text-red-600 hover:text-red-900 flex items-center"
                    >
                      <TrashIcon className="h-4 w-4 mr-1" /> Supprimer
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addItem}
                className="mt-3 px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                + Ajouter un item
              </button>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-900">Total général</span>
                <span className="font-semibold text-gray-900">
                  {items.reduce((sum, item) => sum + item.total, 0).toFixed(2)} €
                </span>
              </div>
            </div>
          </div>

          {/* Champ caché pour stocker les items */}
          <input type="hidden" name="items" value={JSON.stringify(items)} />
        </>
      )}

      {resource === 'subscription' && (
        <>
          <div>
            <label htmlFor="user_id" className="block mb-1">Utilisateur</label>
            <select
              id="user_id"
              name="user_id"
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Sélectionnez un utilisateur</option>
              {/* Options pour les utilisateurs avec rôle ADMIN, SECRETARY ou SUPERVISOR */}
              {users
                .map(user => (
                  <option key={user.id} value={user.id}>
                    {user.name} ({user.email})
                  </option>
                ))}
            </select>
          </div>
          <div>
            <label htmlFor="service_id" className="block mb-1">Service</label>
            <select
              id="service_id"
              name="service_id"
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Sélectionnez un service</option>
              {/* Options pour les utilisateurs avec rôle ADMIN, SECRETARY ou SUPERVISOR */}
              {s
                .map(service => (
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
              required
            >
              <option value="active">Actif</option>
                <option value="paid">Payé</option>
                <option value="overdue">En retard</option>
                <option value="cancelled">Annulé</option>
                <option value="pending">Suspendu</option>
                <option value="expired">Expiré</option>
            </select>
          </div>
          <div>
            <label htmlFor="start_date" className="block mb-1">Date de départ</label>
            <input type="datetime-local" id="start_date" name="start_date" className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label htmlFor="end_date" className="block mb-1">Date de fin</label>
            <input type="datetime-local" id="end_date" name="end_date" className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label htmlFor="next_payment_date" className="block mb-1">Date de paiement</label>
            <input type="datetime-local" id="next_payment_date" name="next_payment_date" className="w-full p-2 border rounded" required />
          </div>          
        </>
      )}

      {resource === 'users' && (
        <>
          <div>
            <label htmlFor="email" className="block mb-1">Email</label>
            <input type="text" id="email" name="email" className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label htmlFor="name" className="block mb-1">Nom</label>
            <input type="text" id="name" name="name" className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label htmlFor="phone" className="block mb-1">Téléphone</label>
            <input type="text" id="phone" name="phone" className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label htmlFor="company" className="block mb-1">Companie</label>
            <input type="text" id="company" name="company" className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label htmlFor="role" className="block mb-1">Role</label>
            <select
              id="role"
              name="role"
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Sélectionnez un role</option>
              <option value="ADMIN">Administrateur</option>
              <option value="SECRETARY">Secrétaire</option>
              <option value="CLIENT">Client</option>
              <option value="SUPERVISOR">Superviseur</option>
            </select>
          </div>
          <div>
            <label htmlFor="billing_address" className="block mb-1">Adresse de facturation</label>
            <input type="text" id="billing_address" name="billing_address" className="w-full p-2 border rounded" required />
          </div>{/* JSON object: street, city, state, postal_code, country */}
          <div>
            <label htmlFor="payment_method" className="block mb-1">Méthode de paiement</label>
            <select
              id="payment_method"
              name="payment_method"
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Sélectionnez un type</option>
              <option value="credit_card">Carte de crédit</option>
              {/* card_number, card_last_four, card_brand (PaymentMethodDetails) */}
              <option value="paypal">Paypal</option>
              {/* paypal_email (PaymentMethodDetails) */}
              <option value="bank_transfer">Virement bancaire</option>
            </select>
          </div>{/* JSON object */}
          <div>
            <label htmlFor="can_write" className="block mb-1">Peut écrire</label>
            <input type="text" id="can_write" name="can_write" className="w-full p-2 border rounded" required />
          </div>{/* Boolean oui ou non  */}
          <div>
            <label htmlFor="can_delete" className="block mb-1">Peut supprimer</label>
            <input type="text" id="can_delete" name="can_delete" className="w-full p-2 border rounded" required />
          </div>{/* Boolean oui ou non  */}
          <div>
            <label htmlFor="service_id" className="block mb-1">Service(s) lié(s)</label>
            <select
              id="service_id"
              name="service_id"
              className="w-full p-2 border rounded"
              multiple
              required
            >
              <option value="">Sélectionnez un/des service(s)</option>
              {/* Options pour les utilisateurs avec rôle ADMIN, SECRETARY ou SUPERVISOR */}
              {s.map(service => (
                <option key={service.id} value={service.id}>
                  {service.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
        Créer
      </button>
    </form>
  );
}
