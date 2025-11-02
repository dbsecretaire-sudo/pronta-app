"use client";
import { SubscriptionFields } from "@/src/Types/Users";
import { getStatusLabel, getStatusStyle } from "./utils";

interface SubscriptionInfoProps {
  serviceName?: string;
  subscriptions: SubscriptionFields[];
}

export const SubscriptionInfo = ({
  serviceName,
  subscriptions = [],
}: SubscriptionInfoProps) => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-6">
      <div className="space-y-4">
        {serviceName && (
          <h3 className="font-medium text-lg mb-2">Services souscrits</h3>
        )}

        {/* Boucle sur les abonnements */}
        {subscriptions.length > 0 ? (
          subscriptions.map((subscription, index) => (
            <div key={index} className="space-y-3 p-4 bg-white rounded-lg shadow-sm">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">Abonnement {index + 1}</h4>
                  <p className="font-semibold">{subscription.plan}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(subscription.status)}`}>
                  {getStatusLabel(subscription.status)}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                {subscription.start_date && (
                  <div>
                    <p className="text-gray-500">Date de souscription</p>
                    <p>{new Date(subscription.start_date).toLocaleDateString('fr-FR')}</p>
                  </div>
                )}
                {subscription.next_payment_date && (
                  <div>
                    <p className="text-gray-500">Prochaine échéance</p>
                    <p>{new Date(subscription.next_payment_date).toLocaleDateString('fr-FR')}</p>
                  </div>
                )}
                {subscription.end_date && (
                  <div>
                    <p className="text-gray-500">Fin d'abonnement</p>
                    <p>{new Date(subscription.end_date).toLocaleDateString('fr-FR')}</p>
                  </div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm">
            <span className="font-medium">Aucun abonnement actif</span>
          </div>
        )}
      </div>
    </div>
  );
};
