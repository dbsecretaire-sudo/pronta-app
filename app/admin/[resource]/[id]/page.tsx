// src/app/admin/[resource]/[id]/page.tsx
import { ResourceEditForm } from '@/src/Components';
import { notFound } from 'next/navigation';

interface ResourceEditPageProps {
  params: Promise<{ resource: string, id: string }>;
}

export default async function ResourceEditPage({ params }: ResourceEditPageProps) {
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
      />
    </div>
  );
}
