// src/lib/admin/columns.ts

import { createColumnHelper } from '@tanstack/react-table';
import { ExtendedColumnDef } from '@/src/Types/table';
import { Call, Client } from '@/src/Components';
import { User } from '@/src/Types/Users';
import { Invoice } from '@/src/Types/Invoices';
import { Service } from '@/src/Types/Services';
import { CalendarEvent } from '@/src/Types/Calendar';
import { Subscription } from '@/src/Types/Subscription';

// Définissez vos helpers ici
const clientColumnHelper = createColumnHelper<Client>();
const callColumnHelper = createColumnHelper<Call>();
const invoiceColumnHelper = createColumnHelper<Invoice>();
const serviceColumnHelper = createColumnHelper<Service>();
const calendarColumnHelper = createColumnHelper<CalendarEvent>();
const subscriptionColumnHelper = createColumnHelper<Subscription>();
const userColumnHelper = createColumnHelper<User>();

// Exportez les colonnes par ressource
export const getClientColumns = (): ExtendedColumnDef<Client>[] => [
  clientColumnHelper.accessor('id', {
    header: 'ID',
    meta: { sortable: true, filterType: 'text' },
  }),
  clientColumnHelper.accessor('user_id', {
    header: 'Client',
    meta: { sortable: true, filterType: 'select', type: 'userName', dataMap: 'usersClients', },

  }),
  clientColumnHelper.accessor('name', {
    header: 'Nom',
    meta: { sortable: true, filterType: 'text' },
  }),
  clientColumnHelper.accessor('email', {
    header: 'Email',
    meta: { sortable: true, filterType: 'text', },
  }),
  clientColumnHelper.accessor('phone', {
    header: 'Téléphone',
    meta: { sortable: true, filterType: 'text', },
  }),
  clientColumnHelper.accessor('address', {
    header: 'Adresse',
    meta: { sortable: true, filterType: 'text', },
  }),
  clientColumnHelper.accessor('company', {
    header: 'Companie',
    meta: { sortable: true, filterType: 'text' },
  })
];

export const getCallsColumns = (): ExtendedColumnDef<Call>[] => [
    callColumnHelper.accessor('id', {
        header: 'ID',
        meta: { sortable: true, filterType: 'text', },
    }),
    callColumnHelper.accessor('user_id', {
        header: 'ID Utilisateur',
        meta: { sortable: true, filterType: 'select', type: 'userName', dataMap: 'users', },
    }),
    callColumnHelper.accessor('client_id', {
        header: 'ID Client',
        meta: { sortable: true, filterType: 'select', type: 'userName', dataMap: 'clients', },
    }),
    callColumnHelper.accessor('name', {
        header: 'Nom',
        meta: { sortable: true, filterType: 'text', },
    }),
    callColumnHelper.accessor('phone', {
        header: 'Téléphone',
        meta: { sortable: true, filterType: 'text', },
    }),
    callColumnHelper.accessor('phoneNumber', {
        header: 'Numéro de téléphone',
        meta: { sortable: true, filterType: 'text', },
    }),
    callColumnHelper.accessor('contactName', {
        header: 'Nom du contact',
        meta: { sortable: true, filterType: 'text', },
    }),
    callColumnHelper.accessor('date', {
        header: 'Date',
        meta: { sortable: true, filterType: 'date', type: 'date', },
    }),
    callColumnHelper.accessor('type', {
        header: 'Type',
        meta: { sortable: true, filterType: 'select', type: 'typeBadge',
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
        meta: { sortable: false, filterType: 'text', },
    }),
    callColumnHelper.accessor('duration', {
        header: 'Durée (secondes)',
        meta: { sortable: true, filterType: 'duration', type: 'duration', },
    }),
]

export const getInvoicesColumns = (): ExtendedColumnDef<Invoice>[] => [
    invoiceColumnHelper.accessor('id', {
        header: 'ID',
        meta: { sortable: true, filterType: 'text', },
      }),
      invoiceColumnHelper.accessor('user_id', {
        header: 'ID Utilisateur',
        meta: { sortable: true, filterType: 'select', type: 'userName', dataMap: 'users', },
      }),
      invoiceColumnHelper.accessor('client_id', {
        header: 'ID Client',
        meta: { sortable: true, filterType: 'select', type: 'userName', dataMap: 'clients', },
      }),
      invoiceColumnHelper.accessor('client_name', {
        header: 'Nom du client',
        meta: { sortable: true, filterType: 'text', },
      }),
      invoiceColumnHelper.accessor('amount', {
        header: 'Montant (€)',
        meta: { sortable: true, filterType: 'text', },
      }),
      invoiceColumnHelper.accessor('status', {
        header: 'Statut',
        meta: { sortable: true, filterType: 'select', type: 'typeBadge',
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
        meta: { sortable: true, filterType: 'date', type: 'date',},
      }),
      invoiceColumnHelper.accessor('created_at', {
        header: 'Créée le',
        meta: { sortable: true, filterType: 'date', type: 'date', },
      }),
      invoiceColumnHelper.accessor('updated_at', {
        header: 'Mise à jour le',
        meta: { sortable: true, filterType: 'date', type: 'date', },
      }),
]

export const getServicesColumns = (): ExtendedColumnDef<Service>[] => [
    serviceColumnHelper.accessor('id', {
        header: 'ID',
        meta: { sortable: true, filterType: 'text', },
      }),
      serviceColumnHelper.accessor('name', {
        header: 'Nom',
        meta: { sortable: true, filterType: 'text',},
      }),
      serviceColumnHelper.accessor('description', {
        header: 'Description',
        meta: { sortable: false, filterType: 'text', },
      }),
      serviceColumnHelper.accessor('route', {
        header: 'Route',
        meta: { sortable: false, filterType: 'text', },
      }),
      serviceColumnHelper.accessor('icon', {
        header: 'Icône',
        meta: { sortable: false, filterType: 'text', },
      }),
      serviceColumnHelper.accessor('price', {
        header: 'Prix (€)',
        meta: { sortable: true, filterType: 'text', },
      }),
      serviceColumnHelper.accessor('unit', {
        header: 'Unité',
        meta: { sortable: false, filterType: 'text',},
      }),
      serviceColumnHelper.accessor('is_active', {
        header: 'Actif',
        meta: { sortable: false, filterType: 'text',},
      }),
]

export const getCalendarColumns = (): ExtendedColumnDef<CalendarEvent>[] => [
    calendarColumnHelper.accessor('id', {
        header: 'ID',
        meta: { sortable: true, filterType: 'text', },
    }),
    calendarColumnHelper.accessor('user_id', {
        header: 'ID Utilisateur',
        meta: { sortable: true, filterType: 'select', type: 'userName', dataMap: 'users', },
    }),
    calendarColumnHelper.accessor('title', {
        header: 'Titre',
        meta: { sortable: false, filterType: 'text', },
    }),
    calendarColumnHelper.accessor('start_time', {
        header: 'Date de départ',
        meta: { sortable: true, filterType: 'date', type: 'date', },
    }),
    calendarColumnHelper.accessor('end_time', {
        header: 'Date de fin',
        meta: { sortable: true, filterType: 'date', type: 'date', },
    }),
    calendarColumnHelper.accessor('description', {
        header: 'Description',
        meta: { sortable: false,  filterType: 'text', },
      }),
]

export const getSubscriptionColumns = (): ExtendedColumnDef<Subscription>[] => [
    subscriptionColumnHelper.accessor('id', {
        header: 'ID',
        meta: { sortable: true, filterType: 'text', },
    }),
    subscriptionColumnHelper.accessor('user_id', {
        header: 'ID Utilisateur',
        meta: { sortable: true, filterType: 'select', type: 'userName', dataMap: 'users', },
    }),
    subscriptionColumnHelper.accessor('service_id', {
        header: 'ID Service',
        meta: { sortable: true,  filterType: 'select',  type: 'userName', dataMap: 'services', },
    }),
    subscriptionColumnHelper.accessor('status', {
        header: 'Statut',
        meta: { sortable: false, filterType: 'text',},
    }),
    subscriptionColumnHelper.accessor('start_date', {
        header: 'Date de départ',
        meta: { sortable: true, filterType: 'date', type: 'date',},
    }),
    subscriptionColumnHelper.accessor('end_date', {
        header: 'Date de fin',
        meta: { sortable: true, filterType: 'date',type: 'date', },
    }),
    subscriptionColumnHelper.accessor('next_payment_date', {
        header: 'Date de paiement',
        meta: { sortable: true, filterType: 'date', type: 'date', },
    }),
]

export const getUserColumns = (): ExtendedColumnDef<User>[] => [
    userColumnHelper.accessor('id', {
        header: 'ID',
        meta: { sortable: true, filterType: 'text', },
    }),
    userColumnHelper.accessor('email', {
        header: 'Email',
        meta: { sortable: true, filterType: 'text', },
    }),
    userColumnHelper.accessor('name', {
        header: 'Nom',
        meta: { sortable: true, filterType: 'text',},
    }),
    userColumnHelper.accessor('phone', {
        header: 'Téléphone',
        meta: { sortable: true, filterType: 'text', },
    }),
    userColumnHelper.accessor('company', {
        header: 'Entreprise',
        meta: { sortable: true, filterType: 'text', },
    }),
    userColumnHelper.accessor('role', {
        header: 'Rôle',
        meta: { sortable: true, filterType: 'select',  type: 'typeBadge',
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
        meta: { sortable: true,  filterType: 'date', type: 'date',},
    }),
    userColumnHelper.accessor('billing_address', {
        header: 'Adresse de facturation',
        meta: { sortable: false, filterType: 'text', },
    }),
    userColumnHelper.accessor('payment_method', {
        header: 'Moyen de paiement',
        meta: { sortable: false, filterType: 'text', },
    }),
    userColumnHelper.accessor('can_write', {
        header: 'Peut écrire',
        // cell: (info) => (info.getValue() ? '✅' : '❌'),
        meta: { sortable: true, filterType: 'select', type: 'booleanBadge',},
    }),
    userColumnHelper.accessor('can_delete', {
        header: 'Peut supprimer',
        // cell: (info) => (info.getValue() ? '✅' : '❌'),
        meta: { sortable: true, filterType: 'select', type: 'booleanBadge', },
    }),
    userColumnHelper.accessor('service_ids', {
        header: 'Services liés',
        // cellType: 'array', // Marquez le type de cellule
        meta: { sortable: true, filterType: 'array', type: 'array' },
    }),
];
