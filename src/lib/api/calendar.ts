import { CalendarEvent } from "@/src/Types/Calendar/index";
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;


export async function fetchCalendar(accessToken: string | null): Promise<CalendarEvent[]> {
  const url = `${API_URL}/api/calendar`;
  const res = await fetch(url, {
     credentials: 'include',
     headers: {
      'Content-type' : 'application/json',
      'Authorization': `Bearer ${accessToken}`
     }
  });
  return res.json();
}

export const fetchCalendarEvents = async (userId?: number) => {
  try {
    const currentSession = await getSession();
    if (!currentSession) {
      throw new Error("Session expirée. Veuillez vous reconnecter.");
    }

    const response = await fetch(`/api/calendar?userId=${userId}`, {
       credentials: 'include',
      headers: {
        'Content-type' : 'application/json',
        'Authorization': `Bearer ${currentSession.accessToken}`
      }   
    });
    if (!response.ok) {
      throw new Error('Failed to fetch calendar events');
    }
    return response.json();
  } catch (error) {
    throw error;
  }
};
