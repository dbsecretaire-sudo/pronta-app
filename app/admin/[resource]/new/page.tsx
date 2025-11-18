import { notFound } from 'next/navigation';
import { ResourceForm } from '@/src/Components'; // Composant client
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function NewResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } =  await params;

  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken ?? null;

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
    <div className="max-w-md mx-auto my-8">
      <h1 className="text-2xl font-bold mb-4">
        Nouveau {resourceNames[resource]}
      </h1>
      <ResourceForm resource={resource} accessToken={accessToken} />
    </div>
  );
}