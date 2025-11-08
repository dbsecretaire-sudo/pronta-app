// src/lib/admin/resources.ts
import { createColumnHelper, ColumnDef } from '@tanstack/react-table';
import { Client } from '@/src/Types/Clients';
import { Call } from '@/src/Types/Calls';
import { Invoice, InvoiceStatus } from '@/src/Types/Invoices';
import { Service } from '@/src/Types/Services';
import { CalendarEvent } from '@/src/Types/Calendar';
import { Subscription } from '@/src/Types/Subscription';
import { BillingAddress, PaymentMethod, PaymentMethodDetails, Role, User } from '@/src/Types/Users';
// import { UserService } from '@/src/Types/UserServices';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

// Définition des types pour les métadonnées étendues
interface ExtendedColumnMeta {
  type?: 'text' | 'userName' | 'typeBadge' | 'date' | 'duration' | 'booleanBadge';
  dataMap?: string;
  typeData?: Record<string, { label: string; color: string }>;
  filterOptions?: Array<{ value: string; label: string }>;
  filterType?: 'text' | 'select' | 'date' | 'duration';
  sortable?: boolean;
}

type ExtendedColumnDef<TData> = ColumnDef<TData, any> & {
  meta?: ExtendedColumnMeta;
};

const clientColumnHelper = createColumnHelper<Client>();
const callColumnHelper = createColumnHelper<Call>();
const invoiceColumnHelper = createColumnHelper<Invoice>();
const serviceColumnHelper = createColumnHelper<Service>();
const calendarColumnHelper = createColumnHelper<CalendarEvent>();
const subscriptionColumnHelper = createColumnHelper<Subscription>();
const userColumnHelper = createColumnHelper<User>();
// const userServicesColumnHelper = createColumnHelper<UserService>();

export type ResourceConfig<TData> = {
  columns: ExtendedColumnDef<TData>[];
  fetchData: () => Promise<TData[]>;
};

export const resourcesConfig: Record<string, ResourceConfig<any>> = {
  clients: {
    columns: [
      clientColumnHelper.accessor('id', {
        header: 'ID',
        meta: {
          sortable: true,
          filterType: 'text',
        },
      }),
      clientColumnHelper.accessor('name', {
        header: 'Nom',
        meta: {
          sortable: true,
          filterType: 'text',
        },
      }),
      clientColumnHelper.accessor('email', {
        header: 'Email',
        meta: {
          sortable: true,
          filterType: 'text',
        },
      }),
      clientColumnHelper.accessor('phone', {
        header: 'Téléphone',
        meta: {
          sortable: true,
          filterType: 'text',
        },
      }),
      clientColumnHelper.accessor('address', {
        header: 'Adresse',
        meta: {
          sortable: true,
          filterType: 'text',
        },
      }),
      clientColumnHelper.accessor('created_at', {
        header: 'Créé le',
        meta: {
          sortable: true,
          filterType: 'date',
          type: 'date',
        },
      }),
      clientColumnHelper.accessor('updated_at', {
        header: 'Mis à jour le',
        meta: {
          sortable: true,
          filterType: 'date',
          type: 'date',
        },
      }),
    ],
    fetchData: async () => {
      const res = await fetch(`${API_URL}/api/clients`);
      return res.json();
    },
  },
  calls: {
    columns: [
      callColumnHelper.accessor('id', {
        header: 'ID',
        meta: {
          sortable: true,
          filterType: 'text',
        },
      }),
      callColumnHelper.accessor('user_id', {
        header: 'ID Utilisateur',
        meta: {
          sortable: true,
          filterType: 'select',
          type: 'userName',
          dataMap: 'users',
        },
      }),
      callColumnHelper.accessor('client_id', {
        header: 'ID Client',
        meta: {
          sortable: true,
          filterType: 'select',
          type: 'userName',
          dataMap: 'clients',
        },
      }),
      callColumnHelper.accessor('name', {
        header: 'Nom',
        meta: {
          sortable: true,
          filterType: 'text',
        },
      }),
      callColumnHelper.accessor('phone', {
        header: 'Téléphone',
        meta: {
          sortable: true,
          filterType: 'text',
        },
      }),
      callColumnHelper.accessor('phoneNumber', {
        header: 'Numéro de téléphone',
        meta: {
          sortable: true,
          filterType: 'text',
        },
      }),
      callColumnHelper.accessor('contactName', {
        header: 'Nom du contact',
        meta: {
          sortable: true,
          filterType: 'text',
        },
      }),
      callColumnHelper.accessor('date', {
        header: 'Date',
        meta: {
          sortable: true,
          filterType: 'date',
          type: 'date',
        },
      }),
      callColumnHelper.accessor('type', {
        header: 'Type',
        meta: {
          sortable: true,
          filterType: 'select',
          type: 'typeBadge',
          typeData: {
            incoming: { label: 'Entrant', color: 'green' },
            outgoing: { label: 'Sortant', color: 'blue' },
            missed: { label: 'Manqué', color: 'red' },
          },
          filterOptions: [
            { value: 'incoming', label: 'Entrant' },
            { value: 'outgoing', label: 'Sortant' },
            { value: 'missed', label: 'Manqué' },
          ],
        },
      }),
      callColumnHelper.accessor('summary', {
        header: 'Résumé',
        meta: {
          sortable: false,
          filterType: 'text',
        },
      }),
      callColumnHelper.accessor('duration', {
        header: 'Durée (secondes)',
        meta: {
          sortable: true,
          filterType: 'duration',
          type: 'duration',
        },
      }),
    ],
    fetchData: async () => {
      const res = await fetch(`${API_URL}/api/calls`);
      return res.json();
    },
  },
  invoices: {
    columns: [
      invoiceColumnHelper.accessor('id', {
        header: 'ID',
        meta: {
          sortable: true,
          filterType: 'text',
        },
      }),
      invoiceColumnHelper.accessor('user_id', {
        header: 'ID Utilisateur',
        meta: {
          sortable: true,
          filterType: 'select',
          type: 'userName',
          dataMap: 'users',
        },
      }),
      invoiceColumnHelper.accessor('client_id', {
        header: 'ID Client',
        meta: {
          sortable: true,
          filterType: 'select',
          type: 'userName',
          dataMap: 'clients',
        },
      }),
      invoiceColumnHelper.accessor('client_name', {
        header: 'Nom du client',
        meta: {
          sortable: true,
          filterType: 'text',
        },
      }),
      invoiceColumnHelper.accessor('amount', {
        header: 'Montant (€)',
        meta: {
          sortable: true,
          filterType: 'text',
        },
      }),
      invoiceColumnHelper.accessor('status', {
        header: 'Statut',
        meta: {
          sortable: true,
          filterType: 'select',
          type: 'typeBadge',
          typeData: {
            draft: { label: 'Brouillon', color: 'gray' },
            sent: { label: 'Envoyée', color: 'blue' },
            paid: { label: 'Payée', color: 'green' },
            cancelled: { label: 'Annulée', color: 'red' },
            overdue: { label: 'En retard', color: 'orange' },
          },
          filterOptions: [
            { value: 'draft', label: 'Brouillon' },
            { value: 'sent', label: 'Envoyée' },
            { value: 'paid', label: 'Payée' },
            { value: 'cancelled', label: 'Annulée' },
            { value: 'overdue', label: 'En retard' },
          ],
        },
      }),
      invoiceColumnHelper.accessor('due_date', {
        header: 'Date d\'échéance',
        meta: {
          sortable: true,
          filterType: 'date',
          type: 'date',
        },
      }),
      invoiceColumnHelper.accessor('created_at', {
        header: 'Créée le',
        meta: {
          sortable: true,
          filterType: 'date',
          type: 'date',
        },
      }),
      invoiceColumnHelper.accessor('updated_at', {
        header: 'Mise à jour le',
        meta: {
          sortable: true,
          filterType: 'date',
          type: 'date',
        },
      }),
    ],
    fetchData: async () => {
      const res = await fetch(`${API_URL}/api/invoices`);
      return res.json();
    },
  },
  services: {
    columns: [
      serviceColumnHelper.accessor('id', {
        header: 'ID',
        meta: {
          sortable: true,
          filterType: 'text',
        },
      }),
      serviceColumnHelper.accessor('name', {
        header: 'Nom',
        meta: {
          sortable: true,
          filterType: 'text',
        },
      }),
      serviceColumnHelper.accessor('description', {
        header: 'Description',
        meta: {
          sortable: false,
          filterType: 'text',
        },
      }),
      serviceColumnHelper.accessor('route', {
        header: 'Route',
        meta: {
          sortable: false,
          filterType: 'text',
        },
      }),
      serviceColumnHelper.accessor('icon', {
        header: 'Icône',
        meta: {
          sortable: false,
          filterType: 'text',
        },
      }),
      serviceColumnHelper.accessor('price', {
        header: 'Prix (€)',
        meta: {
          sortable: true,
          filterType: 'text',
        },
      }),
      serviceColumnHelper.accessor('unit', {
        header: 'Unité',
        meta: {
          sortable: false,
          filterType: 'text',
        },
      }),
    ],
    fetchData: async () => {
      const res = await fetch(`${API_URL}/api/services`);
      return res.json();
    },
  },
  calendar: {
    columns: [
      calendarColumnHelper.accessor('id', {
        header: 'ID',
        meta: {
          sortable: true,
          filterType: 'text',
        },
      }),
      calendarColumnHelper.accessor('user_id', {
        header: 'ID Utilisateur',
        meta: {
          sortable: true,
          filterType: 'select',
          type: 'userName',
          dataMap: 'users',
        },
      }),
      calendarColumnHelper.accessor('title', {
        header: 'Titre',
        meta: {
          sortable: false,
          filterType: 'text',
        },
      }),
      calendarColumnHelper.accessor('start_time', {
        header: 'Date de départ',
        meta: {
          sortable: true,
          filterType: 'date',
          type: 'date',
        },
      }),
      calendarColumnHelper.accessor('end_time', {
        header: 'Date de fin',
        meta: {
          sortable: true,
          filterType: 'date',
          type: 'date',
        },
      }),
      calendarColumnHelper.accessor('description', {
        header: 'Description',
        meta: {
          sortable: false,
          filterType: 'text',
        },
      }),
    ],
    fetchData: async () => {
      const res = await fetch(`${API_URL}/api/calendar`);
      return res.json();
    },
  },
  subscriptions: {
    columns: [
      subscriptionColumnHelper.accessor('id', {
        header: 'ID',
        meta: {
          sortable: true,
          filterType: 'text',
        },
      }),
      subscriptionColumnHelper.accessor('user_id', {
        header: 'ID Utilisateur',
        meta: {
          sortable: true,
          filterType: 'select',
          type: 'userName',
          dataMap: 'users',
        },
      }),
      subscriptionColumnHelper.accessor('service_id', {
        header: 'ID Service',
        meta: {
          sortable: true,
          filterType: 'select',
          type: 'userName',
          dataMap: 'services',
        },
      }),
      subscriptionColumnHelper.accessor('status', {
        header: 'Statut',
        meta: {
          sortable: false,
          filterType: 'text',
        },
      }),
      subscriptionColumnHelper.accessor('start_date', {
        header: 'Date de départ',
        meta: {
          sortable: true,
          filterType: 'date',
          type: 'date',
        },
      }),
      subscriptionColumnHelper.accessor('end_date', {
        header: 'Date de fin',
        meta: {
          sortable: true,
          filterType: 'date',
          type: 'date',
        },
      }),
      subscriptionColumnHelper.accessor('next_payment_date', {
        header: 'Date de paiement',
        meta: {
          sortable: true,
          filterType: 'date',
          type: 'date',
        },
      }),
    ],
    fetchData: async () => {
      const res = await fetch(`${API_URL}/api/subscription`);
      return res.json();
    },
  },
  user: {
    columns: [
      userColumnHelper.accessor('id', {
        header: 'ID',
        meta: {
          sortable: true,
          filterType: 'text',
        },
      }),
      userColumnHelper.accessor('email', {
        header: 'Email',
        meta: {
          sortable: true,
          filterType: 'text',
        },
      }),
      userColumnHelper.accessor('name', {
        header: 'Nom',
        meta: {
          sortable: true,
          filterType: 'text',
        },
      }),
      userColumnHelper.accessor('phone', {
        header: 'Téléphone',
        meta: {
          sortable: true,
          filterType: 'text',
        },
      }),
      userColumnHelper.accessor('company', {
        header: 'Entreprise',
        meta: {
          sortable: true,
          filterType: 'text',
        },
      }),
      userColumnHelper.accessor('role', {
        header: 'Rôle',
        meta: {
          sortable: true,
          filterType: 'select',
          type: 'typeBadge',
          typeData: {
            ADMIN: { label: 'Administrateur', color: 'red' },
            SECRETARY: { label: 'Secrétaire', color: 'blue' },
            CLIENT: { label: 'Client', color: 'green' },
            SUPERVISOR: { label: 'Superviseur', color: 'purple' },
          },
          filterOptions: [
            { value: 'ADMIN', label: 'Administrateur' },
            { value: 'SECRETARY', label: 'Secrétaire' },
            { value: 'CLIENT', label: 'Client' },
            { value: 'SUPERVISOR', label: 'Superviseur' },
          ],
        },
      }),
      userColumnHelper.accessor('created_at', {
        header: 'Créé le',
        meta: {
          sortable: true,
          filterType: 'date',
          type: 'date',
        },
      }),
      userColumnHelper.accessor('billing_address', {
        header: 'Adresse de facturation',
        meta: {
          sortable: false,
          filterType: 'text',
        },
      }),
      userColumnHelper.accessor('payment_method', {
        header: 'Moyen de paiement',
        meta: {
          sortable: false,
          filterType: 'text',
        },
      }),
    ],
    fetchData: async () => {
      const res = await fetch(`${API_URL}/api/user`);
      return res.json();
    },
  },
  // userServices: {
  //   columns: [
  //     userServicesColumnHelper.accessor('user_id', {
  //       header: 'ID Utilisateur',
  //       meta: {
  //         sortable: true,
  //         filterType: 'select',
  //         type: 'userName',
  //         dataMap: 'users',
  //       },
  //     }),
  //     userServicesColumnHelper.accessor('service_id', {
  //       header: 'ID Service',
  //       meta: {
  //         sortable: true,
  //         filterType: 'select',
  //         type: 'userName',
  //         dataMap: 'services',
  //       },
  //     }),
  //     userServicesColumnHelper.accessor('subscription_date', {
  //       header: 'Date de souscription',
  //       meta: {
  //         sortable: true,
  //         filterType: 'date',
  //         type: 'date',
  //       },
  //     }),
  //     userServicesColumnHelper.accessor('is_active', {
  //       header: 'Actif',
  //       meta: {
  //         sortable: true,
  //         filterType: 'select',
  //         type: 'booleanBadge',
  //       },
  //     }),
  //     userServicesColumnHelper.accessor('can_write', {
  //       header: 'Écriture',
  //       meta: {
  //         sortable: true,
  //         filterType: 'select',
  //         type: 'booleanBadge',
  //       },
  //     }),
  //     userServicesColumnHelper.accessor('can_delete', {
  //       header: 'Suppression',
  //       meta: {
  //         sortable: true,
  //         filterType: 'select',
  //         type: 'booleanBadge',
  //       },
  //     }),
  //     userServicesColumnHelper.display({
  //       id: 'permissions',
  //       header: 'Permissions',
  //     }),
  //   ],
  //   fetchData: async () => {
  //     const res = await fetch(`${API_URL}/api/UserServices`);
  //     return res.json();
  //   },
  // },
};
