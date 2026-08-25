// app/(dashboard)/layout.jsx

import Sidebar from "@/components/dashboard/layout/Sidebar";
import { CartProvider } from "@/context/CartContext";

export default function DashboardLayout({ children }) {
  return (
    <CartProvider>
      <div className="flex flex-col h-screen overflow-hidden bg-gray-50 text-black">     
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