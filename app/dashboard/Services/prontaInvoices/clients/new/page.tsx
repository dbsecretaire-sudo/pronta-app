"use client";
import { useRouter } from "next/navigation";
import ClientForm from "@/app/components/clients/ClientForm";
import { emptyClient } from "@/app/components/models/client";

export default function NewClientPage() {
  const router = useRouter();

  const handleSubmit = async (data: typeof emptyClient) => {
    try {
      const response = await fetch('/api/clients', {
        method: 'POST',
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
        <h1 className="text-2xl font-bold mb-6">Nouveau client</h1>
        <ClientForm onSubmit={handleSubmit} />
      </div>
    </div>
  );
}
