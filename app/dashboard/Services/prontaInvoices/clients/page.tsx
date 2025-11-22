// app/dashboard/Clients/page.tsx
"use client";
import { ClientList } from "@/src/Components";
import { AuthContext } from "@/src/context/authContext";
import { useClients } from "@/src/Hook/useClients";
import { useContext } from "react";

export default function ClientsPage() {
    const context = useContext(AuthContext)
  const { accessToken, session } = context;

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
  } = useClients(accessToken);

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
