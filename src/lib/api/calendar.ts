import { CalendarEvent } from "@/src/Types/Calendar/index";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchCalendar(): Promise<CalendarEvent[]> {
  const url = `${API_URL}/api/calendar`;
  const res = await fetch(url);
  return res.json();
}

export const fetchCalendarEvents = async (userId?: number) => {
  try {
    const response = await fetch(`/api/calendar?userId=${userId}`);
    if (!response.ok) {
      throw new Error('Failed to fetch calendar events');
    }
    return response.json();
  } catch (error) {
    throw error;
  }
};
