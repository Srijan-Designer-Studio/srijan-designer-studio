export default function ContactPage() {
  return (
    <section className="bg-white py-20">
      <div className="max-w-[1320px] mx-auto px-6">

        {/* Heading */}
        <h1 className="text-center text-[54px] font-light text-[#222] mb-16">
          Contact Us
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left */}
          <div>

            <div className="space-y-8">

              <div className="flex items-start gap-4">

                <span className="text-3xl">📞</span>

                <div>
                  <h3 className="font-semibold text-lg">Phone</h3>
                  <p className="text-gray-600">
                    +91 6290686399
                  </p>
                </div>

              </div>

              <div className="flex items-start gap-4">

                <span className="text-3xl">✉️</span>

                <div>
                  <h3 className="font-semibold text-lg">Email</h3>

                  <p className="text-gray-600">
                    contact@srijandesignerstudio.com
                  </p>

                </div>

              </div>

              <div className="flex items-start gap-4">

                <span className="text-3xl">📍</span>

                <div>

                  <h3 className="font-semibold text-lg">
                    Office
                  </h3>

                  <p className="text-gray-600 leading-7">
                    Chhobi Apartment,
                    Sani Mandir,
                    Panchasayar Main Road,
                    Panchasayar,
                    Kolkata-700094,
                    West Bengal
                  </p>

                </div>

              </div>

            </div>

            <div className="mt-10 overflow-hidden rounded-lg border">

              <iframe
                src="https://www.google.com/maps?q=Chhobi+Apartment+Panchasayar+Kolkata&output=embed"
                width="100%"
                height="430"
                style={{ border: 0 }}
                loading="lazy"
              />

            </div>

          </div>

          {/* Right */}

          <div>

            <form className="space-y-6">

              <div>

                <label className="mb-2 block font-medium">
                  Your Name *
                </label>

                <input
                  type="text"
                  className="h-[56px] w-full rounded border border-gray-300 px-4 focus:border-black outline-none"
                />

              </div>

              <div>

                <label className="mb-2 block font-medium">
                  Email Address *
                </label>

                <input
                  type="email"
                  className="h-[56px] w-full rounded border border-gray-300 px-4 focus:border-black outline-none"
                />

              </div>

              <div>

                <label className="mb-2 block font-medium">
                  Subject
                </label>

                <input
                  type="text"
                  className="h-[56px] w-full rounded border border-gray-300 px-4 focus:border-black outline-none"
                />

              </div>

              <div>

                <label className="mb-2 block font-medium">
                  Message
                </label>

                <textarea
                  rows="8"
                  className="w-full rounded border border-gray-300 p-4 resize-none focus:border-black outline-none"
                />

              </div>

              <button
                type="submit"
                className="bg-black text-white px-10 py-4 uppercase tracking-wider hover:bg-[#8B5E3C] duration-300"
              >
                Submit
              </button>

            </form>

          </div>

        </div>

      </div>
    </section>
  );
}