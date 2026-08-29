"use client";

import { useState, useRef, useTransition, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
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
  { 
    q: "Can I customize a dress or outfit for my child?", 
    a: "Yes. We can make the outfit according to the design, color and fabric choice that you like." 
  },
  { 
    q: "What age groups do you make custom kids wear for?", 
    a: "We provide the service of custom-made outfits for babies, toddlers and children from different age groups. Mention the age or measurements of your child and we can get started." 
  },
  { 
    q: "Can I choose the fabric for my child's outfit?", 
    a: "Yes, we have several fabrics that are appropriate to wear by the children for different seasons and occasions." 
  },
  { 
    q: "How do I provide my child's measurements?", 
    a: "The child's measurement can be shared directly with us or we can send you the guide for measurement." 
  },
  { 
    q: "Do you make outfits for birthdays and special occasions?", 
    a: "Yes, we create custom outfits for the birthday, wedding, festival, school function, photoshoot and much more special events." 
  },
  { 
    q: "Can I match my child's outfit with my own outfit?", 
    a: "Certainly. We can also coordinate the outfits for parents along with the kids so that everyone can match." 
  },
  { 
    q: "How long does it take to complete a custom kids wear order?", 
    a: "It depends upon the design and customization requirements of the outfit, after understanding the need, we'll let you know about the delivery date." 
  },
  { 
    q: "Can I make changes to the design before stitching starts?", 
    a: "Yes, we discuss all the designing aspects with the customers before creating the outfit. This will help you request any changes during the designing phase." 
  },
  { 
    q: "Are custom kids outfits comfortable for everyday wear?", 
    a: "Yes, absolutely. The comfort is one of the priorities. We will ensure the perfect fitting, softness and ease in wearing of our items." 
  },
  { 
    q: "How do I place an order for custom kids wear?", 
    a: "You just need to share us the requirements or designs and we'll assist you from fabric choice, measurement and design discussion to order placing." 
  }
];

export default function KidsWearClient() {
  const [openId, setOpenId] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [formStatus, setFormStatus] = useState(null);
  const containerRef = useRef(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [timeError, setTimeError] = useState("");

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });

    resizeObserver.observe(document.body);

    const timer = setTimeout(() => {
      ScrollTrigger.refresh();
    }, 1000);

    return () => {
      resizeObserver.disconnect();
      clearTimeout(timer);
    };
  }, []);

  useGSAP(() => {
    gsap.utils.toArray('.reveal-up').forEach(elem => {
      gsap.fromTo(elem,
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", scrollTrigger: { trigger: elem, start: "top 85%" } }
      );
    });

    gsap.to(".faq-animate", {
      y: 0,
      opacity: 1,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out",
      scrollTrigger: {
        trigger: ".faq-section-trigger",
        start: "top 85%",
        once: true,
      }
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

  const handleTimeChange = (e) => {
    const selectedTime = e.target.value;
    if (!selectedTime) return;

    const [hours, minutes] = selectedTime.split(":").map(Number);

    if (hours < 12 || hours > 21 || (hours === 21 && minutes > 0)) {
      setTimeError("Call back time is only available between 12:00 PM and 9:00 PM.");
      e.target.value = "";
      return;
    }

    setTimeError("");
  };

  const toggleFAQ = (index) => {
    setOpenId((prevId) => (prevId === index ? null : index));
    setTimeout(() => {
      ScrollTrigger.refresh();
    }, 350);
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
          <Image fill src="/Custom Kids Wear/HERO Section 3.webp" alt="Customize Kids Wear" priority className="object-cover object-center" />
        </div>
        <div className="relative z-10 max-w-[1320px] mx-auto px-6 w-full">
          <div className="max-w-xl mr-auto text-white">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 leading-tight drop-shadow-md">Customize Kids Wear</h1>
            <p className="text-[19px] sm:text-xl lg:text-[22px] text-white font-semibold leading-relaxed drop-shadow-sm max-w-[600px]">Capture every little moment, dressed just right.</p>
          </div>
        </div>
      </section>

      <section className="py-20 max-w-[1320px] mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
        <div className="reveal-up relative">
          <img src="/Custom Kids Wear/Untitled design (4).webp" alt="Camera Graphic" className="w-full h-auto drop-shadow-2xl" />
        </div>
        <div className="reveal-up">
          <h2 className="text-3xl md:text-4xl font-bold text-black mb-6">Click Small Sizes, Save Big Memories</h2>
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
              className="px-8 py-3 bg-[#00c3ff] text-white rounded-full font-bold shadow-md hover:bg-[#00a0d6] transition-colors cursor-pointer"
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
              <p className="text-[19px] text-gray-600 max-w-[260px] mx-auto leading-relaxed">
                Choose the fabric and colour you love.
              </p>
            </div>

            <div className="hiw-step flex flex-col items-center">
              <div className="mb-6 flex h-14 items-center justify-center">
                <img src="/Create Custom-img/Icon 2.webp" alt="Design a dress" className="h-12 w-auto object-contain" />
              </div>
              <h3 className="font-bold text-black text-[19px] mb-2.5">Design a dress</h3>
              <p className="text-[19px] text-gray-600 max-w-[260px] mx-auto leading-relaxed">
                Share your ideas and create your perfect look.
              </p>
            </div>

            <div className="hiw-step flex flex-col items-center">
              <div className="mb-6 flex h-14 items-center justify-center">
                <img src="/Create Custom-img/Icon 3.webp" alt="Get measured" className="h-12 w-auto object-contain" />
              </div>
              <h3 className="font-bold text-black text-[19px] mb-2.5">Get measured</h3>
              <p className="text-[19px] text-gray-600 max-w-[260px] mx-auto leading-relaxed">
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
              <p className="text-[19px] text-gray-600 max-w-[260px] mx-auto leading-relaxed">
                Discuss your vision with fashion designer.
              </p>
            </div>

            <div className="hiw-step flex flex-col items-center">
              <div className="mb-6 flex h-14 items-center justify-center">
                <img src="/Create Custom-img/Icon 5.webp" alt="Get delivered" className="h-12 w-auto object-contain" />
              </div>
              <h3 className="font-bold text-black text-[19px] mb-2.5">Get delivered</h3>
              <p className="text-[19px] text-gray-600 max-w-[260px] mx-auto leading-relaxed">
                Receive your custom-made dress at your doorstep.
              </p>
            </div>
          </div>

        </div>
      </section>

      <section className="py-16 bg-white text-black">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <h2 className="reveal-up text-3xl md:text-[38px] font-bold text-center mb-10 text-black">
            Our Click Gallery
          </h2>

          <div className="reveal-up grid grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
            <img src="/Custom Kids Wear/Gallery 7.webp" alt="Gallery" className="order-1 md:order-none w-full h-full object-cover object-center rounded-2xl md:rounded-[24px] aspect-square" />
            <img src="/Custom Kids Wear/Gallery 10.webp" alt="Gallery" className="order-5 md:order-none w-full h-full object-cover object-center rounded-2xl md:rounded-[24px] aspect-square col-span-2 row-span-2" />
            <img src="/Custom Kids Wear/Gallery 9.webp" alt="Gallery" className="order-7 md:order-none w-full h-full object-cover object-center rounded-2xl md:rounded-[24px] aspect-square col-span-2 row-span-2" />
            <img src="/Custom Kids Wear/Gallery 6.webp" alt="Gallery" className="order-2 md:order-none w-full h-full object-cover object-center rounded-2xl md:rounded-[24px] aspect-square" />
            <img src="/Custom Kids Wear/Gallery 5.webp" alt="Gallery" className="order-3 md:order-none w-full h-full object-cover object-center rounded-2xl md:rounded-[24px] aspect-square" />
            <img src="/Custom Kids Wear/Gallery 1.webp" alt="Gallery" className="order-4 md:order-none w-full h-full object-cover object-center rounded-2xl md:rounded-[24px] aspect-square" />
            <img src="/Custom Kids Wear/Gallery 3.webp" alt="Gallery" className="order-6 md:order-none w-full h-full object-cover object-center rounded-2xl md:rounded-[24px] aspect-square" />
            <img src="/Custom Kids Wear/Gallery 2.webp" alt="Gallery" className="order-8 md:order-none w-full h-full object-cover object-center rounded-2xl md:rounded-[24px] aspect-square" />
            <img src="/Custom Kids Wear/Gallery 11.webp" alt="Gallery" className="order-9 md:order-none w-full h-full object-cover object-center rounded-2xl md:rounded-[24px] aspect-square" />
            <img src="/Custom Kids Wear/Gallery 12.webp" alt="Gallery" className="order-10 md:order-none w-full h-full object-cover object-center rounded-2xl md:rounded-[24px] aspect-square" />
            <img src="/Custom Kids Wear/Gallery 4.webp" alt="Gallery" className="order-11 md:order-none w-full h-full object-cover object-center rounded-2xl md:rounded-[24px] aspect-square" />
            <img src="/Custom Kids Wear/Gallery 8.webp" alt="Gallery" className="order-12 md:order-none w-full h-full object-cover object-center rounded-2xl md:rounded-[24px] aspect-square" />
          </div>
        </div>
      </section>

      <section className="py-20 bg-[#f4f7fa]">
        <div className="max-w-[1100px] mx-auto px-6 grid lg:grid-cols-2 gap-10 items-center">
          <div className="reveal-up">
            <h2 className="text-4xl font-bold text-black mb-6 leading-tight">Let's click some special moment</h2>
            <img src="/Custom Kids Wear/Untitled design (5).webp" alt="Special Moment" className="w-full object-cover" />
          </div>

          <div className="reveal-up bg-white p-4 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-normal text-black mb-6 text-center">Fill In the Form To Get Started</h3>

            {formStatus && (
              <div className={`p-3 rounded-md mb-4 text-sm font-bold ${formStatus.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                {formStatus.message}
              </div>
            )}

            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4">
              <input type="hidden" name="sourcePage" value="Custom Kids Wear" />

              <div className="flex flex-col gap-1">
                <label className="text-[14px] text-gray-700">Full Name*</label>
                <input name="name" type="text" required className="w-full px-4 h-[45px] border border-gray-400 rounded-lg focus:border-black focus:outline-none transition-colors" />
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[14px] text-gray-700">Email Address*</label>
                <input name="email" type="email" required className="w-full px-4 h-[45px] border border-gray-400 rounded-lg focus:border-black focus:outline-none transition-colors" />
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[14px] text-gray-700">Phone Number*</label>
                <input name="phone" type="tel" required className="w-full px-4 h-[45px] border border-gray-400 rounded-lg focus:border-black focus:outline-none transition-colors" />
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[14px] text-gray-700">Outfit Type*</label>
                  <input name="outfitType" type="text" required className="w-full px-4 h-[45px] border border-gray-400 rounded-lg focus:border-black focus:outline-none transition-colors" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[14px] text-gray-700">Budget Range*</label>
                  <input name="budget" type="text" required className="w-full px-4 h-[45px] border border-gray-400 rounded-lg focus:border-black focus:outline-none transition-colors" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-[14px] text-gray-700">Select date for call back*</label>
                  <input name="date" type="date" required className="w-full px-4 h-[45px] border border-gray-400 rounded-lg focus:border-black focus:outline-none text-gray-700 transition-colors" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[14px] text-gray-700">Select time for call back*</label>
                  <input
                    name="time"
                    type="time"
                    required
                    min="12:00"
                    max="21:00"
                    onChange={handleTimeChange}
                    className="w-full px-4 h-[45px] border border-gray-400 rounded-lg focus:border-black focus:outline-none text-gray-700 transition-colors"
                  />
                  {timeError && <p className="text-red-500 text-xs mt-1">{timeError}</p>}
                </div>
              </div>
              
              <div className="flex flex-col gap-1">
                <label className="text-[14px] text-gray-700">Message</label>
                <textarea name="message" className="w-full p-4 h-[80px] border border-gray-400 rounded-lg focus:border-black focus:outline-none resize-none transition-colors"></textarea>
              </div>
              
              <button type="submit" disabled={isPending} className="bg-[#00c3ff] text-white text-sm sm:text-base font-bold px-8 py-3 rounded-full transition-all hover:bg-opacity-90 hover:shadow-md w-full cursor-pointer">
                {isPending ? 'SUBMITTING...' : 'SUBMIT NOW'}
              </button>
              <p className="text-[10px] text-center text-gray-500 mt-1">
                Your profile name will be shared. Never submit passwords.
              </p>
            </form>
          </div>
        </div>
      </section>

      <section className="py-20 bg-white faq-section-trigger">
        <div className="max-w-[1350px] mx-auto px-6">
          
          <div className="faq-animate opacity-0 translate-y-8 text-center mb-12">
            <h2 className="text-[#ff3838] font-bold uppercase tracking-wider text-sm sm:text-base mb-3 block">
              FAQS
            </h2>
            <h3 className="text-2xl sm:text-4xl lg:text-[42px] font-bold font-serif text-[#111] leading-tight">
              Frequently Asked Questions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4 lg:gap-y-6">
            {faqs.map((faq, index) => {
              const isOpen = openId === index;

              return (
                <div
                  key={index}
                  className="faq-animate opacity-0 translate-y-8 bg-[#eaf4fc] rounded-xl overflow-hidden h-fit transition-colors duration-300"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex justify-between items-center text-left p-6 focus:outline-none cursor-pointer"
                  >
                    <span className="text-[15px] lg:text-[17px] text-gray-800 font-semibold pr-4">
                      {faq.q}
                    </span>
                    
                    <ChevronDown
                      size={20}
                      strokeWidth={2.5}
                      className={`text-black flex-shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : "rotate-0"
                      }`}
                    />
                  </button>

                  <div
                    className={`grid transition-all duration-300 ease-in-out ${
                      isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="px-6 pb-6 text-sm lg:text-[16px] text-gray-600 leading-relaxed">
                        {faq.a}
                      </p>
                    </div>
                  </div>
                  
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}