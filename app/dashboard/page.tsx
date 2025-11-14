"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useServices } from '@/src/Hook/useServices';
import { ServiceCard, AccountSummary } from '@/src/Modules/index';
import { useState } from "react";
import { ServiceForm } from "@/src/Components";
import { createService } from "@/src/lib/api";
import { useSubscription } from "@/src/Hook/useSubscriptions";

export default function DashboardHome() {
    const { data: session, status } = useSession();
  const router = useRouter();
  const { s, sO, sN, loading, handleSubscribe, handleDeactivate, handleReactivate } = useServices(session?.user?.id, status);
  const { subscriptionServices } = useSubscription(session?.user.id, sO);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

    // Redirection si non authentifié
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/login');
    }
  }, [status, router]);

  // Affichage d'un loader pendant le chargement
  if (status === "loading") {
    return <div className="p-8">Chargement...</div>;
  }

  const subscribedServices = sO;
  const unSubscribedServices = sN;

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
                subscription={subscriptionServices.find(sub => sub.service_id === service.id)}
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
      {unSubscribedServices.length > 0 ? (
        <section className="mb-10">
          <h2 className="text-xl font-semibold mb-4">Services disponibles</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {unSubscribedServices.map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                isSubscribed={false}
                onSubscribe={handleSubscribe}
                onReactivate={handleReactivate}
              />
            ))}           
          </div>
        </section>
      ) : ( '' )}

      {/* Messages importants */}
      <section className="mb-10 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Messages importants</h2>
        </div>
        <p className="text-gray-500 italic">Aucun message pour le moment.</p>
      </section>

      {/* Mon Compte */}
        <AccountSummary
          sN={unSubscribedServices}
          sO={subscribedServices}
        />
    </div>
  );
}
