// src/lib/admin/resources.ts
import { ExtendedColumnDef } from '@/src/Types/table';
import { getClientColumns, getUserColumns, getCallsColumns, getInvoicesColumns, getServicesColumns, getCalendarColumns, getSubscriptionColumns } from './column'; // Importez les fonctions

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export type ResourceConfig<TData> = {
  getColumns: () => ExtendedColumnDef<TData>[]; // Passez la fonction, ne l'appelez pas
  fetchData: () => Promise<TData[]>;
};

export const resourcesConfig: Record<string, ResourceConfig<any>> = {
  clients: {
    getColumns: getClientColumns, // Appelez la fonction pour obtenir les colonnes
    fetchData: async () => {
      const res = await fetch(`${API_URL}/api/clients`);
      return res.json();
    },
  },
  calls: {
    getColumns: getCallsColumns,
    fetchData: async () => {
      const res = await fetch(`${API_URL}/api/calls`);
      return res.json();
    },
  },
  invoices: {
    getColumns: getInvoicesColumns,
    fetchData: async () => {
      const res = await fetch(`${API_URL}/api/invoices`);
      return res.json();
    },
  },
  services: {
    getColumns: getServicesColumns,
    fetchData: async () => {
      const res = await fetch(`${API_URL}/api/services`);
      return res.json();
    },
  },
  calendar: {
    getColumns: getCalendarColumns,
    fetchData: async () => {
      const res = await fetch(`${API_URL}/api/calendar`);
      return res.json();
    },
  },
  subscriptions: {
    getColumns: getSubscriptionColumns,
    fetchData: async () => {
      const res = await fetch(`${API_URL}/api/subscription`);
      return res.json();
    },
  },
  users: {
    getColumns: getUserColumns,
    fetchData: async () => {
      const res = await fetch(`${API_URL}/api/user`);
      return res.json();
    },
  },
};
