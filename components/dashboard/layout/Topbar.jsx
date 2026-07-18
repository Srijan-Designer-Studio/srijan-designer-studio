'use client';

export default function Topbar() {
  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10">
      <div className="flex-1 max-w-lg">
        {/* Mobile menu button could go here */}
        <div className="relative">
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="flex items-center space-x-4">
        <button className="text-gray-500 hover:text-gray-700">
          <span className="sr-only">Notifications</span>
          {/* Notification Icon SVG placeholder */}
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </button>
        
        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white font-bold text-sm">
          U
        </div>
      </div>
    </header>
  );
}