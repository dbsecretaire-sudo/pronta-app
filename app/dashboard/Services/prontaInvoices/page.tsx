"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { Invoice } from "@/models/Invoice";

export default function ProntaInvoicesDashboard() {
  const [stats, setStats] = useState({
    totalInvoices: 0,
    paidInvoices: 0,
    pendingInvoices: 0,
    totalRevenue: 0
  });
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupérer les données depuis l'API
    const fetchData = async () => {
      try {
        const [statsRes, invoicesRes] = await Promise.all([
          fetch('/api/invoices/stats'),
          fetch('/api/invoices/recent')
        ]);
        const statsData = await statsRes.json();
        const invoicesData = await invoicesRes.json();
        setStats(statsData);
        setRecentInvoices(invoicesData);
      } catch (error) {
        console.error("Erreur:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) return <div className="p-8">Chargement...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-8">Tableau de bord Pronta Invoices</h1>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-2 text-gray-500">Factures totales</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.totalInvoices}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-2 text-gray-500">Payées</h2>
          <p className="text-3xl font-bold text-green-600">{stats.paidInvoices}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-2 text-gray-500">En attente</h2>
          <p className="text-3xl font-bold text-yellow-600">{stats.pendingInvoices}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-2 text-gray-500">Revenus</h2>
          <p className="text-3xl font-bold text-green-600">{stats.totalRevenue}€</p>
        </div>
      </div>

      {/* Factures récentes */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Factures récentes</h2>
          <Link href="/dashboard/Services/prontaInvoices/invoices" className="text-blue-600 hover:underline">
            Voir toutes →
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date d'échéance</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentInvoices.map((invoice) => (
                <tr key={invoice.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{invoice.clientName}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{invoice.amount}€</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                      invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {invoice.status === 'draft' ? 'Brouillon' :
                       invoice.status === 'sent' ? 'Envoyée' :
                       invoice.status === 'paid' ? 'Payée' : 'En retard'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(invoice.dueDate).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Actions rapides */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Créer une nouvelle facture</h2>
          <Link
            href="/dashboard/Services/prontaInvoices/invoices/new"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 inline-block"
          >
            Nouvelle facture
          </Link>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-medium mb-4">Ajouter un client</h2>
          <Link
            href="/dashboard/Services/prontaInvoices/clients/new"
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 inline-block"
          >
            Nouveau client
          </Link>
        </div>
      </div>
    </div>
  );
}
