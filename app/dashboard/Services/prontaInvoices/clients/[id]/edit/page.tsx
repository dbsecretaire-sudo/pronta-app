// app/dashboard/Services/prontaInvoices/clients/[id]/page.tsx
"use client";
import { ClientForm } from "@/src/Components/index";
import { useEditClient } from "@/src/Hook/useEditClient";

export default function EditClientPage() {
  const { client, loading, error, handleSubmit, router } = useEditClient();

  if (loading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8 text-red-500">{error}</div>;
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
