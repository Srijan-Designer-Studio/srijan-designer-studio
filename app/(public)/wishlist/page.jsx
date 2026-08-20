import WishlistClient from "./WishlistClient";

export const metadata = {
  title: "My Wishlist | SRIJAN Fashion",
  description: "View and manage your saved designer items at SRIJAN Fashion.",
  robots: {
    index: false,
    follow: false,
  }
};

export default function WishlistPage() {
  return <WishlistClient />;
}