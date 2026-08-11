export const dynamic = 'force-dynamic';
import ContactHero from "@/components/Contact/ContactHero";
import ContactDetails from "@/components/Contact/ContactDetails";


export const metadata = {
  title: "Contact SRIJAN Fashion | Visit Our Studio & Get in Touch",
  description: "Get in touch with Srijan Fashion for custom outfits, styling queries or consultations. Visit our Kolkata studio, call us or send a message to discuss your ideas.",
};

export default function ContactPage() {
  return (
    <main>
      <ContactHero />
      <ContactDetails />
    </main>
  );
}