"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Lock, User } from "lucide-react";
// 1. Import signIn from next-auth
import { signIn } from "next-auth/react"; 

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    const checkEmail = loginEmail.trim();
    const checkPassword = loginPassword.trim();

    // 1. Admin Bypass
    if (checkEmail === "admin01" && checkPassword === "admin1234") {
      document.cookie = "auth_token=admin_token; path=/; max-age=86400";
      router.push("/admin");
      router.refresh();
      return;
    }

    // 2. Customer Bypass
    if (checkEmail === "user01" && checkPassword === "user1234") {
      document.cookie = "auth_token=customer_token; path=/; max-age=86400";
      router.push("/account");
      router.refresh();
      return;
    }

    console.log("Normal login attempt:", checkEmail);
  };

  // SVG Icon for Google to keep things fast and independent of image files
  const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
    </svg>
  );

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#121433] via-[#3d4563] to-[#8d94a6] p-6 overflow-hidden">
      
      {/* Main Glass Container */}
      <div className="relative w-full max-w-[1000px] h-[850px] md:h-[650px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-hidden flex">
        
        {/* ================= REGISTER FORM ================= */}
        
        <div className={`absolute top-0 left-0 w-full md:w-1/2 h-full p-8 md:p-14 flex flex-col justify-center transition-all duration-700 ease-in-out z-20 ${
          isLogin 
            ? 'opacity-0 pointer-events-none -translate-x-full md:translate-x-0' 
            : 'opacity-100 pointer-events-auto translate-x-0 md:translate-x-[100%]'
        }`}>
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-[42px] font-bold text-[#0ba6ff] mb-2 tracking-tight drop-shadow-md">
              Create Account
            </h1>
            <p className="text-gray-200 text-[13px] drop-shadow-sm">Sign up with your details</p>
          </div>

          <form className="space-y-5">
            <div className="relative">
              <span className="absolute -top-3 left-4 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-[#0ba6ff] border border-white/10 shadow-sm z-10">Full Name</span>
              <div className="flex items-center border border-white/30 hover:border-[#0ba6ff]/70 focus-within:border-[#0ba6ff] rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md transition-all">
                <User className="text-white/80 mr-3 shrink-0" size={18} />
                <input type="text" placeholder="John Doe" className="w-full bg-transparent outline-none text-[14px] text-white font-medium placeholder:text-white/40" />
              </div>
            </div>

            <div className="relative">
              <span className="absolute -top-3 left-4 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-[#0ba6ff] border border-white/10 shadow-sm z-10">Email Id</span>
              <div className="flex items-center border border-white/30 hover:border-[#0ba6ff]/70 focus-within:border-[#0ba6ff] rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md transition-all">
                <Mail className="text-white/80 mr-3 shrink-0" size={18} />
                <input type="email" placeholder="thisisux@mail.com" className="w-full bg-transparent outline-none text-[14px] text-white font-medium placeholder:text-white/40" />
              </div>
            </div>

            <div className="relative">
              <span className="absolute -top-3 left-4 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-[#0ba6ff] border border-white/10 shadow-sm z-10">Password</span>
              <div className="flex items-center border border-white/30 hover:border-[#0ba6ff]/70 focus-within:border-[#0ba6ff] rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md transition-all">
                <Lock className="text-white/80 mr-3 shrink-0" size={18} />
                <input type="password" placeholder="••••••••••••••" className="w-full bg-transparent outline-none text-[14px] text-white font-medium tracking-widest placeholder:text-white/40" />
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-2">
              <button type="button" className="w-full bg-[#0ba6ff] hover:bg-[#0092e6] text-white font-bold text-[13px] py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(11,166,255,0.4)] hover:shadow-[0_0_25px_rgba(11,166,255,0.6)] uppercase tracking-wide">
                REGISTER
              </button>
              
              {/* Divider */}
              <div className="flex items-center my-1">
                <div className="flex-grow border-t border-white/20"></div>
                <span className="mx-4 text-xs font-medium text-white/50">OR</span>
                <div className="flex-grow border-t border-white/20"></div>
              </div>

              {/* Google Button */}
              <button 
                type="button" 
                onClick={() => signIn('google')}
                className="w-full flex items-center justify-center gap-3 bg-white/10 border border-white/30 hover:bg-white hover:text-black text-white font-bold text-[13px] py-3 rounded-xl transition-all uppercase tracking-wide group"
              >
                <GoogleIcon />
                Sign up with Google
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

       
        {/* ================= LOGIN FORM ================= */}
        <div className={`absolute top-0 left-0 w-full md:w-1/2 h-full p-8 md:p-14 flex flex-col justify-center transition-all duration-700 ease-in-out z-20 ${
          isLogin 
            ? 'opacity-100 pointer-events-auto translate-x-0' 
            : 'opacity-0 pointer-events-none translate-x-[100%]'
        }`}>
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-[42px] font-bold text-[#0ba6ff] mb-2 tracking-tight drop-shadow-md">
              Welcome Back
            </h1>
            <p className="text-gray-200 text-[13px] drop-shadow-sm">Login with Email or Google</p>
          </div>

          <form className="space-y-5" onSubmit={handleLogin}>
            <div className="relative">
              <span className="absolute -top-3 left-4 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-[#0ba6ff] border border-white/10 shadow-sm z-10">Email / Username</span>
              <div className="flex items-center border border-white/30 hover:border-[#0ba6ff]/70 focus-within:border-[#0ba6ff] rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md transition-all">
                <Mail className="text-white/80 mr-3 shrink-0" size={18} />
                <input 
                  type="text" 
                  placeholder="admin01 or email@mail.com" 
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  className="w-full bg-transparent outline-none text-[14px] text-white font-medium placeholder:text-white/40" 
                />
              </div>
            </div>

            <div className="relative mt-6">
              <span className="absolute -top-3 left-4 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-[#0ba6ff] border border-white/10 shadow-sm z-10">Password</span>
              <div className="flex items-center border border-white/30 hover:border-[#0ba6ff]/70 focus-within:border-[#0ba6ff] rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md transition-all">
                <Lock className="text-white/80 mr-3 shrink-0" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••••••••" 
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="w-full bg-transparent outline-none text-[14px] text-white font-medium tracking-widest placeholder:text-white/40" 
                />
              </div>
            </div>

            <div className="text-right mt-2">
              <Link href="/forgot-password" className="text-[12px] font-medium text-gray-300 hover:text-[#0ba6ff] transition-colors drop-shadow-sm">
                Forgot your password?
              </Link>
            </div>

            <div className="flex flex-col gap-4 pt-2">
              <button type="submit" className="w-full bg-[#0ba6ff] hover:bg-[#0092e6] text-white font-bold text-[13px] py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(11,166,255,0.4)] hover:shadow-[0_0_25px_rgba(11,166,255,0.6)] uppercase tracking-wide">
                LOGIN
              </button>

              {/* Divider */}
              <div className="flex items-center my-1">
                <div className="flex-grow border-t border-white/20"></div>
                <span className="mx-4 text-xs font-medium text-white/50">OR</span>
                <div className="flex-grow border-t border-white/20"></div>
              </div>

              {/* Google Button */}
              <button 
                type="button" 
                onClick={() => signIn('google', { callbackUrl: '/account' })}
                className="w-full flex items-center justify-center gap-3 bg-white/10 border border-white/30 hover:bg-white hover:text-black text-white font-bold text-[13px] py-3 rounded-xl transition-all uppercase tracking-wide group"
              >
                <GoogleIcon />
                Sign in with Google
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