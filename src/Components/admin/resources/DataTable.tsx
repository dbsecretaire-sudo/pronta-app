// src/components/admin/ResourceDataTable.tsx
'use client';

import { DataTableUi } from '@/src/Components';
import { Column } from "@/src/Components";
import { Call } from '@/src/Components';
import Link from 'next/link';

interface ResourceDataTableProps<T extends { id: number }> {
  data: T[];
  resourceName: string;
  createHref: string;
}

export function DataTable<T extends { id: number }>({ data, resourceName, createHref }: ResourceDataTableProps<T>) {
  const sortedData = [...data].sort((a, b) => a.id - b.id);

  const getColumns = (): Column<T>[] => {
    switch (resourceName) {
      case 'clients':
        return [
          { header: 'ID', accessor: 'id' as keyof T },
          { header: 'Nom', accessor: 'name' as keyof T },
          { header: 'Email', accessor: 'email' as keyof T },
          { header: 'Téléphone', accessor: 'phone' as keyof T },
          { header: 'Entreprise', accessor: 'company' as keyof T },
          {
            header: 'Actions',
            accessor: 'actions' as keyof T,
            render: (_, row: any) => (
              <div className="flex space-x-2">
                <Link
                  href={`/admin/${resourceName}/${row.id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Modifier
                </Link>
              </div>
            )
          }
        ];

      case 'calls':
        return [
          { header: 'ID', accessor: 'id' as keyof T },
          {
            header: 'Numéro',
            accessor: 'phoneNumber' as keyof T,
            render: (value: string) => <span>{value || 'N/A'}</span>
          },
          {
            header: 'Type',
            accessor: 'type' as keyof T,
            render: (value: Call['type']) => {
              const types: Record<Call['type'], { label: string; color: string }> = {
                incoming: { label: 'Entrant', color: 'green' },
                outgoing: { label: 'Sortant', color: 'blue' },
                missed: { label: 'Manqué', color: 'red' }
              };
              const typeInfo = types[value];
              return typeInfo ? (
                <span className={`px-2 py-1 text-xs rounded-full bg-${typeInfo.color}-100 text-${typeInfo.color}-800`}>
                  {typeInfo.label}
                </span>
              ) : (
                <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
                  {value}
                </span>
              );
            }
          },
          {
            header: 'Date',
            accessor: 'date' as keyof T,
            render: (value: any) => {
              try {
                return new Date(value).toLocaleString('fr-FR');
              } catch {
                return 'Date invalide';
              }
            }
          },
          {
            header: 'Durée',
            accessor: 'duration' as keyof T,
            render: (value: number) => {
              if (typeof value !== 'number') return 'N/A';
              const mins = Math.floor(value / 60);
              const secs = value % 60;
              return `${mins}:${String(secs).padStart(2, '0')}`;
            }
          },
          {
            header: 'Actions',
            accessor: 'actions' as keyof T,
            render: (_, row: any) => (
              <div className="flex space-x-2">
                <Link
                  href={`/admin/${resourceName}/${row.id}`}
                  className="text-blue-500 hover:text-blue-700"
                >
                  Modifier
                </Link>
              </div>
            )
          }
        ];

      default:
        // Colonnes par défaut pour les ressources non définies
        const firstItem = data[0];
        if (!firstItem) return [];

        return Object.keys(firstItem).map(key => ({
          header: key.charAt(0).toUpperCase() + key.slice(1),
          accessor: key as keyof T
        }));
    }
  };

  const columns = getColumns();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold capitalize">
          {resourceName}
        </h1>
        <Link
          href={createHref}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center"
        >
          Nouveau
        </Link>
      </div>
      <DataTableUi<T>
        data={sortedData }
        columns={columns}
        resourceName={resourceName}
        createHref={createHref}
      />
    </div>
  );
}
