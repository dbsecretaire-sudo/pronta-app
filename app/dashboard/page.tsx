// app/dashboard/page.tsx
"use client";
import { useSession } from "next-auth/react";
import { useServices } from '@/src/Hook/useServices';
import { ServiceCard, MessageList, AccountSummary } from '@/src/Modules/index';

export default function DashboardHome() {
  const { data: session, status } = useSession();
  const { services, availableServices, loading, handleSubscribe, handleDeactivate, handleReactivate } = useServices(session?.user?.id, status);

  if (loading) return <div className="p-8">Chargement...</div>;

  const userServicesMap = new Map<number, any>();
  availableServices.forEach((s) => {
    if (s.userService && !s.userService?.is_active) userServicesMap.set(s.id, s.userService);
  });

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Tableau de bord</h1>
      {/* Services souscrits */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Mes services</h2>
        {services.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSubscribed
                onDeactivate={handleDeactivate}
                userService={userServicesMap.get(service.id)}
              />
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <p className="text-gray-700 mb-4">Vous n'avez souscrit à aucun service pour le moment.</p>
          </div>
        )}
      </section>
      {/* Services disponibles */}
      {availableServices.length > 0 && (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Services disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {availableServices.map((service) => {
              const shouldShowReactivate = service.isSubscribed && !service.userService?.is_active;

              return (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isSubscribed={service.isSubscribed}
                  onSubscribe={!service.isSubscribed ? handleSubscribe : undefined}
                  onDeactivate={service.isSubscribed && service.userService?.is_active ? handleDeactivate : undefined}
                  onReactivate={shouldShowReactivate ? handleReactivate : undefined}
                  userService={service.userService}
                />
              );
            })}
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
