// app/Types/Components/Invoices/InvoicesStats.tsx
import React from "react";
import { InvoiceStatus } from "@/src/Types/Invoices";

interface InvoicesStatsProps {
  totalInvoices: number;
  totalAmount: number;
  statusCounts: Record<InvoiceStatus, number>;
}

export default function InvoicesStats({
  totalInvoices,
  totalAmount,
  statusCounts,
}: InvoicesStatsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <p className="text-gray-500 text-sm">Total des factures</p>
        <p className="text-2xl font-bold mt-2">{totalInvoices}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <p className="text-gray-500 text-sm">Montant total</p>
        <p className="text-2xl font-bold mt-2">{totalAmount.toFixed(2)} €</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <p className="text-gray-500 text-sm">Brouillons</p>
        <p className="text-2xl font-bold mt-2">{statusCounts.draft}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <p className="text-gray-500 text-sm">Envoyées</p>
        <p className="text-2xl font-bold mt-2">{statusCounts.sent}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <p className="text-gray-500 text-sm">Payées</p>
        <p className="text-2xl font-bold mt-2">{statusCounts.paid}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-100">
        <p className="text-gray-500 text-sm">En retard</p>
        <p className="text-2xl font-bold mt-2">{statusCounts.overdue}</p>
      </div>
    </div>
  );
}
