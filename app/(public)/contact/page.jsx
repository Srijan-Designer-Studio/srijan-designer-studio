export const dynamic = 'force-dynamic';
import ContactHero from "@/components/Contact/ContactHero";
import ContactDetails from "@/components/Contact/ContactDetails";


export const metadata = {
  title: "Contact Us | SRIJAN Fashion",
  description: "Connect with SRIJAN Fashion. Drop your message or visit our store.",
};

export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <ContactDetails />
    </main>
  );
}