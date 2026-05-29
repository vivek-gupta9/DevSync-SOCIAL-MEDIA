import React, { useEffect } from 'react';
import { ShieldAlert, ShieldCheck, Info } from 'lucide-react';

export default function Toast({ message, type, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div class="fixed top-24 right-6 z-50 glass-panel border border-white/10 px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-right-10 duration-300">
      <div class={`${type === 'success' ? 'text-emerald-400' : 'text-rose-500'}`}>
        {type === 'success' ? <ShieldCheck size={20} /> : <ShieldAlert size={20} />}
      </div>
      <span class="text-xs font-bold text-gray-200 tracking-wide font-mono uppercase">{message}</span>
    </div>
  );
}