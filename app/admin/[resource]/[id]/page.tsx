// src/app/admin/[resource]/[id]/page.tsx
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { ResourceEditForm } from '@/src/Components';
import { getServerSession } from 'next-auth';
import { notFound } from 'next/navigation';

interface ResourceEditPageProps {
  params: Promise<{ resource: string, id: string }>;
}

export default async function ResourceEditPage({ params }: ResourceEditPageProps) {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken ?? null;
  const { resource, id } = await params;

  // Vérifiez que l'ID est un nombre valide
  if (!/^\d+$/.test(id)) {
    return notFound();
  }

  return (
    <div className="p-8">
      <ResourceEditForm
        resourceName={resource}
        id={parseInt(id)}
        accessToken={accessToken}
      />
    </div>
  );
}