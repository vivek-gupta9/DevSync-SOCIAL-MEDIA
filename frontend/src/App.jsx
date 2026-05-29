import React, { useState, useEffect } from 'react';
import LandingPage from './pages/LandingPage';
import HomeFeed from './pages/HomeFeed';
import { CheckCircle, LogOut, AlertTriangle, RefreshCw } from 'lucide-react';


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  handleReset = () => {
    localStorage.clear(); // Wipes corrupted data
    window.location.href = "/"; // Reloads fresh app
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#07080E] flex flex-col items-center justify-center p-6 text-center z-50 relative">
          <AlertTriangle size={64} className="text-rose-500 mb-6 animate-pulse" />
          <h1 className="text-2xl font-extrabold text-white mb-2">System Data Crash Prevented</h1>
          <p className="text-gray-400 text-sm max-w-md mb-8 leading-relaxed">
            Your browser's memory contains corrupted data from an old deleted account or chat, which caused the blank screen. Click below to deep-clean the cache and fix the app instantly.
          </p>
          <button onClick={this.handleReset} className="flex items-center gap-2 bg-rose-600 hover:bg-rose-500 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-rose-900/30 cursor-pointer">
            <RefreshCw size={18} /> Fix & Restart App
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const activeSessionString = localStorage.getItem('devsync_active_session');
      if (!activeSessionString) return null;
      const parsedSessionObject = JSON.parse(activeSessionString);
      if (parsedSessionObject && parsedSessionObject._id) return parsedSessionObject;
      return null;
    } catch (e) {
      localStorage.removeItem('devsync_active_session');
      return null;
    }
  });

  const [flash, setFlash] = useState(null);

  const triggerFlash = (msg, type) => {
    setFlash({ text: msg, type });
    setTimeout(() => setFlash(null), 5000);
  };

  const handleAuthSuccess = (authenticatedUser) => {
    if (!authenticatedUser || !authenticatedUser._id) return;
    setUser(authenticatedUser);
    localStorage.setItem('devsync_active_session', JSON.stringify(authenticatedUser));
    triggerFlash(`Login Successful! Welcome, ${authenticatedUser.name}`, 'login');
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('devsync_active_session');
    triggerFlash("Logged out successfully. See you soon!", 'logout');
  };

  return (
    <ErrorBoundary>
      <div className="bg-[#07080E] min-h-screen text-gray-200 antialiased selection:bg-indigo-500/30 selection:text-white relative">
        {flash && (
          <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[100] bg-[#0E101C]/90 backdrop-blur-xl border border-white/10 text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 animate-in slide-in-from-top-5 fade-in duration-300 min-w-max">
            {flash.type === 'login' ? <CheckCircle className="text-emerald-400" size={18} /> : <LogOut className="text-rose-400" size={18} />}
            <span className="text-[11px] font-extrabold tracking-wide uppercase">{flash.text}</span>
          </div>
        )}
        {user && user._id ? <HomeFeed user={user} onLogout={handleLogout} /> : <LandingPage onAuthSuccess={handleAuthSuccess} />}
      </div>
    </ErrorBoundary>
  );
}