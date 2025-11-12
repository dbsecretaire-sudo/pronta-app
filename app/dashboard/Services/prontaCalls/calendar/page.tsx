// app/dashboard/calendar/page.tsx
import { CalendarClient } from "@/src/Components/Calendar/CalendarClient";

export default async function CalendarPage() {
  // Récupérez les événements depuis votre API ou base de données

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Calendrier</h1>
      <CalendarClient/>
    </div>
  );
}
