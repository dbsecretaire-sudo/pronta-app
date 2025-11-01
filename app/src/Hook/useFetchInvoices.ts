// app/hooks/useFetchInvoices.ts
import { useState, useEffect } from 'react';
import { Invoice } from '@/app/src/Types/Invoices/index';

export const useFetchInvoices = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await fetch('/api/invoices');
        const data = await res.json();
        setInvoices(data);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  return { invoices, loading };
};
