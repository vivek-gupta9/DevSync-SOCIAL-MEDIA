import React, { useState } from 'react';
import { Home, Compass, Bell, MessageSquare, User, Power, Search, AtSign, ChevronRight, HelpCircle } from 'lucide-react';

export default function Sidebar({ currentUser, onLogoutInit, activeTab, setActiveTab, notificationCount, unreadMessageCount, allUsers, onUserClick }) {
  const [showSearchBox, setShowSearchBox] = useState(false);
  const [localSearchQuery, setLocalSearchQuery] = useState('');

  const menuItems = [
    { id: 'home', icon: <Home size={20} />, label: 'Home Feed' },
    { id: 'explore', icon: <Compass size={20} />, label: 'Explore Hub' },
    { id: 'alerts', icon: <Bell size={20} />, label: 'Notifications', badge: notificationCount },
    { id: 'messages', icon: <MessageSquare size={20} />, label: 'Messages', badge: unreadMessageCount },
    { id: 'profile', icon: <User size={20} />, label: 'My Profile' },
    { id: 'support', icon: <HelpCircle size={20} />, label: 'Help & Support' }
  ];

  const safeUsers = Array.isArray(allUsers) ? allUsers : [];

  // 🔥 UPDATE: Removed 'u._id !== currentUser._id' so you can search yourself globally
  const inlineFilteredUsers = localSearchQuery.trim() === '' 
    ? [] 
    : safeUsers.filter(u => 
        u?.username?.toLowerCase().includes(localSearchQuery.toLowerCase()) ||
        u?.name?.toLowerCase().includes(localSearchQuery.toLowerCase())
      );

  const safeCurrentUser = currentUser || { name: 'Guest', username: 'guest', avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150' };

  return (
    <aside className="w-72 fixed left-0 top-[73px] bottom-0 border-r border-gray-900/60 p-6 hidden lg:flex flex-col justify-between bg-[#07080E]/40 z-20">
      <div className="space-y-4">
        <nav className="space-y-1.5">
          {menuItems.map((item) => (
            <button 
              key={item.id} 
              type="button"
              onClick={() => {
                setActiveTab(item.id);
                if (item.id !== 'search') setShowSearchBox(false);
              }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group active:scale-98 cursor-pointer ${
                activeTab === item.id && !showSearchBox
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/10' 
                  : 'text-gray-400 hover:text-white hover:bg-gray-900/40'
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`${activeTab === item.id && !showSearchBox ? 'text-indigo-400' : 'text-gray-500 group-hover:text-indigo-400 transition-colors'}`}>
                  {item.icon}
                </div>
                <span>{item.label}</span>
              </div>
              {item.badge > 0 && (
                <span className="bg-indigo-500 text-white text-[10px] px-2 py-0.5 rounded-full font-extrabold shadow-sm shadow-indigo-500/50">
                  {item.badge}
                </span>
              )}
            </button>
          ))}

          <button 
            type="button"
            onClick={() => setShowSearchBox(!showSearchBox)}
            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-2xl text-sm font-bold transition-all group active:scale-98 cursor-pointer ${
              showSearchBox 
                ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/10' 
                : 'text-gray-400 hover:text-white hover:bg-gray-900/40'
            }`}
          >
            <Search size={20} className={`${showSearchBox ? 'text-indigo-400' : 'text-gray-500 group-hover:text-indigo-400'}`} />
            <span>Search Directory</span>
          </button>
        </nav>

        {showSearchBox && (
          <div className="glass-panel p-3 rounded-2xl border border-white/5 space-y-2 bg-[#07080E]">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search users..." 
                className="w-full bg-[#0E101C] border border-gray-800 rounded-xl py-2 pl-8 pr-3 text-xs font-medium focus:outline-none focus:border-indigo-500 text-white placeholder:text-gray-600"
                value={localSearchQuery}
                onChange={e => setLocalSearchQuery(e.target.value)}
              />
              <AtSign size={11} className="absolute left-2.5 top-3 text-gray-600" />
            </div>

            {inlineFilteredUsers.length > 0 && (
              <div className="space-y-1 max-h-40 overflow-y-auto custom-scroll pt-1">
                {inlineFilteredUsers.map(u => (
                  <div 
                    key={u._id} 
                    onClick={() => {
                      onUserClick(u);
                      setLocalSearchQuery('');
                      setShowSearchBox(false);
                    }}
                    className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-900/50 cursor-pointer group/item transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <img src={u.avatar} alt="Avatar" className="h-6 w-6 rounded-md object-cover" />
                      <div className="truncate max-w-[140px]">
                        <h4 className="text-[11px] font-bold text-white group-hover/item:text-indigo-400 transition-colors">{u.name}</h4>
                        <span className="text-[9px] text-gray-500 block">@{u.username}</span>
                      </div>
                    </div>
                    <ChevronRight size={12} className="text-gray-600 group-hover/item:text-indigo-400 transition-colors" />
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <div className="space-y-3">
        <div onClick={() => { setActiveTab('profile'); setShowSearchBox(false); }} className="glass-card p-4 rounded-2xl border border-white/5 flex items-center gap-3 cursor-pointer group bg-[#0A0C14]">
          <img src={safeCurrentUser.avatar} alt="User Avatar" className="h-10 w-10 rounded-xl object-cover ring-2 ring-indigo-500/20 group-hover:ring-indigo-500/60 transition-all" />
          <div className="max-w-[150px]">
            <h4 className="text-xs font-bold truncate text-white">{safeCurrentUser.name}</h4>
            <span className="text-[10px] text-indigo-400 font-semibold uppercase tracking-wider block mt-0.5">@{safeCurrentUser.username}</span>
          </div>
        </div>

        <button 
          type="button"
          onClick={onLogoutInit}
          className="w-full py-3.5 rounded-2xl border border-rose-950/40 bg-rose-950/10 hover:bg-rose-900/20 text-rose-400 text-xs font-extrabold tracking-wider uppercase flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer shadow-sm"
        >
          <Power size={14} /> Log Out Account
        </button>
      </div>
    </aside>
  );
}