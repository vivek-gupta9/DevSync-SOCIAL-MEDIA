import React, { useState, useEffect, useRef } from 'react';
import { X, Send, ShieldAlert } from 'lucide-react';

export default function LiveChatBox({ targetUser, onClose, onNewMessageSent }) {
  const [chatLog, setChatLog] = useState([
    { sender: 'them', text: `Hey! I saw your recent code metrics deployment. Let's sync up.` }
  ]);
  const [typedMsg, setTypedMsg] = useState('');
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatLog]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!typedMsg.trim()) return;

    const myMessage = { sender: 'me', text: typedMsg };
    setChatLog(prev => [...prev, myMessage]);
    setTypedMsg('');

    // Triggering dynamic simulated reply from the node
    setTimeout(() => {
      setChatLog(prev => [...prev, {
        sender: 'them',
        text: `Acknowledged. Data pipeline packet received perfectly.`
      }]);
      onNewMessageSent(targetUser.name);
    }, 1500);
  };

  return (
    <div class="fixed bottom-0 right-6 w-80 glass-panel border border-indigo-500/20 rounded-t-3xl shadow-2xl z-50 animate-in slide-in-from-bottom-10 duration-300">
      {/* Active Chat Header */}
      <div class="p-4 border-b border-white/5 flex items-center justify-between bg-gradient-to-r from-indigo-950/40 to-purple-950/40 rounded-t-3xl">
        <div class="flex items-center gap-2.5">
          <img src={targetUser.avatar} alt="User Avatar" class="h-7 w-7 rounded-lg object-cover ring-1 ring-indigo-500/30" />
          <div>
            <h4 class="text-xs font-extrabold text-white">{targetUser.name}</h4>
            <span class="text-[9px] font-bold text-emerald-400 flex items-center gap-1 uppercase tracking-wider">
              <span class="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" /> Node Sync
            </span>
          </div>
        </div>
        <button onClick={onClose} class="text-gray-400 hover:text-white p-1 rounded-lg transition-colors">
          <X size={14} />
        </button>
      </div>

      {/* Messages Stream Content */}
      <div class="p-4 h-64 overflow-y-auto space-y-3 bg-[#080911]/80 custom-scroll text-xs">
        {chatLog.map((msg, index) => (
          <div key={index} class={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}>
            <div class={`max-w-[80%] rounded-2xl p-3 leading-relaxed font-medium ${
              msg.sender === 'me'
                ? 'bg-indigo-600 text-white rounded-br-none'
                : 'bg-[#141728] text-gray-300 rounded-bl-none border border-white/5'
            }`}>
              {msg.text}
            </div>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Field Form Control */}
      <form onSubmit={handleSendMessage} class="p-3 border-t border-white/5 bg-[#0A0C16] flex gap-2">
        <input 
          type="text" 
          placeholder="Send sync data packet..." 
          class="flex-1 bg-[#111322] border border-gray-800 rounded-xl px-3 py-2 text-xs font-medium focus:outline-none focus:border-indigo-500 text-white placeholder:text-gray-600"
          value={typedMsg}
          onChange={e => setTypedMsg(e.target.value)}
        />
        <button type="submit" class="p-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white transition-all active:scale-95">
          <Send size={12} />
        </button>
      </form>
    </div>
  );
}