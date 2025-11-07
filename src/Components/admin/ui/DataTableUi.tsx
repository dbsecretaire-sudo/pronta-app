"use client";
import { useState, useCallback } from 'react';
import { PencilIcon, TrashIcon, PlusIcon, ChevronUpIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

interface UserMap {
  [id: number]: { id: number; name: string };
}

interface TypeBadgeInfo {
  label: string;
  color: string;
}

export interface Column<T> {
  header: string;
  accessor: keyof T;
  type?: 'text' | 'userName' | 'typeBadge' | 'date' | 'duration';
  dataMap?: string;
  typeData?: Record<string, TypeBadgeInfo>;
  filterOptions?: Array<{ value: string; label: string }>;
  filterType?: 'text' | 'select' | 'date' | 'duration';
  render?: (value: any, row: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T extends { id: number }> {
  data: T[];
  columns: Column<T>[];
  resourceName: string;
  createHref: string;
  onDelete?: (id: string | number) => void;
  dataMaps?: Record<string, UserMap>;
}

export function DataTableUi<T extends { id: number }>({
  data,
  columns,
  resourceName,
  createHref,
  onDelete,
  dataMaps = {}
}: DataTableProps<T>) {
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: 'asc' | 'desc';
  }>({ key: null, direction: 'asc' });

  const [filters, setFilters] = useState<Record<string, string | null>>({});

  const handleSort = useCallback((key: keyof T) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  }, [sortConfig]);

  const sortedData = useCallback(() => {
    if (!sortConfig.key) return data;

    const column = columns.find(col => col.accessor === sortConfig.key);
    if (!column) return data;

    return [...data].sort((a, b) => {
      const aValue = a[column.accessor];
      const bValue = b[column.accessor];

      if (column.type === 'date') {
        try {
          const dateA = new Date(aValue as string | number | Date).getTime();
          const dateB = new Date(bValue as string | number | Date).getTime();
          return sortConfig.direction === 'asc' ? dateA - dateB : dateB - dateA;
        } catch {
          return sortConfig.direction === 'asc'
            ? String(aValue).localeCompare(String(bValue))
            : String(bValue).localeCompare(String(aValue));
        }
      }

      if (column.type === 'duration' && typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'asc' ? aValue - bValue : bValue - aValue;
      }

      return sortConfig.direction === 'asc'
        ? String(aValue).localeCompare(String(bValue))
        : String(bValue).localeCompare(String(aValue));
    });
  }, [data, sortConfig, columns]);

  const filteredData = useCallback(() => {
    let filtered = sortedData();

    Object.entries(filters).forEach(([key, value]) => {
      if (!value) return;

      const column = columns.find(col => {
        if (typeof col.accessor === 'string') {
          return String(col.accessor) === key;
        }
        return false;
      });

      if (!column || !column.accessor || !column.filterType) return;

      filtered = filtered.filter(row => {
        const rowValue = row[column.accessor];

        if (column.filterType === 'text') {
          return String(rowValue).toLowerCase().includes(value.toLowerCase());
        }

        if (column.filterType === 'select') {
          return String(rowValue) === value;
        }

        if (column.filterType === 'date') {
          try {
            const rowDate = new Date(rowValue as string | number | Date);
            const filterDate = new Date(value);
            return rowDate.toDateString() === filterDate.toDateString();
          } catch {
            return false;
          }
        }

        if (column.filterType === 'duration') {
          const duration = Number(rowValue);
          if (value === 'short') return duration < 60;
          if (value === 'medium') return duration >= 60 && duration <= 300;
          if (value === 'long') return duration > 300;
        }

        return true;
      });
    });

    return filtered;
  }, [sortedData, filters, columns]);

  const handleFilterChange = useCallback((accessor: string, value: string | null) => {
    setFilters(prev => ({ ...prev, [accessor]: value }));
  }, []);

  const renderCell = useCallback((item: T, column: Column<T>) => {
    const value = item[column.accessor];

    switch (column.type) {
      case 'userName':
        if (!column.dataMap) return String(value || 'N/A');
        const dataMap = dataMaps[column.dataMap];
        return dataMap?.[Number(value)]?.name || 'Non spécifié';

      case 'typeBadge':
        if (!column.typeData) return String(value || 'N/A');
        const typeKey = typeof value === 'string' ? value : String(value);
        const typeInfo = column.typeData[typeKey];
        return typeInfo ? (
          <span className={`px-2 py-1 text-xs rounded-full bg-${typeInfo.color}-100 text-${typeInfo.color}-800`}>
            {typeInfo.label || String(value)}
          </span>
        ) : String(value || 'N/A');

      case 'date':
        if (typeof value === 'string' || typeof value === 'number') {
          try {
            return new Date(value).toLocaleString('fr-FR');
          } catch {
            return 'Date invalide';
          }
        }
        return 'Date invalide';

      case 'duration':
        const numValue = Number(value);
        if (!isNaN(numValue)) {
          const mins = Math.floor(numValue / 60);
          const secs = numValue % 60;
          return `${mins}:${String(secs).padStart(2, '0')}`;
        }
        return 'Durée invalide';

      default:
        return column.render ? column.render(value, item) : String(value || 'N/A');
    }
  }, [dataMaps]);

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
          {columns.filter(col => col.filterType).map((column) => (
            <div key={String(column.accessor)} className="relative">
              {column.filterType === 'text' && (
                <input
                  type="text"
                  placeholder={`Filtrer ${column.header}...`}
                  className="block w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filters[String(column.accessor)] || ''}
                  onChange={(e) => handleFilterChange(String(column.accessor), e.target.value)}
                />
              )}

              {column.filterType === 'select' && (
                <select
                  className="block w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filters[String(column.accessor)] || ''}
                  onChange={(e) => handleFilterChange(String(column.accessor), e.target.value || null)}
                >
                  <option value="">Tous</option>
                  {column.filterOptions?.map((option) => (
                    <option key={option.value} value={option.value}>{option.label}</option>
                  ))}
                  {column.type === 'userName' && column.dataMap && dataMaps[column.dataMap] &&
                    Object.values(dataMaps[column.dataMap]).map((item) => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                </select>
              )}

              {column.filterType === 'date' && (
                <input
                  type="date"
                  className="block w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filters[String(column.accessor)] || ''}
                  onChange={(e) => handleFilterChange(String(column.accessor), e.target.value)}
                  max={new Date().toISOString().split('T')[0]}
                />
              )}

              {column.filterType === 'duration' && (
                <select
                  className="block w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 pr-8 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={filters[String(column.accessor)] || ''}
                  onChange={(e) => handleFilterChange(String(column.accessor), e.target.value)}
                >
                  <option value="">Toutes les durées</option>
                  <option value="short">&lt; 1 min</option>
                  <option value="medium">1-5 min</option>
                  <option value="long">&gt; 5 min</option>
                </select>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Tableau */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.accessor)}
                  className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${
                    column.sortable ? 'cursor-pointer hover:bg-gray-100' : ''
                  }`}
                  onClick={() => column.sortable && handleSort(column.accessor)}
                >
                  <div className="flex items-center">
                    {column.header}
                    {column.sortable && sortConfig.key === column.accessor && (
                      sortConfig.direction === 'asc' ? (
                        <ChevronUpIcon className="h-4 w-4 ml-1" />
                      ) : (
                        <ChevronDownIcon className="h-4 w-4 ml-1" />
                      )
                    )}
                  </div>
                </th>
              ))}
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredData().length > 0 ? (
              filteredData().map((row) => (
                <tr key={row.id}>
                  {columns.map((column) => (
                    <td key={`${String(row.id)}-${String(column.accessor)}`} className="px-6 py-4 whitespace-nowrap">
                      {renderCell(row, column)}
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
                  {Object.values(filters).some(f => f) ? `Aucun ${resourceName} ne correspond aux filtres` : `Aucun ${resourceName} trouvé`}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
