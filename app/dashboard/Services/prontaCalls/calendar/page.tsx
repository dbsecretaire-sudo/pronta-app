// app/dashboard/calendar/page.tsx
import { Calendar } from "@/src/Components";
import { fetchCalendar } from "@/src/lib/api"; // Assurez-vous que cette fonction existe

export default async function CalendarPage() {
  // Récupérez les événements depuis votre API ou base de données
  const events = await fetchCalendar(); // Exemple : [{ title: "Rendez-vous", start: new Date(2025, 9, 29), end: new Date(2025, 9, 29, 1, 0) }]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Calendrier</h1>
      <Calendar events={events} />
    </div>
  );
}
