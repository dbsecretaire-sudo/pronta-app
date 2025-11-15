// app/hooks/useEditClient.ts
'use client'
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ClientFormData } from '@/src/Types/Clients';
import { useAuthCheck } from './useAuthCheck';

export const useEditClient = () => {
  const router = useRouter();
  const { data: session, status } = useAuthCheck();
  const [client, setClient] = useState<ClientFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const params = useParams();

// useEffect(() => {
//     // Si la session n'est pas chargée ou n'existe pas
//     if (status === 'unauthenticated' || !session) {
//       router.push('/login');
//       return;
//     }
   
//   }, [session, status, router]);

  // Récupérer le client
  useEffect(() => {
    const fetchClient = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/clients/${params.id}`);
        if (!res.ok) {
          throw new Error("Client non trouvé");
        }
        const data = await res.json();
        setClient({
          name: data.name,
          email: data.email,
          phone: data.phone || "",
          address: data.address || "",
          company: data.company || "",
        });
      } catch (error) {
        setError(error instanceof Error ? error.message : "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    };
    fetchClient();
  }, [params.id]);

  // Soumettre les modifications
  const handleSubmit = async (data: ClientFormData) => {
    
    try {
      const response = await fetch(`/api/clients/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        router.push('/dashboard/Services/prontaInvoices/clients');
      }
    } catch (error) {
      setError("Erreur lors de la mise à jour du client");
    }
  };

  return { client, loading, error, handleSubmit, router };
};
