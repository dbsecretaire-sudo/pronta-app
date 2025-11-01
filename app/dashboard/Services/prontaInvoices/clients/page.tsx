"use client";
import { useState, useEffect } from "react";
import ClientList from "@/app/Types/Components/Clients/ClientList/ClientList";
import { Client } from "@/app/Types/Clients/index";

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalClients, setTotalClients] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `/api/clients?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`
        );
        const data = await res.json();
        setClients(data.clients);
        setTotalClients(data.total);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClients();
  }, [currentPage, searchTerm]);

  const handleDelete = async (clientId: string) => {
    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        // Rafraîchir la liste
        const updatedRes = await fetch(
          `/api/clients?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`
        );
        const updatedData = await updatedRes.json();
        setClients(updatedData.clients);
        setTotalClients(updatedData.total);
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

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
