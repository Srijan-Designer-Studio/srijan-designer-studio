"use client";

import { useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const menuLinks = [
  { name: "Home", href: "/" },
  { name: "About Us", href: "/about-us" },
  { name: "Products", href: "/shop-style" },
  { name: "Customize", href: "/create-designer-dress" },
  { name: "Blog", href: "/blog" },
  { name: "Contact Us", href: "/contact-us" },
];

const policyLinks = [
  { name: "Terms & Conditions", href: "/terms" },
  { name: "Privacy Policy", href: "/privacy" },
  { name: "Return Policy", href: "/return" },
  { name: "Refund & Cancellation Policy", href: "/refund" },
  { name: "Customization Policy", href: "/customization-policy" },
  { name: "Shipping Policy", href: "/shipping" },
];

const FacebookIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-[#00c3ff] transition-colors cursor-pointer">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const InstagramIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-[#00c3ff] transition-colors cursor-pointer">
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const YoutubeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-[#00c3ff] transition-colors cursor-pointer">
    <path d="M2.5 7.1C2.5 5.4 3.9 4 5.6 4h12.8c1.7 0 3.1 1.4 3.1 3.1v9.8c0 1.7-1.4 3.1-3.1 3.1H5.6C3.9 20 2.5 18.6 2.5 16.9V7.1z" />
    <path d="m10 15 5-3-5-3v6z" />
  </svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="hover:text-[#00c3ff] transition-colors cursor-pointer" viewBox="0 0 16 16">
    <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75Zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633Z" />
  </svg>
);

const PinterestIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor" className="hover:text-[#00c3ff] transition-colors cursor-pointer">
    <path d="M12.017 0C5.396 0 .029 5.367.029 11.987c0 5.079 3.158 9.417 7.618 11.162-.105-.949-.199-2.403.041-3.439.219-.937 1.406-5.957 1.406-5.957s-.359-.72-.359-1.781c0-1.663.967-2.911 2.168-2.911 1.024 0 1.518.769 1.518 1.688 0 1.029-.653 2.567-.992 3.992-.285 1.193.6 2.165 1.775 2.165 2.128 0 3.768-2.245 3.768-5.487 0-2.861-2.063-4.869-5.008-4.869-3.41 0-5.409 2.562-5.409 5.199 0 1.033.394 2.143.889 2.741.099.12.112.225.085.345-.09.375-.293 1.199-.334 1.363-.053.225-.172.271-.401.165-1.495-.69-2.433-2.878-2.433-4.646 0-3.776 2.748-7.252 7.951-7.252 4.168 0 7.41 2.967 7.41 6.923 0 4.135-2.607 7.462-6.233 7.462-1.214 0-2.354-.629-2.758-1.379l-.749 2.848c-.269 1.045-1.004 2.352-1.498 3.146 1.123.345 2.306.535 3.55.535 6.607 0 11.985-5.365 11.985-11.987C23.97 5.366 18.602 0 12.017 0z" />
  </svg>
);

const CustomQIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="hover:text-[#00c3ff] transition-colors cursor-pointer" viewBox="0 0 24 24">
    <circle cx="11" cy="11" r="8"></circle>
    <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
  </svg>
);

export default function Footer() {
  const footerRef = useRef(null);

  useEffect(() => {
    // Aggressive GSAP Refresh: পেজ লোড হওয়ার পর বিভিন্ন সময়ে হাইট চেক করে ফিক্স করবে
    const t1 = setTimeout(() => ScrollTrigger.refresh(), 500);
    const t2 = setTimeout(() => ScrollTrigger.refresh(), 1500);
    const t3 = setTimeout(() => ScrollTrigger.refresh(), 3000);

    // ResizeObserver: পেজের হাইট যখনই চেঞ্জ হবে, সাথে সাথে GSAP আপডেট হবে
    const resizeObserver = new ResizeObserver(() => {
      ScrollTrigger.refresh();
    });
    resizeObserver.observe(document.body);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      resizeObserver.disconnect();
    };
  }, []);

  useGSAP(() => {
    gsap.fromTo(
      ".footer-col",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          once: true,
        },
      }
    );

    gsap.fromTo(
      ".footer-map-card",
      { y: 30, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.6,
        ease: "power2.out",
        clearProps: "all",
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 90%",
          once: true,
        },
      }
    );

    gsap.fromTo(
      ".footer-copyright",
      { opacity: 0 },
      {
        opacity: 1,
        duration: 0.5,
        scrollTrigger: {
          trigger: footerRef.current,
          start: "top 95%",
          once: true,
        },
      }
    );
  }, { scope: footerRef });

  return (
    <footer className="bg-[#04051a] pt-16 pb-8" ref={footerRef}>
      <div className="max-w-[1320px] mx-auto px-6">

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8">

          <div className="flex flex-col justify-between h-full w-full">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 sm:gap-6 mb-12">
              <div className="footer-col">
                <h3 className="text-[#ff3838] font-bold uppercase text-[17px] tracking-wide mb-6">
                  MAIN MENU
                </h3>
                <ul className="space-y-4">
                  {menuLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-white text-[15px] hover:text-[#00c3ff] transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="footer-col">
                <h3 className="text-[#ff3838] font-bold uppercase text-[17px] tracking-wide mb-6">
                  POLICY
                </h3>
                <ul className="space-y-4">
                  {policyLinks.map((link, index) => (
                    <li key={index}>
                      <Link
                        href={link.href}
                        className="text-white text-[15px] hover:text-[#00c3ff] transition-colors"
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="footer-col mb-[95px] lg:mb-">
              <h3 className="text-[#ff3838] font-bold uppercase text-[17px] tracking-wide mb-6">
                CONNECT WITH US
              </h3>

              <div className="space-y-3 mb-6">
                <a href="tel:+916290686399" className="flex items-center gap-3 text-white hover:text-[#00c3ff] transition-colors">
                  <Phone size={20} strokeWidth={2} />
                  <span className="text-[15px] font-medium">+ 91 6290686399</span>
                </a>

                <a href="mailto:contact@srijandesignerstudio.com" className="flex items-center gap-3 text-white hover:text-[#00c3ff] transition-colors">
                  <Mail size={20} strokeWidth={2} />
                  <span className="text-[15px] font-medium">contact@srijandesignerstudio.com</span>
                </a>
              </div>

              <div className="flex items-center gap-5 text-white">
                <Link href="https://www.facebook.com/srijanfashion2022" target="_blank" rel="noopener noreferrer">
                  <FacebookIcon />
                </Link>
                <Link href="https://www.instagram.com/srijanfashion2022" target="_blank" rel="noopener noreferrer">
                  <InstagramIcon />
                </Link>
                <Link href="https://x.com/SrijanFashion" target="_blank" rel="noopener noreferrer">
                  <XIcon />
                </Link>
                <Link href="https://www.youtube.com/@srijanfashion" target="_blank" rel="noopener noreferrer">
                  <YoutubeIcon />
                </Link>
                <Link href="https://in.pinterest.com/srijanfashion" target="_blank" rel="noopener noreferrer">
                  <PinterestIcon />
                </Link>
                <Link href="https://www.quora.com/profile/Srijan-Fashion" target="_blank" rel="noopener noreferrer">
                  <Image
                    src="/others-img/Quora Logo.webp"
                    alt="Quora"
                    width={22}
                    height={22}
                  />
                </Link>
              </div>
            </div>


          </div>

          <div className="flex items-center justify-center lg:justify-end h-full w-full">
            <div className="footer-map-card w-full max-w-[550px]">
              <div className="bg-[#0a4d9c] rounded-2xl p-6 sm:p-8 shadow-2xl h-full flex flex-col">
                <h3 className="text-white font-bold text-2xl mb-6">Location</h3>

                <div className="flex items-start gap-3 text-white mb-6">
                  <MapPin size={24} className="shrink-0 mt-1" />
                  <p className="text-[15px] leading-relaxed">
                    Chhobi Apartment, Sani Mandir, Panchasayar Main Road,
                    Panchasayar, Kolkata-700094, West Bengal
                  </p>
                </div>

                <div className="w-full h-[350px] lg:h-[420px] rounded-xl overflow-hidden bg-white shadow-inner relative mt-auto">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1887709.7714258232!2d86.09533549375!3d22.4691464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0273d54c6ea3a7%3A0x8a5bebfa270fffe9!2sSrijan%20Fashion!5e0!3m2!1sen!2sin!4v1786361637593!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="strict-origin-when-cross-origin"
                  ></iframe>
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="footer-copyright mt-6 lg:mb-[120px] lg:-mt-4">
          <p className="text-white/80 text-sm sm:text-[15px] font-medium">
            © Copyright 2026 By SRIJAN Fashion. All right reserved.
          </p>
        </div>

      </div>
    </footer>
  );
}