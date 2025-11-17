// app/hooks/useInvoices.ts
"use client"; // <-- Ajoute cette directive si ce fichier est utilisé dans un Client Component

import { useState, useEffect } from 'react';
import { Invoice, InvoiceFilter, InvoiceStatus } from '@/src/Types/Invoices';
import { fetchInvoiceItems } from '../lib/api';
import { InvoiceItem, InvoiceWithItems } from '../lib/schemas/invoices';
import { useAuthCheck } from './useAuthCheck';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';
const API_URL = process.env.NEXTAUTH_URL

export const useInvoices = (request: Request, userId: number | undefined) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalAmount: 0,
    statusCounts: { draft: 0, sent: 0, paid: 0, overdue: 0 } as Record<InvoiceStatus, number>,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // Ajout d'un état pour les erreurs
  const [filter, setFilter] = useState<InvoiceFilter>({
    userId: userId ? userId : undefined,
  });
  const [invoiceItems, setInvoiceItems] = useState<InvoiceItem[]>([])
  const [invoicesWithItems, setInvoicesWithItems] = useState<InvoiceWithItems[]>([])

  useEffect(() => {
    const loadInvoices = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null); // Réinitialise l'erreur à chaque chargement

        const queryParams = new URLSearchParams();
        if (filter.userId) queryParams.append("userId", filter.userId.toString());
        if (filter.clientId) queryParams.append("clientId", filter.clientId?.toString());
        if (filter.status) queryParams.append("status", filter.status);
        if (filter.startDate) queryParams.append("startDate", filter.startDate.toISOString());
        if (filter.endDate) queryParams.append("endDate", filter.endDate?.toISOString());
        const { searchParams } = new URL(request.url);
        const accessToken = searchParams.get('accessToken');

        const response = await fetch(`/api/invoices?${queryParams.toString()}`, { 
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${accessToken}`, // <-- Utilise le token
          },
        });
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des factures");
        }

        const data = await response.json();
        const invoicesWithDates = data.invoices?.map((inv: any) => ({
          ...inv,
          due_date: new Date(inv.due_date),
          created_at: new Date(inv.created_at),
          updated_at: new Date(inv.updated_at),
        })) || []; // Si data.invoices est undefined, utilise un tableau vide

        // Calcul des statistiques (même si invoicesWithDates est vide)
        const totalAmount = invoicesWithDates.reduce((sum: number, inv: Invoice) => sum + inv.amount, 0);
        const statusCounts = {
          draft: invoicesWithDates.filter((inv: Invoice) => inv.status === "draft").length,
          sent: invoicesWithDates.filter((inv: Invoice) => inv.status === "sent").length,
          paid: invoicesWithDates.filter((inv: Invoice) => inv.status === "paid").length,
          overdue: invoicesWithDates.filter((inv: Invoice) => inv.status === "overdue").length,
        };

        setInvoices(invoicesWithDates);
        setStats({
          totalInvoices: invoicesWithDates.length,
          totalAmount,
          statusCounts,
        });

      } catch (error) {
        setError(error instanceof Error ? error.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, [userId, filter]);

  const handleFilterChange = (newFilters: Partial<InvoiceFilter>) => {
    setFilter({ ...filter, ...newFilters });
  };

  useEffect(() => {
    const fetchInvoiceItem = async () => {
      try {
        const { searchParams } = new URL(request.url);
        const accessToken = searchParams.get('accessToken');
        const allItems = await fetchInvoiceItems(accessToken);

        const itemsArray = Array.isArray(invoiceItems) ? invoiceItems : [];
        const itemsByInvoiceId = itemsArray.reduce((acc, item) => {
          if (!acc[item.invoice_id]) {
            acc[item.invoice_id] = [];
          }
          acc[item.invoice_id].push(item);
          return acc;
        }, {} as Record<number, any[]>);

        // 2. Associe les items à chaque facture
        const invoicesWithI = invoices.map(invoice => ({
          ...invoice,
          items: itemsByInvoiceId[invoice.id] || [], // Items de cette facture
        }));

        setInvoicesWithItems(invoicesWithI);
        setInvoiceItems(allItems);
      } catch (error) {
        console.error('Erreur lors de la récupération des lignes de factures', error)
      }
      
    }

    fetchInvoiceItem();
  }, [])

  return { invoices, invoiceItems, invoicesWithItems, stats, loading, error, handleFilterChange };
};

export const useFetchInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const currentSession = await getSession();
        if (!currentSession) {
          throw new Error("Session expirée. Veuillez vous reconnecter.");
        }

        const res = await fetch(`${API_URL}/api/invoices`, {
          credentials: 'include',
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${currentSession.accessToken}`, // <-- Utilise le token
          },
        });
        const data = await res.json();
        setInvoices(data);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  return { invoices, loading };
};
