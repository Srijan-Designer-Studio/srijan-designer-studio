import Link from 'next/link';
import { Search, ArrowLeft } from 'lucide-react';

export const metadata = {
  title: 'Page Not Found | SRIJAN Fashion',
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 font-sans pt-20">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-8">
          <div className="relative">
            <h1 className="text-[120px] font-black text-gray-100 leading-none tracking-tighter">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100">
                <Search size={32} className="text-[#00c3ff]" />
              </div>
            </div>
          </div>
        </div>
        
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">Page Not Found</h2>
        
        <p className="text-gray-500 mb-8 leading-relaxed text-sm md:text-base">
          Oops! The page or product you are looking for has vanished from our catalog, or the link might be broken.
        </p>
        
        <Link 
          href="/"
          className="inline-flex items-center justify-center gap-2 px-8 py-3.5 bg-black text-white font-bold text-[15px] rounded-full hover:bg-gray-800 transition-all shadow-md hover:shadow-lg cursor-pointer"
        >
          <ArrowLeft size={18} />
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}