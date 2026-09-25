"use client";

import { useRef, useState, useTransition } from "react";
import { MapPin, Phone, Mail, Loader2, CheckCircle2 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { submitCustomRequest } from "@/app/actions/forms"; // Updated Action

gsap.registerPlugin(ScrollTrigger);

export default function ContactDetails() {
    const containerRef = useRef(null);
    const [isPending, startTransition] = useTransition();
    const [status, setStatus] = useState({ type: '', message: '' });

    useGSAP(() => {
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 75%",
                toggleActions: "play none none reverse",
            }
        });

        tl.fromTo(
            ".contact-anim",
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: "power3.out" }
        ).fromTo(
            ".contact-form-card",
            { x: 40, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.8, ease: "power4.out" },
            "-=0.6"
        );
    }, { scope: containerRef });

    const handleSubmit = (e) => {
        e.preventDefault();
        setStatus({ type: '', message: '' });
        
        const formData = new FormData(e.target);
        formData.append("sourcePage", "Contact Us");
        formData.append("outfitType", "General Inquiry"); 
        formData.append("budget", "N/A"); 
        
        const msg = formData.get("message");
        if (msg) formData.append("details", msg);

        startTransition(async () => {
            try {
                await submitCustomRequest(formData);
                setStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully.' });
                e.target.reset();
                setTimeout(() => setStatus({ type: '', message: '' }), 5000);
            } catch (error) {
                setStatus({ type: 'error', message: 'Failed to send message. Please try again.' });
            }
        });
    };

    return (
        <section className="py-20 bg-[#f8f9fa]" ref={containerRef}>
            <div className="max-w-[1320px] mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 text-black items-start">

                <div>
                    <h2 className="contact-anim text-2xl md:text-[28px] font-bold text-black mb-8">Store Location</h2>

                    <div className="space-y-6 mb-10">
                        <div className="contact-anim flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#00c3ff] flex items-center justify-center shrink-0 text-white">
                                <MapPin size={24} />
                            </div>
                            <div className="pt-1">
                                <p className="text-gray-700 text-[15px] leading-relaxed">
                                    Chhobi Apartment, Sani Mandir, Panchasayar Main<br />
                                    Road, Panchasayar, Kolkata-700094, West Bengal
                                </p>
                            </div>
                        </div>

                        <div className="contact-anim flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#00c3ff] flex items-center justify-center shrink-0 text-white">
                                <Phone size={24} />
                            </div>
                            <div className="pt-1">
                                <h4 className="font-bold text-black text-[15px] leading-tight mb-1">Call Us</h4>
                                <p className="text-gray-700 text-[15px] leading-tight">+91 6290686399 / +91 7980306992</p>
                            </div>
                        </div>

                        <div className="contact-anim flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#00c3ff] flex items-center justify-center shrink-0 text-white">
                                <Mail size={24} />
                            </div>
                            <div className="pt-1">
                                <h4 className="font-bold text-black text-[15px] leading-tight mb-1">Email Us</h4>
                                <p className="text-gray-700 text-[15px] leading-tight">contact@srijandesignerstudio.com</p>
                            </div>
                        </div>
                    </div>

                    <div className="contact-anim relative w-full aspect-[4/3] sm:aspect-video lg:aspect-[4/3] rounded-[20px] overflow-hidden border-[8px] border-[#00c3ff] shadow-lg">
                        <iframe 
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3686.933147316061!2d88.4024644!3d22.4691464!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a0273d54c6ea3a7%3A0x8a5bebfa270fffe9!2sSRIJAN%20Fashion!5e0!3m2!1sen!2sin!4v1787655000856!5m2!1sen!2sin" 
                            className="absolute top-0 left-0 w-full h-full"
                            style={{ border: 0 }} 
                            allowFullScreen 
                            loading="lazy" 
                            referrerPolicy="strict-origin-when-cross-origin"
                        ></iframe>
                    </div>
                </div>

                <div className="contact-form-card bg-white rounded-[24px] p-8 md:p-10 shadow-2xl shadow-gray-200/60 lg:mt-0 mt-8">
                    <h2 className="text-[32px] font-medium text-black mb-8 leading-tight">
                        Drop Your Message<br />Here
                    </h2>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-[14px] text-gray-700 mb-1.5">Full Name*</label>
                            <input name="name" required type="text" className="w-full border border-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#00c3ff] transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[14px] text-gray-700 mb-1.5">Phone Number*</label>
                            <input name="phone" required type="tel" className="w-full border border-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#00c3ff] transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[14px] text-gray-700 mb-1.5">Email Address*</label>
                            <input name="email" required type="email" className="w-full border border-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#00c3ff] transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[14px] text-gray-700 mb-1.5">Your Message*</label>
                            <textarea name="message" required rows="4" className="w-full border border-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#00c3ff] transition-colors resize-none"></textarea>
                        </div>

                        {status.type && (
                            <div className={`flex items-center gap-2 p-3 mt-1 rounded-lg border ${status.type === 'success' ? 'bg-[#f0fdf4] border-[#bbf7d0] text-[#166534]' : 'bg-red-50 border-red-200 text-red-700'}`}>
                                {status.type === 'success' && <CheckCircle2 className="w-5 h-5 text-[#16a34a] shrink-0" />}
                                <p className="font-semibold text-[14px]">{status.message}</p>
                            </div>
                        )}

                        <button disabled={isPending} type="submit" className="w-full flex justify-center items-center gap-2 bg-[#00c3ff] hover:bg-[#00abe0] text-white font-medium text-[17px] py-3 rounded-full transition-colors mt-2 shadow-md shadow-[#00c3ff]/30 disabled:opacity-70 cursor-pointer">
                            {isPending && <Loader2 size={20} className="animate-spin" />}
                            {isPending ? "Sending..." : "Submit"}
                        </button>
                        <p className="text-[11px] text-center text-gray-400 mt-2">Your profile name will be shared. Never submit passwords.</p>
                    </form>
                </div>

            </div>
        </section>
    );
}