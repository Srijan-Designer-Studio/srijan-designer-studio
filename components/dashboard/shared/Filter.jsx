export default function Filter({ options, defaultValue = "All" }) {
  return (
    <div className="relative w-full sm:w-48">
      <select 
        className="block w-full py-2 px-3 text-sm text-gray-900 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none transition-all cursor-pointer"
      >
        <option value="">{defaultValue}</option>
        {options.map((opt, idx) => (
          <option key={idx} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {/* Custom dropdown arrow */}
      <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}