export const metadata = {
  title: 'Terms and Conditions | SRIJAN',
  description: 'Terms and conditions for using SRIJAN website and services.',
   robots: {
    index: false,
    follow: false,
  }
};

export default function TermsAndConditions() {
  return (
    <main className="pt-[100px] lg:pt-[120px] pb-20 max-w-4xl mx-auto px-6 font-sans">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Terms and Conditions</h1>
      <p className="text-gray-600 mb-8 leading-relaxed">
        Welcome to SRIJAN. By accessing or using our website, you agree to comply with and be bound by the following Terms and Conditions. Please read them carefully before using our services.
      </p>

      <div className="space-y-8 text-gray-700">
        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Use of Website</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>You agree to use this website only for lawful purposes.</li>
            <li>You must be at least 18 years old to place an order on our website.</li>
            <li>Any unauthorized use, fraudulent activity or misuse of the website may result in suspension or termination of access without prior notice.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Product Information</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>We make every effort to display product details, descriptions and colors accurately.</li>
            <li>However, actual product colors may slightly vary due to screen settings and photography.</li>
            <li>Product prices and availability are subject to change without prior notice.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Orders and Payments</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Once an order is placed, you will receive an order confirmation via email or SMS.</li>
            <li>We reserve the right to cancel or refuse any order due to pricing errors, stock unavailability, suspicious activity or other reasons.</li>
            <li>All payments must be completed through our secure payment gateways at the time of purchase.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Shipping and Delivery</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Estimated delivery timelines are mentioned on the product pages.</li>
            <li>Delivery delays may occur due to courier issues, natural events, holidays or unforeseen circumstances.</li>
            <li>Customers are responsible for providing accurate shipping details.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Returns, Refunds and Cancellation</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Customers may request returns or cancellations as per our Refund & Cancellation Policy.</li>
            <li>Refunds are processed after product inspection and approval.</li>
            <li>Refunds will be credited to the original payment method within 5-7 business days.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Intellectual Property</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>All content on this website, including images, text, graphics, logos and designs, is the intellectual property of SRIJAN.</li>
            <li>Unauthorized copying, reproduction or use of website content is strictly prohibited.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Privacy Policy</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>Customer information is handled according to our Privacy Policy.</li>
            <li>We do not sell or share personal information with third parties for marketing purposes without consent.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Limitation of Liability</h2>
          <p>SRIJAN shall not be liable for any indirect, incidental, special or consequential damages arising from the use of our website, products or services.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Termination</h2>
          <p>We reserve the right to terminate or suspend user access to the website without prior notice if any violation of these Terms is detected.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">10. Governing Law</h2>
          <p>These Terms and Conditions shall be governed and interpreted in accordance with the laws of India. Any disputes arising shall be subject to the jurisdiction of the courts located in West Bengal, India.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">11. Changes to Terms</h2>
          <p>We reserve the right to update or modify these Terms and Conditions at any time without prior notice. Continued use of the website after changes constitutes acceptance of the updated Terms.</p>
        </section>

        <section>
          <h2 className="text-xl font-semibold text-gray-900 mb-3">12. Contact Information</h2>
          <p className="mb-4">For any questions regarding these Terms and Conditions, please contact us:</p>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="font-bold text-gray-900">SRIJAN</p>
            <p className="mt-2">Email: <a href="mailto:contact@srijandesignstudio.com" className="text-blue-600 hover:underline">contact@srijandesignstudio.com</a></p>
            <p>Website: <a href="https://srijandesignstudio.com/" className="text-blue-600 hover:underline">https://srijandesignstudio.com/</a></p>
          </div>
        </section>
      </div>
    </main>
  );
}