import { CartProvider } from "@/context/CartContext";
import Header from "@/components/Header/Header";
import Footer from "@/components/Footer/Footer";
import SmoothScroll from "@/components/providers/SmoothScroll";

export default function PublicLayout({ children }) {
  return (
    <SmoothScroll>
      <CartProvider>
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </CartProvider>
    </SmoothScroll>
  );
}