// src/lib/admin/resources.ts
import { ExtendedColumnDef } from '@/src/Types/table';
import { safeFetch } from './api';
import {  getClientColumns,  getUserColumns,  getCallsColumns,  getInvoicesColumns,  getServicesColumns,  getCalendarColumns,  getSubscriptionColumns} from './column';
import {
  Client,
  Call,
  Invoice,
  Service,
  CalendarEvent,
  Subscription,
  User,
} from '@/src/lib/schemas'; // <-- Remplace par tes types réels
import { getSession } from 'next-auth/react';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

type ResourceConfig<TData> = {
  getColumns: () => ExtendedColumnDef<TData>[];
  fetchData: (accessToken: {} | string | null) => Promise<TData[]>;
  dataDependencies: string[];
};

export const resourcesConfig: Record<string, ResourceConfig<any>> = {
  clients: {
    getColumns: getClientColumns,
    fetchData: async (accessToken: {} | string | null): Promise<Client[]> => {const res = await fetch(`${API_URL}/api/clients`, {
      credentials: 'include',
      headers: {
        "Content-type": 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }); return res.json();},
    dataDependencies: ['users'],
  },
  calls: {
    getColumns: getCallsColumns,
    fetchData: async (accessToken: {} | string | null): Promise<Call[]> => {const res = await fetch(`${API_URL}/api/calls/All`, {
      credentials: 'include',
      headers: {
        "Content-type": 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }); return res.json();},
    dataDependencies: ['usersRole', 'usersName', 'clients'],
  },
  invoices: {
    getColumns: getInvoicesColumns,
    fetchData: async (accessToken: {} | string | null): Promise<Invoice[]> => {const res = await fetch(`${API_URL}/api/invoices`, {
      credentials: 'include',
      headers: {
        "Content-type": 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }); return res.json();},
    dataDependencies: ['usersRole', 'usersName', 'clients', 'invoiceItems', 'users'],
  },
  services: {
    getColumns: getServicesColumns,
    fetchData: async (accessToken: {} | string | null): Promise<Service[]> => {const res = await fetch(`${API_URL}/api/services`, {
      credentials: 'include',
      headers: {
        "Content-type": 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }); return res.json();},
    dataDependencies: [],
  },
  calendar: {
    getColumns: getCalendarColumns,
    fetchData: async (accessToken: {} | string | null): Promise<CalendarEvent[]> => {const res = await fetch(`${API_URL}/api/calendar`, {
      credentials: 'include',
      headers: {
        "Content-type": 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }); return res.json();},
    dataDependencies: ['usersRole', 'usersName', 'users'],
  },
  subscriptions: {
    getColumns: getSubscriptionColumns,
    fetchData: async (accessToken: {} | string | null): Promise<Subscription[]> => {const res = await fetch(`${API_URL}/api/subscription`, {
      credentials: 'include',
      headers: {
        "Content-type": 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }); return res.json();},
    dataDependencies: ['usersRole', 'usersName', 'users', 'services'],
  },
  users: {
    getColumns: getUserColumns,
    fetchData: async (accessToken: {} | string | null): Promise<User[]> => {const res = await fetch(`${API_URL}/api/user`, {
      credentials: 'include',
      headers: {
        "Content-type": 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    }); return res.json();},
    dataDependencies: ['usersRole', 'usersName', 'clients', 'invoiceItems'],
  },
};
