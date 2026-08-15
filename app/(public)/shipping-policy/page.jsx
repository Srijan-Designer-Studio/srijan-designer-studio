export const metadata = {
  title: 'Shipping Policy | SRIJAN',
  description: 'Information regarding the shipping and delivery of your orders.',
};

export default function ShippingPolicy() {
  return (
    <main className="pt-[100px] lg:pt-[120px] pb-20 max-w-4xl mx-auto px-6 font-sans">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Shipping Policy</h1>
      
      <div className="text-gray-700 leading-relaxed space-y-4">
        <p>
          The orders for the user are shipped through registered domestic courier companies and/or speed post only. Orders are shipped within <strong>10 days</strong> from the date of the order and/or payment or as per the delivery date agreed at the time of order confirmation and delivering of the shipment, subject to courier company / post office norms.
        </p>
        
        <p>
          Platform Owner shall not be liable for any delay in delivery by the courier company / postal authority. Delivery of all orders will be made to the address provided by the buyer at the time of purchase. 
        </p>
        
        <p>
          Delivery of our services will be confirmed on your email ID as specified at the time of registration. If there are any shipping cost(s) levied by the seller or the Platform Owner (as the case be), the same is not refundable.
        </p>
      </div>
    </main>
  );
}