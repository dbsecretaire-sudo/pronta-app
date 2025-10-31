import { TableProps } from "@/app/models/Props";

export default function Table<T>({ data, columns, actions, emptyMessage = "Aucune donnée disponible" }: TableProps<T>) {
  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      {data.length > 0 ? (
        <>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.header}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    {column.header}
                  </th>
                ))}
                {actions && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data.map((item, index) => (
                <tr key={index}>
                  {columns.map((column) => (
                    <td key={`${index}-${String(column.accessor)}`} className="px-6 py-4 whitespace-nowrap">
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
        </>
      ) : (
        <div className="p-8 text-center text-gray-500">{emptyMessage}</div>
      )}
    </div>
  );
}
