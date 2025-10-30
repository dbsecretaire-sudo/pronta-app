// app/dashboard/Services/prontaCalls/page.tsx
"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import CallStats from "@/app//components/CallStats";
import CallFilter from "@/app/components/CallFilter";
import CallList from "@/app//components/CallList";
import { Call } from "@/app//models/Call";
import { CallFilter as CallFilterInterface } from "@/app/models/CallFilter";

export default function ProntaCallsDashboard() {
  const { data: session } = useSession();
  const [calls, setCalls] = useState<Call[]>([]);
  const [stats, setStats] = useState({
    totalToday: 0,
    missedToday: 0,
    answerRate: 0,
  });
  const [filter, setFilter] = useState<CallFilterInterface>({ byName: "", byPhone: "" });
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
        const todayCalls = data.filter((call: Call) => call.date.startsWith(today));
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
        <CallFilter onFilterChange={setFilter} />
        <CallList calls={calls} />
      </div>
    </div>
  );
}
