// src/components/admin/ui/DataTable.tsx
"use client";
import { PencilIcon, TrashIcon, PlusIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export interface Column<T> {
  header: string;
  accessor: keyof T;  // Ici, accessor doit être une clé de T
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T extends { id: number } = any> {
  data: T[];
  columns: Column<T>[];
  resourceName: string;
  onDelete?: (id: string | number) => void;
  createHref: string;
}

export function DataTable<T extends { id: number }>({
  data,
  columns,
  resourceName,
  onDelete,
  createHref,
}: DataTableProps<T>) {
  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold capitalize">{resourceName}</h2>
        <Link
          href={createHref}
          className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusIcon className="w-4 h-4 mr-1" />
          Ajouter
        </Link>
      </div>

      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.accessor)}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((row) => (
              <tr key={row.id}>
                {columns.map((column) => (
                  <td key={`${String(row.id)}-${String(column.accessor)}`} className="px-6 py-4 whitespace-nowrap">
                    {column.render ?
                      column.render(row[column.accessor], row) :
                      String(row[column.accessor] || 'N/A')
                    }
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex justify-end space-x-2">
                    <Link
                      href={`/admin/${resourceName}/${row.id}`}
                      className="text-blue-600 hover:text-blue-900"
                      title="Modifier"
                    >
                      <PencilIcon className="h-5 w-5" />
                    </Link>
                    {onDelete && (
                      <button
                        onClick={() => onDelete(row.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Supprimer"
                      >
                        <TrashIcon className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length + 1} className="px-6 py-4 text-center text-sm text-gray-500">
                Aucun {resourceName} trouvé
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
