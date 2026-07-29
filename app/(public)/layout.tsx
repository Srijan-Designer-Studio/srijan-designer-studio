import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { createClient } from "@/lib/supabase/server";
import React from "react";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
 
  const { data: { user }, error } = await supabase.auth.getUser();

  return (
    <SmoothScroll>
      <CartProvider>
        <div className="flex flex-col min-h-screen bg-white">
         
          <Header initialUser={user as any} />
          <main className="flex-grow w-full">
            {children}
          </main>
          <Footer />
        </div>
      </CartProvider>
    </SmoothScroll>
  );
}