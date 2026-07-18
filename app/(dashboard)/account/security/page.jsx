'use client';

import { ShieldCheck } from 'lucide-react';
import Card from '@/components/dashboard/shared/Card';

export default function SecurityPage() {
  return (
    <div className="max-w-3xl space-y-6 font-sans">
      
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

        <form className="p-6 space-y-5">
          <div>
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Current Password</label>
            <input 
              type="password" 
              className="w-full md:w-2/3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm bg-white" 
              placeholder="Enter your current password" 
            />
          </div>

          <div className="pt-2">
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">New Password</label>
            <input 
              type="password" 
              className="w-full md:w-2/3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm bg-white" 
              placeholder="Create a new password" 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-900 uppercase tracking-wider mb-2">Confirm New Password</label>
            <input 
              type="password" 
              className="w-full md:w-2/3 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-black/5 text-sm bg-white" 
              placeholder="Confirm your new password" 
            />
          </div>

          <div className="pt-4 flex items-center gap-4">
            <button type="button" className="px-6 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 shadow-sm transition-colors">
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