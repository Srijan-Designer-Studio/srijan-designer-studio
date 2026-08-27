export const metadata = {
  title: 'Refund and Cancellation Policy | SRIJAN',
  description: 'Rules and conditions for order cancellations and refunds.',
  robots: {
    index: false,
    follow: false,
  }
};

export default function RefundCancellationPolicy() {
  return (
    <main className="pt-[100px] lg:pt-[120px] pb-20 max-w-4xl mx-auto px-6 font-sans">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Refund and Cancellation Policy</h1>
      
      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>
          This refund and cancellation policy outlines how you can cancel or seek a refund for a product / service that you have purchased through the Platform. Under this policy:
        </p>

        <ol className="list-decimal pl-5 space-y-4">
          <li>
            Cancellations will only be considered if the request is made <strong>4 days</strong> of placing the order. However, cancellation requests may not be entertained if the orders have been communicated to such sellers / merchant(s) listed on the Platform and they have initiated the process of shipping them, or the product is out for delivery. In such an event, you may choose to reject the product at the doorstep.
          </li>
          
          <li>
            <strong>SRIJAN</strong> does not accept cancellation requests for perishable items like flowers, eatables, etc. However, the refund / replacement can be made if the user establishes that the quality of the product delivered is not good.
          </li>
          
          <li>
            In case of receipt of damaged or defective items, please report to our customer service team. The request would be entertained once the seller/ merchant listed on the Platform, has checked and determined the same at its own end. This should be reported within <strong>3 days</strong> of receipt of products. In case you feel that the product received is not as shown on the site or as per your expectations, you must bring it to the notice of our customer service within <strong>3 days</strong> of receiving the product. The customer service team after looking into your complaint will take an appropriate decision.
          </li>
          
          <li>
            In case of complaints regarding the products that come with a warranty from the manufacturers, please refer the issue to them.
          </li>
          
          <li>
            In case of any refunds approved by <strong>SRIJAN</strong>, it will take <strong>4-5 days</strong> for the refund to be processed to you.
          </li>
        </ol>
      </div>
    </main>
  );
}