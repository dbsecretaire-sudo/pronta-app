// app/hooks/useCalls.ts
'use client';
import { useState, useEffect, useCallback } from 'react';
import { Call,  CallFilter as CallFilterType } from "@/src/lib/schemas/calls";

import { fetchCalendarEvents } from '../lib/api';
import { useCalendar } from './useCalendar';

const calculateCallStats = (calls: Call[]) => {
  // Convertir les dates en objets Date si nécessaire
  const callsWithDateObjects = calls.map(call => ({
    ...call,
    date: call.date ? (call.date instanceof Date ? call.date : new Date(call.date)) : null
  }));

  // Calculer les statistiques pour aujourd'hui
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Début de la journée

  const todayCalls = callsWithDateObjects.filter(call => {
    if (!call.date) return false; // On ignore si la date est null

    const callDate = call.date instanceof Date ? call.date : new Date(call.date);
    const callDateStartOfDay = new Date(callDate);
    callDateStartOfDay.setHours(0, 0, 0, 0);

    return callDateStartOfDay.getTime() === today.getTime();
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

export const useCalls = (userId: string | undefined, initialFilter: Omit<CallFilterType, 'userId'> = {}) => {
  const [filter, setFilter] = useState<Omit<CallFilterType, 'userId'>>(initialFilter);
  const [calls, setCalls] = useState<Call[]>([]);
  const [stats, setStats] = useState({
    totalToday: 0,
    missedToday: 0,
    answerRate: 0,
    answeredToday: 0,
    missedRate: 0
  });
  const [loading, setLoading] = useState(true);
  const { calendarEvents } = useCalendar(userId)

  useEffect(() => {
  const loadData = async () => {
    if (!userId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filter.byName) params.append('byName', filter.byName);
      if (filter.byPhone) params.append('byPhone', filter.byPhone);

      const response = await fetch(`/api/calls?userId=${userId}&${params.toString()}`);
      if (!response.ok) throw new Error("Erreur lors de la récupération des appels");
      const callsData: Call[] = await response.json();
      setCalls(callsData);
      setStats(calculateCallStats(callsData));
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, [userId, filter.byName, filter.byPhone]);

  const handleFilterChange = useCallback((newFilters: Partial<CallFilterType>) => {
    setFilter(prev => ({ ...prev, ...newFilters }));
  }, []);

  return { calls, stats, calendarEvents, loading, filter, handleFilterChange };
};
