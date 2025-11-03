"use client";
import { Subscription } from "@/src/Types/Subscription";
import { getStatusLabel, getStatusStyle } from "./utils";

interface SubscriptionInfoProps {
  serviceName?: string;
  subscriptions: Array<Partial<Subscription> & { id: number }>;
  isEditing?: boolean;
  onEdit?: (subscriptionId: number) => void;
  onDelete?: (subscriptionId: number) => void;
}

export const SubscriptionInfo = ({
  serviceName,
  subscriptions = [],
  isEditing = false,
  onEdit,
  onDelete
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
    // Dans une application réelle, vous auriez un champ 'price' dans votre table
    // et vous feriez la somme ici. Pour l'exemple, nous retournons un montant fictif.
    return subscriptions.reduce((total, sub) => {
      // Logique pour calculer le coût en fonction du plan
      let price = 0;
      if (sub.plan === "Basic") price = 9.99;
      else if (sub.plan === "Premium") price = 19.99;
      else if (sub.plan === "Enterprise") price = 49.99;
      return total + price;
    }, 0).toFixed(2);
  };

  return (
    <div className="bg-blue-50 p-4 rounded-lg mb-6">
      <div className="space-y-4">
        {serviceName && (
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium text-lg">{serviceName}</h3>
            {subscriptions.length > 0 && (
              <div className="text-sm text-gray-600">
                Total: {calculateTotalCost()} €/mois
              </div>
            )}
          </div>
        )}

        {/* Affichage du nombre total d'abonnements */}
        {subscriptions.length > 0 && (
          <div className="text-sm text-gray-600 mb-3">
            {subscriptions.length} abonnement{subscriptions.length > 1 ? 's' : ''} actif{subscriptions.length > 1 ? 's' : ''}
          </div>
        )}

        {/* Boucle sur les abonnements */}
        {subscriptions.length > 0 ? (
          subscriptions.map((subscription) => (
            <div key={subscription.id} className="space-y-3 p-4 bg-white rounded-lg shadow-sm relative">
              {/* Badge "En édition" si le mode édition est activé */}
              {isEditing && (
                <div className="absolute top-2 right-2 bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                  En édition
                </div>
              )}

              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium text-gray-700">Abonnement #{subscription.id}</h4>
                  <p className="font-semibold text-lg">{subscription.plan}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusStyle(subscription.status)}`}>
                    {getStatusLabel(subscription.status)}
                  </span>
                  {!isEditing && (
                    <div className="flex space-x-1">
                      {onEdit && (
                        <button
                          onClick={() => onEdit(subscription.id)}
                          className="p-1 text-gray-500 hover:text-blue-600"
                          title="Modifier"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(subscription.id)}
                          className="p-1 text-gray-500 hover:text-red-600"
                          title="Supprimer"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                          </svg>
                        </button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm">
                {/* Date de début */}
                {subscription.start_date && (
                  <div>
                    <p className="text-gray-500">Date de début</p>
                    <p className="font-medium">{formatDate(subscription.start_date)}</p>
                  </div>
                )}

                {/* Prochaine échéance */}
                {subscription.next_payment_date && (
                  <div>
                    <p className="text-gray-500">Prochaine échéance</p>
                    <p className="font-medium">{formatDate(subscription.next_payment_date)}</p>
                  </div>
                )}

                {/* Date de fin */}
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

              {/* Détails supplémentaires */}
              <div className="pt-3 border-t border-gray-100">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center text-gray-600">
                    <span className="mr-1">ID:</span>
                    <span className="font-mono">{subscription.id}</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="mr-1">Créé le:</span>
                    <span>{formatDate(subscription.created_at)}</span>
                  </div>
                </div>
              </div>
            </div>
          ))
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
    </div>
  );
};
