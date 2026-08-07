"use client";

import { useState, useRef, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown, Palette, Scissors, Ruler, UserCheck, Truck } from "lucide-react";
import { submitKidsForm } from "@/app/actions/kids";

gsap.registerPlugin(ScrollTrigger);

const looksData = [
  { id: 1, title: "Party Perfect Clicks", img: "/images/kids-look1.jpg", slug: "party-perfect" },
  { id: 2, title: "Everyday Happy Clicks", img: "/images/kids-look2.jpg", slug: "everyday-happy" },
  { id: 3, title: "Magical Theme Clicks", img: "/images/kids-look3.jpg", slug: "magical-theme" },
  { id: 4, title: "First Birthday Clicks", img: "/images/kids-look4.jpg", slug: "first-birthday" },
  { id: 5, title: "Picture-Perfect Gown Clicks", img: "/images/kids-look5.jpg", slug: "picture-perfect" },
  { id: 6, title: "Festive Ethnic Clicks", img: "/images/kids-look6.jpg", slug: "festive-ethnic" },
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

  useGSAP(() => {
    // Reveal Animations
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
    <div ref={containerRef} className="pt-[80px] lg:pt-[100px] bg-white font-sans overflow-hidden">
      
      {/* 1. Hero Section */}
      <section className="relative w-full h-[50vh] md:h-[70vh] bg-[#a8a196] flex items-center">
        <div className="absolute inset-0 z-0">
          <img src="/images/kids-hero.jpg" alt="Customize Kids Wear" className="w-full h-full object-cover object-right md:object-center opacity-80" />
        </div>
        <div className="relative z-10 max-w-[1320px] mx-auto px-6 w-full">
          <div className="max-w-xl text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-md">Customize Kids Wear</h1>
            <p className="text-lg md:text-xl font-medium drop-shadow-md">Capture every little moment, dressed just right.</p>
          </div>
        </div>
      </section>

      {/* 2. Camera Graphic Section */}
      <section className="py-20 max-w-[1320px] mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="reveal-up relative">
          <img src="/images/kids-camera.png" alt="Camera Graphic" className="w-full h-auto drop-shadow-2xl" />
        </div>
        <div className="reveal-up">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">Click Small Sizes, Big Memories</h2>
          <p className="text-gray-600 leading-relaxed text-lg">
            Birthdays, festivals, family days or photoshoots, we design custom kids wear that fits perfectly and photographs even better. Because every giggle and twirl deserves to be remembered just right click.
          </p>
        </div>
      </section>

      {/* 3. Choose Click By Looks */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1320px] mx-auto px-6">
          <h2 className="reveal-up text-3xl font-bold text-center mb-12">Choose Click By Looks</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            {looksData.map((look) => (
              <Link href={`/occasions/${look.slug}`} key={look.id} className="reveal-up group block cursor-pointer">
                <div className="relative aspect-[4/5] rounded-[20px] overflow-hidden mb-4 shadow-sm group-hover:shadow-xl transition-all">
                  <img src={look.img} alt={look.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                </div>
                <h3 className="text-center font-bold text-[15px] md:text-[16px] text-gray-900 group-hover:text-[#00c3ff] transition-colors">{look.title}</h3>
              </Link>
            ))}
          </div>
          <div className="text-center reveal-up">
            <button className="px-8 py-3 bg-[#00c3ff] text-white rounded-full font-bold shadow-md hover:bg-[#00a0d6] transition-colors">Choose Your Look</button>
          </div>
        </div>
      </section>

      {/* 4. Trusted By Parents */}
      <section className="py-20 max-w-[1320px] mx-auto px-6">
        <h2 className="reveal-up text-3xl font-bold text-center mb-16">Trusted By Parents</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center">
          {[
            { icon: Palette, title: "Pick your fabric", desc: "Choose the fabric and colour for your kid." },
            { icon: Scissors, title: "Design a dress", desc: "Share your ideas and create your kid perfect look." },
            { icon: Ruler, title: "Get measured", desc: "Send your measurements for a perfect fit." },
            { icon: UserCheck, title: "Consult with designer", desc: "Discuss your vision with fashion designer." },
            { icon: Truck, title: "Get delivered", desc: "Receive your custom-made dress at your doorstep." }
          ].map((item, idx) => (
            <div key={idx} className="reveal-up flex flex-col items-center">
              <div className="w-16 h-16 mb-4 flex items-center justify-center text-gray-800">
                <item.icon size={40} strokeWidth={1.5} />
              </div>
              <h3 className="font-bold text-gray-900 mb-2">{item.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Click Gallery */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-[1320px] mx-auto px-6">
          <h2 className="reveal-up text-3xl font-bold text-center mb-10">Our Click Gallery</h2>
          {/* Masonry / Bento Box simulation */}
          <div className="reveal-up grid grid-cols-2 md:grid-cols-4 gap-4 auto-rows-[150px] md:auto-rows-[200px]">
            <img src="/images/gal1.jpg" className="w-full h-full object-cover rounded-xl" />
            <img src="/images/gal2.jpg" className="w-full h-full object-cover rounded-xl row-span-2" />
            <img src="/images/gal3.jpg" className="w-full h-full object-cover rounded-xl row-span-2 col-span-2 md:col-span-1" />
            <img src="/images/gal4.jpg" className="w-full h-full object-cover rounded-xl" />
            <img src="/images/gal5.jpg" className="w-full h-full object-cover rounded-xl" />
            <img src="/images/gal6.jpg" className="w-full h-full object-cover rounded-xl" />
            <img src="/images/gal7.jpg" className="w-full h-full object-cover rounded-xl" />
            <img src="/images/gal8.jpg" className="w-full h-full object-cover rounded-xl" />
            <img src="/images/gal9.jpg" className="w-full h-full object-cover rounded-xl" />
          </div>
        </div>
      </section>

      {/* 6. Contact Form Section */}
      <section className="py-20 bg-[#f4f7fa]">
        <div className="max-w-[1000px] mx-auto px-6 grid md:grid-cols-2 gap-10 items-center">
          <div className="reveal-up">
            <h2 className="text-4xl font-bold text-black mb-6 leading-tight">Let's click some special moment</h2>
            <img src="/images/kids-form-img.jpg" alt="Special Moment" className="w-full rounded-2xl shadow-lg object-cover" />
          </div>
          <div className="reveal-up bg-white p-8 rounded-2xl shadow-xl">
            <h3 className="text-xl font-bold mb-6 text-gray-800">Fill In the Form To Get Started</h3>
            
            {formStatus && (
              <div className={`p-3 rounded-md mb-4 text-sm font-bold ${formStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {formStatus.message}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Full Name*</label>
                <input name="name" type="text" required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00c3ff] focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Select date for call back*</label>
                <input name="date" type="date" required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00c3ff] focus:outline-none text-gray-600" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Select time for call back*</label>
                <input name="time" type="time" required className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00c3ff] focus:outline-none text-gray-600" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">Message</label>
                <textarea name="message" rows="3" className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#00c3ff] focus:outline-none"></textarea>
              </div>
              <button type="submit" disabled={isPending} className="w-full py-3 bg-[#00c3ff] text-white font-bold rounded-lg hover:bg-[#00a0d6] transition-colors disabled:opacity-70">
                {isPending ? 'Submitting...' : 'Submit Now'}
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
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