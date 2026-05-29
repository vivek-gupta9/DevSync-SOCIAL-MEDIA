import React from 'react';
import { ShieldAlert, Power } from 'lucide-react';

export default function LogoutModal({ isOpen, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div class="glass-panel w-full max-w-sm rounded-3xl p-6 border border-white/10 shadow-2xl text-center">
        <div class="h-12 w-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-4">
          <ShieldAlert size={24} />
        </div>
        <h3 class="text-base font-extrabold text-white tracking-tight">Confirm Log Out</h3>
        <p class="text-xs text-gray-400 font-medium mt-2 leading-relaxed">Are you sure you want to log out of your account? You will need to re-authenticate your credentials to access your personal dashboard feed again.</p>
        
        <div class="grid grid-cols-2 gap-3 mt-6">
          <button onClick={onCancel} class="py-3 rounded-xl border border-gray-800 bg-[#0E101C] text-xs font-bold text-gray-400 hover:text-white hover:border-gray-700 transition-all active:scale-95 cursor-pointer">
            Cancel
          </button>
          <button onClick={onConfirm} class="py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-extrabold text-white shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 cursor-pointer">
            <Power size={14} /> Log Out
          </button>
        </div>
      </div>
    </div>
  );
}