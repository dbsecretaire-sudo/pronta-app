// app/hooks/useClients.ts
'use client';
import { useState, useEffect } from 'react';
import { Client } from '@/src/lib/schemas/clients';
import { useAuthCheck } from './useAuthCheck';
import { useRouter } from 'next/navigation';
import { getSession } from 'next-auth/react';

export const useClients = (accessToken: string | null) => {
  const router = useRouter();
  const { data: session, status } = useAuthCheck(accessToken);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalClients, setTotalClients] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const itemsPerPage = 10;

// useEffect(() => {
//     // Si la session n'est pas chargée ou n'existe pas
//     if (status === 'unauthenticated' || !session) {
//       router.push('/login');
//       return;
//     }
    
//   }, [session, status, router]);

  // Fonction pour récupérer les clients
  const fetchClients = async () => {
    try {
      setLoading(true);

      const res = await fetch(
        `/api/clients?page=${currentPage}&limit=${itemsPerPage}&search=${searchTerm}`, {
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            'Authorization': `Bearer ${accessToken}`, // <-- Utilise le token
          },
        }
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
        credentials: 'include',
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${accessToken}`, // <-- Utilise le token
        },
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
