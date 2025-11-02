"use client";
import { getStatusLabel, getStatusStyle } from "./utils";

interface SubscriptionInfoProps {
  serviceName?: string;
  subscriptionStatus?: string;
  subscriptionStartDate?: Date;
  nextPaymentDate?: Date;
  subscriptionEndDate?: Date;
  subscriptionPlan?: string;
}

export const SubscriptionInfo = ({
  serviceName,
  subscriptionStatus,
  subscriptionStartDate,
  nextPaymentDate,
  subscriptionEndDate,
  subscriptionPlan,
}: SubscriptionInfoProps) => {
  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-6">
      <div className="space-y-3">
        {serviceName ? (
          <>
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">Service souscrit</h3>
                <p className="font-semibold text-lg">{serviceName}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(subscriptionStatus)}`}>
                {getStatusLabel(subscriptionStatus)}
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              {subscriptionStartDate && (
                <div>
                  <p className="text-gray-500">Date de souscription</p>
                  <p>{new Date(subscriptionStartDate).toLocaleDateString('fr-FR')}</p>
                </div>
              )}
              {nextPaymentDate && (
                <div>
                  <p className="text-gray-500">Prochaine échéance</p>
                  <p>{new Date(nextPaymentDate).toLocaleDateString('fr-FR')}</p>
                </div>
              )}
              {subscriptionEndDate && (
                <div>
                  <p className="text-gray-500">Fin d'abonnement</p>
                  <p>{new Date(subscriptionEndDate).toLocaleDateString('fr-FR')}</p>
                </div>
              )}
            </div>
          </>
        ) : (
            <div className="flex justify-between items-center">
                <span className="font-medium">Plan actuel</span>
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                {subscriptionPlan || "Aucun"}
                </span>
            </div>
        )}
      </div>
    </div>
  );
};
