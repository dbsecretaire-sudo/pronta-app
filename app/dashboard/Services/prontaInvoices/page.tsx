// app/dashboard/Services/prontaInvoices/page.tsx
"use client";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import InvoicesStats from "@/app/Types/Components/Invoices/InvoicesStats";
import InvoicesList from "@/app/Types/Components/Invoices/InvoicesList";
import InvoicesFilter from "@/app/Types/Components/Invoices/InvoicesFilter";
import { Invoice, InvoiceFilter, InvoiceStatus } from "@/app/Types/Invoices";

export default function ProntaInvoicesDashboard() {
  const { data: session } = useSession();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalAmount: 0,
    statusCounts: { draft: 0, sent: 0, paid: 0, overdue: 0 } as Record<InvoiceStatus, number>,
  });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<InvoiceFilter>({ userId: 0 });

  useEffect(() => {
    const loadInvoices = async () => {
      if (!session?.user?.id) return;
      try {
        setLoading(true);
        // Construis l'URL avec les filtres
        const queryParams = new URLSearchParams();
        if (filter.userId) queryParams.append("userId", filter.userId.toString());
        if (filter.clientId) queryParams.append("clientId", filter.clientId.toString());
        if (filter.status) queryParams.append("status", filter.status);
        if (filter.startDate) queryParams.append("startDate", filter.startDate.toISOString());
        if (filter.endDate) queryParams.append("endDate", filter.endDate.toISOString());

        const response = await fetch(`/api/invoices?${queryParams.toString()}`);
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des factures");
        }
        const data = await response.json();

        // Convertis les dates en objets Date
        const invoicesWithDates = data.invoices.map((inv: any) => ({
          ...inv,
          due_date: new Date(inv.due_date),
          created_at: new Date(inv.created_at),
          updated_at: new Date(inv.updated_at),
        }));

        setInvoices(invoicesWithDates);

        // Calcul des statistiques
        const totalAmount = data.invoices.reduce((sum: number, inv: Invoice) => sum + inv.amount, 0);
        const statusCounts = {
          draft: data.invoices.filter((inv: Invoice) => inv.status === "draft").length,
          sent: data.invoices.filter((inv: Invoice) => inv.status === "sent").length,
          paid: data.invoices.filter((inv: Invoice) => inv.status === "paid").length,
          overdue: data.invoices.filter((inv: Invoice) => inv.status === "overdue").length,
        };

        setStats({
          totalInvoices: data.invoices.length,
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
  }, [session, filter]);

  const handleFilterChange = (newFilters: InvoiceFilter) => {
    setFilter({ ...filter, ...newFilters });
  };

  if (loading) {
    return <div className="p-8 max-w-7xl mx-auto">Chargement...</div>;
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pronta Invoices - Tableau de bord</h1>
      <InvoicesStats {...stats} />
      <div className="mt-8">
        <InvoicesFilter onFilterChange={handleFilterChange} />
        <InvoicesList invoices={invoices} />
      </div>
    </div>
  );
}
