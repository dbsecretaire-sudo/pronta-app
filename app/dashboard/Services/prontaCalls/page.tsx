"use client";
import { useAuthCheck } from "@/src/Hook/useAuthCheck";
import { CallStats, CallList, CallFilter, Calendar } from "@/src/Components";
import { CallFilter as CallFilterType } from "@/src/lib/schemas/calls";
import { useCalls } from "@/src/Hook/useCalls";
import { Tabs } from "@/src/Components"; // À créer ou utiliser une lib comme @radix-ui/react-tabs
import { useEffect, useState } from "react";

export default function ProntaCallsDashboard() {
  const { data: session, status } = useAuthCheck();

  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const userIdVerified = isAuthChecked && status === 'authenticated' ? session?.id : undefined;

    // Attendre que l'authentification soit vérifiée
  useEffect(() => {
    if (status !== 'loading') {
      setIsAuthChecked(true);
    }
  }, [status]);

  const { calls, stats, calendarEvents, loading, handleFilterChange } = useCalls(userIdVerified);

  const tabs = [
    {
      id: "calls",
      label: "Appels récents",
      content: (
        <div className="bg-white p-6 rounded-lg shadow">
          <CallFilter
            userId={Number(userIdVerified)}
            onFilterChange={handleFilterChange}
          />
          <CallList calls={calls} />
        </div>
      ),
    },
    {
      id: "calendar",
      label: "Calendrier",
      content: (
        <div className="bg-white p-6 rounded-lg shadow">
          <Calendar events={calendarEvents} />
        </div>
      )
    }
  ];

   if (loading) return <div className="p-8 max-w-7xl mx-auto">Chargement...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Pronta Calls - Tableau de bord</h1>
      <CallStats {...stats} />
      <div className="mt-8">
        <Tabs tabs={tabs} defaultTab="calls" />
      </div>
    </div>
  );
}