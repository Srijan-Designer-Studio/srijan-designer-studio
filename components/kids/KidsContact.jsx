import Image from "next/image";

export default function KidsContact() {
  return (
    <section className="py-24 bg-gradient-to-b from-[#f2f4f8] to-white">
      <div className="max-w-[1320px] mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
        
        <div>
          <h2 className="text-4xl md:text-[42px] font-bold text-black font-serif leading-tight mb-10">
            Let's click some special<br />moment
          </h2>
          <div className="relative w-full max-w-[500px] aspect-[4/3] rounded-3xl overflow-hidden shadow-lg border-4 border-white bg-[#0e163d]">
            <Image 
              src="/images/kids-contact.jpg" 
              alt="Special Moment" 
              fill 
              className="object-cover" 
            />
          </div>
        </div>

        <div className="bg-white rounded-[32px] p-8 md:p-12 shadow-xl border border-gray-100">
          <h3 className="text-2xl font-bold text-black mb-8">Fill In the Form To Get Started</h3>
          <form className="space-y-5">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Full Name*</label>
              <input type="text" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#00c3ff]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Select date for call back*</label>
              <input type="date" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#00c3ff]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Select time for call back*</label>
              <input type="time" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#00c3ff]" />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Message</label>
              <textarea rows="4" className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:border-[#00c3ff] resize-none"></textarea>
            </div>
            <button type="button" className="w-full bg-[#00c3ff] hover:bg-[#00abe0] text-white font-bold py-3.5 rounded-lg transition-colors mt-4">
              Submit Now
            </button>
            <p className="text-[11px] text-center text-gray-400 mt-4">Your profile name will be shared. Never submit passwords.</p>
          </form>
        </div>

      </div>
    </section>
  );
}
