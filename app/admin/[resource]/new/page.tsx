import { notFound, redirect } from 'next/navigation';
import { ResourceForm } from '@/src/Components'; // Composant client
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerToken, verifyAndDecodeToken } from '@/src/lib/auth';
import Link from 'next/link';
export const dynamic = 'force-dynamic';
export default async function NewResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } =  await params;

  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken ?? null;

  const { valid, payload } = verifyAndDecodeToken(accessToken);
  if (!valid) {
    redirect('/login');
  }
  // Liste des ressources valides
  const validResources = ['clients', 'calls', 'users', 'invoices', 'calendar', 'services', 'subscriptions'];

  // Vérification de la validité de la ressource
  if (!validResources.includes(resource)) {
    notFound();
  }

  // Mappage des noms de ressources en français
  const resourceNames: Record<string, string> = {
    clients: 'client',
    calls: 'appel',
    users: 'utilisateur',
    invoices: 'facture',
    calendar: 'événement de calendrier',
    services: 'service',
    subscriptions: 'abonnement',
  };

  return (
    <div className="max-w-7xl mx-auto my-8 mb-6">
       {/* Barre de retour spécifique à Admin */}
      <nav className="bg-white border-b border-gray-200 h-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
          <div className="flex justify-between items-center h-full">
            <Link
              href="/admin"
              className="text-xl font-bold text-gray-900 hover:text-blue-600 flex items-center transition-colors"
            >
              ← Retour au tableau de bord Administration
            </Link>
          </div>
        </div>
      </nav>
      <h1 className="text-center text-2xl font-bold mb-6">
        Nouveau {resourceNames[resource]}
      </h1>
      <ResourceForm resource={resource} accessToken={accessToken} />
    </div>
  );
}