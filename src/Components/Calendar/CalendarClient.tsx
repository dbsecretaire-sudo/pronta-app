// app/dashboard/calendar/CalendarClient.tsx
"use client"; // <-- Marqué comme Client Component

import { Calendar } from "@/src/Components";
import { useCalendar } from "@/src/Hook/useCalendar";
import { useAuthCheck } from "@/src/Hook/useAuthCheck";
import { useEffect, useState } from "react";

export function CalendarClient({accessToken}: {accessToken: {} | string | null}) {
  const { data:session, status } = useAuthCheck(accessToken);

  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const userIdVerified = isAuthChecked && status === 'authenticated' ? session?.id : undefined;

    // Attendre que l'authentification soit vérifiée
  useEffect(() => {
    if (status !== 'loading') {
      setIsAuthChecked(true);
    }
  }, [status]);

  const { calendarEvents } = useCalendar(userIdVerified, accessToken);

  if (status === "loading") {
    return <div className="p-6">Chargement...</div>;
  }

  return <Calendar events={calendarEvents} />;
}
