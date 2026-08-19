"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { sendWeddingInquiry } from "@/app/actions/contact";

gsap.registerPlugin(ScrollTrigger);

export default function WeddingContactForm() {
  const containerRef = useRef(null);
  const formRef = useRef(null);
  const bgImageSrc = "/Custom Wedding Wear/Wedding Wear.webp";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', message: '' });

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: "top 75%",
        toggleActions: "play none none reverse",
      }
    });

    tl.fromTo(
      ".wed-contact-left",
      { x: -50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power4.out" }
    ).fromTo(
      ".wed-contact-right",
      { x: 50, opacity: 0 },
      { x: 0, opacity: 1, duration: 1, ease: "power4.out" },
      "-=0.8"
    );
  }, { scope: containerRef });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFeedback({ type: '', message: '' });

    const formData = new FormData(e.target);
    const result = await sendWeddingInquiry(formData);

    if (result.success) {
      setFeedback({ type: 'success', message: result.message });
      formRef.current.reset();
    } else {
      setFeedback({ type: 'error', message: result.error });
    }
    
    setIsSubmitting(false);
    
    setTimeout(() => setFeedback({ type: '', message: '' }), 4000);
  };

  return (
    <section className="py-20 bg-white" ref={containerRef}>
      <div className="max-w-[1280px] mx-auto px-6">
        <div className="flex flex-col lg:flex-row shadow-2xl rounded-[24px] overflow-hidden bg-white">

          <div className="wed-contact-left relative w-full lg:w-1/2 min-h-[400px] lg:min-h-[550px] bg-black">
            {bgImageSrc && (
              <Image
                src={bgImageSrc}
                alt="Special Moment"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
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

          <div className="wed-contact-right w-full lg:w-1/2 p-8 sm:p-12 flex flex-col justify-center relative bg-white z-10 lg:-ml-[1px]">
            <div className="border border-[#d69f53] p-8 rounded-2xl">
              <h3 className="text-2xl font-normal text-black mb-6 text-center">
                Fill In the Form To Get Started
              </h3>

              {feedback.message && (
                <div className={`mb-4 p-3 rounded-md text-sm font-medium ${feedback.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {feedback.message}
                </div>
              )}

              <form ref={formRef} onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input type="hidden" name="sourcePage" value="Wedding Contact" />

                <div className="flex flex-col gap-1">
                  <label className="text-[14px] text-gray-700">Full Name*</label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    className="w-full border border-gray-400 rounded-lg h-[45px] px-4 outline-none focus:border-black transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[14px] text-gray-700">Email Address*</label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full border border-gray-400 rounded-lg h-[45px] px-4 outline-none focus:border-black transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[14px] text-gray-700">Phone Number*</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    className="w-full border border-gray-400 rounded-lg h-[45px] px-4 outline-none focus:border-black transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[14px] text-gray-700">Outfit Type*</label>
                    <input
                      type="text"
                      name="outfitType"
                      required
                      className="w-full border border-gray-400 rounded-lg h-[45px] px-4 outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[14px] text-gray-700">Budget Range*</label>
                    <input
                      type="text"
                      name="budget"
                      required
                      className="w-full border border-gray-400 rounded-lg h-[45px] px-4 outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-[14px] text-gray-700">Select date for call back*</label>
                    <input
                      type="date"
                      name="date"
                      required
                      className="w-full border border-gray-400 rounded-lg h-[45px] px-4 outline-none focus:border-black text-gray-700 transition-colors"
                    />
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-[14px] text-gray-700">Select time for call back*</label>
                    <input
                      type="time"
                      name="time"
                      required
                      className="w-full border border-gray-400 rounded-lg h-[45px] px-4 outline-none focus:border-black text-gray-700 transition-colors"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[14px] text-gray-700">Message</label>
                  <textarea
                    name="message"
                    className="w-full border border-gray-400 rounded-lg h-[80px] p-4 outline-none focus:border-black resize-none transition-colors"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#c98d45] text-black font-medium h-[50px] rounded-full mt-2 hover:bg-[#b57a35] transition-colors shadow-md disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? 'SUBMITTING...' : 'SUBMIT NOW'}
                </button>

                <p className="text-[10px] text-center text-gray-500 mt-1">
                  Your profile name will be shared. Never submit passwords.
                </p>
              </form>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}