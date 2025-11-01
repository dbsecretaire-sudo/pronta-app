// app/hooks/useInvoices.ts
import { useState, useEffect } from 'react';
import { Invoice, InvoiceFilter, InvoiceStatus } from '@/app/src/Types/Invoices';

export const useInvoices = (userId: string | undefined) => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalAmount: 0,
    statusCounts: { draft: 0, sent: 0, paid: 0, overdue: 0 } as Record<InvoiceStatus, number>,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<InvoiceFilter>({ userId: userId ? parseInt(userId, 10) : undefined, });

  useEffect(() => {
    const loadInvoices = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (filter.userId) queryParams.append("userId", filter.userId.toString());
        if (filter.clientId) queryParams.append("clientId", filter.clientId.toString());
        if (filter.status) queryParams.append("status", filter.status);
        if (filter.startDate) queryParams.append("startDate", filter.startDate.toISOString());
        if (filter.endDate) queryParams.append("endDate", filter.endDate.toISOString());

        const response = await fetch(`/api/invoices?${queryParams.toString()}`);
        if (!response.ok) throw new Error("Erreur lors de la récupération des factures");

        const data = await response.json();
        const invoicesWithDates = data.invoices.map((inv: any) => ({
          ...inv,
          due_date: new Date(inv.due_date),
          created_at: new Date(inv.created_at),
          updated_at: new Date(inv.updated_at),
        }));

        // Calcul des statistiques
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
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    loadInvoices();
  }, [userId, filter]);

  const handleFilterChange = (newFilters: Partial<InvoiceFilter>) => {
    setFilter({ ...filter, ...newFilters });
  };

  return { invoices, stats, loading, handleFilterChange };
};
