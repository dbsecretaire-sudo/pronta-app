// src/app/admin/[resource]/page.tsx
import { DataTable } from '@/src/Components/admin/ui/DataTable';
import { fetchResource } from '@/src/lib/admin/api';
import { notFound } from 'next/navigation';
import { Column } from "@/src/Components/admin/ui/DataTable"
import { Call } from '@/src/Components';

interface ResourcePageProps {
  params: Promise<{ resource: string }>;
  searchParams: { [key: string]: string | string[] | undefined };
}

export default async function ResourcePage({ params }: ResourcePageProps) {

  const { resource } = await params;
console.log( "Resource : ", resource);
  const data = await fetchResource(resource);

  if (!data) {
    return notFound();
  }

  // Définissez les colonnes en fonction de la ressource
  const getColumns = <T extends {id : number}>(resourceName: string): Column<T>[] => {
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
          { header: 'ID', accessor: 'id' as keyof T },
          { header: 'Numéro', accessor: 'phoneNumber' as keyof T },
          { 
            header: 'Type', 
            accessor: 'type' as keyof T, 
            render: (value: Call['type']) => {
                const types: Record<Call['type'], { label: string; color: string }> = {
                incoming: { label: 'Entrant', color: 'green' },
                outgoing: { label: 'Sortant', color: 'blue' },
                missed: { label: 'Manqué', color: 'red' }
                };

                // Vérification de sécurité
                const typeInfo = types[value];
                return (
                    <span className={`px-2 py-1 text-xs rounded-full bg-${types[value]?.color || 'gray'}-100 text-${types[value]?.color || 'gray'}-800`}>
                        {types[value]?.label || value}
                    </span>
                );
              }
          },
          { 
            header: 'Date', 
            accessor: 'date' as keyof T , 
            render: (value: any) => new Date(value).toLocaleString('fr-FR')
          },
          { 
            header: 'Durée', 
            accessor: 'duration' as keyof T , 
            render: (value: number) => {
                const mins = Math.floor(value / 60);
                const secs = value % 60;
                return `${mins}:${String(secs).padStart(2, '0')}`;
            }
          },
        ]
        default:
            return [];
    }
  };

  const columns = getColumns(resource);

  return (
    <div className="space-y-6">
      <DataTable
        data={data}
        columns={columns}
        resourceName={resource}
        createHref={`/admin/${resource}/new`}
      />
    </div>
  );
}
