// app/hooks/useEditClient.ts
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { ClientFormData } from '@/src/Types/Clients';

export const useEditClient = () => {
  const [client, setClient] = useState<ClientFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const params = useParams();

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
        console.error("Erreur:", error);
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
      console.error("Erreur:", error);
      setError("Erreur lors de la mise à jour du client");
    }
  };

  return { client, loading, error, handleSubmit, router };
};
