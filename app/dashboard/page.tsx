"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Service, AvailableService } from "@/app/Types/Services/index";
import { UserService } from "@/app/Types/UserServices/index";
import { Message } from "@/app/Types/Components/Message/Message";

export default function DashboardHome() {
  const { data: session, status } = useSession();
  const [services, setServices] = useState<Service[]>([]);
  const [availableServices, setAvailableServices] = useState<AvailableService[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") { return; }
    if (status === "unauthenticated") { setLoading(false);  return; }
    if (status === "authenticated") {
      const fetchData = async () => {
        try {
          const [subscribedRes, allServicesRes] = await Promise.all([
            fetch(`/api/UserServices/${session.user.id}`, {credentials: 'include'}),
            fetch('/api/services', {credentials: 'include'})
          ]);

          if (!subscribedRes.ok) { throw new Error(`Erreur HTTP: ${subscribedRes.status}`);}
          if (!allServicesRes.ok) { throw new Error(`Erreur HTTP: ${allServicesRes.status}`); }
          const subscribedServices = await subscribedRes.json();
          // const subscribedServices = subscribedServicesData.map((subscription: any) => subscription.service);
          const allServices = await allServicesRes.json();

          if (!Array.isArray(subscribedServices)) {
            setServices([]);
            setAvailableServices(
              allServices.map((service: AvailableService) => ({
                ...service,
                isSubscribed: false
              }))
            );
            return;
          }

          const servicesWithStatus = allServices.map((service: AvailableService) => ({
            ...service,
            isSubscribed: subscribedServices.some((s: Service) => s.id !== service.id)
          }));

          setServices(subscribedServices);
          setAvailableServices(servicesWithStatus);
          
        } catch (error) {
          console.error("Erreur lors de la récupération des données:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchData();

    }
   }, [status, session]);

  const handleSubscribe = async (serviceId: number) => {
    try {
      const response = await fetch('/api/user/services', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ serviceId }), // À remplacer par l'ID utilisateur réel
      });

      if (response.ok) {
        // Rafraîchir les données
        const [subscribedRes, allServicesRes] = await Promise.all([
          fetch('/api/user/services', {credentials: 'include'}),
          fetch('/api/services', {credentials: 'include'})
        ]);

        const subscribedServices = await subscribedRes.json();
        const allServices = await allServicesRes.json();

        const servicesWithStatus = allServices.map((service: AvailableService) => ({
          ...service,
          isSubscribed: !subscribedServices.some((s: Service) => s.id === service.id)
        }));
        setServices(subscribedServices);
        setAvailableServices(servicesWithStatus);
      }
    } catch (error) {
      console.error("Erreur lors de l'abonnement:", error);
    }
  };

  if (loading) return <div className="p-8">Chargement...</div>;
services.map((service) => console.log(service)); //services souscrits
console.log(availableServices); //services disponibles
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Tableau de bord</h1>

      {/* Services souscrits */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Mes services</h2>
        {/* {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <Link
                key={service.id}
                href={service.route}
                className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-all border border-gray-100"
              >
                <div className="flex items-center mb-3">
                  <span className="text-2xl mr-3">{service.icon}</span>
                  <h3 className="text-lg font-medium">{service.name}</h3>
                </div>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <div className="text-sm text-blue-600 font-medium">
                  Accéder →
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <p className="text-gray-700 mb-4">Vous n'avez souscrit à aucun service pour le moment.</p>
          </div>
        )} */}
      </section>

      {/* Services disponibles */}
      {availableServices.some(s => !s.isSubscribed) && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Services disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableServices
              .filter(s => !s.isSubscribed)
              .map((service) => (
                <div
                  key={service.id}
                  className="bg-white p-6 rounded-lg shadow-md border border-gray-100"
                >
                  <div className="flex items-center mb-3">
                    <span className="text-2xl mr-3">{service.icon}</span>
                    <h3 className="text-lg font-medium">{service.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-4">{service.description}</p>
                  <button
                    onClick={() => handleSubscribe(service.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
                  >
                    Souscrire
                  </button>
                </div>
              ))}
          </div>
        </section>
      )}

      {/* Section Messagerie intégrée */}
      <section className="mb-10 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Messages importants</h2>
          <span className="text-sm text-gray-500">
            {/* {messages.filter(m => !m.isRead).length} non lus */}
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
