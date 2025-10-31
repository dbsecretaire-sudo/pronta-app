import { CalendarEvent } from "@/Types/Calendar/index";
import { CallFilter } from "@/Types/Calls/index"; 

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Remplacez par l’URL de votre backend

export async function fetchCalls(filter: CallFilter) {
  // Construisez l'URL avec tous les paramètres de filtre
  const queryParams = new URLSearchParams();

  // Ajoutez userId seulement s'il est défini
  if (filter.userId) {
    queryParams.append('userId', filter.userId.toString());
  }

  // Ajoutez les autres filtres seulement s'ils sont définis
  if (filter.byName) {
    queryParams.append('byName', filter.byName);
  }

  if (filter.byPhone) {
    queryParams.append('byPhone', filter.byPhone);
  }

  // Construisez l'URL complète
  const url = `${API_URL}/api/calls?${queryParams.toString()}`;

  const res = await fetch(url);
  return res.json();
}

export async function fetchCalendar(): Promise<CalendarEvent[]> {
  const res = await fetch(`${API_URL}/api/calendar`);
  return res.json();
}