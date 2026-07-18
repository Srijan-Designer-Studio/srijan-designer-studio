// app/(dashboard)/layout.jsx

import Sidebar from "@/components/dashboard/layout/Sidebar";
import ConditionalHeader from "@/components/dashboard/layout/ConditionalHeader";
import { CartProvider } from "@/context/CartContext";

export default function DashboardLayout({ children }) {
  return (
    <CartProvider>
      {/* Main container ke Top-to-Bottom (Column) flex kora holo */}
      <div className="flex flex-col h-screen overflow-hidden bg-gray-50">
        
        {/* 1. Header Area: Navbar ekhane thakbe ebong full-width hobe. 
             Transparent issue fix korar jonno bg-black dewa holo */}
        <div className="shrink-0 w-full z-50">
          <ConditionalHeader />
        </div>
        
        {/* 2. Content Area: Sidebar ebong Main Dashboard ei div er moddhe thakbe */}
        <div className="flex flex-1 overflow-hidden relative">
          <Sidebar />
          
          <main className="flex-1 overflow-y-auto p-4 lg:p-8">
            {children}
          </main>
        </div>
        
      </div>
    </CartProvider>
  );
}