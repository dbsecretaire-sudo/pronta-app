// app/dashboard/Services/prontaInvoices/page.tsx
"use client";
import { useSession } from "next-auth/react";
import InvoicesStats from "@/app/src/Components/Invoices/InvoicesStats";
import InvoicesList from "@/app/src/Components/Invoices/InvoicesList";
import InvoicesFilter from "@/app/src/Components/Invoices/InvoicesFilter";
import { useInvoices } from "@/app/src/Hook/useInvoices";

export default function ProntaInvoicesDashboard() {
  const { data: session } = useSession();
  const { invoices, stats, loading, handleFilterChange } = useInvoices(session?.user?.id);

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
