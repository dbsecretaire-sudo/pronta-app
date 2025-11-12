'use client';
import { useState, useEffect } from 'react';
import { fetchCalendar } from '@/src/lib/api';
import { CalendarEvent } from '../lib/schemas/calendar';

export const useCalendar = (userId: string | undefined) => {
    const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]); // Initialisez comme un tableau vide

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