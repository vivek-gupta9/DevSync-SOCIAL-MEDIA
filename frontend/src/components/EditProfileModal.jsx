import React, { useState, useRef } from 'react';
import { X, User, FileText, Calendar, HelpCircle, UploadCloud, AlertCircle } from 'lucide-react';

export default function EditProfileModal({ isOpen, currentUser, onClose, onSave }) {
  const [formData, setFormData] = useState({
    name: currentUser.name,
    username: currentUser.username, 
    bio: currentUser.bio || '',
    avatar: currentUser.avatar,
    age: currentUser.age || '',
    dob: currentUser.dob || ''
  });
  const [localError, setLocalError] = useState('');

  const profileFileSelectorRef = useRef(null);

  if (!isOpen) return null;

  const handleProfileDateChange = (e) => {
    const selectedDate = e.target.value;
    const yearExtractor = selectedDate.split('-')[0];
    
    if (yearExtractor && yearExtractor.length > 4) {
      setLocalError("Year sequence cannot exceed 4 digits formatting rules.");
      return;
    }
    setLocalError('');
    setFormData({ ...formData, dob: selectedDate });
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, avatar: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div class="glass-panel w-full max-w-md rounded-3xl p-6 border border-white/10 shadow-2xl relative max-h-[90vh] overflow-y-auto custom-scroll z-50">
        <button type="button" onClick={onClose} class="absolute top-5 right-5 p-1.5 rounded-xl border border-gray-800 text-gray-400 hover:text-white transition-colors cursor-pointer">
          <X size={14} />
        </button>
        
        <h3 class="text-base font-extrabold text-white tracking-tight mb-4 flex items-center gap-2">Edit Profile Context</h3>

        {localError && (
          <div class="mb-3 p-2.5 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center gap-2 text-[10px] font-bold text-rose-400">
            <AlertCircle size={14} />
            <span>{localError}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} class="space-y-4">
          <div class="flex flex-col items-center justify-center py-2 bg-[#0A0C14] border border-white/5 rounded-2xl gap-3 mb-1">
            <img src={formData.avatar} alt="Profile preview" class="h-16 w-16 rounded-xl object-cover ring-2 ring-indigo-500/40" />
            
            <input type="file" accept="image/*" class="hidden" ref={profileFileSelectorRef} onChange={handleProfilePhotoChange} />
            
            <button 
              type="button" 
              onClick={() => profileFileSelectorRef.current.click()} 
              class="px-4 py-2 bg-indigo-600/10 hover:bg-indigo-600/20 text-indigo-400 text-[10px] font-extrabold uppercase tracking-widest rounded-xl border border-indigo-500/20 flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <UploadCloud size={12} /> Change Profile Photo
            </button>
            <span class="text-[10px] text-gray-500 font-bold tracking-wide">Locked Handle Node: @{currentUser.username}</span>
          </div>

          <div class="relative">
            <User class="absolute left-3.5 top-3.5 text-gray-500" size={16} />
            <input type="text" placeholder="Full Name" required class="w-full bg-[#0E101C] border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-indigo-500 text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>

          <div class="grid grid-cols-2 gap-3">
            <div class="relative">
              <Calendar class="absolute left-3.5 top-3.5 text-gray-500" size={16} />
              <input type="date" max="2026-12-31" class="w-full bg-[#0E101C] border border-gray-800 rounded-xl py-3 pl-10 pr-3 text-[11px] font-medium focus:outline-none focus:border-indigo-500 text-gray-400" value={formData.dob} onChange={handleProfileDateChange} />
            </div>
            <div class="relative">
              <HelpCircle class="absolute left-3.5 top-3.5 text-gray-500" size={16} />
              <input type="number" placeholder="Age" class="w-full bg-[#0E101C] border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-indigo-500 text-white" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
            </div>
          </div>

          <div class="relative">
            <FileText class="absolute left-3.5 top-3.5 text-gray-500" size={16} />
            <textarea placeholder="Write something about yourself..." rows={3} class="w-full bg-[#0E101C] border border-gray-800 rounded-xl py-3 pl-10 pr-4 text-xs font-medium focus:outline-none focus:border-indigo-500 text-white resize-none" value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} />
          </div>

          <div class="grid grid-cols-2 gap-3 pt-2">
            <button type="button" onClick={onClose} class="py-3 rounded-xl border border-gray-800 text-xs font-bold text-gray-400 hover:text-white transition-all cursor-pointer">Abort</button>
            <button type="submit" class="py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-xs font-extrabold text-white shadow-lg shadow-indigo-600/20 transition-all cursor-pointer">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

