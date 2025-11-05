import { CallFilter } from "@/src/Types/Calls/index";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchCalls(filter: CallFilter) {
  const queryParams = new URLSearchParams();
  if (filter.userId) queryParams.append('userId', filter.userId.toString());
  if (filter.byName) queryParams.append('byName', filter.byName);
  if (filter.byPhone) queryParams.append('byPhone', filter.byPhone);

  const url = `${API_URL}/api/calls?${queryParams.toString()}`;
  const res = await fetch(url);
  return res.json();
}
