"use client";

import { useState, useEffect, useRef } from 'react';
import { Camera, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Card from '@/components/dashboard/shared/Card';
import { createClient } from '@/lib/supabase/client';

export default function ProfilePage() {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [popup, setPopup] = useState({ show: false, message: '', type: 'success' });
  const fileInputRef = useRef(null);

  const showPopupMessage = (message, type = 'success') => {
    setPopup({ show: true, message, type });
    setTimeout(() => setPopup({ show: false, message: '', type: 'success' }), 3000);
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        
        if (user) {
          setProfile({
            first_name: user.user_metadata?.first_name || '',
            last_name: user.user_metadata?.last_name || '',
            phone: user.user_metadata?.phone || '',
            email: user.email || '',
            avatar_url: user.user_metadata?.avatar_url || null
          });
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("Authentication required");

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase.auth.updateUser({
        data: { avatar_url: publicUrl }
      });

      if (updateError) throw updateError;

      setProfile(prev => ({ ...prev, avatar_url: publicUrl }));
      showPopupMessage("Profile picture updated successfully!");
    } catch (error) {
      showPopupMessage(error.message || "Failed to upload image", "error");
    } finally {
      setIsUploading(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSaving(true);
    
    const formData = new FormData(e.target);
    const firstName = formData.get('firstName');
    const lastName = formData.get('lastName');
    const phone = formData.get('phone');

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.updateUser({
        data: {
          first_name: firstName,
          last_name: lastName,
          phone: phone,
          name: `${firstName} ${lastName}`
        }
      });

      if (error) throw error;

      setProfile(prev => ({
        ...prev,
        first_name: firstName,
        last_name: lastName,
        phone: phone
      }));
      showPopupMessage("Profile updated successfully!");
    } catch (error) {
      showPopupMessage(error.message || "Something went wrong.", "error");
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !profile) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <Loader2 className="animate-spin text-[#0ba6ff]" size={40} />
      </div>
    );
  }

  return (
    <div className="max-w-4xl pt-[100px] lg:pt-[120px] text-black space-y-6 font-sans relative">
      
      {popup.show && (
        <div className={`fixed top-24 left-1/2 -translate-x-1/2 z-[100] px-6 py-3.5 rounded-xl shadow-2xl backdrop-blur-md font-bold text-[14px] flex items-center gap-3 transition-all duration-300 ${
          popup.type === 'success' ? 'bg-[#00c3ff]/90 text-white border border-[#00c3ff]' : 'bg-red-500/90 text-white border border-red-400'
        }`}>
          {popup.type === 'success' ? <CheckCircle2 size={20} /> : <AlertCircle size={20} />}
          {popup.message}
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold text-gray-900">My Profile</h1>
        <p className="text-sm text-gray-500 mt-1">Update your personal information and profile picture.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        <div className="md:col-span-1">
          <Card className="flex flex-col items-center text-center p-6 shadow-sm border border-gray-100">
            <div 
              onClick={() => !isUploading && fileInputRef.current.click()}
              className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-gray-50 shadow-sm bg-gray-100 flex items-center justify-center group cursor-pointer"
            >
              <img 
                src={profile.avatar_url || "/images/user.png"} 
                alt="Profile" 
                className="object-cover w-full h-full" 
              />
              
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white" size={24} />
              </div>

              {isUploading && (
                <div className="absolute inset-0 bg-white/70 flex items-center justify-center">
                  <Loader2 className="animate-spin text-[#0ba6ff]" size={28} />
                </div>
              )}
            </div>
            
            <h3 className="font-bold text-gray-900 uppercase">{profile.first_name} {profile.last_name}</h3>
            
            <input 
              type="file" 
              accept="image/*" 
              className="hidden" 
              ref={fileInputRef} 
              onChange={handleImageUpload} 
            />
            
            <button 
              onClick={() => fileInputRef.current.click()}
              disabled={isUploading}
              className="mt-6 w-full py-2 px-4 border border-gray-200 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
            >
              {isUploading ? 'Uploading...' : 'Change Picture'}
            </button>
          </Card>
        </div>

        <div className="md:col-span-2">
          <Card title="Personal Information" className="shadow-sm border border-gray-100">
            <form onSubmit={handleUpdate} className="space-y-5">
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                  <input 
                    name="firstName"
                    type="text" 
                    defaultValue={profile.first_name}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0ba6ff]/30 transition-all text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                  <input 
                    name="lastName"
                    type="text" 
                    defaultValue={profile.last_name}
                    required
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0ba6ff]/30 transition-all text-sm" 
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input 
                    name="phone"
                    type="tel" 
                    defaultValue={profile.phone}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#0ba6ff]/30 transition-all text-sm" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Email Address</label>
                  <input 
                    type="email" 
                    defaultValue={profile.email}
                    disabled
                    className="w-full px-4 py-2.5 bg-gray-100 border border-gray-200 rounded-lg text-sm text-gray-400 cursor-not-allowed" 
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button type="reset" disabled={isSaving} className="px-5 py-2.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors disabled:opacity-50 cursor-pointer">
                  Cancel
                </button>
                <button type="submit" disabled={isSaving} className="flex items-center gap-2 px-6 py-2.5 text-sm font-medium text-white bg-black rounded-lg hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-70 cursor-pointer">
                  {isSaving && <Loader2 size={16} className="animate-spin" />}
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