// app/hooks/useCalls.ts
import { useState, useEffect } from 'react';
import { Call, CallFilter as CallFilterType } from "@/src/Types/Calls/index";
import { fetchCalendarEvents } from '../lib/api';

const calculateCallStats = (calls: Call[]) => {
  // Convertir les dates en objets Date si nécessaire
  const callsWithDateObjects = calls.map(call => ({
    ...call,
    date: call.date instanceof Date ? call.date : new Date(call.date)
  }));

  // Calculer les statistiques pour aujourd'hui
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Début de la journée

  const todayCalls = callsWithDateObjects.filter(call => {
    const callDate = new Date(call.date);
    callDate.setHours(0, 0, 0, 0);
    return callDate.getTime() === today.getTime();
  });

  const missedToday = todayCalls.filter(call => call.type === 'missed').length;
  const answeredToday = todayCalls.length - missedToday;

  return {
    totalToday: todayCalls.length,
    missedToday: missedToday,
    answeredToday: answeredToday,
    answerRate: todayCalls.length > 0
      ? Math.round((answeredToday / todayCalls.length) * 100)
      : 0,
    missedRate: todayCalls.length > 0
      ? Math.round((missedToday / todayCalls.length) * 100)
      : 0
  };
};

export const useCalls = (userId: string | undefined) => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [stats, setStats] = useState({
    totalToday: 0,
    missedToday: 0,
    answerRate: 0,
    answeredToday: 0,
    missedRate: 0
  });
  const [filter, setFilter] = useState<CallFilterType>({
    userId: userId ? Number(userId) : 0,
    byName: "",
    byPhone: "",
  });
  const [loading, setLoading] = useState(true);
  const [calendarEvents, setCalendarEvents] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Charger les appels et le calendrier en parallèle
        const [callsResponse, calendarData] = await Promise.all([
          fetch(`/api/calls?userId=${userId}&byName=${filter.byName}&byPhone=${filter.byPhone}`),
          fetchCalendarEvents(Number(userId))
        ]);

        if (!callsResponse.ok) {
          throw new Error("Erreur lors de la récupération des appels");
        }

        const callsData: Call[] = await callsResponse.json();

        // Mettre à jour les appels et calculer les statistiques
        setCalls(callsData);
        setStats(calculateCallStats(callsData));
        setCalendarEvents(calendarData);
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userId, filter.byName, filter.byPhone]); // Note: filter.userId n'est pas inclus car il dépend de userId

  const handleFilterChange = (newFilters: Partial<CallFilterType>) => {
    setFilter(prev => ({ ...prev, ...newFilters }));
  };

  return { calls, stats, calendarEvents, loading, filter, handleFilterChange };
};
