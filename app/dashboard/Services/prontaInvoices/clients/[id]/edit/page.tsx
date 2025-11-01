"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import ClientForm from "@/app/Types/Components/Clients/ClientForm/ClientForm";
import { ClientFormData } from "@/app/Types/Clients";

export default function EditClientPage() {
  const [client, setClient] = useState<ClientFormData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const fetchClient = async () => {
      try {
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
          company: data.company || ""
        });
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [params.id]);

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
    }
  };

  if (loading) return <div className="p-8">Chargement...</div>;
  if (!client) return <div className="p-8">Client non trouvé</div>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          ← Retour à la liste
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h1 className="text-2xl font-bold mb-6">Modifier le client</h1>
        <ClientForm client={client} onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
