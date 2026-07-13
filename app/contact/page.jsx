import ContactHero from "@/components/contact/ContactHero";
import ContactDetails from "@/components/contact/ContactDetails";

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