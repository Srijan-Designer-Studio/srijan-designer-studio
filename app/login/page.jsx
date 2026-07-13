import Image from "next/image";
import Link from "next/link";
import { Mail, Lock } from "lucide-react";

export const metadata = {
  title: "Login | SRIJAN Fashion",
  description: "Login to your account",
};

export default function LoginPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#121433] via-[#3d4563] to-[#8d94a6] p-6">
      <div className="flex w-full max-w-[1000px] bg-white rounded-[32px] shadow-2xl overflow-hidden min-h-[600px]">
        
        <div className="hidden md:block w-1/2 relative bg-gray-200">
          <Image 
            src="/images/man1.png" 
            alt="Login Fashion" 
            fill 
            className="object-cover" 
          />
        </div>

        <div className="w-full md:w-1/2 p-10 md:p-16 flex flex-col justify-center relative">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-[42px] font-bold text-[#0ba6ff] mb-2 tracking-tight">
              Welcome
            </h1>
            <p className="text-gray-400 text-[13px]">
              Login with Email
            </p>
          </div>

          <form className="space-y-6">
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

            <div className="text-right mt-2">
              <Link href="/forgot-password" className="text-[12px] font-medium text-gray-400 hover:text-[#0ba6ff] transition-colors">
                Forgot your password?
              </Link>
            </div>

            <div className="flex justify-center pt-4">
              <button 
                type="button" 
                className="bg-[#0ba6ff] hover:bg-[#0092e6] text-white font-bold text-[13px] py-3.5 px-14 rounded-md transition-colors shadow-lg shadow-[#0ba6ff]/30 uppercase tracking-wide"
              >
                LOGIN
              </button>
            </div>
          </form>

          <div className="mt-16 text-center text-[13px]">
            <span className="text-gray-500 font-medium">Don't have account? </span>
            <Link href="/register" className="font-extrabold text-gray-900 hover:text-[#0ba6ff] transition-colors">
              Register Now
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}