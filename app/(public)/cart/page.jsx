import CartClient from "./CartClient";

export const metadata = {
  title: "Shopping Cart | SRIJAN Fashion",
  description: "Review your selected designer outfits in the cart before proceeding to checkout at SRIJAN Fashion.",
  robots: {
    index: false,
    follow: false,
  }
};

export default function CartPage() {
  return <CartClient />;
}