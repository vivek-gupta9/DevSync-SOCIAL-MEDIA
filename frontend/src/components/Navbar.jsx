import React from 'react';
import { Search, Bell, MessageSquare, User } from 'lucide-react';

export default function Navbar({ user, setActiveTab }) {
  return (
    <nav className="fixed top-0 w-full bg-[#07080E]/80 backdrop-blur-md border-b border-white/10 z-40 px-6 py-3 flex items-center justify-between">
      <div className="text-xl font-extrabold text-white cursor-pointer" onClick={() => setActiveTab('home')}>DevSync</div>
      
      <div className="flex-1 max-w-md mx-6">
        <div className="relative flex items-center text-gray-400 focus-within:text-white">
          <Search size={18} className="absolute left-3" />
          <input type="text" placeholder="Search developers..." className="w-full bg-white/5 border border-white/10 rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-indigo-500" />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <Bell size={20} className="text-gray-400 hover:text-white cursor-pointer" />
        <MessageSquare size={20} className="text-gray-400 hover:text-white cursor-pointer" />
        <img src={user?.avatar} alt="Avatar" className="w-8 h-8 rounded-full border border-white/20" />
      </div>
    </nav>
  );
}