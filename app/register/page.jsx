import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, User } from "lucide-react";

export const metadata = {
  title: "Register | SRIJAN Fashion",
  description: "Create a new account",
};

export default function RegisterPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#121433] via-[#3d4563] to-[#8d94a6] p-6">
      <div className="flex w-full max-w-[1000px] bg-white rounded-[32px] shadow-2xl overflow-hidden min-h-[600px]">
        
        <div className="hidden md:block w-1/2 relative bg-gray-200">
          <Image 
            src="/images/man1.png" 
            alt="Register Fashion" 
            fill 
            className="object-cover" 
          />
        </div>

        <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center relative">
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-[42px] font-bold text-[#0ba6ff] mb-2 tracking-tight">
              Create Account
            </h1>
            <p className="text-gray-400 text-[13px]">
              Sign up with Email
            </p>
          </div>

          <form className="space-y-6">
            <div className="relative">
              <span className="absolute -top-2.5 left-5 bg-white px-1.5 text-[11px] font-bold text-[#0ba6ff]">
                Full Name
              </span>
              <div className="flex items-center border border-[#0ba6ff] rounded-xl px-4 py-3.5 bg-white">
                <User className="text-gray-600 mr-3 shrink-0" size={18} />
                <input 
                  type="text" 
                  placeholder="John Doe" 
                  className="w-full outline-none text-[14px] text-black font-medium placeholder:text-gray-800"
                />
              </div>
            </div>

            <div className="relative">
              <span className="absolute -top-2.5 left-5 bg-white px-1.5 text-[11px] font-bold text-[#0ba6ff]">
                Email Id
              </span>
              <div className="flex items-center border border-[#0ba6ff] rounded-xl px-4 py-3.5 bg-white">
                <Mail className="text-gray-600 mr-3 shrink-0" size={18} />
                <input 
                  type="email" 
                  placeholder="thisisux@mail.com" 
                  className="w-full outline-none text-[14px] text-black font-medium placeholder:text-gray-800"
                />
              </div>
            </div>

            <div className="relative">
              <span className="absolute -top-2.5 left-5 bg-white px-1.5 text-[11px] font-bold text-[#0ba6ff]">
                Password
              </span>
              <div className="flex items-center border border-[#0ba6ff] rounded-xl px-4 py-3.5 bg-white">
                <Lock className="text-gray-600 mr-3 shrink-0" size={18} />
                <input 
                  type="password" 
                  placeholder="••••••••••••••" 
                  className="w-full outline-none text-[14px] text-black font-medium tracking-widest placeholder:text-gray-800"
                />
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <button 
                type="button" 
                className="bg-[#0ba6ff] hover:bg-[#0092e6] text-white font-bold text-[13px] py-3.5 px-14 rounded-md transition-colors shadow-lg shadow-[#0ba6ff]/30 uppercase tracking-wide"
              >
                REGISTER
              </button>
            </div>
          </form>

          <div className="mt-12 text-center text-[13px]">
            <span className="text-gray-500 font-medium">Already have an account? </span>
            <Link href="/login" className="font-extrabold text-gray-900 hover:text-[#0ba6ff] transition-colors">
              Login Now
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}