// app/dashboard/calendar/page.tsx
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { CalendarClient } from "@/src/Components/Calendar/CalendarClient";
import { getServerSession } from "next-auth";

export default async function CalendarPage() {
  // Récupérez les événements depuis votre API ou base de données
  const currentSession = await getServerSession(authOptions);
  const accessToken = currentSession?.accessToken ?? null;
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Calendrier</h1>
      <CalendarClient accessToken={accessToken}/>
    </div>
  );
}
