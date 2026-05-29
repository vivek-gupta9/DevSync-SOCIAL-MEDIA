import React, { useState } from 'react';
import { X, Mail, Lock, User, Sparkles, Calendar, HelpCircle, AtSign, Link2, Eye, EyeOff, AlertCircle } from 'lucide-react';

export default function AuthModal({ mode, onClose, onAuthSuccess, showToast }) {
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [localErrorMessage, setLocalErrorMessage] = useState('');
  
  const [formData, setFormData] = useState({
    name: '', username: '', email: '', password: '', age: '', dob: '', gender: 'Male', avatar: ''
  });

  const currentMaxYearLimit = "2026-12-31";

  const handleDateChangeWithStrictLimit = (e) => {
    const selectedDate = e.target.value;
    const yearExtractor = selectedDate.split('-')[0];
    
    if (yearExtractor && yearExtractor.length > 4) {
      setLocalErrorMessage("Year format cannot exceed 4 sequential digits.");
      return;
    }
    setLocalErrorMessage('');
    setFormData({ ...formData, dob: selectedDate });
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Default submission rokega, par native validation activate hogi
    setLocalErrorMessage('');
    setLoading(true);
    
    setTimeout(() => {
      setLoading(false);
      const registeredUsers = JSON.parse(localStorage.getItem('devsync_global_users')) || [];
      
      const DEFAULT_ADMIN = {
        _id: "usr_vivek_admin",
        email: "vivek@nexus.com",
        password: "Password123",
        name: "Vivek Kumar",
        username: "vivek_alpha",
        age: 21,
        dob: "2005-08-15",
        gender: "Male",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        bio: "Lead Developer of DevSync Engineering Ecosystem Platform."
      };

      if (isLogin) {
        const foundUser = registeredUsers.find(u => u.email === formData.email && u.password === formData.password);
        
        if (formData.email === DEFAULT_ADMIN.email && formData.password === DEFAULT_ADMIN.password) {
          if (showToast) showToast("Authentication successful. Welcome back!", "success");
          onAuthSuccess(DEFAULT_ADMIN);
        } else if (foundUser) {
          if (showToast) showToast(`Welcome back, ${foundUser.name}!`, "success");
          onAuthSuccess(foundUser);
        } else {
          setLocalErrorMessage("Account does not exist or password mismatch.");
        }
      } else {
        const duplicateCheck = registeredUsers.some(u => u.email === formData.email || u.username === formData.username);
        if (formData.email === DEFAULT_ADMIN.email || duplicateCheck) {
          setLocalErrorMessage("This handle node or email is already registered.");
          return;
        }

        const cleanUsername = formData.username.toLowerCase().replace(/\s+/g, '_');
        const newUserObj = {
          _id: `usr_${Date.now()}`,
          name: formData.name,
          username: cleanUsername,
          email: formData.email,
          password: formData.password,
          age: formData.age,
          dob: formData.dob,
          gender: formData.gender,
          avatar: formData.avatar.trim() || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
          bio: "Active DevSync Community Member Node."
        };

        registeredUsers.push(newUserObj);
        localStorage.setItem('devsync_global_users', JSON.stringify(registeredUsers));

        if (showToast) showToast("Identity registered successfully. Token deployed.", "success");
        onAuthSuccess(newUserObj);
      }
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md overflow-y-auto">
      <div className="glass-panel w-full max-w-md rounded-3xl p-8 relative border border-white/10 shadow-2xl my-8 animate-in fade-in zoom-in-95 duration-200 bg-[#07080E]">
        <button type="button" onClick={onClose} className="absolute top-6 right-6 p-1.5 rounded-xl border border-gray-800 text-gray-400 hover:text-white transition-colors z-10 cursor-pointer">
          <X size={16} />
        </button>

        <div className="text-center mb-6">
          <h2 className="text-2xl font-extrabold tracking-tight flex items-center justify-center gap-2 text-white">
            <Sparkles className="text-indigo-500" size={20} /> {isLogin ? 'Sign In to DevSync' : 'Create Your Account'}
          </h2>
        </div>

        {localErrorMessage && (
          <div className="mb-5 p-4 bg-rose-500/10 border border-rose-500/30 rounded-2xl flex items-center gap-3 text-xs font-bold text-rose-400 tracking-wide shadow-md shadow-rose-950/10 animate-in slide-in-from-top-2 duration-200">
            <AlertCircle size={18} className="text-rose-400 flex-shrink-0" />
            <span>{localErrorMessage}</span>
          </div>
        )}

        {/* 🔥 FIX: Removed 'noValidate' so browser's native Validation works */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="relative">
                <User className="absolute left-4 top-3.5 text-gray-500" size={18} />
                <input type="text" placeholder="Full Name" required className="w-full bg-[#0E101C] border border-gray-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:invalid:border-rose-500 text-white" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
              </div>
              <div className="relative">
                <AtSign className="absolute left-4 top-3.5 text-gray-500" size={18} />
                <input type="text" placeholder="Unique Username (e.g. vivek_99)" required className="w-full bg-[#0E101C] border border-gray-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:invalid:border-rose-500 text-white" value={formData.username} onChange={e => setFormData({...formData, username: e.target.value})} />
              </div>
              <div className="relative">
                <Link2 className="absolute left-4 top-3.5 text-gray-500" size={18} />
                <input type="text" placeholder="Profile Image Link URL (Optional)" className="w-full bg-[#0E101C] border border-gray-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500 text-white" value={formData.avatar} onChange={e => setFormData({...formData, avatar: e.target.value})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="relative">
                  <Calendar className="absolute left-4 top-3.5 text-gray-500" size={18} />
                  <input type="date" max={currentMaxYearLimit} required className="w-full bg-[#0E101C] border border-gray-800 rounded-2xl py-3.5 pl-12 pr-4 text-xs focus:outline-none focus:border-indigo-500 focus:invalid:border-rose-500 text-gray-400 font-medium" value={formData.dob} onChange={handleDateChangeWithStrictLimit} />
                </div>
                <div className="relative">
                  <HelpCircle className="absolute left-4 top-3.5 text-gray-500" size={18} />
                  <input type="number" placeholder="Your Age" min="13" max="120" required className="w-full bg-[#0E101C] border border-gray-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:invalid:border-rose-500 text-white" value={formData.age} onChange={e => setFormData({...formData, age: e.target.value})} />
                </div>
              </div>
              <div className="relative">
                <select className="w-full bg-[#0E101C] border border-gray-800 rounded-2xl py-3.5 px-4 text-sm focus:outline-none focus:border-indigo-500 text-gray-400 font-medium appearance-none" value={formData.gender} onChange={e => setFormData({...formData, gender: e.target.value})}>
                  <option value="Male">Gender: Male</option>
                  <option value="Female">Gender: Female</option>
                  <option value="Non-Binary">Gender: Non-Binary</option>
                </select>
              </div>
            </>
          )}

          <div className="relative">
            <Mail className="absolute left-4 top-3.5 text-gray-500" size={18} />
            <input type="email" placeholder="Email Address" required className="w-full bg-[#0E101C] border border-gray-800 rounded-2xl py-3.5 pl-12 pr-4 text-sm focus:outline-none focus:border-indigo-500 focus:invalid:border-rose-500 text-white" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
          </div>
          
          <div className="relative">
            <Lock className="absolute left-4 top-3.5 text-gray-500" size={18} />
            <input type={showPassword ? "text" : "password"} placeholder="Account Password" required className="w-full bg-[#0E101C] border border-gray-800 rounded-2xl py-3.5 pl-12 pr-12 text-sm focus:outline-none focus:border-indigo-500 focus:invalid:border-rose-500 text-white" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-3.5 text-gray-500 hover:text-gray-300 cursor-pointer">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button type="submit" disabled={loading} className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 font-extrabold text-sm text-white hover:opacity-90 active:scale-98 transition-all cursor-pointer">
            {loading ? 'Processing network verification...' : isLogin ? 'Sign In' : 'Register Account'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-5 font-medium">
          {isLogin ? "New to DevSync?" : "Already have an account?"}{' '}
          <button onClick={() => { setIsLogin(!isLogin); setLocalErrorMessage(''); }} className="text-indigo-400 hover:underline font-bold ml-1 cursor-pointer">{isLogin ? 'Create an Account' : 'Sign In'}</button>
        </p>
      </div>
    </div>
  );
}

