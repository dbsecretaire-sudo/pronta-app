"use client";
import { useState } from "react";
import { Tab } from '@headlessui/react';
import Navbar from "@/app/components/Navbar";

export default function AccountPage() {
  const [activeTab, setActiveTab] = useState('profile');

  // Données mockées - à remplacer par un appel API réel
  const accountData = {
    profile: {
      email: "utilisateur@example.com",
      phone: "0612345678",
      company: "Entreprise SAS"
    },
    billing: {
      plan: "Pronta Pro",
      price: "49€",
      nextPayment: "15 décembre 2023",
      paymentMethod: {
        type: "VISA",
        last4: "4242",
        expDate: "12/25"
      },
      address: {
        street: "123 Rue de Paris",
        city: "Paris",
        zipCode: "75000",
        country: "France"
      },
      invoices: [
        { id: "INV-001", date: "2023-11-15", amount: "49.00", status: "paid", pdfUrl: "#" },
        { id: "INV-002", date: "2023-10-15", amount: "49.00", status: "paid", pdfUrl: "#" }
      ]
    },
    messages: [
      {
        id: "1",
        title: "Bienvenue sur Pronta",
        content: "Merci d'avoir souscrit à nos services. Voici quelques conseils pour bien démarrer...",
        date: "2023-11-15T10:00:00",
        isRead: false
      },
      {
        id: "2",
        title: "Mise à jour importante",
        content: "Nous avons amélioré notre interface de gestion des appels. Découvrez les nouveautés.",
        date: "2023-11-10T14:30:00",
        isRead: true
      }
    ]
  };

  // Navigation spécifique pour la page compte
  const navItems = [
    { name: "Tableau de bord", path: "/dashboard", icon: "📊" },
    { name: "Mon compte", path: "/dashboard/account", icon: "👤" }
  ];

  return (
    <Navbar
      navItems={navItems}
      showLogo={true}
      isInService={false}
    >
      <div className="p-8 max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold mb-8">Mon compte</h1>

        <div className="mb-6">
          <div className="sm:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="block w-full rounded-md border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="profile">Informations personnelles</option>
              <option value="billing">Facturation</option>
              <option value="messages">Messages</option>
            </select>
          </div>
          <div className="hidden sm:block">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-1 rounded-xl bg-blue-900/20 p-1">
                {['profile', 'billing', 'messages'].map((tab) => (
                  <Tab
                    key={tab}
                    className={({ selected }) =>
                      `w-full rounded-lg py-2.5 text-sm font-medium leading-5 ${
                        selected ? 'bg-white shadow text-blue-700' : 'text-blue-600 hover:bg-white/[0.12]'
                      }`
                    }
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab === 'profile' && 'Informations personnelles'}
                    {tab === 'billing' && 'Facturation'}
                    {tab === 'messages' && 'Messages'}
                  </Tab>
                ))}
              </nav>
            </div>
          </div>
        </div>

        {/* Contenu des onglets */}
        {activeTab === 'profile' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Informations personnelles</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Email</label>
                  <p className="mt-1">{accountData.profile.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Téléphone</label>
                  <p className="mt-1">{accountData.profile.phone}</p>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Entreprise</label>
                <p className="mt-1">{accountData.profile.company}</p>
              </div>
              <div className="mt-6">
                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Modifier les informations
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'billing' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Facturation</h2>
            <div className="space-y-6">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span>Plan {accountData.billing.plan}</span>
                  <span className="font-medium">{accountData.billing.price}/mois</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Prochain prélèvement le {accountData.billing.nextPayment}
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span>•••• {accountData.billing.paymentMethod.last4}</span>
                  <span>{accountData.billing.paymentMethod.type}</span>
                </div>
                <p className="text-sm text-gray-600 mt-1">
                  Expire le {accountData.billing.paymentMethod.expDate}
                </p>
                <div className="mt-3">
                  <button className="text-blue-600 text-sm hover:underline">
                    Mettre à jour
                  </button>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-medium mb-2">Adresse de facturation</h3>
                <p>{accountData.billing.address.street}</p>
                <p>{accountData.billing.address.zipCode} {accountData.billing.address.city}</p>
                <p>{accountData.billing.address.country}</p>
              </div>

              <div className="mt-6">
                <h3 className="font-medium mb-4">Historique de facturation</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Statut</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Facture</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {accountData.billing.invoices.map((invoice) => (
                        <tr key={invoice.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(invoice.date).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {invoice.amount}€
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              invoice.status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {invoice.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <a href={invoice.pdfUrl} className="text-blue-600 hover:underline" target="_blank">
                              Télécharger
                            </a>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'messages' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Tous mes messages</h2>
            <div className="space-y-4">
              {accountData.messages.map((message) => (
                <div key={message.id} className={`p-4 rounded-lg ${!message.isRead ? 'bg-blue-50' : 'bg-gray-50'}`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-medium">{message.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{message.content}</p>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(message.date).toLocaleString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </div>
                  </div>
                  {!message.isRead && (
                    <div className="mt-2">
                      <button className="text-blue-600 text-sm hover:underline">
                        Marquer comme lu
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Navbar>
  );
}
