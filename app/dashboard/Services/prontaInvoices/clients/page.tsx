// app/dashboard/Clients/page.tsx
"use client";
import { ClientList } from "@/src/Components";
import { useClients } from "@/src/Hook/useClients";

export default function ClientsPage() {
  const {
    clients,
    loading,
    currentPage,
    totalClients,
    searchTerm,
    itemsPerPage,
    setCurrentPage,
    setSearchTerm,
    handleDelete,
  } = useClients();

  return (
    <div className="p-8">
      <ClientList
        clients={clients}
        totalClients={totalClients}
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
        onSearch={setSearchTerm}
        onDelete={handleDelete}
        loading={loading}
      />
    </div>
  );
}
