export default function Loading() {
  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm">
      <div className="relative w-16 h-16 mb-4">
        {/* Background Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-gray-100"></div>
        {/* Spinning Ring */}
        <div className="absolute inset-0 rounded-full border-4 border-[#00c3ff] border-t-transparent animate-spin"></div>
      </div>
      <p className="text-gray-600 font-bold tracking-[0.2em] uppercase text-xs animate-pulse">
        Loading...
      </p>
    </div>
  );
}