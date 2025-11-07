import { notFound } from 'next/navigation';
import { ResourceForm } from '@/src/Components'; // Composant client

export default async function NewResourcePage({ params }: { params: Promise<{ resource: string }> }) {
  const { resource } = await params;
  const isValidResource = ['clients', 'calls'].includes(resource);
  if (!isValidResource) notFound();

  return (
    <div className="max-w-md mx-auto my-8">
      <h1 className="text-2xl font-bold mb-4">
        Nouveau {resource === 'clients' ? 'client' : 'appel'}
      </h1>
      <ResourceForm resource={resource} />
    </div>
  );
}