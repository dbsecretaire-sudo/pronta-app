"use client";
import { useSession } from "next-auth/react";
import { useServices } from '@/src/Hook/useServices';
import { ServiceCard, AccountSummary } from '@/src/Modules/index';
import { useEffect, useState } from "react";
import { ServiceForm } from "@/src/Components";
import { createService, fetchAllServices, fetchUser } from "@/src/lib/api";
import { Service } from "@/src/Types/Services";
import { User } from "@/src/Types/Users";

export default function DashboardHome() {
  const { data: session, status } = useSession();
  const { loading, handleSubscribe, handleDeactivate, handleReactivate } = useServices(session?.user?.id, status);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sO, setSO] = useState<Service[]>([]);
  const [sN, setSN] = useState<Service[]>([]);
  const [s, setS] = useState<Service[]>([]);
  const [user, setUser] = useState<User | null>(null);

  
  const fetchData = async () => {
    const [fetchedUser, allServices] = await Promise.all([
      fetchUser(Number(session?.user.id)),
      fetchAllServices(),
    ]);

    setUser(fetchedUser);
    setS(allServices);
    const servicesWithStatus = allServices.map(service => {
      return {
        ...service,
        isSubscribed: fetchedUser.service_ids.includes(service.id),
      };
    });

    const sO = servicesWithStatus.filter(service => 
      service.isSubscribed === true
    );

    const sN = servicesWithStatus.filter(service => 
      service.isSubscribed === false && service.is_active === true
    );

    setSO(sO);
    setSN(sN); 
  }

  useEffect(() => {
    if (status === "loading" || status === "unauthenticated") {
      return;
    }
    if (status === "authenticated" && session?.user.id) {
      fetchData();
    }
  }, [status, session?.user.id]);


  const subscribedServices = sO;
  const unSubscribedServices = sN;
console.log("sO: ",sO, ", sN: ", sN,", s: ", s)
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
