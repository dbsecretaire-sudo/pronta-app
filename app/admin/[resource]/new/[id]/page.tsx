// src/app/admin/[resource]/[id]/page.tsx
import { AdminForm } from '@/src/Components/admin/ui/FormFields';
import { fetchResourceItem, updateResource } from '@/src/lib/admin/api';
import { notFound, redirect } from 'next/navigation';

interface ResourceItemPageProps {
  params: Promise<{ resource: string, id: string }>;
}

export default async function ResourceItemPage({ params }: ResourceItemPageProps) {
  const { resource, id } = await params;
  const isNew = id === 'new';

  let defaultValues = {};
  if (!isNew) {
    const data = await fetchResourceItem(resource, Number(id));
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
          { name: 'phone', label: 'Téléphone', type: 'tel' },
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
    await updateResource(resource, isNew ? undefined : Number(id), formData);
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
