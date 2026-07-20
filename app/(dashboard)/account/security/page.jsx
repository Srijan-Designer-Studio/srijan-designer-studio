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
    <div className="max-w-3xl pt-[100px] lg:pt-[120px] space-y-6 font-sans">
      
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Security Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Update your password and secure your account.</p>
      </div>

      <Card className="shadow-sm border-gray-100 p-0 overflow-hidden">
        <div className="bg-gray-50 p-6 border-b border-gray-100 flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-green-600 shadow-sm">
             <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-base font-bold text-gray-900">Change Password</h2>
            <p className="text-xs text-gray-500">Ensure your account is using a long, random password to stay secure.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div className="pt-2">
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">New Password</label>
            <input 
              name="newPassword"
              type="password" 
              required
              minLength="6"
              className="w-full md:w-2/3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm bg-white" 
              placeholder="Create a new password" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Confirm New Password</label>
            <input 
              name="confirmPassword"
              type="password" 
              required
              minLength="6"
              className="w-full md:w-2/3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm bg-white" 
              placeholder="Confirm your new password" 
            />
          </div>

          {message && (
            <p className={`text-sm font-medium ${message.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
              {message}
            </p>
          )}

          <div className="pt-4 flex items-center gap-4">
            <button disabled={isPending} type="submit" className="px-6 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 shadow-sm transition-colors flex items-center gap-2 disabled:opacity-70">
              {isPending && <Loader2 size={16} className="animate-spin" />}
              Update Password
            </button>
            <button type="button" className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline">
              Forgot password?
            </button>
          </div>
        </form>
      </Card>
    </div>
  );
}