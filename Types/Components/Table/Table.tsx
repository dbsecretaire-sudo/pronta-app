import { TableProps } from './Table.types';

export default function Table<T>({
  data,
  columns,
  actions,
  emptyMessage = "Aucune donnée disponible",
  className = '',
  tableClassName = '',
  rowClassName,
}: TableProps<T>) {
  return (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${className}`}>
      {data.length > 0 ? (
        <div className="overflow-x-auto"> {/* ✅ Ajout pour le défilement horizontal */}
          <table className={`min-w-full divide-y divide-gray-200 ${tableClassName}`}>
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={String(column.accessor)}
                    className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${column.headerClassName || ''}`}
                  >
                    {column.header}
                  </th>
                ))}
                {actions && (
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                )}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr
                  key={index}
                  className={rowClassName?.(item, index) || ''}
                >
                  {columns.map((column) => (
                    <td
                      key={`${index}-${String(column.accessor)}`}
                      className={`px-6 py-4 whitespace-nowrap ${column.className || ''}`}
                    >
                      {column.render ?
                        column.render(item[column.accessor], item) :
                        String(item[column.accessor])}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      {actions(item)}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-8 text-center text-gray-500">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}