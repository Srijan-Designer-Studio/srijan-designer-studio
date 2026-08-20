export const metadata = {
  title: 'Return Policy | SRIJAN',
  description: 'Information regarding product returns and exchanges.',
  robots: {
    index: false,
    follow: false,
  }
};

export default function ReturnPolicy() {
  return (
    <main className="pt-[100px] lg:pt-[120px] pb-20 max-w-4xl mx-auto px-6 font-sans">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Return Policy</h1>
      
      <div className="space-y-6 text-gray-700 leading-relaxed">
        <p>
          We offer refund / exchange within first <strong>5 days</strong> from the date of your product received. If <strong>5 days</strong> have passed since your product received, you will not be offered a return, exchange or refund of any kind. 
        </p>
        
        <p>In order to become eligible for a return or an exchange:</p>
        
        <ol className="list-decimal pl-5 space-y-2">
          <li>The purchased item should be unused and in the same condition as you received it</li>
          <li>The item must have original packaging</li>
          <li>The orginal product tag must be intact with it</li>
          <li>If the item that you purchased on a sale, then the item may not be eligible for a return / exchange.</li>
        </ol>

        <p className="pt-4">
          Further, only such items are replaced by us (based on an exchange request), if such items are found defective or damaged.
        </p>

        <p className="pt-4">
          You agree that there may be a certain category of products / items that are exempted from returns or refunds. Such categories of the products would be identified to you at the item of purchase. For exchange / return accepted request(s) (as applicable), once your returned product / item is received and inspected by us, we will send you an email to notify you about receipt of the returned / exchanged product. Further, if the same has been approved after the quality check at our end, your request (i.e. return / exchange) will be processed in accordance with our policies.
        </p>
      </div>
    </main>
  );
}