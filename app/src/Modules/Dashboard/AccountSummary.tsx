// app/components/AccountSummary.tsx
import Link from 'next/link';

export const AccountSummary = () => (
  <section className="bg-white rounded-lg shadow-md p-6">
    <div className="flex justify-between items-center mb-5">
      <h2 className="text-xl font-semibold">Mon compte</h2>
      <Link href="/dashboard/account" className="text-blue-600 hover:underline text-sm">
        Voir tous les détails →
      </Link>
    </div>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div>
        <p className="text-gray-500 text-sm">Abonnement actuel</p>
        <p className="font-medium">Pronta Pro</p>
      </div>
      <div>
        <p className="text-gray-500 text-sm">Prochain paiement</p>
        <p className="font-medium">15 décembre 2023</p>
      </div>
      <div>
        <p className="text-gray-500 text-sm">Moyen de paiement</p>
        <p className="font-medium">•••• 4242 (VISA)</p>
      </div>
    </div>
  </section>
);
