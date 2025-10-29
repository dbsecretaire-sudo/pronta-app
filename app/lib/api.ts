const API_URL = process.env.NEXT_PUBLIC_API_URL_BACKEND; // Remplacez par l’URL de votre backend

export async function fetchCalls(filter: { byName: string; byPhone: string }) {
  const res = await fetch(`${API_URL}/calls?byName=${filter.byName}&byPhone=${filter.byPhone}`);
  return res.json();
}

export async function fetchCalendar() {
  const res = await fetch(`${API_URL}/calendar`);
  return res.json();
}
