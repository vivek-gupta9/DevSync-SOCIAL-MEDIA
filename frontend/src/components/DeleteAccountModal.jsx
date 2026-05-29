import React, { useState } from 'react';
import { X, AlertCircle } from 'lucide-react';

export default function DeleteAccountModal({ isOpen, onClose, onConfirm }) {
  const [password, setPassword] = useState('');
  const [reason, setReason] = useState('Too much time spent');
  const [localError, setLocalError] = useState(''); // 🔥 NEW: Form Validation State

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLocalError(''); // Reset error
    
    if (!password) return;
    
    // Yahan hum check karenge ki password sahi tha ya nahi
    const result = onConfirm(password, reason);
    
    if (result && result.success === false) {
      setLocalError(result.message); // 🔥 Agar galat hai toh modal ke andar hi error dikhayega
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="glass-panel w-full max-w-sm rounded-3xl p-6 border border-white/10 shadow-2xl relative bg-[#0B0D17]">
        
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-extrabold text-white flex items-center gap-2">
            <AlertCircle className="text-rose-500" size={20} />
            Delete Account
          </h2>
          <button type="button" onClick={onClose} className="p-1.5 rounded-xl border border-gray-800 text-gray-400 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        {/* 🔥 NEW: Premium Error Flash Banner */}
        {localError && (
          <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl flex items-center gap-2 text-xs font-bold text-rose-400 animate-in slide-in-from-top-2">
            <AlertCircle size={16} className="flex-shrink-0" />
            <span>{localError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <input
              type="password"
              required
              placeholder="Enter your password..."
              value={password}
              onChange={(e) => { setPassword(e.target.value); setLocalError(''); }}
              className={`w-full bg-[#141625] border ${localError ? 'border-rose-500/50' : 'border-gray-800'} rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-rose-500 text-white placeholder:text-gray-600 transition-colors`}
            />
          </div>

          <div>
            {/* 🔥 NEW: 10 Advanced Options Added */}
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full bg-[#141625] border border-gray-800 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:border-rose-500 text-white appearance-none cursor-pointer"
            >
              <option value="Too much time spent">Too much time spent</option>
              <option value="Privacy concerns">Privacy concerns</option>
              <option value="Taking a break">Taking a break</option>
              <option value="Lack of engagement">Lack of engagement</option>
              <option value="Too many notifications">Too many notifications</option>
              <option value="Found a better alternative">Found a better alternative</option>
              <option value="Technical issues / Bugs">Technical issues / Bugs</option>
              <option value="Don't feel safe">Don't feel safe</option>
              <option value="Content is not relevant">Content is not relevant</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={!password}
            className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-700 font-extrabold text-sm text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2 shadow-lg shadow-rose-900/20 cursor-pointer"
          >
            Confirm Permanent Deletion
          </button>
        </form>
      </div>
    </div>
  );
}