// app/components/AccountSummary.tsx
"use client";
import Link from 'next/link';
import { useAccount } from '@/src/Hook/useAccount';
import { Subscription, SubscriptionWithService } from '@/src/lib/schemas/subscription';
import { useTab } from '@/src/context/TabContext';
import { useRouter } from 'next/navigation';
import { Service } from '@/src/lib/schemas/services';
import { PaymentMethod } from '@/src/lib/schemas/users';

export const AccountSummary = ({sN, sO, accessToken}: {sN: Service[], sO: Service[], accessToken: string | null}) => {
  const { userData, subscriptionServices, loading, error } = useAccount(accessToken);
  const { setActiveTab } = useTab();
  const router = useRouter();
  const formatDate = (date: string | Date | null | undefined) => { // ✅ Ajoute `null` au type
    if (!date) return "Aucune date";

    try {
      const dateObj = date instanceof Date ? date : new Date(date);
      if (isNaN(dateObj.getTime())) return "Date invalide";

      return dateObj.toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      });
    } catch {
      return "Date invalide";
    }
  };


  // Formate la méthode de paiement
  const formatPaymentMethod = () => {
    if (!userData?.payment_method) return "Aucun moyen de paiement";

    const { type, details } = userData.payment_method;

    // Vérifie que `type` est défini et est une clé valide
    if (!type) return "Moyen de paiement inconnu";

    // Vérifie que `type` est une clé valide
    const paymentMethods: Record<PaymentMethod["type"], string> = {
      credit_card: `•••• ${(details as PaymentMethod["details"])?.card_last_four || ''} (${(details as PaymentMethod["details"])?.brand || 'Carte'})`,
      paypal: `PayPal (${(details as PaymentMethod["details"])?.paypal_email || 'email manquant'})`,
      bank_transfer: "Virement bancaire",
      other: "Autre",
    };

    // Utilise un type guard pour vérifier que `type` est une clé valide
    if (type in paymentMethods) {
      return paymentMethods[type as PaymentMethod["type"]];
    }

    return "Moyen de paiement inconnu";
  };

  if (loading) {
    return (
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="text-xl font-semibold">Mon compte</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="animate-pulse">
              <p className="text-gray-500 text-sm">Chargement...</p>
              <div className="h-5 bg-gray-200 rounded w-3/4 mt-1"></div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white rounded-lg shadow-md p-6">
        <div className="text-red-500 text-sm">Erreur lors du chargement des données.</div>
      </section>
    );
  }

  return (
    <section className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-5">
        <h2 className="text-xl font-semibold">Mon compte</h2>
        <button
          className="text-blue-600 hover:underline text-sm"
          onClick={() => {
            setActiveTab('profile');
            router.push('/dashboard/account');
          }}
        >
          Voir tous les détails →
        </button>
      </div>

      {/* Affichage des abonnements actifs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Nombre d'abonnements actifs */}
        <div>
          <p className="text-gray-500 text-sm">Abonnements actifs</p>
          <p className="font-medium">
            {subscriptionServices.length} abonnement{subscriptionServices.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Prochain paiement (le plus proche) */}
        <div>
          <p className="text-gray-500 text-sm">Prochain paiement</p>
          <p className="font-medium">
            {subscriptionServices.length > 0
              ? formatDate(
                subscriptionServices
                  .map(sub => sub.next_payment_date)
                  .filter((date): date is string | Date => date !== null && date !== undefined) // Filtre les null/undefined
                  .sort((a, b) => new Date(a).getTime() - new Date(b).getTime())[0]
                )
              : "Aucun paiement prévu"}
          </p>
        </div>

        {/* Moyen de paiement */}
        <div>
          <p className="text-gray-500 text-sm">Moyen de paiement</p>
          <p className="font-medium">{formatPaymentMethod()}</p>
        </div>
      </div>

      {/* Liste des abonnements actifs */}
      {subscriptionServices.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Mes abonnements</h3>
          <div className="space-y-3">
            {subscriptionServices.map((subscription) => (
              <div key={subscription.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">{subscription.service.icon}</span>
                      <h4 className="font-medium">{subscription.service.name}</h4>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {subscription.service.price} €/{subscription.service.unit}
                    </p>
                    <p className="text-sm text-gray-500">
                      Prochain paiement: {formatDate(subscription.next_payment_date)}
                    </p>
                  </div>
                  <button
                    className="text-blue-600 text-sm hover:underline"
                    onClick={() => {
                      setActiveTab('billing');
                      router.push('/dashboard/account');
                    }}
                  >
                    Gérer →
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
