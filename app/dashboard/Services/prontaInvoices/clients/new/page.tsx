"use client";
import { useRouter } from "next/navigation";
import { ClientForm } from "@/src/Components";
import { emptyClient } from "@/src/Types/Clients/index";
import { createClient } from "@/src/lib/api";
import { useContext } from "react";
import { AuthContext } from "@/src/context/authContext";

export default function NewClientPage() {
  const router = useRouter();
    const context = useContext(AuthContext)
  const { accessToken, session } = context;

  const handleSubmit = async (data: typeof emptyClient) => {
    try {
      await createClient(data, accessToken);
      router.push('/dashboard/Services/prontaInvoices/clients');
    } catch (error) {
      console.error("Erreur:", error);
      // Vous pourriez ajouter ici une notification d'erreur pour l'utilisateur
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
