// app/dashboard/calendar/CalendarClient.tsx
"use client"; // <-- Marqué comme Client Component

import { Calendar } from "@/src/Components";
import { useCalendar } from "@/src/Hook/useCalendar";
import { useSession } from "next-auth/react";

export function CalendarClient() {
  const { data:session, status } = useSession();
  const { calendarEvents } = useCalendar(session?.user.id);

  if (status === "loading") {
    return <div className="p-6">Chargement...</div>;
  }

  return <Calendar events={calendarEvents} />;
}
