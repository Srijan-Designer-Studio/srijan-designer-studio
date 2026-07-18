export default function Table({ columns, data }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left text-gray-600">
        <thead className="text-xs text-gray-500 uppercase bg-gray-50/80 border-b border-gray-200">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="px-6 py-4 font-semibold tracking-wider">
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr 
                key={rowIndex} 
                className="bg-white hover:bg-gray-50/50 transition-colors"
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-6 py-4 whitespace-nowrap">
                    {/* If a custom render function is provided, use it. Otherwise, render raw data. */}
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td 
                colSpan={columns.length} 
                className="px-6 py-8 text-center text-gray-500"
              >
                No data available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}