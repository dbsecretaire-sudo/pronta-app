import { CalendarEvent } from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL; // Remplacez par l’URL de votre backend

export async function fetchCalls(filter: { byName: string; byPhone: string }) {
  const res = await fetch(`${API_URL}/calls?byName=${filter.byName}&byPhone=${filter.byPhone}`);
  return res.json();
}

console.log("URL de l'API :", API_URL); // Ajoutez ce log pour déboguer

export async function fetchCalendar(): Promise<CalendarEvent[]> {
  const res = await fetch(`${API_URL}/api/calendar`);
  return res.json();
}