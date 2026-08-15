export const metadata = {
  title: 'Privacy Policy | SRIJAN',
  description: 'How SRIJAN collects, uses, and protects your personal data.',
};

export default function PrivacyPolicy() {
  return (
    <main className="pt-[100px] lg:pt-[120px] pb-20 max-w-4xl mx-auto px-6 font-sans">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Privacy Policy</h1>
      
      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-2xl font-semibold text-gray-900 mb-3">Your Privacy Matters to Us</h2>
          <p className="leading-relaxed">
            At SRIJAN, we keep this simple. When you shop with us, message us or visit our website, you share some personal information with us. We use it only to serve you nothing else. Here is exactly how.
          </p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">What information we collect</h3>
          <p className="mb-3">We only collect what we actually need to complete your order or answer your query.</p>
          <ul className="space-y-2">
            <li>→ Basic details like your name, phone number, and address — to process and deliver your order</li>
            <li>→ Your WhatsApp or email — to confirm orders and send updates</li>
            <li>→ Your design ideas, measurements, and preferences — when you request a custom outfit or bridal consultation</li>
            <li>→ Basic website usage data — like which pages you visited, collected via standard analytics tools</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">How we use it</h3>
          <p className="mb-3">Your information is used for one purpose: to give you a great experience at SRIJAN.</p>
          <ul className="space-y-2">
            <li>→ To process and deliver your order on time</li>
            <li>→ To stitch your custom outfit exactly as you described</li>
            <li>→ To send you order updates, delivery confirmations, and appointment reminders</li>
            <li>→ To occasionally share new collections or offers over WhatsApp — you can opt out anytime</li>
            <li>→ To improve our website and understand what our customers are looking for</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">We do not sell your data</h3>
          <p className="mb-3">We never sell, rent, or share your personal information and data with third parties for their marketing. Your details are yours. Full stop.</p>
          <p>The only time we share your information is when it is directly needed to serve you — for example, with a courier service to deliver your parcel. And they are only given what they need (your name and address).</p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">How long we keep it</h3>
          <p>We keep your order and contact details for as long as your relationship with SRIJAN is active — so we can reference past orders and serve you better. If you ask us to delete your information, we will do so within 7 working days.</p>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Your rights</h3>
          <p className="mb-3">You are always in control of your information.</p>
          <ul className="space-y-2">
            <li>→ Ask us what information we hold about you</li>
            <li>→ Ask us to correct anything that is wrong</li>
            <li>→ Ask us to delete your data at any time</li>
            <li>→ Unsubscribe from our WhatsApp broadcasts by simply replying STOP.</li>
          </ul>
        </section>

        <section>
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Cookies</h3>
          <p>Our website uses basic cookies to understand how visitors use the site (pages visited, time spent). These are anonymous and cannot identify you from cookie data. We do not use advertising cookies or tracking pixels.</p>
        </section>

        <section className="bg-gray-50 p-6 rounded-xl mt-10">
          <h3 className="text-xl font-semibold text-gray-900 mb-3">Have a question or concern?</h3>
          <p className="mb-6">If you have any questions about how we handle your information, please reach out to us directly. We are a small team and we will respond personally.</p>
          
          <div className="space-y-2 text-sm text-gray-800">
            <p className="font-bold text-base">SRIJAN</p>
            <p>Chhobi Apartment, Sani Mandir, Panchasayar Main Road, Panchasayar, Kolkata - 700094</p>
            <p>Email: <a href="mailto:contact@srijandesignstudio.com" className="text-blue-600">contact@srijandesignstudio.com</a></p>
            <p>Phone / WhatsApp: +91 62906 86399</p>
          </div>
        </section>
      </div>
    </main>
  );
}