// app/dashboard/Services/prontaCalls/page.tsx
"use client";
import { useSession } from "next-auth/react";
import { CallStats, CallList, CallFilter } from "@/src/Components";
import { useCalls } from "@/src/Hook/useCalls";

export default function ProntaCallsDashboard() {
  const { data: session } = useSession();
  const { calls, stats, loading, filter, handleFilterChange } = useCalls(session?.user?.id);

  if (loading) {
    return (
      <div className="p-8 max-w-7xl mx-auto">
        <p>Chargement des données...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pronta Calls - Tableau de bord</h1>
      <CallStats {...stats} />
      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Appels récents</h2>
        <CallFilter
          userId={filter.userId}
          onFilterChange={handleFilterChange}
        />
        <CallList calls={calls} />
      </div>
    </div>
  );
}
