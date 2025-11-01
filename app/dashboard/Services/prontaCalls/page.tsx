// app/dashboard/Services/prontaCalls/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CallStats from "@/app/Types/Components/Calls/CallStats";
import CallList from "@/app/Types/Components/Calls/CallList";
import CallFilter from '@/app/Types/Components/Calls/CallFilter';
import { Call, CallFilter as CallFilterType } from "@/app/Types/Calls/index";

export default function ProntaCallsDashboard() {
  const { data: session } = useSession();
  const [calls, setCalls] = useState<Call[]>([]);
  const [stats, setStats] = useState({
    totalToday: 0,
    missedToday: 0,
    answerRate: 0,
  });
  const [filter, setFilter] = useState<CallFilterType>({
    userId: 0,          // Valeur initiale (sera mise à jour plus tard)
    byName: "",
    byPhone: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCalls = async () => {
      if (!session?.user?.id) return;

      try {
        setLoading(true);
        const response = await fetch(
          `/api/calls?userId=${session.user.id}&byName=${filter.byName}&byPhone=${filter.byPhone}`
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des appels");
        }
        const data: Call[] = await response.json();
        setCalls(data);

        // Calcul des statistiques
        const today = new Date().toISOString().split('T')[0];
        const todayCalls = data.filter((call: Call) =>
          call.date.toISOString().startsWith(today)
        );
        const missedToday = todayCalls.filter((call: Call) => call.type === 'missed').length;

        setStats({
          totalToday: todayCalls.length,
          missedToday: missedToday,
          answerRate: todayCalls.length > 0
            ? Math.round(((todayCalls.length - missedToday) / todayCalls.length) * 100)
            : 0,
        });
      } catch (error) {
        console.error("Erreur lors du chargement des appels:", error);
      } finally {
        setLoading(false);
      }
    };
    
    loadCalls();
  }, [session, filter]);
  
  const handleFilterChange = (newFilters: CallFilterType) => {
    setFilter(newFilters);
  };
  
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
