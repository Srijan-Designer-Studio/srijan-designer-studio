"use client";

import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, Palette, Scissors, Ruler, UserCheck, Truck } from "lucide-react";
import { submitKidsForm } from "@/app/actions/kids";
import CustomStylesPopup from "@/components/customPopUp/CustomStylesPopup";

gsap.registerPlugin(ScrollTrigger);

const looksData = [
  { id: 1, title: "Party Perfect Clicks", img: "/Custom Kids Wear/Kids Card 1.webp", slug: "party-perfect" },
  { id: 2, title: "Everyday Happy Clicks", img: "/Custom Kids Wear/Kids Card 2.webp", slug: "everyday-happy" },
  { id: 3, title: "Magical Theme Clicks", img: "/Custom Kids Wear/Kids Card 3.webp", slug: "magical-theme" },
  { id: 4, title: "First Birthday Clicks", img: "/Custom Kids Wear/Kids Card 4.webp", slug: "first-birthday" },
  { id: 5, title: "Picture-Perfect Gown Clicks", img: "/Custom Kids Wear/Kids Card 5.webp", slug: "picture-perfect" },
  { id: 6, title: "Festive Ethnic Clicks", img: "/Custom Kids Wear/Kids Card 6.webp", slug: "festive-ethnic" },
];

const faqs = [
  { q: "Can I customize a dress or outfit for my child?", a: "Yes, absolutely! We specialize in custom tailoring for kids to ensure the perfect fit and design." },
  { q: "Can I match my child's outfit with my own outfit?", a: "Yes, we offer matching 'Mom & Me' or 'Dad & Me' outfits for special occasions." },
  { q: "What age groups do you make custom kids wear for?", a: "We design custom outfits for newborns up to 14-year-old kids." },
  { q: "How long does it take to complete a custom kids wear order?", a: "Usually, it takes 7-14 working days depending on the design complexity." },
  { q: "Can I choose the fabric for my child's outfit?", a: "Yes, you can select from our premium range of child-safe fabrics." },
  { q: "Can I make changes to the design before stitching starts?", a: "Yes, minor adjustments can be made during the consultation phase." },
  { q: "How do I provide my child's measurements?", a: "You can follow our measurement guide or schedule a video call for assistance." },
  { q: "Are custom kids outfits comfortable for everyday wear?", a: "We use soft, breathable linings to ensure maximum comfort for everyday wear." },
  { q: "Do you make outfits for birthdays and special occasions?", a: "Yes! Birthdays, weddings, and theme parties are our specialty." },
  { q: "How do I place an order for custom kids wear?", a: "Simply fill out the form below or contact us via WhatsApp to get started." },
];

export default function KidsWearClient() {
  const [activeFAQ, setActiveFAQ] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [formStatus, setFormStatus] = useState(null);
  const containerRef = useRef(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  useGSAP(() => {
    gsap.utils.toArray('.reveal-up').forEach(elem => {
      gsap.fromTo(elem,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: elem, start: "top 85%" } }
      );
    });
  }, { scope: containerRef });

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    startTransition(async () => {
      const res = await submitKidsForm(formData);
      if (res.success) {
        setFormStatus({ type: 'success', message: 'Request sent successfully! We will contact you soon.' });
        e.target.reset();
      } else {
        setFormStatus({ type: 'error', message: res.error || 'Something went wrong.' });
      }
      setTimeout(() => setFormStatus(null), 5000);
    });
  };

  return (
    <div ref={containerRef} className="font-sans w-full text-black overflow-hidden">
      
      <CustomStylesPopup 
        isOpen={isPopupOpen} 
        onClose={() => setIsPopupOpen(false)} 
        category="Kids"
      />

      <section className="relative w-full h-screen md:h-screen bg-[#a8a196] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src="/Custom Kids Wear/Custom Kids Wear HERO Section.webp" alt="Customize Kids Wear" className="w-full h-full object-cover object-right md:object-center opacity-80" />
        </div>
        <div className="relative z-10 max-w-[1320px] mx-auto px-6 w-full">
          <div className="max-w-xl ml-auto text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-md">Customize Kids Wear</h1>
            <p className="text-lg md:text-xl font-medium drop-shadow-md">Capture every little moment,<br /> dressed just right.</p>
          </div>
        </div>
      </section>

      <section className="py-20 max-w-[1320px] mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="reveal-up relative">
          <img src="/Custom Kids Wear/Untitled design (4).webp" alt="Camera Graphic" className="w-full h-auto drop-shadow-2xl" />
        </div>
        <div className="reveal-up">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">Click Small Sizes, Big Memories</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Birthdays, festivals, family days or photoshoots, we design custom kids wear that fits perfectly and photographs even better. Because every giggle and twirl deserves to be remembered just right click.
          </p>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="max-w-[1320px] mx-auto px-6">
          <h2 className="reveal-up text-3xl font-bold text-center mb-12">Choose Click By Looks</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            {looksData.map((look) => (
              <div key={look.id} className="reveal-up group block cursor-pointer">
                <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all">
                  <img src={look.img} alt={look.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <h3 className="text-center font-bold text-[15px] md:text-[16px] text-gray-900 group-hover:text-[#00c3ff] transition-colors">{look.title}</h3>
              </div>
            ))}
          </div>
          <div className="text-center reveal-up">
            <button 
              onClick={() => setIsPopupOpen(true)} 
              className="px-8 py-3 bg-[#00c3ff] text-white rounded-full font-bold shadow-md hover:bg-[#00a0d6] transition-colors"
            >
              Choose Your Look
            </button>
          </div>
        </div>
      </section>

      <section className="hiw-sec py-20 bg-white">
        <div className="max-w-[1320px] mx-auto px-6 text-center">
          <h2 className="hiw-title text-3xl sm:text-[38px] font-bold text-black mb-16 lg:mb-20">
            Trusted By Parents
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-8 mb-12 lg:mb-16">
            <div className="hiw-step flex flex-col items-center">
              <div className="mb-6 flex h-14 items-center justify-center">
                <img src="/Create Custom-img/Icon 1.webp" alt="Pick your fabric" className="h-12 w-auto object-contain" />
              </div>
              <h3 className="font-bold text-black text-[19px] mb-2.5">Pick your fabric</h3>
              <p className="text-[15px] text-gray-600 max-w-[260px] mx-auto leading-relaxed">
                Choose the fabric and colour you love.
              </p>
            </div>

            <div className="hiw-step flex flex-col items-center">
              <div className="mb-6 flex h-14 items-center justify-center">
                <img src="/Create Custom-img/Icon 2.webp" alt="Design a dress" className="h-12 w-auto object-contain" />
              </div>
              <h3 className="font-bold text-black text-[19px] mb-2.5">Design a dress</h3>
              <p className="text-[15px] text-gray-600 max-w-[260px] mx-auto leading-relaxed">
                Share your ideas and create your perfect look.
              </p>
            </div>

            <div className="hiw-step flex flex-col items-center">
              <div className="mb-6 flex h-14 items-center justify-center">
                <img src="/Create Custom-img/Icon 3.webp" alt="Get measured" className="h-12 w-auto object-contain" />
              </div>
              <h3 className="font-bold text-black text-[19px] mb-2.5">Get measured</h3>
              <p className="text-[15px] text-gray-600 max-w-[260px] mx-auto leading-relaxed">
                Send your measurements for a perfect fit.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-8 max-w-[850px] mx-auto">
            <div className="hiw-step flex flex-col items-center">
              <div className="mb-6 flex h-14 items-center justify-center">
                <img src="/Create Custom-img/Icon 4.webp" alt="Consult with designer" className="h-12 w-auto object-contain" />
              </div>
              <h3 className="font-bold text-black text-[19px] mb-2.5">Consult with designer</h3>
              <p className="text-[15px] text-gray-600 max-w-[260px] mx-auto leading-relaxed">
                Discuss your vision with fashion designer.
              </p>
            </div>

            <div className="hiw-step flex flex-col items-center">
              <div className="mb-6 flex h-14 items-center justify-center">
                <img src="/Create Custom-img/Icon 5.webp" alt="Get delivered" className="h-12 w-auto object-contain" />
              </div>
              <h3 className="font-bold text-black text-[19px] mb-2.5">Get delivered</h3>
              <p className="text-[15px] text-gray-600 max-w-[260px] mx-auto leading-relaxed">
                Receive your custom-made dress at your doorstep.
              </p>
            </div>
          </div>

        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <h2 className="reveal-up text-3xl md:text-[38px] font-bold text-center mb-10 text-black">
            Our Click Gallery
          </h2>

          <div className="reveal-up grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
            <img src="/Custom Kids Wear/Gallery 1.webp" alt="Gallery" className="w-full h-full object-cover object-center rounded-2xl md:rounded-[24px] aspect-square" />
            <img src="/Custom Kids Wear/Gallery 2.webp" alt="Gallery" className="w-full h-full object-cover object-center rounded-2xl md:rounded-[24px] aspect-square col-span-2 row-span-2" />
            <img src="/Custom Kids Wear/Gallery 3.webp" alt="Gallery" className="w-full h-full object-cover object-center rounded-2xl md:rounded-[24px] aspect-square col-span-2 row-span-2" />
            <img src="/Custom Kids Wear/Gallery 4.webp" alt="Gallery" className="w-full h-full object-cover object-center rounded-2xl md:rounded-[24px] aspect-square" />
            <img src="/Custom Kids Wear/Gallery 5.webp" alt="Gallery" className="w-full h-full object-cover object-center rounded-2xl md:rounded-[24px] aspect-square" />
            <img src="/Custom Kids Wear/Gallery 6.webp" alt="Gallery" className="w-full h-full object-cover object-center rounded-2xl md:rounded-[24px] aspect-square" />
            <img src="/Custom Kids Wear/Gallery 7.webp" alt="Gallery" className="w-full h-full object-cover object-center rounded-2xl md:rounded-[24px] aspect-square" />
            <img src="/Custom Kids Wear/Gallery 8.webp" alt="Gallery" className="w-full h-full object-cover object-center rounded-2xl md:rounded-[24px] aspect-square" />
            <img src="/Custom Kids Wear/Gallery 9.webp" alt="Gallery" className="w-full h-full object-cover object-center rounded-2xl md:rounded-[24px] aspect-square" />
            <img src="/Custom Kids Wear/Gallery 10.webp" alt="Gallery" className="w-full h-full object-cover object-center rounded-2xl md:rounded-[24px] aspect-square" />
            <img src="/Custom Kids Wear/Gallery 11.webp" alt="Gallery" className="w-full h-full object-cover object-center rounded-2xl md:rounded-[24px] aspect-square" />
            <img src="/Custom Kids Wear/Gallery 12.webp" alt="Gallery" className="w-full h-full object-cover object-center rounded-2xl md:rounded-[24px] aspect-square" />
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f4f7fa]">
        <div className="max-w-[1000px] mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div className="reveal-up">
            <h2 className="text-4xl font-bold text-black mb-6 leading-tight">Let's click some special moment</h2>
            <img src="/Custom Kids Wear/Untitled design (5).webp" alt="Special Moment" className="w-full object-cover" />
          </div>
          
          <div className="reveal-up bg-white p-8 rounded-2xl shadow-xl border border-[#d69f53]">
            <h3 className="text-2xl font-normal text-black mb-6 text-center">Fill In the Form To Get Started</h3>

            {formStatus && (
              <div className={`p-3 rounded-md mb-4 text-sm font-bold ${formStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {formStatus.message}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input type="hidden" name="sourcePage" value="Custom Kids Wear" />
              
              <div>
                <label className="block text-sm text-gray-700 mb-1">Full Name*</label>
                <input name="name" type="text" required className="w-full px-4 py-2.5 border border-gray-400 rounded-lg focus:ring-1 focus:ring-black focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Email Address*</label>
                <input name="email" type="email" required className="w-full px-4 py-2.5 border border-gray-400 rounded-lg focus:ring-1 focus:ring-black focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Phone Number*</label>
                <input name="phone" type="tel" required className="w-full px-4 py-2.5 border border-gray-400 rounded-lg focus:ring-1 focus:ring-black focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Outfit Type*</label>
                <input name="outfitType" type="text" required className="w-full px-4 py-2.5 border border-gray-400 rounded-lg focus:ring-1 focus:ring-black focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Budget Range*</label>
                <input name="budget" type="text" required className="w-full px-4 py-2.5 border border-gray-400 rounded-lg focus:ring-1 focus:ring-black focus:outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Select date for call back*</label>
                <input name="date" type="date" required className="w-full px-4 py-2.5 border border-gray-400 rounded-lg focus:ring-1 focus:ring-black focus:outline-none text-gray-600" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Select time for call back*</label>
                <input name="time" type="time" required className="w-full px-4 py-2.5 border border-gray-400 rounded-lg focus:ring-1 focus:ring-black focus:outline-none text-gray-600" />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">Message</label>
                <textarea name="message" rows="3" className="w-full px-4 py-2.5 border border-gray-400 rounded-lg focus:ring-1 focus:ring-black focus:outline-none"></textarea>
              </div>
              <button type="submit" disabled={isPending} className="w-full py-3 bg-[#c98d45] text-black font-medium rounded-full hover:bg-[#b57a35] transition-colors mt-2 disabled:opacity-70">
                {isPending ? 'SUBMITTING...' : 'SUBMIT NOW'}
              </button>
              <p className="text-[10px] text-center text-gray-500 mt-2">
                Your profile name will be shared. Never submit passwords.
              </p>
            </form>
          </div>
        </div>
      </section>

      <section className="py-20 max-w-[1000px] mx-auto px-6">
        <h2 className="reveal-up text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="reveal-up grid md:grid-cols-2 gap-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg bg-blue-50/30 overflow-hidden h-fit">
              <button
                onClick={() => setActiveFAQ(activeFAQ === index ? null : index)}
                className="w-full flex items-center justify-between p-4 text-left focus:outline-none cursor-pointer hover:bg-blue-50/50 transition-colors"
              >
                <span className="font-semibold text-sm md:text-[15px] text-gray-800 pr-4">{faq.q}</span>
                <ChevronDown size={20} className={`text-gray-500 transition-transform duration-300 flex-shrink-0 ${activeFAQ === index ? 'rotate-180' : ''}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-300 ${activeFAQ === index ? 'max-h-40 border-t border-gray-200' : 'max-h-0'}`}>
                <p className="p-4 text-sm text-gray-600">{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}