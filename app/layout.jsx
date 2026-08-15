import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/AuthProvider";
import WhatsAppButton from "@/components/ui/WhatsAppButton";
import ScrollToTop from "@/components/providers/ScrollToTop";
import { CartProvider } from "@/context/CartContext"; 

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Srijan Designer Studio",
  description: "Luxury Fashion Brand",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} antialiased`} 
    >
  
      <body className="min-h-screen flex flex-col overflow-x-hidden">
        <ScrollToTop />
        <AuthProvider>
          <CartProvider> 
            {children}
          </CartProvider>
        </AuthProvider>
        
      </body>
    </html>
  );
}