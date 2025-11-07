"use client";
import { useSession } from "next-auth/react";
import { useServices } from '@/src/Hook/useServices';
import { ServiceCard, AccountSummary } from '@/src/Modules/index';
import { useState } from "react";
import { ServiceForm } from "@/src/Components";
import { createService } from "@/src/lib/api";

export default function DashboardHome() {
  const { data: session, status } = useSession();
  const { services, availableServices, loading, handleSubscribe, handleDeactivate, handleReactivate } = useServices(session?.user?.id, status);
  const [isAddServiceModalOpen, setIsAddServiceModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);



  // Séparation des services
  const subscribedServices = availableServices.filter((s) => s.userService?.is_active);
  const servicesToReactivate = availableServices.filter((s) => s.userService && !s.userService.is_active);
  const servicesToSubscribe = availableServices.filter((s) => !s.userService);
  const unsubscribedServices = availableServices.filter((s) => !s.userService || (s.userService && !s.userService.is_active));

  if (loading) return <div className="p-8">Chargement...</div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Tableau de bord</h1>

      {/* Mes services */}
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

      {/* Services disponibles */}
      {unsubscribedServices.length > 0 ? (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Services disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {servicesToReactivate.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSubscribed={true}
                onReactivate={handleReactivate}
                userService={service.userService}
              />
            ))}
            {servicesToSubscribe.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSubscribed={false}
                onSubscribe={handleSubscribe}
              />
            ))}
            {/* <button
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
              onClick={() => setIsAddServiceModalOpen(true)}
            >
              Ajouter un service
            </button> */}
          </div>
        </section>
      ) : ( '' )}

      {/* Modal d'ajout de service */}
      {isAddServiceModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Ajouter un nouveau service</h3>
            <ServiceForm
              onSubmit={async (data) => {
                setIsSubmitting(true);
                setError(null);
                try {
                  await createService(data);
                  setIsAddServiceModalOpen(false);
                } catch (err) {
                  setError(err instanceof Error ? err.message : "Une erreur est survenue");
                } finally {
                  setIsSubmitting(false);
                }
              }}
              onCancel={() => setIsAddServiceModalOpen(false)}
              isSubmitting={isSubmitting}
              error={error}
            />
          </div>
        </div>
      )}

      {/* Messages importants */}
      <section className="mb-10 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Messages importants</h2>
        </div>
        <p className="text-gray-500 italic">Aucun message pour le moment.</p>
      </section>

      {/* Mon Compte */}
      <AccountSummary />
    </div>
  );
}
