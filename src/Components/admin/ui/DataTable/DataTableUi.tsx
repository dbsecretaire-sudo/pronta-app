"use client";

import { useState } from 'react';
import { PencilIcon, TrashIcon, PlusIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  ColumnDef,
  SortingState,
  ColumnFiltersState,
} from '@tanstack/react-table';
import { ExtendedColumnDef } from '@/src/Types/table';
import { useSession } from 'next-auth/react';

interface TypeBadgeInfo {
  label: string;
  color: string;
}

interface DataWithId {
  id: number;  // ou string, selon ton cas
}

interface DataTableProps<TData extends DataWithId> {
  data: TData[];
  columns: ExtendedColumnDef<TData>[];
  resourceName: string;
  createHref: string;
  onDelete?: (id: string | number) => void;
  dataMaps?: Record<string, Record<any, any>>;
}

// Composants de cellule
const DateCell = ({ value }: { value: Date | string }) => {
  if (!value) return <span>Non spécifié</span>;
  try {
    return <span>{new Date(value).toLocaleString('fr-FR')}</span>;
  } catch {
    return <span>Date invalide</span>;
  }
};

const BooleanBadgeCell = ({ value }: { value: boolean }) => (
  <span className={`px-2 py-1 text-xs rounded-full ${
    value ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
  }`}>
    {value ? 'Oui' : 'Non'}
  </span>
);

const UserNameCell = ({ value, dataMaps, dataMapKey }: { value: number, dataMaps: any, dataMapKey: string }) => {
  return <span>{dataMaps?.[dataMapKey]?.[value]?.name || 'Non spécifié'}</span>;
};

const TypeBadgeCell = ({ value, typeData }: { value: string, typeData?: Record<string, TypeBadgeInfo> }) => {
  const typeInfo = typeData?.[value];
  return typeInfo ? (
    <span className={`px-2 py-1 text-xs rounded-full bg-${typeInfo.color}-100 text-${typeInfo.color}-800`}>
      {typeInfo.label}
    </span>
  ) : (
    <span>{value}</span>
  );
};

export function DataTableUi<TData extends DataWithId>({
  data,
  columns,
  resourceName,
  createHref,
  onDelete,
  dataMaps = {},
}: DataTableProps<TData>) {
  const { data: session, status } = useSession(); 
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  function formatDuration(seconds: number): string {
    if (seconds === undefined || seconds === null) return "Non spécifié";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  const transformedColumns = columns.map(column => {
    const { meta } = column;

    if (meta?.type) {
      return {
        ...column,
        cell: (info: any) => {
          const value = info.getValue();

          switch (meta.type) {
            case 'date':
              return <DateCell value={value} />;
            case 'booleanBadge':
              return <BooleanBadgeCell value={value} />;
            case 'userName':
              return <UserNameCell value={value} dataMaps={dataMaps} dataMapKey={meta.dataMap || ''} />;
            case 'typeBadge':
              return <TypeBadgeCell value={value} typeData={meta.typeData} />;
            case 'duration':
              return <span>{formatDuration(value)}</span>;
            default:
              return value;
          }
        }
      };
    }

    return column;
  });

  const table = useReactTable({
    data,
    columns: transformedColumns,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    state: {
      sorting,
      columnFilters,
    },
    meta: {
      dataMaps,
    },
  });

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      {/* En-tête avec filtres */}
      <div className="p-4 border-b border-gray-200 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold capitalize">{resourceName}</h2>
          <Link href={createHref} className="flex items-center px-3 py-1.5 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <PlusIcon className="w-4 h-4 mr-1" />
            Ajouter
          </Link>
        </div>
        {/* Filtres dynamiques */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          {table.getAllLeafColumns().map((column) => {
            const meta = column.columnDef.meta;
            if (!meta?.filterType) return null;

            return (
              <div key={column.id} className="relative">
                {meta.filterType === 'text' && (
                  <input
                    type="text"
                    placeholder={`Filtrer ${String(column.columnDef.header)}...`}
                    className="block w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={(column.getFilterValue() as string) ?? ''}
                    onChange={(e) => column.setFilterValue(e.target.value)}
                  />
                )}
                {meta.filterType === 'select' && (
                  <select
                    className="block w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={(column.getFilterValue() as string) ?? ''}
                    onChange={(e) => column.setFilterValue(e.target.value)}
                  >
                    <option value="">{typeof column.columnDef.header === 'string'? `Tous les ${column.columnDef.header}`: 'Tous'}</option>
                    {meta.filterOptions?.map((option) => (
                      <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                    {meta.type === 'userName' && meta.dataMap && dataMaps[meta.dataMap] && (
                      Object.entries(dataMaps[meta.dataMap]).map(([id, item]) => {
                        if (item && typeof item === 'object' && 'name' in item) {
                          return <option key={id} value={id}>{item.name as string}</option>;
                        }
                        return null;
                      })
                    )}
                  </select>
                )}
                {meta.filterType === 'date' && (
                  <input
                    type="date"
                    className="block w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={(column.getFilterValue() as string) ?? ''}
                    onChange={(e) => column.setFilterValue(e.target.value)}
                    max={new Date().toISOString().split('T')[0]}
                  />
                )}
                {meta.filterType === 'duration' && (
                  <select
                    className="block w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    value={(column.getFilterValue() as string) ?? ''}
                    onChange={(e) => column.setFilterValue(e.target.value)}
                  >
                    <option value="">Toutes les durées</option>
                    <option value="short">&lt; 1 min</option>
                    <option value="medium">1-5 min</option>
                    <option value="long">&gt; 5 min</option>
                  </select>
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                      header.column.getCanSort() ? 'cursor-pointer hover:bg-gray-100' : ''
                    }`}
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    <div className="flex items-center">
                      {flexRender(header.column.columnDef.header, header.getContext())}
                      {header.column.getCanSort() && (
                        header.column.getIsSorted() === 'asc' ? (
                          <ChevronUpIcon className="h-4 w-4 ml-1" />
                        ) : header.column.getIsSorted() === 'desc' ? (
                          <ChevronDownIcon className="h-4 w-4 ml-1" />
                        ) : null
                      )}
                    </div>
                  </th>
                ))}
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            ))}
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-6 py-4 whitespace-nowrap">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <Link
                        href={`/admin/${resourceName}/${row.original.id}`}
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
                  {table.getState().columnFilters.length > 0 ? `Aucun ${resourceName} ne correspond aux filtres` : `Aucun ${resourceName} trouvé`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
