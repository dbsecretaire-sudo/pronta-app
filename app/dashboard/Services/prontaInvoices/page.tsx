// app/dashboard/Services/prontaInvoices/page.tsx
"use client";
import { useAuthCheck } from "@/src/Hook/useAuthCheck";
import { InvoicesStats, InvoicesList, InvoicesFilter } from "@/src/Components";
import { useInvoices } from "@/src/Hook/useInvoices";
import { useContext, useEffect, useState } from "react";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { AuthContext } from "@/src/context/authContext";
import Link from "next/link";

export default function ProntaInvoicesDashboard() {
  const context = useContext(AuthContext)
  const { accessToken, session } = context;
  const { status } = useAuthCheck(accessToken);

  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const userIdVerified = isAuthChecked && status === 'authenticated' ? session?.user.id : undefined;
  
    // Attendre que l'authentification soit vérifiée
  useEffect(() => {
    if (session?.user) {
      setIsAuthChecked(true);
    }
  }, [session]);

  const { invoices, stats, loading, handleFilterChange } = useInvoices(accessToken, Number(userIdVerified));

  if (loading) {
    return <div className="p-8 max-w-7xl mx-auto">Chargement...</div>;
  }

  return (
    <div>
      {/* Barre de retour spécifique */}
        <nav className="bg-white border-b border-gray-200 h-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
            <div className="flex justify-between items-center h-full">
              <Link href="/dashboard" className="text-xl font-bold text-gray-900 hover:text-blue-600 flex items-center">
                ← Retour
              </Link>
              <div className="text-xl font-semibold text-gray-800">
                Pronta Invoices
              </div>
            </div>
          </div>
        </nav>

        <div className="pt-4"></div>
      <div className="p-8 max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Pronta Invoices - Tableau de bord</h1>
        <InvoicesStats {...stats} />
        <div className="mt-8">
          <InvoicesFilter onFilterChange={handleFilterChange} />
          <InvoicesList invoices={invoices} />
        </div>
      </div>
    </div>
  );
}
