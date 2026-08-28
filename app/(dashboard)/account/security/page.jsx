'use client';

import { useState, useTransition } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import Card from '@/components/dashboard/shared/Card';
import { updatePassword } from '@/app/actions/dashboard';

export default function SecurityPage() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setMessage('');
    const formData = new FormData(e.target);

    startTransition(async () => {
      try {
        await updatePassword(formData);
        setMessage('Password updated successfully.');
        e.target.reset();
      } catch (error) {
        setMessage(`Error: ${error.message}`);
      }
    });
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-[100px] lg:pt-[120px] space-y-6 font-sans pb-10">

      <div className="text-center sm:text-left">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Security Settings</h1>
        <p className="text-[14px] sm:text-[16px] text-gray-500 mt-1">Update your password and secure your account.</p>
      </div>

      <Card className="shadow-sm border-gray-100 p-0 overflow-hidden rounded-2xl">
        <div className="bg-gray-50 p-5 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row items-center sm:items-start text-center sm:text-left gap-4">
          <div className="w-12 h-12 shrink-0 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm border border-gray-100">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-[16px] sm:text-lg font-bold text-gray-900">Change Password</h2>
            <p className="text-[13px] sm:text-[14px] text-gray-500 mt-1">Ensure your account is using a long, random password to stay secure.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5">
          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">New Password</label>
            <input
              name="newPassword"
              type="password"
              required
              minLength="6"
              className="w-full sm:w-2/3 lg:w-1/2 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 text-[13px] sm:text-sm bg-white text-black transition-all"
              placeholder="Create a new password"
            />
          </div>

          <div>
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm New Password</label>
            <input
              name="confirmPassword"
              type="password"
              required
              minLength="6"
              className="w-full sm:w-2/3 lg:w-1/2 px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black/5 text-[13px] sm:text-sm bg-white text-black transition-all"
              placeholder="Confirm your new password"
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-[13px] font-bold ${message.includes('Error') ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-green-50 text-green-600 border border-green-100'}`}>
              {message}
            </div>
          )}

          <div className="pt-4 flex flex-col-reverse sm:flex-row items-center gap-4 sm:gap-6 border-t border-gray-100">
            <button type="button" className="text-[13px] font-bold text-blue-600 hover:text-blue-800 hover:underline w-full sm:w-auto text-center">
              Forgot password?
            </button>
            <button disabled={isPending} type="submit" className="w-full sm:w-auto px-6 py-3 text-[13px] sm:text-sm font-bold text-white bg-black rounded-xl hover:bg-gray-800 shadow-sm transition-colors flex justify-center items-center gap-2 disabled:opacity-70">
              {isPending && <Loader2 size={16} className="animate-spin" />}
              {isPending ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}