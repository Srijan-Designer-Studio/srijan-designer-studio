import Image from "next/image";
import { MapPin, Phone, Mail } from "lucide-react";

export default function ContactDetails() {
    return (
        <section className="py-20 bg-[#f8f9fa]">
            <div className="max-w-[1320px] mx-auto px-6 grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">

                <div>
                    <h2 className="text-2xl md:text-[28px] font-bold text-black mb-8">Store Location</h2>

                    <div className="space-y-6 mb-10">
                        <div className="flex items-start gap-4">
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

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#00c3ff] flex items-center justify-center shrink-0 text-white">
                                <Phone size={24} />
                            </div>
                            <div className="pt-1">
                                <h4 className="font-bold text-black text-[15px] leading-tight mb-1">Call Us</h4>
                                <p className="text-gray-700 text-[15px] leading-tight">+91 6290686399</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-full bg-[#00c3ff] flex items-center justify-center shrink-0 text-white">
                                <Mail size={24} />
                            </div>
                            <div className="pt-1">
                                <h4 className="font-bold text-black text-[15px] leading-tight mb-1">Email Us</h4>
                                <p className="text-gray-700 text-[15px] leading-tight">contact@srijandesignerstudio.com</p>
                            </div>
                        </div>
                    </div>

                    <div className="relative w-full aspect-[4/3] rounded-[20px] overflow-hidden border-[8px] border-[#00c3ff] shadow-lg">
                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3686.0820464871465!2d88.3976!3d22.4831!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMjLCsDI4JzU5LjIiTiA4OMKwMjMnNTEuNCJF!5e0!3m2!1sen!2sin!4v1698765432100!5m2!1sen!2sin"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen=""
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            title="Srijan Fashion Location"
                        >

                        </iframe>
                    </div>
                </div>

                <div className="bg-white rounded-[24px] p-8 md:p-10 shadow-2xl shadow-gray-200/60 lg:mt-0 mt-8">
                    <h2 className="text-[32px] font-medium text-black mb-8 leading-tight">
                        Drop Your Message<br />Here
                    </h2>

                    <form className="space-y-5">
                        <div>
                            <label className="block text-[14px] text-gray-700 mb-1.5">Full Name*</label>
                            <input type="text" className="w-full border border-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#00c3ff] transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[14px] text-gray-700 mb-1.5">Phone Number*</label>
                            <input type="tel" className="w-full border border-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#00c3ff] transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[14px] text-gray-700 mb-1.5">Email Address*</label>
                            <input type="email" className="w-full border border-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#00c3ff] transition-colors" />
                        </div>
                        <div>
                            <label className="block text-[14px] text-gray-700 mb-1.5">Your Message*</label>
                            <textarea rows="4" className="w-full border border-gray-400 rounded-lg px-4 py-2.5 focus:outline-none focus:border-[#00c3ff] transition-colors resize-none"></textarea>
                        </div>
                        <button type="button" className="w-full bg-[#00c3ff] hover:bg-[#00abe0] text-white font-medium text-[17px] py-3 rounded-full transition-colors mt-6 shadow-md shadow-[#00c3ff]/30">
                            Submit
                        </button>
                        <p className="text-[11px] text-center text-gray-400 mt-4">Your profile name will be shared. Never submit passwords.</p>
                    </form>
                </div>

            </div>
        </section>
    );
}