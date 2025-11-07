// src/app/admin/[resource]/page.tsx
import { fetchResource } from '@/src/lib/admin/api';
import { notFound } from 'next/navigation';
import { Call, Column, DataTableUi } from '@/src/Components';
import { fetchUsersName } from '@/src/lib/api';
import { User } from '@/src/Types/Users';

interface ResourcePageProps {
  params: Promise<{ resource: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

interface SerializableColumn<T> {
  header: string;
  accessor: keyof T;
  type?: 'text' | 'date' | 'duration' | 'typeBadge';
  typeData?: Record<string, { label: string; color: string }>;
}

export default async function ResourcePage({ params }: ResourcePageProps) {

  const { resource } = await params;
console.log( "Resource : ", resource);
  const data = await fetchResource(resource);

  if (!data) {
    return notFound();
  }

  let users: Record<number, { id: number; name: string }> = {};
  if (resource === 'calls') {
    const clientsData = await fetchUsersName();
    users = Object.fromEntries(clientsData.map((user: { id: any; }) => [user.id, user]));
  }

  // Définissez les colonnes en fonction de la ressource
  const getColumns = <T extends { id: number }>(resourceName: string): SerializableColumn<T>[] => {
    switch (resourceName) {
      case 'clients':
        return [
          { header: 'ID', accessor: 'id' as keyof T },
          { header: 'Nom', accessor: 'name' as keyof T },
          { header: 'Email', accessor: 'email' as keyof T },
          { header: 'Téléphone', accessor: 'phone' as keyof T },
          { header: 'Entreprise', accessor: 'company' as keyof T },
        ];
      case 'calls':
        return [
          { header: 'ID', accessor: 'id' as keyof T},
          { header: 'Numéro', accessor: 'phoneNumber'  as keyof T},
          { header: 'Utilisateur', accessor: 'user_name' as keyof T }, 
          {
            header: 'Type',
            accessor: 'type' as keyof T,
            type: 'typeBadge',
            typeData: {
              incoming: { label: 'Entrant', color: 'green' },
              outgoing: { label: 'Sortant', color: 'blue' },
              missed: { label: 'Manqué', color: 'red' }
            }
          },
          {
            header: 'Date',
            accessor: 'date' as keyof T,
            type: 'date'
          },
          {
            header: 'Durée',
            accessor: 'duration' as keyof T,
            type: 'duration'
          },
        ];
      default:
        return [];
    }
  };

  const columns = getColumns(resource);

  return (
    <div className="space-y-6">
      <DataTableUi
        data={data}
        columns={columns}
        resourceName={resource}
        createHref={`/admin/${resource}/new`}
      />
    </div>
  );
}
