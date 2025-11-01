// app/hooks/useCalls.ts
import { useState, useEffect } from 'react';
import { Call, CallFilter as CallFilterType } from "@/app/src/Types/Calls/index";

export const useCalls = (userId: string | undefined) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [stats, setStats] = useState({
    totalToday: 0,
    missedToday: 0,
    answerRate: 0,
  });
  const [filter, setFilter] = useState<CallFilterType>({
    userId: 0,
    byName: "",
    byPhone: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCalls = async () => {
      if (!userId) return;
      try {
        setLoading(true);
        const response = await fetch(
          `/api/calls?userId=${userId}&byName=${filter.byName}&byPhone=${filter.byPhone}`
        );
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération des appels");
        }
        const data: Call[] = await response.json();
        const callsWithDateObjects = data.map((call) => ({
          ...call,
          date: new Date(call.date),
        }));
        setCalls(callsWithDateObjects);

        // Calcul des statistiques
        const today = new Date().toISOString().split('T')[0];
        const todayCalls = callsWithDateObjects.filter((call) =>
          call.date.toISOString().startsWith(today)
        );
        const missedToday = todayCalls.filter((call) => call.type === 'missed').length;
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
  }, [userId, filter]);

  const handleFilterChange = (newFilters: CallFilterType) => {
    setFilter(newFilters);
  };

  return { calls, stats, loading, filter, handleFilterChange };
};
