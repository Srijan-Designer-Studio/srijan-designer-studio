import Image from "next/image";

export default function AboutContent() {
  return (
    <>


      <section className="bg-white py-24">
        <div className="max-w-[1320px] mx-auto px-6">

          <div className="grid lg:grid-cols-2 items-center gap-10">

            {/* Left Content */}
            <div>

              <h2 className="text-[56px] font-light leading-tight text-[#111] mb-8">
                SRIJAN" Means Creation. It's Not
                Just Our Name, It's Our Craft
              </h2>

              <p className="text-[22px] leading-[42px] text-[#222] mb-8">
                And that is exactly what we do. We don’t just sell clothes; we
                create statements, memories and moments.
              </p>

              <p className="text-[22px] leading-[42px] text-[#222] mb-8">
                <strong>At SRIJAN,</strong> we believe that fashion shouldn’t be
                limited by what’s on a rack. Whether it’s a screenshot from
                Instagram, a sketch on a napkin or a dream you’ve had since you
                were five we exist to bring it to life.
              </p>

              <p className="text-[22px] leading-[42px] text-[#222]">
                We are a new-age fashion house in Kolkata that bridges the gap
                between <strong>exclusive designer luxury</strong> and
                <strong> accessible, custom fashion.</strong>
              </p>

            </div>

            {/* Right Image */}
            <div className="flex justify-end">

              <Image
                src="/images/aboutmodel.png"
                alt="About Model"
                width={650}
                height={950}
                className="w-full max-w-[650px] h-auto object-contain"
                priority
              />

            </div>

          </div>

        </div>
      </section>
      {/* ===================== What We Do ===================== */}

      <section className="bg-white py-24">

        <div className="max-w-[1320px] mx-auto px-6">

          <div className="grid lg:grid-cols-2 gap-20 items-center">

            {/* Left Image */}

            <div className="flex justify-center">

              <Image
                src="/images/whatwedo.png"
                alt="What We Do"
                width={520}
                height={900}
                className="w-full max-w-[520px] h-auto object-contain"
              />

            </div>

            {/* Right Content */}

            <div>

              <h2 className="text-[56px] font-light text-[#111] mb-8">
                What We Do
              </h2>

              <p className="text-[22px] leading-[40px] text-[#222] mb-10">
                We are not just a boutique; we are a full-spectrum fashion hub.
              </p>

              <div className="space-y-10">

                <div>

                  <p className="text-[22px] leading-[42px] text-[#222]">

                    <span className="font-bold">
                      ✨ For The Trendsetters (Ready-to-Wear)
                    </span>

                    {" "}
                    From breezy Western cuts for your brunch dates to elegant
                    Indo-Western fusions for office parties, and timeless Ethnic
                    wear for family gatherings our racks are curated for the
                    modern woman who refuses to be boring.

                  </p>

                </div>

                <div>

                  <p className="text-[22px] leading-[42px] text-[#222]">

                    <span className="font-bold">
                      ✨ For The Dreamers (Bridal & Custom)
                    </span>

                    {" "}
                    Your wedding dress shouldn’t just fit your body; it should
                    fit your personality. Our specialized Bridal Section works
                    with you thread by thread to craft a trousseau that is
                    uniquely yours. Have a specific design in mind? Our
                    “Scratch-to-Reality” Customization Service guarantees that
                    if you can dream it, we can stitch it.

                  </p>

                </div>

                <div>

                  <p className="text-[22px] leading-[42px] text-[#222]">

                    <span className="font-bold">
                      ✨ For The Little Ones (Kids Section)
                    </span>

                    {" "}
                    Why should adults have all the fun? We craft comfortable,
                    stylish, and adorable outfits for kids. Whether it’s a
                    birthday princess gown or a festive kurta for your little
                    prince, we make sure they steal the show comfortably.

                  </p>

                </div>

                <div>

                  <p className="text-[22px] leading-[42px] text-[#222]">

                    <span className="font-bold">
                      ✨ For The Visionaries (Production Hub)
                    </span>

                    {" "}
                    We are makers at heart. Beyond our own label, Srijan serves
                    as a Production Powerhouse for other brands. We offer
                    end-to-end manufacturing services, handling bulk production
                    with the same precision and quality control we apply to our
                    individual masterpieces. You design the brand; we handle the
                    sewing machines.

                  </p>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>
      {/* ===================== Our Promise ===================== */}

      <section className="bg-white py-24">
        <div className="max-w-[1320px] mx-auto px-6">

          <div className="grid lg:grid-cols-2 items-center gap-20">

            {/* Left Content */}
            <div>

              <h2 className="text-[58px] font-light text-[#111] mb-10">
                Our Promise
              </h2>

              <p className="text-[22px] leading-[42px] text-[#222] mb-10">
                In a world of fast fashion and copy-paste trends,
                <strong> SRIJAN </strong>
                stands for
                <strong> individuality.</strong>
              </p>

              <ul className="space-y-5 text-[22px] leading-[42px] text-[#222] list-disc pl-8 mb-12">

                <li>
                  <strong>No Compromises:</strong> We use premium fabrics and expert
                  tailoring.
                </li>

                <li>
                  <strong>No Limits:</strong> Any size, any style, any design.
                </li>

                <li>
                  <strong>No Delays:</strong> Whether it’s a single bridal lehenga or
                  a bulk order of 500 units, we respect the deadline.
                </li>

              </ul>

              <p className="text-[24px] leading-[42px] text-[#222]">
                <strong>Welcome to SRIJAN.</strong>

                <span className="italic">
                  {" "}
                  Come for the fashion. Stay for the fit.
                </span>
              </p>

            </div>

            {/* Right Image */}

            <div className="flex justify-end">
              <Image
                src="/images/ourpromise.png"
                alt="Our Promise"
                width={720}
                height={900}
                className="w-full max-w-[720px] h-auto object-contain"
              />
            </div>

          </div>

        </div>
      </section>
    </>
  );
}