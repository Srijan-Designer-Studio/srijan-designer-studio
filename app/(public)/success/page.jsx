import SuccessClient from "./SuccessClient";

export const metadata = {
  title: "Order Success | SRIJAN Fashion",
  description: "Your order has been placed successfully at SRIJAN Fashion.",
  robots: {
    index: false,
    follow: false,
  }
};

export default function SuccessPage() {
  return <SuccessClient />;
}