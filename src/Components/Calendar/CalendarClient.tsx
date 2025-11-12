// app/dashboard/calendar/CalendarClient.tsx
"use client"; // <-- Marqué comme Client Component

import { Calendar } from "@/src/Components";
import { useAuth } from "@/src/context/AuthContext";
import { useCalendar } from "@/src/Hook/useCalendar";

export function CalendarClient() {
  const { session, status } = useAuth();
  const { calendarEvents } = useCalendar(session?.user.id);

  if (status === "loading") {
    return <div className="p-6">Chargement...</div>;
  }

  return <Calendar events={calendarEvents} />;
}
