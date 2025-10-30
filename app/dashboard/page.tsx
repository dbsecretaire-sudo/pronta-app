"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Service {
  id: number;
  name: string;
  description: string;
  route: string;
  icon: string;
}

interface Message {
  id: number;
  title: string;
  content: string;
  date: string;
  isRead: boolean;
}

export default function DashboardHome() {
  const [services, setServices] = useState<Service[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Récupérer les services et messages en parallèle
    Promise.all([
      fetch('/api/user/services').then(res => res.json()),
      fetch('/api/user/messages').then(res => res.json())
    ]).then(([servicesData, messagesData]) => {
      setServices(servicesData);
      setMessages(messagesData);
      setLoading(false);
    }).catch(error => {
      console.error("Erreur:", error);
      setLoading(false);
    });
  }, []);

  if (loading) return <div className="p-8">Chargement...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Tableau de bord</h1>

      {/* Section Services souscrits */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Mes services</h2>
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.id}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all cursor-pointer border border-gray-100"
                onClick={() => router.push(service.route)}
              >
                <div className="flex items-center mb-3">
                  <span className="material-icons text-blue-600 mr-3">{service.icon}</span>
                  <h3 className="text-lg font-medium">{service.name}</h3>
                </div>
                <p className="text-gray-600">{service.description}</p>
                <div className="mt-4 text-sm text-blue-600 font-medium">
                  Accéder →
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 p-6 rounded-lg">
            <p className="text-gray-700">Vous n'avez souscrit à aucun service pour le moment.</p>
            <Link href="/pricing" className="text-blue-600 hover:underline mt-2 inline-block">
              Découvrir nos offres →
            </Link>
          </div>
        )}
      </section>

      {/* Section Messagerie intégrée */}
      <section className="mb-10 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Messages importants</h2>
          <span className="text-sm text-gray-500">
            {messages.filter(m => !m.isRead).length} non lus
          </span>
        </div>

        {messages.length > 0 ? (
          <div className="divide-y divide-gray-200">
            {messages.slice(0, 3).map((message) => (
              <div
                key={message.id}
                className={`py-4 ${!message.isRead ? 'bg-blue-50' : ''}`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-medium">{message.title}</h3>
                    <p className="text-gray-600 text-sm mt-1 line-clamp-2">{message.content}</p>
                  </div>
                  <div className="text-xs text-gray-500 ml-4">
                    {new Date(message.date).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">Aucun message pour le moment.</p>
        )}
      </section>

      {/* Section Mon Compte (résumé) */}
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Mon compte</h2>
          <Link href="/dashboard/account" className="text-blue-600 hover:underline text-sm">
            Voir tous les détails →
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <p className="text-gray-500 text-sm">Abonnement actuel</p>
            <p className="font-medium">Pronta Pro</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Prochain paiement</p>
            <p className="font-medium">15 décembre 2023</p>
          </div>
          <div>
            <p className="text-gray-500 text-sm">Moyen de paiement</p>
            <p className="font-medium">•••• 4242 (VISA)</p>
          </div>
        </div>
      </section>
    </div>
  );
}
