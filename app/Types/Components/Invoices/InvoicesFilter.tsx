// app/Types/Components/Invoices/InvoicesFilter.tsx
import React, { useState } from "react";
import { InvoiceFilter, InvoiceStatus } from "@/app/Types/Invoices";

interface InvoicesFilterProps {
  onFilterChange: (filters: InvoiceFilter) => void;
}

export default function InvoicesFilter({ onFilterChange }: InvoicesFilterProps) {
  const [clientId, setClientId] = useState<number | undefined>(undefined);
  const [status, setStatus] = useState<InvoiceStatus | undefined>(undefined);
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilterChange({
      clientId,
      status,
      startDate,
      endDate,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 bg-white p-6 rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            ID Client
          </label>
          <input
            type="number"
            value={clientId || ""}
            onChange={(e) => setClientId(e.target.value ? Number(e.target.value) : undefined)}
            className="w-full p-2 border border-gray-300 rounded-md"
            placeholder="ID du client"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Statut
          </label>
          <select
            value={status || ""}
            onChange={(e) => setStatus(e.target.value as InvoiceStatus)}
            className="w-full p-2 border border-gray-300 rounded-md"
          >
            <option value="">Tous</option>
            <option value="draft">Brouillon</option>
            <option value="sent">Envoyée</option>
            <option value="paid">Payée</option>
            <option value="overdue">En retard</option>
          </select>
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Date de début
          </label>
          <input
            type="date"
            value={startDate ? startDate.toISOString().split("T")[0] : ""}
            onChange={(e) => setStartDate(e.target.value ? new Date(e.target.value) : undefined)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-medium mb-2">
            Date de fin
          </label>
          <input
            type="date"
            value={endDate ? endDate.toISOString().split("T")[0] : ""}
            onChange={(e) => setEndDate(e.target.value ? new Date(e.target.value) : undefined)}
            className="w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <button
        type="submit"
        className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        Filtrer
      </button>
    </form>
  );
}
