// components/ResourceForm.tsx
'use client';
import { useActionState } from 'react';
import { createResource } from '@/app/actions/admin';
import { useEffect, useState } from 'react';
import { fetchAllClients, fetchUsers } from '@/src/lib/api';
import { User } from '@/src/Types/Users';
import { Client } from '@/src/Types/Clients';
import { useServices } from '@/src/Hook/useServices';
import { useSession } from 'next-auth/react';

interface ResourceFormProps {
  resource: string;
}

export default function ResourceForm({ resource }: ResourceFormProps) {
  const [state, formAction] = useActionState( createResource.bind(null, resource), {});
  const [users, setUsers] = useState<User[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const { data, status } = useSession();
  const {s, sN} = useServices(data?.user.id, status);

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
              {users.sort((a, b) => a.id - b.id).map((user) => (
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
            <label htmlFor="phone" className="block mb-1">Téléphone</label>
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
                  className="w-full p-2 border rounded-md bg-gray-100 cursor-not-allowed"
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

          <div>
            <label htmlFor="phoneNumber" className="block mb-1">Téléphone 2</label>
            <input type="text" id="phoneNumber" name="phoneNumber" className="w-full p-2 border rounded" required />
          </div>

          <div>
            <label htmlFor="contactName" className="block mb-1">Nom du contact</label>
            <input type="text" id="contactName" name="contactName" className="w-full p-2 border rounded" required />
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
            <label htmlFor="duration" className="block mb-1">Durée</label>
            <input type="number" id="duration" name="duration" className="w-full p-2 border rounded" required />
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
            <label htmlFor="client_id" className="block mb-1">Client</label>
            <select
              id="client_id"
              name="client_id"
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Sélectionnez un client</option>
              {clients
                //.filter(client => client.user_id === user_id) //valeur en fonction du champs précédent
                .map((client: Client) => (
                  <option key={client.id} value={client.id}>
                    {client.name} ({client.email})
                  </option>
                ))}
            </select>
          </div>
          {/* <div>
            <label htmlFor="client_name" className="block mb-1">Nom du client</label>
            <input type="text" id="client_name" name="client_name" className="w-full p-2 border rounded" required />
          </div> */}
          <div>
            <label htmlFor="amount" className="block mb-1">Montant (€)</label>
            <input type="decimal" id="amount" name="amount" className="w-full p-2 border rounded" required />
          </div>
          <div>
            <label htmlFor="status" className="block mb-1">Status</label>
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
            <input type="text" id="status" name="status" className="w-full p-2 border rounded" required />
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
