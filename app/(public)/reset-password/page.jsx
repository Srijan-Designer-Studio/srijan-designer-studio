"use client";
export const dynamic = 'force-dynamic';
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Lock, Loader2 } from "lucide-react";
import { resetPassword } from "@/app/actions/auth";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

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
        await resetPassword(formData);
        setMessage("Password reset successful! Redirecting...");
        setTimeout(() => router.push('/login'), 2000);
      } catch (error) {
        setMessage(error.message || "Failed to reset password. Your link may have expired.");
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
            <p className={`text-sm font-medium ${message.includes('successful') ? 'text-green-400' : 'text-red-400'}`}>
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