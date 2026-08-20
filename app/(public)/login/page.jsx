"use client";

export const dynamic = 'force-dynamic';
import { useState, useTransition } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Lock, User, Loader2, Eye, EyeOff, CheckCircle2, AlertCircle, ArrowLeft } from "lucide-react";
import { signIn } from "next-auth/react";
import { createClient } from "@/lib/supabase/client";
import ScrollToTop from "@/components/providers/ScrollToTop";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegisterPassword, setShowRegisterPassword] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: "", type: "success" });

  const showPopupMessage = (message, type = "success") => {
    setPopup({ show: true, message, type });
    setTimeout(() => {
      setPopup({ show: false, message: "", type: "success" });
    }, 3000);
  };

  const handleLogin = (formData) => {
    const email = formData.get("email");
    const password = formData.get("password");

    startTransition(async () => {
      try {
        const supabase = createClient();

        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          showPopupMessage("Invalid email or password", "error");
        } else if (data?.user) {
          showPopupMessage("Login Successful! Redirecting...", "success");
          const role = data.user.user_metadata?.role;
          const adminEmail = process.env.NEXT_PUBLIC_DEMO_ADMIN_EMAIL;

          setTimeout(() => {
            if (role === 'admin' || email === adminEmail) {
              window.location.href = "/admin";
            } else {
              window.location.href = "/";
            }
          }, 1500);
        }
      } catch (error) {
        showPopupMessage("Something went wrong. Please try again.", "error");
      }
    });
  };

  const handleRegister = (formData) => {
    const email = formData.get("email");
    const password = formData.get("password");
    const firstName = formData.get("firstName");
    const lastName = formData.get("lastName");

    startTransition(async () => {
      try {
        const supabase = createClient();

        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              first_name: firstName,
              last_name: lastName,
              name: `${firstName} ${lastName}`,
              role: 'customer'
            }
          }
        });

        if (error) {
          showPopupMessage(error.message, "error");
        } else {
          setIsLogin(true);
          showPopupMessage("Registration successful! You can now log in.", "success");
        }
      } catch (error) {
        showPopupMessage("Something went wrong during registration.", "error");
      }
    });
  };

  const handleGoogleSignIn = () => {
    signIn("google", { callbackUrl: "/" });
  };

  const GoogleIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="20px" height="20px">
      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z" />
      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z" />
      <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z" />
      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z" />
    </svg>
  );

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#121433] via-[#3d4563] to-[#8d94a6] p-6 overflow-hidden relative">
      <ScrollToTop />
      {popup.show && (
        <div className={`fixed top-8 left-1/2 -translate-x-1/2 z-[100] px-6 py-3.5 rounded-xl shadow-2xl backdrop-blur-md font-bold text-[14px] flex items-center gap-3 transition-all duration-300 transform translate-y-0 ${popup.type === 'success' ? 'bg-[#00c3ff]/90 text-white border border-[#00c3ff]' : 'bg-red-500/90 text-white border border-red-400'
          }`}>
          {popup.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {popup.message}
        </div>
      )}

      <div className="relative w-full max-w-[1000px] h-[850px] md:h-[650px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] overflow-hidden flex">

        <div className={`absolute top-0 left-0 w-full md:w-1/2 h-full p-8 md:p-14 flex flex-col justify-center transition-all duration-700 ease-in-out z-20 ${isLogin
            ? 'opacity-0 pointer-events-none -translate-x-full md:translate-x-0'
            : 'opacity-100 pointer-events-auto translate-x-0 md:translate-x-[100%]'
          }`}>
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-[42px] font-bold text-[#0ba6ff] mb-2 tracking-tight drop-shadow-md">
              Create Account
            </h1>
            <p className="text-yellow-400 text-[13px] drop-shadow-sm">Sign up with your details</p>
          </div>

          <form action={handleRegister} className="space-y-5">
            <div className="flex gap-4">
              <div className="relative w-1/2">
                <span className="absolute -top-3 left-4 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-[#0ba6ff] border border-white/10 shadow-sm z-10">First Name</span>
                <div className="flex items-center border border-white/30 hover:border-[#0ba6ff]/70 focus-within:border-[#0ba6ff] rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md transition-all">
                  <User className="text-white/80 mr-3 shrink-0" size={18} />
                  <input name="firstName" type="text" placeholder="John" required className="w-full bg-transparent outline-none text-[14px] text-white font-medium placeholder:text-white/40" />
                </div>
              </div>
              <div className="relative w-1/2">
                <span className="absolute -top-3 left-4 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-[#0ba6ff] border border-white/10 shadow-sm z-10">Last Name</span>
                <div className="flex items-center border border-white/30 hover:border-[#0ba6ff]/70 focus-within:border-[#0ba6ff] rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md transition-all">
                  <input name="lastName" type="text" placeholder="Doe" required className="w-full bg-transparent outline-none text-[14px] text-white font-medium placeholder:text-white/40" />
                </div>
              </div>
            </div>

            <div className="relative">
              <span className="absolute -top-3 left-4 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-[#0ba6ff] border border-white/10 shadow-sm z-10">Email Id</span>
              <div className="flex items-center border border-white/30 hover:border-[#0ba6ff]/70 focus-within:border-[#0ba6ff] rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md transition-all">
                <Mail className="text-white/80 mr-3 shrink-0" size={18} />
                <input name="email" type="email" placeholder="your@mail.com" required className="w-full bg-transparent outline-none text-[14px] text-white font-medium placeholder:text-white/40" />
              </div>
            </div>

            <div className="relative">
              <span className="absolute -top-3 left-4 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-[#0ba6ff] border border-white/10 shadow-sm z-10">Password</span>
              <div className="flex items-center border border-white/30 hover:border-[#0ba6ff]/70 focus-within:border-[#0ba6ff] rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md transition-all">
                <Lock className="text-white/80 mr-3 shrink-0" size={18} />
                <input name="password" type={showRegisterPassword ? "text" : "password"} placeholder="••••••••••••••" minLength="6" required className="w-full bg-transparent outline-none text-[14px] text-white font-medium tracking-widest placeholder:text-white/40" />
                <button type="button" onClick={() => setShowRegisterPassword(!showRegisterPassword)} className="text-white/80 hover:text-white transition-colors cursor-pointer">
                  {showRegisterPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-2">
              <button disabled={isPending} type="submit" className="w-full flex justify-center items-center gap-2 cursor-pointer bg-[#0ba6ff] hover:bg-[#0092e6] text-white font-bold text-[13px] py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(11,166,255,0.4)] hover:shadow-[0_0_25px_rgba(11,166,255,0.6)] uppercase tracking-wide disabled:opacity-70">
                {isPending && <Loader2 size={16} className="animate-spin" />}
                REGISTER
              </button>

              <div className="flex items-center my-1">
                <div className="flex-grow border-t border-white/20"></div>
                <div className="flex-grow border-t border-white/20"></div>
              </div>

              <Link
                href="/"
                className="w-full cursor-pointer flex items-center justify-center gap-3 bg-white/10 border border-white/30 hover:bg-white hover:text-black text-white font-bold text-[13px] py-3 rounded-xl transition-all uppercase tracking-wide group"
              >
                <ArrowLeft size={18} />
                Back to Home
              </Link>
            </div>
          </form>

          <div className="mt-8 text-center text-[13px] md:hidden">
            <span className="text-gray-300 font-medium drop-shadow-sm">Already have an account? </span>
            <button onClick={() => setIsLogin(true)} className="font-extrabold text-white hover:text-[#0ba6ff] transition-colors drop-shadow-md ml-1 cursor-pointer">
              Login Now
            </button>
          </div>
        </div>

        <div className={`absolute top-0 left-0 w-full md:w-1/2 h-full p-8 md:p-14 flex flex-col justify-center transition-all duration-700 ease-in-out z-20 ${isLogin
            ? 'opacity-100 pointer-events-auto translate-x-0'
            : 'opacity-0 pointer-events-none translate-x-[100%]'
          }`}>
          <div className="text-center mb-6">
            <h1 className="text-3xl md:text-[42px] font-bold text-[#0ba6ff] mb-2 tracking-tight drop-shadow-md">
              Welcome Back
            </h1>
            <p className="text-yellow-400 text-[13px] drop-shadow-sm">Login with Email</p>
          </div>

          <form action={handleLogin} className="space-y-5">
            <div className="relative">
              <span className="absolute -top-3 left-4 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-[#0ba6ff] border border-white/10 shadow-sm z-10">Email</span>
              <div className="flex items-center border border-white/30 hover:border-[#0ba6ff]/70 focus-within:border-[#0ba6ff] rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md transition-all">
                <Mail className="text-white/80 mr-3 shrink-0" size={18} />
                <input
                  name="email"
                  type="email"
                  placeholder="EMAIL_ADDRESS"
                  className="w-full bg-transparent outline-none text-[14px] text-white font-medium placeholder:text-white/40"
                  required
                />
              </div>
            </div>

            <div className="relative mt-6">
              <span className="absolute -top-3 left-4 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-[#0ba6ff] border border-white/10 shadow-sm z-10">Password</span>
              <div className="flex items-center border border-white/30 hover:border-[#0ba6ff]/70 focus-within:border-[#0ba6ff] rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md transition-all">
                <Lock className="text-white/80 mr-3 shrink-0" size={18} />
                <input
                  name="password"
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="••••••••••••••"
                  className="w-full bg-transparent outline-none text-[14px] text-white font-medium tracking-widest placeholder:text-white/40"
                  required
                />
                <button type="button" onClick={() => setShowLoginPassword(!showLoginPassword)} className="text-white/80 hover:text-white transition-colors cursor-pointer">
                  {showLoginPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <div className="text-right mt-2">
              <Link href="/forgot-password" className="text-[12px] font-medium text-gray-300 hover:text-[#0ba6ff] transition-colors drop-shadow-sm cursor-pointer">
                Forgot your password?
              </Link>
            </div>

            <div className="flex flex-col gap-4 pt-2">
              <button disabled={isPending} type="submit" className="w-full flex justify-center items-center gap-2 cursor-pointer bg-[#0ba6ff] hover:bg-[#0092e6] text-white font-bold text-[13px] py-3.5 rounded-xl transition-all shadow-[0_0_15px_rgba(11,166,255,0.4)] hover:shadow-[0_0_25px_rgba(11,166,255,0.6)] uppercase tracking-wide disabled:opacity-70">
                {isPending && <Loader2 size={16} className="animate-spin" />}
                LOGIN
              </button>

              <div className="flex items-center my-1">
                <div className="flex-grow border-t border-white/20"></div>
                <div className="flex-grow border-t border-white/20"></div>
              </div>

              <Link
                href="/"
                className="w-full cursor-pointer flex items-center justify-center gap-3 bg-white/10 border border-white/30 hover:bg-white hover:text-black text-white font-bold text-[13px] py-3 rounded-xl transition-all uppercase tracking-wide group"
              >
                <ArrowLeft size={18} />
                Back to Home
              </Link>
            </div>
          </form>

          <div className="mt-8 text-center text-[13px] md:hidden">
            <span className="text-gray-300 font-medium drop-shadow-sm">Don't have an account? </span>
            <button onClick={() => setIsLogin(false)} className="font-extrabold text-white hover:text-[#0ba6ff] transition-colors drop-shadow-md ml-1 cursor-pointer">
              Register Now
            </button>
          </div>
        </div>

        <div className={`hidden md:flex absolute top-0 left-0 w-1/2 h-full z-50 transition-transform duration-700 ease-in-out ${isLogin ? 'translate-x-[100%]' : 'translate-x-0'
          }`}>
          <div className="relative w-full h-full overflow-hidden shadow-2xl">
            <Image
              src="/others-img/Login.webp"
              alt="Auth Image"
              fill
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-[#0e163d]/30"></div>

            <div className={`absolute inset-0 flex flex-col items-center justify-center text-center p-10 text-white transition-opacity duration-500 ${isLogin ? 'opacity-100 delay-300' : 'opacity-0 pointer-events-none'}`}>
              <h2 className="text-4xl font-bold mb-4 drop-shadow-lg text-[#0ba6ff]  font-serif">Hello, Friend!</h2>
              <p className="text-[15px] text-yellow-400 mb-10 drop-shadow-md max-w-[280px]">Enter your personal details and start your fashion journey with us.</p>
              <button
                onClick={() => setIsLogin(false)}
                className="border-[2.5px] hover:border-white border-[#0ba6ff] rounded-full px-12 py-3.5 font-bold text-[14px] hover:bg-[#0ba6ff] hover:text-white transition-all uppercase tracking-wider shadow-lg text-[#0ba6ff] cursor-pointer"
              >
                Sign Up
              </button>
            </div>

            <div className={`absolute inset-0 flex flex-col items-center justify-center text-center p-10 text-white transition-opacity duration-500 ${!isLogin ? 'opacity-100 delay-300' : 'opacity-0 pointer-events-none'}`}>
              <h2 className="text-4xl text-[#0ba6ff] font-bold mb-4 drop-shadow-lg font-serif">Welcome Back!</h2>
              <p className="text-[15px] text-yellow-400 mb-10 drop-shadow-md max-w-[280px]">To keep connected with us please login with your personal info.</p>
              <button
                onClick={() => setIsLogin(true)}
                className="border-[2.5px] hover:border-white border-[#0ba6ff] rounded-full px-12 py-3.5 font-bold text-[14px] hover:bg-[#0ba6ff] hover:text-white transition-all uppercase tracking-wider shadow-lg text-[#0ba6ff] cursor-pointer"
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