export const metadata = {
  title: 'Customization Policy | SRIJAN',
  description: 'Policies for customized outfits and ready-to-wear collections.',
};

export default function CustomizationPolicy() {
  return (
    <main className="pt-[100px] lg:pt-[120px] pb-20 max-w-4xl mx-auto px-6 font-sans">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-10">Srijan Policies</h1>
      
      <div className="space-y-12">
        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase">Customization Policy</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>
              At SRIJAN, every customized outfit is thoughtfully crafted to match individual preferences and measurements. To maintain transparency and ensure a smooth experience, the following customization policies apply:
            </p>
            <ul className="list-disc pl-5 space-y-3">
              <li>A 40% advance payment is mandatory before placing any customization order.</li>
              <li>Once an order is placed, cancellation is allowed only within 5 days. After this period, no cancellation or refund will be accepted.</li>
              <li>No refunds will be processed under any circumstances once customization work has begun.</li>
              <li>Color changes will be done strictly as per customer demand.</li>
              <li>Prints or designs may be substituted if the selected option is unavailable.</li>
              <li>Any change in fabric or material requested by the customer will result in a revision of garment pricing.</li>
              <li>After the product is delivered, no return or exchange will be accepted for customized outfits.</li>
              <li>The standard manufacturing timeline is 15–20 days from the date of order confirmation.</li>
              <li>For Kolkata-based customers, SRIJAN offers home measurement services for added convenience.</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-gray-900 mb-6 uppercase">Ready-To-Wear Policy</h2>
          <div className="space-y-4 text-gray-700 leading-relaxed">
            <p>For ready-to-wear collections, the following policies apply:</p>
            <ul className="list-disc pl-5 space-y-3">
              <li>Orders will be delivered within 10 – 14 days from order confirmation.</li>
              <li>A 5-day return window is available from the date of delivery.</li>
              <li>Returned items must be unused, unworn, unwashed, and in original condition with tags intact.</li>
            </ul>
          </div>
        </section>
      </div>
    </main>
  );
}