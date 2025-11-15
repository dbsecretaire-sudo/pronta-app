'use client';
import { useState, useEffect } from 'react';
import { fetchCalendar } from '@/src/lib/api';
import { CalendarEvent } from '../lib/schemas/calendar';
import { useAuthCheck } from './useAuthCheck';
import { useRouter } from 'next/navigation';

export const useCalendar = (userId: string | undefined) => {
    const router = useRouter();
    const { data: session, status } = useAuthCheck();
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]); // Initialisez comme un tableau vide

// useEffect(() => {
//     // Si la session n'est pas chargée ou n'existe pas
//     if (status === 'unauthenticated' || !session) {
//       router.push('/login');
//       return;
//     }
   
//   }, [session, status, router]);

    useEffect(() => {
        const fetchEvents = async () => {
            if (!userId) return; // Ne pas faire la requête si userId n'est pas défini

            try {
                const events = await fetchCalendar(); // Attendre la résolution de la promesse

                // Filtrer les événements pour l'utilisateur donné
                const userEvents = events.filter(
                    (cal: CalendarEvent) => cal.user_id === Number(userId)
                );

                setCalendarEvents(userEvents);
            } catch (error) {
                console.error("Erreur lors de la récupération des événements:", error);
                setCalendarEvents([]); // Réinitialiser en cas d'erreur
            }
        };

        fetchEvents();
    }, [userId]); // Ajoutez userId comme dépendance

    return { calendarEvents };
};