import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { createClient } from "@/lib/supabase/server";
import React from "react";

export default async function PublicLayout({ children }) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  const user = session?.user || null;

  return (
    <SmoothScroll>
      <CartProvider>
        <div className="flex flex-col min-h-screen bg-white">
          <Header initialUser={user} />
          <main className="flex-grow w-full">
            {children}
          </main>
          <Footer />
        </div>
      </CartProvider>
    </SmoothScroll>
  );
}