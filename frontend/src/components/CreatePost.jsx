import React, { useState, useRef } from 'react';
import { Image, Video, Link, Smile, Send, X } from 'lucide-react';

export default function CreatePost({ currentUser, onPostCreated, showToast }) {
  const [content, setContent] = useState('');
  const [attachedImage, setAttachedImage] = useState(null);
  const [showStickerBox, setShowStickerBox] = useState(false);

  const imageInputRef = useRef(null);
  const videoInputRef = useRef(null);

  const WHATSAPP_STICKERS = [
    { id: 'ws1', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/512.webp', label: 'Rocket Build' },
    { id: 'ws2', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.webp', label: 'Fire System' },
    { id: 'ws3', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f4bb/512.webp', label: 'Laptop Node' },
    { id: 'ws4', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/2615/512.webp', label: 'Coffee Loop' },
    { id: 'ws5', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f4a9/512.webp', label: 'Trash Bug' }
  ];

  const handleMediaUpload = (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      setAttachedImage(reader.result);
      if (showToast) showToast(`${type} file loaded successfully.`, "success");
    };
    reader.readAsDataURL(file);
  };

  const handleSubmitPost = (e) => {
    e.preventDefault();
    if (!content.trim() && !attachedImage) return;

    onPostCreated({
      content: content.trim() ? content : "Posted an update.",
      image: attachedImage,
      sticker: null
    });

    setContent('');
    setAttachedImage(null);
    setShowStickerBox(false);
  };

  const handleDirectStickerDispatch = (stickerUrl) => {
    onPostCreated({
      content: "Shared a sticker.",
      image: null,
      sticker: stickerUrl
    });
    setShowStickerBox(false);
    if (showToast) showToast("Sticker published successfully.", "success");
  };

  const handleLinkInsertionTrigger = () => {
    const inputUrl = prompt("Enter website link URL:");
    if (inputUrl) {
      setContent(prev => prev + ` [Link: ${inputUrl}] `);
    }
  };

  const activeAvatar = currentUser?.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150";

  return (
    <div className="glass-card p-6 rounded-3xl border border-white/5 mb-6 relative bg-[#0F111C]/5">
      <form onSubmit={handleSubmitPost}>
        <div className="flex gap-4">
          <img src={activeAvatar} alt="My Avatar" className="h-11 w-11 rounded-xl object-cover ring-1 ring-white/10" />
          <div className="flex-1">
            <textarea 
              placeholder="What's on your mind? Share a project update..." 
              rows={2} 
              className="w-full bg-transparent border-none text-sm font-medium placeholder:text-gray-600 focus:outline-none resize-none mt-1 text-white" 
              value={content} 
              onChange={e => setContent(e.target.value)} 
            />
            
            <input type="file" accept="image/*" className="hidden" ref={imageInputRef} onChange={(e) => handleMediaUpload(e, "Image")} />
            <input type="file" accept="video/*" className="hidden" ref={videoInputRef} onChange={(e) => handleMediaUpload(e, "Video")} />

            {attachedImage && (
              <div className="relative rounded-2xl overflow-hidden mt-3 max-h-48 border border-white/10 group">
                <img src={attachedImage} alt="Attachment preview" className="w-full h-full object-cover" />
                <button 
                  type="button" 
                  onClick={() => setAttachedImage(null)} 
                  className="absolute top-3 right-3 p-1.5 rounded-xl bg-black/70 border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer shadow-lg"
                >
                  <X size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between border-t border-gray-900/50 pt-4 mt-4 relative">
          <div className="flex gap-1">
            <button type="button" onClick={() => { imageInputRef.current.click(); setShowStickerBox(false); }} className="p-2.5 rounded-xl text-gray-500 hover:text-indigo-400 hover:bg-gray-900/40 transition-all cursor-pointer"><Image size={18} /></button>
            <button type="button" onClick={() => { videoInputRef.current.click(); setShowStickerBox(false); }} className="p-2.5 rounded-xl text-gray-500 hover:text-indigo-400 hover:bg-gray-900/40 transition-all cursor-pointer"><Video size={18} /></button>
            <button type="button" onClick={handleLinkInsertionTrigger} className="p-2.5 rounded-xl text-gray-500 hover:text-indigo-400 hover:bg-gray-900/40 transition-all cursor-pointer"><Link size={18} /></button>
            <button type="button" onClick={() => setShowStickerBox(!showStickerBox)} className={`p-2.5 rounded-xl border transition-all cursor-pointer ${showStickerBox ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 'border-transparent text-gray-500 hover:text-indigo-400 hover:bg-gray-900/40'}`}><Smile size={18} /></button>
          </div>

          <button 
            type="submit" 
            disabled={!content.trim() && !attachedImage} 
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 text-xs font-extrabold flex items-center gap-2 transition-all active:scale-95 text-white shadow-md cursor-pointer"
          >
            Publish Post <Send size={12} />
          </button>

          {showStickerBox && (
            <div className="absolute bottom-14 left-0 z-50 glass-panel border border-white/10 rounded-2xl p-3 shadow-2xl grid grid-cols-5 gap-3 w-64 bg-[#090A11]">
              {WHATSAPP_STICKERS.map(st => (
                <img key={st.id} src={st.url} alt={st.label} onClick={() => handleDirectStickerDispatch(st.url)} className="h-10 w-10 object-contain hover:scale-110 active:scale-95 transition-transform cursor-pointer" />
              ))}
            </div>
          )}
        </div>
      </form>
    </div>
  );
}