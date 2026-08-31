"use client";
export const dynamic = 'force-dynamic';
import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import { createBrowserClient } from '@supabase/ssr';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // URL থেকে জোর করে টোকেন বের করে সেশন তৈরি করার লজিক
  useEffect(() => {
    const hash = window.location.hash;
    
    if (hash && hash.includes("access_token")) {
      // URL-এর হ্যাশ পার্স করা
      const hashParams = new URLSearchParams(hash.substring(1));
      const access_token = hashParams.get("access_token");
      const refresh_token = hashParams.get("refresh_token");

      if (access_token && refresh_token) {
        // Supabase-কে ম্যানুয়ালি সেশন ধরিয়ে দেওয়া
        supabase.auth.setSession({
          access_token,
          refresh_token
        }).then(({ error }) => {
          if (!error) {
            // সেশন তৈরি হয়ে গেলে সিকিউরিটির জন্য URL থেকে টোকেন মুছে ফেলা
            window.history.replaceState(null, '', window.location.pathname);
          }
        });
      }
    } else if (hash && hash.includes("error_description")) {
       const errorMsg = decodeURIComponent(hash.split("error_description=")[1].split("&")[0]);
       setMessage("Link Error: " + errorMsg.replace(/\+/g, ' '));
    }
  }, [supabase]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage("");

    const formData = new FormData(e.target);
    const password = formData.get('password');
    const confirm = formData.get('confirmPassword');

    if (password !== confirm) {
      setMessage("Passwords do not match.");
      return;
    }

    startTransition(async () => {
      try {
        // আপডেট করার আগে চেক করে নিচ্ছি সেশন ঠিকমতো তৈরি হলো কি না
        const { data: { session } } = await supabase.auth.getSession();
        
        if (!session) {
          setMessage("Session Error: Link expired or invalid. Please request a new link.");
          return;
        }

        const { error } = await supabase.auth.updateUser({
          password: password
        });

        if (error) {
          setMessage("Supabase Error: " + error.message);
          return;
        }

        setMessage("Password reset successful! Redirecting...");
        setTimeout(() => router.push('/login'), 2000);
      } catch (error) {
        setMessage("System Error: " + (error?.message || "Unknown error occurred."));
      }
    });
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#121433] via-[#3d4563] to-[#8d94a6] p-6">
      <div className="w-full max-w-[450px] bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-8 md:p-12 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)]">
        
        <h1 className="text-3xl font-bold text-[#0ba6ff] mb-2 tracking-tight drop-shadow-md">
          Create New Password
        </h1>
        <p className="text-gray-200 text-sm drop-shadow-sm mb-8">
          Please enter your new password below.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="relative">
            <span className="absolute -top-3 left-4 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-[#0ba6ff] border border-white/10 shadow-sm z-10">New Password</span>
            <div className="flex items-center border border-white/30 hover:border-[#0ba6ff]/70 focus-within:border-[#0ba6ff] rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md transition-all">
              <Lock className="text-white/80 mr-3 shrink-0" size={18} />
              <input 
                name="password"
                type="password" 
                placeholder="••••••••" 
                required
                minLength="6"
                className="w-full bg-transparent outline-none text-[14px] text-white font-medium placeholder:text-white/40" 
              />
            </div>
          </div>

          <div className="relative">
            <span className="absolute -top-3 left-4 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded text-[11px] font-bold text-[#0ba6ff] border border-white/10 shadow-sm z-10">Confirm Password</span>
            <div className="flex items-center border border-white/30 hover:border-[#0ba6ff]/70 focus-within:border-[#0ba6ff] rounded-xl px-4 py-3 bg-white/10 backdrop-blur-md transition-all">
              <Lock className="text-white/80 mr-3 shrink-0" size={18} />
              <input 
                name="confirmPassword"
                type="password" 
                placeholder="••••••••" 
                required
                minLength="6"
                className="w-full bg-transparent outline-none text-[14px] text-white font-medium placeholder:text-white/40" 
              />
            </div>
          </div>

          {message && (
            <p className={`text-sm font-medium ${message.includes('successful') ? 'text-green-400' : (message.includes('Error') ? 'text-red-400' : 'text-yellow-400')}`}>
              {message}
            </p>
          )}

          <button 
            disabled={isPending} 
            type="submit" 
            className="w-full flex justify-center items-center gap-2 bg-[#0ba6ff] hover:bg-[#0092e6] text-white font-bold text-[13px] py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(11,166,255,0.4)] uppercase tracking-wide disabled:opacity-70"
          >
            {isPending && <Loader2 size={16} className="animate-spin" />}
            {isPending ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </main>
  );
}
