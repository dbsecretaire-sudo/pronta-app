import { Invoice } from "@/src/Types/Invoices";
import { InvoiceItem } from "../schemas/invoices";
import { getSession } from "next-auth/react";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function fetchInvoices(accessToken: string | null): Promise<Invoice[]> {
  const url = `${API_URL}/api/invoices`;
  const res = await fetch(url, { 
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${accessToken}`, // <-- Utilise le token
    }, 
  });
  return res.json();
}

export async function fetchInvoiceItems(accessToken: string | null): Promise<InvoiceItem[]> {
  const url = `${API_URL}/api/invoices/item`;
  const res = await fetch(url, { 
    credentials: 'include',
    headers: {
      "Content-Type": "application/json",
      'Authorization': `Bearer ${accessToken}`, // <-- Utilise le token
    }, 
  });
  return res.json();
}