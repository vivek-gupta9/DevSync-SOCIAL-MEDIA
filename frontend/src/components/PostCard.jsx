import React, { useState } from 'react';
import { Heart, MessageSquare, CornerDownRight, Edit2, Trash2, Check, X, Smile, UserPlus, UserMinus, Bookmark } from 'lucide-react';

export default function PostCard({ post, currentUser, allUsers, followedUsersList, isSaved, onUserClick, onPostDelete, onPostEdit, onLikeToggle, onCommentAdd, onFollowToggle, onSaveToggle }) {
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [showStickerPicker, setShowStickerPicker] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(post?.content || '');

  // Bulletproof safety check to prevent ghost post crashes
  if (!post || !post.user || !post.user._id) return null;

  const safeAllUsers = Array.isArray(allUsers) ? allUsers : [];
  const latestUser = safeAllUsers.find(u => u && u._id === post.user._id) || post.user;
  const isOwnPost = latestUser._id === currentUser._id;
  const safeFollowingList = Array.isArray(followedUsersList) ? followedUsersList : [];
  const isFollowing = safeFollowingList.includes(latestUser._id) || false;
  
  const safeLikes = Array.isArray(post.likes) ? post.likes : [];
  const liked = safeLikes.includes(currentUser._id) || false;
  const likesCount = safeLikes.length;
  
  const comments = Array.isArray(post.comments) ? post.comments : [];

  const STICKER_PACK = [
    { id: 'st1', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/512.webp', label: 'Rocket Build' },
    { id: 'st2', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.webp', label: 'Fire Code' },
    { id: 'st3', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f4a9/512.webp', label: 'Bug Trash' },
    { id: 'st4', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/2615/512.webp', label: 'Coffee Engine' }
  ];

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    const commentObject = { user: { _id: currentUser._id, name: currentUser.name, username: currentUser.username, avatar: currentUser.avatar }, text: newComment, sticker: null, createdAt: new Date().toISOString() };
    onCommentAdd(post._id, commentObject);
    setNewComment('');
  };

  const saveEdit = () => {
    if (!editContent.trim()) return;
    onPostEdit(post._id, editContent);
    setIsEditing(false);
  };

  return (
    <div className="glass-card rounded-3xl p-5 sm:p-6 border border-white/5 mb-5 flex flex-col bg-[#0F111C]/10">
      <div className="flex items-center justify-between mb-4">
        <div onClick={() => onUserClick(latestUser)} className="flex items-center gap-3 cursor-pointer group">
          <img src={latestUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} alt="Avatar" className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/10 group-hover:ring-indigo-500/50 transition-all" />
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-extrabold text-white leading-tight group-hover:text-indigo-400 transition-colors">{latestUser.name || 'Unknown Node'}</h3>
              {latestUser.username && <span className="text-[10px] font-bold text-gray-500">@{latestUser.username}</span>}
            </div>
            <span className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-0.5 block">Community Node</span>
          </div>
        </div>
        
        {isOwnPost ? (
          <div className="flex gap-1">
            {!isEditing ? (
              <>
                <button type="button" onClick={() => setIsEditing(true)} className="p-2 rounded-xl bg-[#0E101C] border border-gray-800 text-gray-400 hover:text-indigo-400 transition-all"><Edit2 size={13} /></button>
                <button type="button" onClick={() => onPostDelete(post._id)} className="p-2 rounded-xl bg-[#0E101C] border border-gray-800 text-gray-400 hover:text-rose-400 transition-all"><Trash2 size={13} /></button>
              </>
            ) : (
              <>
                <button type="button" onClick={saveEdit} className="p-2 rounded-xl bg-emerald-950/30 border border-emerald-900/50 text-emerald-400 hover:text-emerald-300 transition-all"><Check size={13} /></button>
                <button type="button" onClick={() => { setIsEditing(false); setEditContent(post.content || ''); }} className="p-2 rounded-xl bg-rose-950/30 border border-rose-900/50 text-rose-400 hover:text-rose-300 transition-all"><X size={13} /></button>
              </>
            )}
          </div>
        ) : (
          <button 
            type="button"
            onClick={() => onFollowToggle(latestUser)} 
            className={`px-3 py-1.5 rounded-xl text-[10px] font-extrabold uppercase tracking-wider transition-all flex items-center gap-1.5 ${
              isFollowing ? 'bg-[#141625] text-gray-400 border border-gray-800 hover:border-rose-900/50 hover:text-rose-400' : 'bg-indigo-600 text-white shadow-md hover:bg-indigo-500'
            }`}
          >
            {isFollowing ? <><UserMinus size={13} /> Unfollow</> : <><UserPlus size={13} /> Follow</>}
          </button>
        )}
      </div>

      {isEditing ? (
        <textarea className="w-full bg-[#0E101C] border border-indigo-500/30 rounded-xl p-3 text-sm text-gray-200 focus:outline-none font-medium resize-none mb-3" value={editContent} onChange={e => setEditContent(e.target.value)} rows={3} />
      ) : (
        <p className="text-sm text-gray-300 font-medium leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>
      )}

      {post.image && (
        <div className="relative rounded-2xl overflow-hidden mb-4 border border-white/5 max-h-[400px]">
          <img src={post.image} alt="Post Attachment" className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex items-center justify-between border-t border-gray-900/50 pt-4 mt-2">
        <div className="flex items-center gap-6 text-gray-500">
          <button type="button" onClick={() => onLikeToggle(post._id)} className={`flex items-center gap-2 text-xs font-bold transition-colors group ${liked ? 'text-rose-500' : 'hover:text-rose-400'}`}>
            <Heart size={16} className={`transition-transform group-active:scale-125 ${liked ? 'fill-rose-500 text-rose-500' : ''}`} />
            <span>{likesCount} Likes</span>
          </button>
          <button type="button" onClick={() => setShowComments(!showComments)} className={`flex items-center gap-2 text-xs font-bold transition-colors ${showComments ? 'text-indigo-400' : 'hover:text-indigo-400'}`}>
            <MessageSquare size={16} />
            <span>{comments.length} Comments</span>
          </button>
        </div>
        <button type="button" onClick={() => onSaveToggle(post._id)} className={`flex items-center gap-2 text-xs font-bold transition-colors active:scale-95 ${isSaved ? 'text-amber-400' : 'text-gray-500 hover:text-amber-400'}`}>
          <Bookmark size={16} className={isSaved ? 'fill-amber-400' : ''} />
        </button>
      </div>

      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-900/60 space-y-4">
          <div className="relative">
            <form onSubmit={handleAddComment} className="flex gap-2">
              <button type="button" onClick={() => setShowStickerPicker(!showStickerPicker)} className={`p-2.5 rounded-xl border transition-all cursor-pointer flex-shrink-0 ${showStickerPicker ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 'bg-[#0E101C] border-gray-800 text-gray-500 hover:text-gray-300'}`}><Smile size={16} /></button>
              <input type="text" placeholder="Write a comment..." className="flex-1 bg-[#0E101C] border border-gray-800 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-none focus:border-indigo-500 text-gray-200" value={newComment} onChange={e => setNewComment(e.target.value)} />
              <button type="submit" disabled={!newComment.trim()} className="px-4 py-2 rounded-xl bg-indigo-600 disabled:bg-gray-900 text-white disabled:text-gray-500 font-bold text-xs transition-all cursor-pointer flex-shrink-0">Reply</button>
            </form>

            {showStickerPicker && (
              <div className="absolute bottom-12 left-0 z-50 glass-panel border border-white/10 rounded-2xl p-3 shadow-2xl grid grid-cols-4 gap-2 w-52 bg-[#090A11]">
                {STICKER_PACK.map(st => (
                  <img key={st.id} src={st.url} alt={st.label} onClick={() => { onCommentAdd(post._id, { user: { _id: currentUser._id, name: currentUser.name, username: currentUser.username, avatar: currentUser.avatar }, text: null, sticker: st.url, createdAt: new Date().toISOString() }); setShowStickerPicker(false); }} className="h-10 w-10 object-contain hover:scale-110 active:scale-95 transition-transform cursor-pointer" />
                ))}
              </div>
            )}
          </div>

          {comments.length > 0 && (
            <div className="space-y-3 pl-2">
              {comments.map((cmt, cIndex) => {
                if (!cmt || !cmt.user) return null;
                const commenterObj = cmt.user;
                const latestCommenter = safeAllUsers.find(u => u && u._id === commenterObj._id) || commenterObj;

                return (
                  <div key={cIndex} className="flex items-start gap-2.5 text-xs animate-in slide-in-from-top-2">
                    <CornerDownRight size={14} className="text-gray-700 mt-1 flex-shrink-0" />
                    <img src={latestCommenter.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} alt="Commenter" onClick={() => onUserClick(latestCommenter)} className="h-6 w-6 rounded-md object-cover mt-0.5 cursor-pointer ring-1 ring-white/10 hover:ring-indigo-500/60 transition-all flex-shrink-0" />
                    <div className="bg-[#0A0C14] border border-white/5 rounded-2xl p-3 flex-1 max-w-xs overflow-hidden">
                      <span onClick={() => onUserClick(latestCommenter)} className="font-extrabold text-white block mb-0.5 cursor-pointer hover:text-indigo-400 transition-colors truncate">{latestCommenter.name || 'Unknown Node'}</span>
                      {cmt.text && <p className="text-gray-400 font-medium leading-relaxed break-words">{cmt.text}</p>}
                      {cmt.sticker && <img src={cmt.sticker} alt="Sticker Comment" className="h-16 w-16 object-contain mt-1" />}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}