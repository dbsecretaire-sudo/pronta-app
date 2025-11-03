"use client";

import { Subscription } from "@/src/Types/Subscription";
import { getStatusLabel, getStatusStyle } from "./utils";

interface SubscriptionInfoProps {
  serviceName?: string;
  subscriptions: Array<Partial<Subscription> & { id: number }>;
}

export const SubscriptionInfo = ({
  serviceName,
  subscriptions = [],
}: SubscriptionInfoProps) => {
  // Fonction pour formater une date
  const formatDate = (date: string | Date | undefined) => {
    if (!date) return "Non défini";
    try {
      return new Date(date).toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch {
      return "Date invalide";
    }
  };

  // Fonction pour calculer le nombre de jours restants
  const getDaysRemaining = (endDate: string | Date | undefined) => {
    if (!endDate) return null;
    const end = new Date(endDate);
    const today = new Date();
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  };

  // Fonction pour calculer le coût total des abonnements
  const calculateTotalCost = () => {
    return subscriptions.reduce((total, sub) => {
      let price = 0;
      if (sub.plan === "Basic") price = 9.99;
      else if (sub.plan === "Premium") price = 19.99;
      else if (sub.plan === "Enterprise") price = 49.99;
      return total + price;
    }, 0).toFixed(2);
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg">
      {subscriptions.length > 0 ? (
        <>
          <div className="text-sm text-gray-600 mb-3">
            Total: {calculateTotalCost()} €/mois
          </div>
          {subscriptions.map((subscription) => (
            <div key={subscription.id} className="space-y-3 p-4 bg-white rounded-lg shadow-sm mb-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-700">Abonnement #{subscription.id}</h4>
                  <p className="font-semibold text-lg">{subscription.plan}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(subscription.status)}`}>
                  {getStatusLabel(subscription.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                {subscription.start_date && (
                  <div>
                    <p className="text-gray-500">Date de début</p>
                    <p className="font-medium">{formatDate(subscription.start_date)}</p>
                  </div>
                )}
                {subscription.next_payment_date && (
                  <div>
                    <p className="text-gray-500">Prochaine échéance</p>
                    <p className="font-medium">{formatDate(subscription.next_payment_date)}</p>
                  </div>
                )}
                {subscription.end_date && (
                  <div>
                    <p className="text-gray-500">Fin d'abonnement</p>
                    <p className="font-medium">{formatDate(subscription.end_date)}</p>
                    {subscription.status === 'active' && (
                      <p className="text-xs text-gray-500 mt-1">
                        {getDaysRemaining(subscription.end_date)} jours restants
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </>
      ) : (
        <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm text-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-300 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <span className="font-medium">Aucun abonnement actif</span>
          <p className="text-sm text-gray-500 mt-1">
            Vous n'avez actuellement aucun abonnement actif.
          </p>
        </div>
      )}
    </div>
  );
};
