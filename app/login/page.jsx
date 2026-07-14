"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, User } from "lucide-react";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#121433] via-[#3d4563] to-[#8d94a6] p-6 overflow-hidden">
      
      {/* Main Glass Container */}
      <div className="relative w-full max-w-[1000px] h-[750px] md:h-[600px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-hidden flex">
        
        {/* ================= REGISTER FORM ================= */}
        
        <div className={`absolute top-0 left-0 w-full md:w-1/2 h-full p-8 md:p-14 flex flex-col justify-center transition-all duration-700 ease-in-out z-20 ${
          isLogin 
            ? 'opacity-0 pointer-events-none -translate-x-full md:translate-x-0' 
            : 'opacity-100 pointer-events-auto translate-x-0 md:translate-x-[100%]'
        }`}>
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-[42px] font-bold text-[#0ba6ff] mb-2 tracking-tight drop-shadow-md">
              Create Account
            </h1>
            <p className="text-gray-200 text-[13px] drop-shadow-sm">Sign up with your details</p>
          </div>

          <form className="space-y-6">
            <div className="relative">
              <span className="absolute -top-3 left-4 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-[#0ba6ff] border border-white/10 shadow-sm z-10">Full Name</span>
              <div className="flex items-center border border-white/30 hover:border-[#0ba6ff]/70 focus-within:border-[#0ba6ff] rounded-xl px-4 py-3.5 bg-white/10 backdrop-blur-md transition-all">
                <User className="text-white/80 mr-3 shrink-0" size={18} />
                <input type="text" placeholder="John Doe" className="w-full bg-transparent outline-none text-[14px] text-white font-medium placeholder:text-white/40" />
              </div>
            </div>

            <div className="relative">
              <span className="absolute -top-3 left-4 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-[#0ba6ff] border border-white/10 shadow-sm z-10">Email Id</span>
              <div className="flex items-center border border-white/30 hover:border-[#0ba6ff]/70 focus-within:border-[#0ba6ff] rounded-xl px-4 py-3.5 bg-white/10 backdrop-blur-md transition-all">
                <Mail className="text-white/80 mr-3 shrink-0" size={18} />
                <input type="email" placeholder="thisisux@mail.com" className="w-full bg-transparent outline-none text-[14px] text-white font-medium placeholder:text-white/40" />
              </div>
            </div>

            <div className="relative">
              <span className="absolute -top-3 left-4 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-[#0ba6ff] border border-white/10 shadow-sm z-10">Password</span>
              <div className="flex items-center border border-white/30 hover:border-[#0ba6ff]/70 focus-within:border-[#0ba6ff] rounded-xl px-4 py-3.5 bg-white/10 backdrop-blur-md transition-all">
                <Lock className="text-white/80 mr-3 shrink-0" size={18} />
                <input type="password" placeholder="••••••••••••••" className="w-full bg-transparent outline-none text-[14px] text-white font-medium tracking-widest placeholder:text-white/40" />
              </div>
            </div>

            <div className="flex justify-center pt-4">
              <button type="button" className="bg-[#0ba6ff] hover:bg-[#0092e6] text-white font-bold text-[13px] py-3.5 px-14 rounded-md transition-all shadow-[0_0_15px_rgba(11,166,255,0.4)] hover:shadow-[0_0_25px_rgba(11,166,255,0.6)] uppercase tracking-wide">
                REGISTER
              </button>
            </div>
          </form>

          {/* Mobile Only Toggle */}
          <div className="mt-8 text-center text-[13px] md:hidden">
            <span className="text-gray-300 font-medium drop-shadow-sm">Already have an account? </span>
            <button onClick={() => setIsLogin(true)} className="font-extrabold text-white hover:text-[#0ba6ff] transition-colors drop-shadow-md ml-1">
              Login Now
            </button>
          </div>
        </div>

       
        <div className={`absolute top-0 left-0 w-full md:w-1/2 h-full p-8 md:p-14 flex flex-col justify-center transition-all duration-700 ease-in-out z-20 ${
          isLogin 
            ? 'opacity-100 pointer-events-auto translate-x-0' 
            : 'opacity-0 pointer-events-none translate-x-[100%]'
        }`}>
          <div className="text-center mb-10">
            <h1 className="text-3xl md:text-[42px] font-bold text-[#0ba6ff] mb-2 tracking-tight drop-shadow-md">
              Welcome Back
            </h1>
            <p className="text-gray-200 text-[13px] drop-shadow-sm">Login with Email</p>
          </div>

          <form className="space-y-6">
            <div className="relative">
              <span className="absolute -top-3 left-4 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-[#0ba6ff] border border-white/10 shadow-sm z-10">Email Id</span>
              <div className="flex items-center border border-white/30 hover:border-[#0ba6ff]/70 focus-within:border-[#0ba6ff] rounded-xl px-4 py-3.5 bg-white/10 backdrop-blur-md transition-all">
                <Mail className="text-white/80 mr-3 shrink-0" size={18} />
                <input type="email" placeholder="thisisux@mail.com" className="w-full bg-transparent outline-none text-[14px] text-white font-medium placeholder:text-white/40" />
              </div>
            </div>

            <div className="relative mt-8">
              <span className="absolute -top-3 left-4 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-[#0ba6ff] border border-white/10 shadow-sm z-10">Password</span>
              <div className="flex items-center border border-white/30 hover:border-[#0ba6ff]/70 focus-within:border-[#0ba6ff] rounded-xl px-4 py-3.5 bg-white/10 backdrop-blur-md transition-all">
                <Lock className="text-white/80 mr-3 shrink-0" size={18} />
                <input type="password" placeholder="••••••••••••••" className="w-full bg-transparent outline-none text-[14px] text-white font-medium tracking-widest placeholder:text-white/40" />
              </div>
            </div>

            <div className="text-right mt-2">
              <Link href="/forgot-password" className="text-[12px] font-medium text-gray-300 hover:text-[#0ba6ff] transition-colors drop-shadow-sm">
                Forgot your password?
              </Link>
            </div>

            <div className="flex justify-center pt-4">
              <button type="button" className="bg-[#0ba6ff] hover:bg-[#0092e6] text-white font-bold text-[13px] py-3.5 px-14 rounded-md transition-all shadow-[0_0_15px_rgba(11,166,255,0.4)] hover:shadow-[0_0_25px_rgba(11,166,255,0.6)] uppercase tracking-wide">
                LOGIN
              </button>
            </div>
          </form>

          {/* Mobile Only Toggle */}
          <div className="mt-8 text-center text-[13px] md:hidden">
            <span className="text-gray-300 font-medium drop-shadow-sm">Don't have an account? </span>
            <button onClick={() => setIsLogin(false)} className="font-extrabold text-white hover:text-[#0ba6ff] transition-colors drop-shadow-md ml-1">
              Register Now
            </button>
          </div>
        </div>

        {/* ================= SIMULTANEOUS SLIDING IMAGE OVERLAY (Desktop Only) ================= */}
                <div className={`hidden md:flex absolute top-0 left-0 w-1/2 h-full z-50 transition-transform duration-700 ease-in-out ${
          isLogin ? 'translate-x-[100%]' : 'translate-x-0'
        }`}>
          <div className="relative w-full h-full overflow-hidden shadow-2xl">
            <Image 
              src="/images/man1.png" 
              alt="Auth Image" 
              fill 
              className="object-cover" 
              priority
            />
            <div className="absolute inset-0 bg-[#0e163d]/40 backdrop-blur-[2px]"></div>
            
            {/* Text for Register CTA (Visible when Login form is open) */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center text-center p-10 text-white transition-opacity duration-500 ${isLogin ? 'opacity-100 delay-300' : 'opacity-0 pointer-events-none'}`}>
              <h2 className="text-4xl font-bold mb-4 drop-shadow-lg font-serif">Hello, Friend!</h2>
              <p className="text-[15px] text-gray-200 mb-10 drop-shadow-md max-w-[280px]">Enter your personal details and start your fashion journey with us.</p>
              <button 
                onClick={() => setIsLogin(false)} 
                className="border-[2.5px] border-white rounded-full px-12 py-3.5 font-bold text-[14px] hover:bg-white hover:text-[#121433] transition-all uppercase tracking-wider shadow-lg"
              >
                Sign Up
              </button>
            </div>

            {/* Text for Login CTA (Visible when Register form is open) */}
            <div className={`absolute inset-0 flex flex-col items-center justify-center text-center p-10 text-white transition-opacity duration-500 ${!isLogin ? 'opacity-100 delay-300' : 'opacity-0 pointer-events-none'}`}>
              <h2 className="text-4xl font-bold mb-4 drop-shadow-lg font-serif">Welcome Back!</h2>
              <p className="text-[15px] text-gray-200 mb-10 drop-shadow-md max-w-[280px]">To keep connected with us please login with your personal info.</p>
              <button 
                onClick={() => setIsLogin(true)} 
                className="border-[2.5px] border-white rounded-full px-12 py-3.5 font-bold text-[14px] hover:bg-white hover:text-[#121433] transition-all uppercase tracking-wider shadow-lg"
              >
                Sign In
              </button>
            </div>

          </div>
        </div>

      </div>
    </main>
  );
}