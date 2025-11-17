import { Call, CallFilter } from "@/src/Types/Calls/index";
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchCalls(filter: CallFilter) {
  const queryParams = new URLSearchParams();
  if (filter.userId) queryParams.append('userId', filter.userId.toString());
  if (filter.byName) queryParams.append('byName', filter.byName);
  if (filter.byPhone) queryParams.append('byPhone', filter.byPhone);

  const url = `${API_URL}/api/calls?${queryParams.toString()}`;
  const currentSession = await getSession();
  if (!currentSession) {
    throw new Error("Session expirée. Veuillez vous reconnecter.");
  }

  const res = await fetch(url, { 
    credentials: 'include',
    headers: {
      'Content-type': "application/json",
      'Authorization': `Bearer ${currentSession.accessToken}`,
    } 
  });
  return res.json();
}

export const fetchAllCalls = async (accessToken: string | null): Promise<Call[]> => {
  const res = await fetch(`${API_URL}/api/calls/All`, { 
    credentials: 'include',
    headers: {
      'Content-type': "application/json",
      'Authorization': `Bearer ${accessToken}`,
    } 
  });
  if (!res.ok) throw new Error(`HTTP error: ${res.status}`);
  return res.json();
}

