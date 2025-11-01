// app/hooks/useClients.ts
import { useState, useEffect } from 'react';
import { Client } from '@/src/Types/Clients/index';

export const useClients = () => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalClients, setTotalClients] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

  // Fonction pour récupérer les clients
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

  // Charger les clients au montage et quand currentPage/searchTerm change
  useEffect(() => {
    fetchClients();
  }, [currentPage, searchTerm]);

  // Fonction pour supprimer un client
  const handleDelete = async (clientId: number) => {
    try {
      const res = await fetch(`/api/clients/${clientId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        // Rafraîchir la liste après suppression
        await fetchClients();
      }
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  return {
    clients,
    loading,
    currentPage,
    totalClients,
    searchTerm,
    itemsPerPage,
    setCurrentPage,
    setSearchTerm,
    handleDelete,
  };
};
