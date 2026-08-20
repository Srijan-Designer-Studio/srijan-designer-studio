import ForgotPasswordClient from "./ForgotPasswordClient";

export const metadata = {
  title: "Forgot Password | SRIJAN Fashion",
  description: "Reset your SRIJAN Fashion account password securely.",
  alternates: {
    canonical: 'https://www.srijandesignerstudio.com/forgot-password',
  },
  openGraph: {
    title: 'Forgot Password | SRIJAN Fashion',
    description: 'Reset your SRIJAN Fashion account password securely.',
    url: 'https://www.srijandesignerstudio.com/forgot-password',
    siteName: 'Srijan Fashion',
    images: [
      {
        url: '/images/logo5.webp', 
        width: 1200,
        height: 630,
        alt: 'Srijan Fashion Forgot Password',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordClient />;
}