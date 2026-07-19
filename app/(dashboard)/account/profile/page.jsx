"use client";

import { useState, useEffect, useTransition } from 'react';
import Image from 'next/image';
import { Camera, Loader2 } from 'lucide-react';
import Card from '@/components/dashboard/shared/Card';
import { getProfile, updateProfile } from '@/app/actions/dashboard';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState('');

  // Fetch initial profile data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch (error) {
        console.error("Failed to fetch profile", error);
      }
    };
    fetchProfile();
  }, []);

  const handleUpdate = (formData) => {
    setMessage('');
    startTransition(async () => {
      try {
        await updateProfile(formData);
        setMessage('Profile updated successfully!');
        
        // Clear success message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } catch (error) {
        setMessage('Error: ' + error.message);
      }
    });
  };

  if (!profile) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-gray-500" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl pt-[100px] lg:pt-[120px] space-y-6 font-sans">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Update your personal information and profile picture.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Column: Avatar/Picture */}
        <div className="md:col-span-1">
          <Card className="flex flex-col items-center text-center p-6 shadow-sm border border-gray-100">
            <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-gray-50 shadow-sm bg-gray-100 flex items-center justify-center group">
              <Image src="/images/man1.png" alt="Profile" fill className="object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                <Camera className="text-white" size={24} />
              </div>
            </div>
            <h3 className="font-bold text-gray-900">{profile.first_name} {profile.last_name}</h3>
            
            <button className="mt-6 w-full py-2 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
              Change Picture
            </button>
          </Card>
        </div>

        {/* Right Column: Details Form */}
        <div className="md:col-span-2">
          <Card title="Personal Information" className="shadow-sm border border-gray-100">
            <form action={handleUpdate} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input 
                    name="firstName"
                    type="text" 
                    defaultValue={profile.first_name || ""}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input 
                    name="lastName"
                    type="text" 
                    defaultValue={profile.last_name || ""}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    name="phone"
                    type="tel" 
                    defaultValue={profile.phone || ""}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-black/5 transition-all text-sm" 
                  />
                </div>
                <div>
                  {/* Email is read-only here as it requires a secure Supabase Auth update process */}
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    disabled
                    placeholder="Email updates disabled"
                    className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-400 cursor-not-allowed" 
                  />
                </div>
              </div>

              {message && (
                <p className={`text-sm ${message.includes('Error') ? 'text-red-500' : 'text-green-600'}`}>
                  {message}
                </p>
              )}

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="reset" disabled={isPending} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50">
                  Cancel
                </button>
                <button type="submit" disabled={isPending} className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-70">
                  {isPending && <Loader2 size={16} className="animate-spin" />}
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