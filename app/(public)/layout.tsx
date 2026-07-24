import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import SmoothScroll from "@/components/providers/SmoothScroll";

export default function PublicLayout({ children }) {
  return (
    <SmoothScroll>
      <CartProvider>
        <div className="flex flex-col min-h-screen bg-white">
          <Header />
          <main className="flex-grow w-full">
            {children}
          </main>
          <Footer />
        </div>
      </CartProvider>
    </SmoothScroll>
  );
}