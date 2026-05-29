// import React, { useState } from 'react';
// import { Shield, Zap, Sparkles, Globe, ArrowRight } from 'lucide-react';
// import AuthModal from '../components/AuthModal';
// import Toast from '../components/Toast';

// export default function LandingPage({ onAuthSuccess }) {
//   const [isAuthOpen, setIsAuthOpen] = useState(false);
//   const [authMode, setAuthMode] = useState('login');
//   const [toast, setToast] = useState(null);

//   const openAuth = (mode) => {
//     setAuthMode(mode);
//     setIsAuthOpen(true);
//   };

//   const showToast = (message, type = 'success') => {
//     setToast({ message, type });
//   };

//   return (
//     <div class="relative min-h-screen overflow-hidden bg-[#07080E]">
//       {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
//       <div class="absolute -top-[20%] -left-[10%] h-[600px] w-[600px] rounded-full bg-gradient-to-tr from-indigo-600/20 to-purple-600/0 blur-[140px]" />
//       <div class="absolute top-[40%] -right-[10%] h-[500px] w-[500px] rounded-full bg-gradient-to-br from-emerald-500/10 to-cyan-500/0 blur-[130px]" />

//       <header class="glass-panel sticky top-0 z-40 w-full px-6 py-4 lg:px-16 flex items-center justify-between">
//         <div class="flex items-center gap-2">
//           <div class="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
//             <span class="text-white font-extrabold text-lg">D</span>
//           </div>
//           <span class="text-xl font-extrabold tracking-wider bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">DevSync</span>
//         </div>
//         <div class="flex gap-4">
//           <button onClick={() => openAuth('login')} class="text-sm font-semibold text-gray-300 hover:text-white transition-colors cursor-pointer">Sign In</button>
//           <button onClick={() => openAuth('signup')} class="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all active:scale-95 cursor-pointer text-white">Get Started</button>
//         </div>
//       </header>

//       <main class="relative z-10 max-w-7xl mx-auto px-6 pt-20 pb-16 text-center lg:pt-32">
//         <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/5 text-xs font-bold text-indigo-400 uppercase tracking-widest mb-6 shadow-sm shadow-indigo-500/5">
//           <Sparkles size={14} /> The Next Evolution of Social Media
//         </div>
        
//         <h1 class="text-5xl md:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1] mb-8 text-white">
//           Where <span class="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">Creators & Developers</span> Connect Globally.
//         </h1>

//         <p class="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed font-light">
//           Share your build metrics, code systems, and aesthetic visuals on an ultra-responsive interface designed for production minds.
//         </p>

//         <div class="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24">
//           <button onClick={() => openAuth('signup')} class="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-base font-extrabold shadow-xl shadow-indigo-500/20 transition-all flex items-center justify-center gap-2 group active:scale-98 cursor-pointer text-white">
//             Create Free Account <ArrowRight size={18} class="group-hover:translate-x-1 transition-transform" />
//           </button>
//         </div>
//       </main>

//       {isAuthOpen && <AuthModal mode={authMode} onClose={() => setIsAuthOpen(false)} onAuthSuccess={onAuthSuccess} showToast={showToast} />}
//     </div>
//   );
// }







import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, Code, Zap, Shield } from 'lucide-react';
import AuthModal from '../components/AuthModal';
import Toast from '../components/Toast';

export default function LandingPage({ onAuthSuccess }) {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [toast, setToast] = useState(null);
  
  const [text, setText] = useState('');
  const fullText = "Hello! I'm Vivek. Welcome to DevSync—built for building, sharing, and connecting code systems.";
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const handleTyping = () => {
      const currentText = isDeleting 
        ? fullText.substring(0, text.length - 1) 
        : fullText.substring(0, text.length + 1);
      setText(currentText);
      if (!isDeleting && currentText === fullText) setTimeout(() => setIsDeleting(true), 2000);
      else if (isDeleting && currentText === "") { setIsDeleting(false); }
    };
    const timer = setTimeout(handleTyping, isDeleting ? 30 : 60);
    return () => clearTimeout(timer);
  }, [text, isDeleting]);

  const openAuth = (mode) => { setAuthMode(mode); setIsAuthOpen(true); };
  const showToast = (message, type = 'success') => { setToast({ message, type }); };

  return (
    <div className="relative min-h-screen bg-[#07080E] text-gray-200">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* Header - ORIGINAL COLORS MAINTAINED */}
      <header className="fixed top-0 w-full z-50 px-6 py-4 lg:px-16 flex items-center justify-between bg-[#07080E]/80 backdrop-blur-lg border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20">
            <span className="text-white font-extrabold text-lg">D</span>
          </div>
          <span className="text-xl font-extrabold tracking-wider text-white">DevSync</span>
        </div>
        <div className="flex gap-4">
          <button onClick={() => openAuth('login')} className="text-sm font-semibold text-gray-300 hover:text-white transition-all cursor-pointer">Sign In</button>
          {/* Button color kept original */}
          <button onClick={() => openAuth('signup')} className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-sm font-bold text-white transition-all cursor-pointer">Get Started</button>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-24 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] font-bold text-gray-300 uppercase tracking-widest mb-8">
          <Sparkles size={14} className="text-indigo-400" /> Powered by Vivek's Terminal
        </div>
        
        <h1 className="text-5xl md:text-8xl font-extrabold tracking-tight max-w-5xl mx-auto leading-[1] mb-8 text-white">
          Where <span className="text-indigo-500">Creators</span> & <span className="text-purple-500">Developers</span> Connect.
        </h1>

        {/* Typing Effect - Vivek's personal branding */}
        <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto mb-12 leading-relaxed font-mono h-24">
          {text}<span className="animate-pulse text-indigo-400">|</span>
        </p>

        <button onClick={() => openAuth('signup')} className="px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold shadow-2xl shadow-indigo-500/20 transition-all flex items-center gap-2 mx-auto active:scale-95">
          Create Free Account <ArrowRight size={18} />
        </button>
      </main>

      {isAuthOpen && <AuthModal mode={authMode} onClose={() => setIsAuthOpen(false)} onAuthSuccess={onAuthSuccess} showToast={showToast} />}
    </div>
  );
}
