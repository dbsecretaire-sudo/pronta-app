import { NextResponse } from 'next/server';

export async function GET() {
  // Exemple : Retournez des données statiques pour le build
  const events = [
    { title: "Rendez-vous 1", start: new Date(2025, 9, 29, 10, 0), end: new Date(2025, 9, 29, 11, 0) },
    { title: "Réunion", start: new Date(2025, 9, 30, 14, 0), end: new Date(2025, 9, 30, 15, 30) },
  ];
  return NextResponse.json(events);
}
