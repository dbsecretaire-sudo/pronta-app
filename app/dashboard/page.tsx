// app/dashboard/page.tsx
"use client";
import { useSession } from "next-auth/react";
import { useServices } from '@/src/Hook/useServices';
import { ServiceCard, MessageList, AccountSummary } from '@/src/Modules/index';

export default function DashboardHome() {
  const { data: session, status } = useSession();
  const { services, availableServices, loading, handleSubscribe } = useServices(session?.user?.id, status);

  if (loading) return <div className="p-8">Chargement...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Tableau de bord</h1>

      {/* Services souscrits */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Mes services</h2>
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard key={service.id} service={service} isSubscribed />
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <p className="text-gray-700 mb-4">Vous n'avez souscrit à aucun service pour le moment.</p>
          </div>
        )}
      </section>

      {/* Services disponibles */}
      {availableServices.some(s => !s.isSubscribed) && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Services disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableServices
              .filter(s => !s.isSubscribed)
              .map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onSubscribe={handleSubscribe}
                />
              ))}
          </div>
        </section>
      )}

      {/* Section Messagerie intégrée */}
      <section className="mb-10 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Messages importants</h2>
        </div>
        {/* <MessageList messages={messages} /> */}
        <p className="text-gray-500 italic">Aucun message pour le moment.</p>
      </section>

      {/* Section Mon Compte */}
      <AccountSummary />
    </div>
  );
}
