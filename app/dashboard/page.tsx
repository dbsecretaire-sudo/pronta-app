// src/app/dashboard/page.tsx
"use client";
import { useSession } from "next-auth/react";
import { useServices } from '@/src/Hook/useServices';
import { ServiceCard, AccountSummary } from '@/src/Modules/index';
import { useState } from 'react';
import { updateUserSubscription } from '@/src/lib/api';
import { AvailableService } from "@/src/Types/Services";

export default function DashboardHome() {
  const { data: session, status } = useSession();
  const { services, availableServices, loading } = useServices(
    session?.user?.id,
    status
  );
  const [isUpdating, setIsUpdating] = useState(false);
  const [currentAction, setCurrentAction] = useState<'subscribe' | 'deactivate' | 'reactivate' | null>(null);

  // Fonction générique pour gérer les actions sur les services
  const handleServiceAction = async (
    action: 'subscribe' | 'deactivate' | 'reactivate',
    service: AvailableService
  ) => {
    if (!session?.user?.id) return;

    setIsUpdating(true);
    setCurrentAction(action);

    try {
      // Calcul des dates pour les souscriptions/réactivations
      const now = new Date();
      const endDate = new Date(now);
      endDate.setMonth(now.getMonth() + 1); // +1 mois

      const nextPaymentDate = new Date(endDate);
      nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);

      // Appel à notre fonction unifiée
      await updateUserSubscription(
        action,
        Number(session.user.id),
        {
            subscription_plan: service.name,
            subscription_end_date: now,
            next_payment_date: endDate,
            subscription_status: service.userService?.is_active ? "actif" : "inactif",
        }
      );

      // Rafraîchir les données
      await mutate();
    } catch (error) {
      console.error(`Erreur lors de ${action}:`, error);
      const errorMessage = error instanceof Error
        ? error.message
        : `Une erreur est survenue lors de ${action} du service`;

      alert(errorMessage);
    } finally {
      setIsUpdating(false);
      setCurrentAction(null);
    }
  };

  // Fonctions spécifiques pour chaque action (pour plus de clarté)
  const handleSubscribe = (service: AvailableService) => handleServiceAction('subscribe', service);
  const handleDeactivate = (serviceId: number) => {
    const service = availableServices.find(s => s.id === serviceId);
    if (service) handleServiceAction('deactivate', service);
  };
  const handleReactivate = (service: AvailableService) => handleServiceAction('reactivate', service);

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p>Chargement des services...</p>
      </div>
    </div>
  );

  // Séparation des services
  const subscribedServices = availableServices.filter(s => s.userService?.is_active);
  const servicesToReactivate = availableServices.filter(s => !s.userService?.is_active && s.userService);
  const servicesToSubscribe = availableServices.filter(s => !s.userService);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-8">Tableau de bord</h1>

      {/* Services souscrits (actifs) */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Mes services</h2>
        {subscribedServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {subscribedServices.map((service) => (
              <div key={service.id} className="relative">
                <ServiceCard
                  service={service}
                  isSubscribed={true}
                  onDeactivate={() => handleDeactivate(service.id)}
                  userService={service.userService}
                  // disabled={isUpdating}
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 p-6 rounded-lg mb-6">
            <p className="text-gray-700 mb-4">Vous n'avez souscrit à aucun service pour le moment.</p>
          </div>
        )}
      </section>

      {/* Services disponibles (à réactiver ou à souscrire) */}
      <section className="mb-10">
        <h2 className="text-xl font-semibold mb-4">Services disponibles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Services à réactiver */}
          {servicesToReactivate.length > 0 &&
            servicesToReactivate.map((service) => (
              <div key={service.id} className="relative">
                <ServiceCard
                  service={service}
                  isSubscribed={true}
                  onReactivate={() => handleReactivate(service)}
                  userService={service.userService}
                  // disabled={isUpdating}
                />
              </div>
            ))}

          {/* Services à souscrire */}
          {servicesToSubscribe.length > 0 &&
            servicesToSubscribe.map((service) => (
              <div key={service.id} className="relative">
                <ServiceCard
                  service={service}
                  isSubscribed={false}
                  onSubscribe={() => handleSubscribe(service)}
                  // disabled={isUpdating}
                />
              </div>
            ))}
        </div>
      </section>

      {/* Section Mon Compte */}
      <AccountSummary />
    </div>
  );
}
