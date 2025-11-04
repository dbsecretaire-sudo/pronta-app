// app/components/AccountSummary.tsx
"use client";
import Link from 'next/link';
import { useAccount } from '@/src/Hook/useAccount';
import { SubscriptionWithService } from '@/src/Types/Subscription';

export const AccountSummary = () => {
  const { userData, subscriptions, loading, error } = useAccount();
 

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

    // Déclare un type pour les clés possibles
    type PaymentMethodType = 'credit_card' | 'paypal' | 'bank_transfer';

    // Vérifie que `type` est une clé valide
    const paymentMethods: Record<PaymentMethodType, string> = {
      credit_card: `•••• ${details?.card_last_four || ''} (${details?.card_brand || 'Carte'})`,
      paypal: `PayPal (${details?.paypal_email || 'email manquant'})`,
      bank_transfer: "Virement bancaire",
    };

    // Utilise un type guard pour vérifier que `type` est une clé valide
    if (type in paymentMethods) {
      return paymentMethods[type as PaymentMethodType];
    }

    return "Moyen de paiement inconnu";
  };


  // Trouve les abonnements actifs
  const activeSubscriptions: SubscriptionWithService[] = subscriptions?.filter((sub: SubscriptionWithService) => sub.status === 'active') || [];

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
        <Link href="/dashboard/account" className="text-blue-600 hover:underline text-sm">
          Voir tous les détails →
        </Link>
      </div>

      {/* Affichage des abonnements actifs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Nombre d'abonnements actifs */}
        <div>
          <p className="text-gray-500 text-sm">Abonnements actifs</p>
          <p className="font-medium">
            {activeSubscriptions.length} abonnement{activeSubscriptions.length > 1 ? 's' : ''}
          </p>
        </div>

        {/* Prochain paiement (le plus proche) */}
        <div>
          <p className="text-gray-500 text-sm">Prochain paiement</p>
          <p className="font-medium">
            {activeSubscriptions.length > 0
              ? formatDate(
                activeSubscriptions
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
      {activeSubscriptions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Mes abonnements</h3>
          <div className="space-y-3">
            {activeSubscriptions.map((subscription) => (
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
                  <Link
                    href={subscription.service.route}
                    className="text-blue-600 text-sm hover:underline"
                  >
                    Gérer →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </section>
  );
};
