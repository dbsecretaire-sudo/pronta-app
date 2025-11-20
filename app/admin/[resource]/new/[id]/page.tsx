// src/app/admin/[resource]/[id]/page.tsx
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { AdminForm } from '@/src/Components';
import { fetchResourceItem, updateResource } from '@/src/lib/admin/api';
import { getServerToken, verifyAndDecodeToken } from '@/src/lib/auth';
import { getServerSession } from 'next-auth';
import { notFound, redirect } from 'next/navigation';
export const dynamic = 'force-dynamic';
interface ResourceItemPageProps {
  params: Promise<{ resource: string, id: string }>;
}

export default async function ResourceItemPage({ params }: ResourceItemPageProps) {
  const session = await getServerSession(authOptions);
  const accessToken = session?.accessToken ?? null;

  const { valid, payload } = verifyAndDecodeToken(accessToken);
  if (!valid) {
    redirect('/login');
  }

  const { resource, id } = await params;
  const isNew = id === 'new';

  let defaultValues = {};
  if (!isNew) {
    const data = await fetchResourceItem(resource, Number(id), accessToken);
    if (!data) return notFound();
    defaultValues = data;
  }

  // Définissez les champs en fonction de la ressource
  const getFields = (resourceName: string) => {
    switch (resourceName) {
      case 'clients':
        return [
          { name: 'name', label: 'Nom complet', type: 'text', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'phoneNumber', label: 'Téléphone', type: 'tel' },
          { name: 'company', label: 'Entreprise', type: 'text' },
        ];
      case 'calls':
        return [
          { name: 'phoneNumber', label: 'Numéro', type: 'tel', required: true },
          { name: 'type', label: 'Type', type: 'select', required: true, options: [
            { value: 'incoming', label: 'Entrant' },
            { value: 'outgoing', label: 'Sortant' },
            { value: 'missed', label: 'Manqué' },
          ]},
          { name: 'duration', label: 'Durée (secondes)', type: 'number' },
        ];
      default:
        return [];
    }
  };

  const fields = getFields(resource);

  const handleSubmit = async (formData: any) => {
    'use server';
    await updateResource(accessToken, resource, isNew ? undefined : Number(id), formData);
    redirect(`/admin/${resource}`);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold capitalize">
          {isNew ? 'Nouveau' : 'Modifier'} {resource}
        </h1>
      </div>

      <AdminForm
        fields={fields}
        defaultValues={defaultValues}
        onSubmit={handleSubmit}
        submitText={isNew ? 'Créer' : 'Mettre à jour'}
      />
    </div>
  );
}
