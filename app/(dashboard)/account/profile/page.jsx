'use client';

import Image from 'next/image';
import { Camera, User } from 'lucide-react';
import Card from '@/components/dashboard/shared/Card';

export default function ProfilePage() {
  return (
    <div className="max-w-4xl space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Update your personal information and profile picture.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar/Picture */}
        <div className="md:col-span-1">
          <Card className="flex flex-col items-center text-center p-6 shadow-sm border border-gray-100">
            <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-gray-50 shadow-sm bg-gray-100 flex items-center justify-center">
              {/* Using your existing placeholder */}
              <Image src="/images/man1.png" alt="Profile" fill className="object-cover" />
              
              {/* Overlay for uploading */}
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="text-white" size={24} />
              </div>
            </div>
            <h3 className="font-bold text-gray-900">Ananya Sharma</h3>
            <p className="text-xs text-gray-500 mt-1">ananya@example.com</p>
            
            <button className="mt-6 w-full py-2 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Change Picture
            </button>
          </Card>
        </div>

        {/* Right Column: Details Form */}
        <div className="md:col-span-2">
          <Card title="Personal Information" className="shadow-sm border border-gray-100">
            <form className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input 
                    type="text" 
                    defaultValue="Ananya"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input 
                    type="text" 
                    defaultValue="Sharma"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue="ananya@example.com"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    type="tel" 
                    defaultValue="+91 98765 43210"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm" 
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <input 
                  type="date" 
                  defaultValue="1995-08-15"
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm text-gray-700" 
                />
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="button" className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Cancel
                </button>
                <button type="button" className="px-6 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors shadow-sm">
                  Save Changes
                </button>
              </div>

            </form>
          </Card>
        </div>

      </div>
    </div>
  );
}