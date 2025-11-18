// app/dashboard/Services/prontaInvoices/page.tsx
"use client";
import { useAuthCheck } from "@/src/Hook/useAuthCheck";
import { InvoicesStats, InvoicesList, InvoicesFilter } from "@/src/Components";
import { useInvoices } from "@/src/Hook/useInvoices";
import { useEffect, useState } from "react";

export default function ProntaInvoicesDashboard(request: Request) {
  const { data: session, status } = useAuthCheck();

  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const userIdVerified = isAuthChecked && status === 'authenticated' ? session?.id : undefined;

    // Attendre que l'authentification soit vérifiée
  useEffect(() => {
    if (status !== 'loading') {
      setIsAuthChecked(true);
    }
  }, [status]);

  const { invoices, stats, loading, handleFilterChange } = useInvoices(request, userIdVerified);

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
