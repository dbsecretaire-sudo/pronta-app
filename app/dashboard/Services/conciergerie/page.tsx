// app/dashboard/Services/prontaCalls/page.tsx
"use client";
import { useAuthCheck } from "@/src/Hook/useAuthCheck";
import { CallStats, CallList, CallFilter } from "@/src/Components";
import { CallFilter as CallFilterType } from "@/src/lib/schemas/calls";
import { useCalls } from "@/src/Hook/useCalls";
import { useEffect, useState } from "react";

export default function ConciergerieDashboard() {
  const { data: session, status } = useAuthCheck();

  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const userIdVerified = isAuthChecked && status === 'authenticated' ? session?.id : undefined;

    // Attendre que l'authentification soit vérifiée
  useEffect(() => {
    if (status !== 'loading') {
      setIsAuthChecked(true);
    }
  }, [status]);

  const [filter, setFilter] = useState<CallFilterType>({
      userId: 0,
      byName: "",
      byPhone: "",
    });
  const { calls, stats, loading } = useCalls(userIdVerified);

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
          onFilterChange={setFilter}
        />
        <CallList calls={calls} />
      </div>
    </div>
  );
}
