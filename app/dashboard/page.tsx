"use client";
import { useSession } from "next-auth/react";
import { useServices } from '@/src/Hook/useServices';
import { ServiceCard, MessageList, AccountSummary } from '@/src/Modules/index';
import { useState, useEffect } from 'react';
import { AvailableService } from "@/src/Types/Services";

export default function DashboardHome() {
  const { data: session, status } = useSession();
  const { services, availableServices, loading, handleSubscribe, handleDeactivate, handleReactivate } = useServices(session?.user?.id, status);
  const [subscribedServices, setSubscribedServices ] = useState<AvailableService[]>([]);
  const [servicesToReactivate, setServicesToReactivate ] = useState<AvailableService[]>([]);
  const [servicesToSubscribe, setServicesToSubscribe ] = useState<AvailableService[]>([]);

  if (loading) return <div className="p-8">Chargement...</div>;

  // Séparation des services
  setSubscribedServices(availableServices.filter(s => s.userService?.is_active));
  setServicesToReactivate(availableServices.filter(s => !s.userService?.is_active));
  setServicesToSubscribe(availableServices.filter(s => !s.userService));
  console.log("subscribedServices: ", subscribedServices);
  console.log("servicesToReactivate", servicesToReactivate);
  console.log("servicesToSubscribe", servicesToSubscribe);
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Tableau de bord</h1>

      {/* Services souscrits (actifs) */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Mes services</h2>
        {subscribedServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscribedServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSubscribed={true}
                onDeactivate={handleDeactivate}
                userService={service.userService}
              />
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <p className="text-gray-700 mb-4">Vous n'avez souscrit à aucun service pour le moment.</p>
          </div>
        )}
      </section>

      {/* Services disponibles (à réactiver ou à souscrire) */}
      {(servicesToReactivate.length > 0 || servicesToSubscribe.length > 0) && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Services disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Services à réactiver */}
            {servicesToReactivate.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSubscribed={false}
                onReactivate={handleReactivate}
                userService={service.userService}
              />
            ))}
            {/* Services à souscrire */}
            {servicesToSubscribe.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSubscribed={false}
                onSubscribe={handleSubscribe}
                userService={service.userService}
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
        <p className="text-gray-500 italic">Aucun message pour le moment.</p>
      </section>

      {/* Section Mon Compte */}
      <AccountSummary />
    </div>
  );
}
