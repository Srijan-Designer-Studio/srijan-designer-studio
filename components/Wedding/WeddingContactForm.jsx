import Image from "next/image";

export default function WeddingContactForm() {
  const bgImageSrc = "";

  return (
    <section className="py-20 bg-white">
      <div className="max-w-[1100px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-6 shadow-2xl rounded-[24px] overflow-hidden bg-white">
          
          <div className="relative w-full lg:w-1/2 min-h-[400px] lg:min-h-[550px] bg-black">
            {bgImageSrc && (
              <Image
                src={bgImageSrc}
                alt="Special Moment"
                fill
                className="object-cover opacity-80"
              />
            )}
            <div className="absolute top-10 left-8 pr-8 z-10">
              <h3 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight font-serif">
                Let's create some special <br /> moment
              </h3>
              <p className="text-white text-[15px] sm:text-[17px] max-w-[300px]">
                Official camera roll of our prettiest brides & handsome grooms
              </p>
            </div>
          </div>

          <div className="w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center">
            <h3 className="text-2xl font-normal text-black mb-8">
              Fill In the Form To Get Started
            </h3>
            
            <form className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] text-gray-500">Full Name*</label>
                <input 
                  type="text" 
                  className="w-full border border-gray-300 rounded-md h-[45px] px-4 outline-none focus:border-black"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] text-gray-500">Select date for call back*</label>
                <input 
                  type="date" 
                  className="w-full border border-gray-300 rounded-md h-[45px] px-4 outline-none focus:border-black text-gray-700"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] text-gray-500">Select time for call back*</label>
                <input 
                  type="time" 
                  className="w-full border border-gray-300 rounded-md h-[45px] px-4 outline-none focus:border-black text-gray-700"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] text-gray-500">Message</label>
                <textarea 
                  className="w-full border border-gray-300 rounded-md h-[100px] p-4 outline-none focus:border-black resize-none"
                ></textarea>
              </div>

              <button 
                type="button" 
                className="w-full bg-[#00c3ff] text-white font-bold h-[50px] rounded-full mt-2 hover:bg-[#00a0d6] transition-colors"
              >
                Submit Now
              </button>
              
              <p className="text-[9px] text-center text-gray-400 mt-2">
                Your Contact profile name will be shared. Never submit password.
              </p>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
