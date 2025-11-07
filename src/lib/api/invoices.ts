import { Invoice } from "@/src/Types/Invoices";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchInvoices(): Promise<Invoice[]> {
  const url = `${API_URL}/api/invoices`;
  const res = await fetch(url);
  return res.json();
}