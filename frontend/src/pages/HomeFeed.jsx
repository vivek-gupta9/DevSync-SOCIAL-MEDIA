import DeleteAccountModal from '../components/DeleteAccountModal';

import React, { useState, useRef, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import CreatePost from '../components/CreatePost';
import PostCard from '../components/PostCard';
import EditProfileModal from '../components/EditProfileModal';
import Toast from '../components/Toast';
import { TrendingUp, MessageSquare, Send, Settings, Image as ImageIcon, Smile, X, Mail, Users, Layers, MoreVertical, Trash2, History, ChevronLeft, ChevronRight, Home, Compass, Bell, User, Power, Search, Bookmark, PlusCircle, AlertCircle } from 'lucide-react';

export default function HomeFeed({ user: initialUser, onLogout }) {
  const safeUser = initialUser || { _id: "usr_default", name: "Guest", username: "guest_user", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150", bio: "" };
  const [user, setUser] = useState(safeUser);
  const [activeTab, setActiveTab] = useState('home');
  const [viewedProfile, setViewedProfile] = useState(null);
  const [toast, setToast] = useState(null);
  
  const [selectedMessageUser, setSelectedMessageUser] = useState(null);
  const [typedMessagePacket, setTypedMessagePacket] = useState('');
  const [chatSelectedFile, setChatSelectedFile] = useState(null); 
  const [showChatStickers, setShowChatStickers] = useState(false);
  const [showChatMenu, setShowChatMenu] = useState(false);
  const [showNetworkListModal, setShowNetworkListModal] = useState(false);
  const [networkModalTitle, setNetworkModalTitle] = useState('Users List');
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState('');


  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  // SETTINGS & STORIES INTERFACES
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [savedPosts, setSavedPosts] = useState(() => {
    try {
      const cacheBookmarkedData = localStorage.getItem(`devsync_saved_${user._id}`);
      return cacheBookmarkedData ? JSON.parse(cacheBookmarkedData) : [];
    } catch(e) { return []; }
  });
  const [dynamicTrending, setDynamicTrending] = useState([]);
  
  // Real Stories Engine State Setup
  const [activeStoryView, setActiveStoryView] = useState(null);
  const [localStories, setLocalStories] = useState([
    { id: 's2', user: { name: 'Aarav', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' }, image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=500' },
    { id: 's3', user: { name: 'Ananya', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' }, image: 'https://images.unsplash.com/photo-1555099962-4199c345e5dd?w=500' }
  ]);
  const storyUploadRef = useRef(null);

  const chatFileSelectorRef = useRef(null);
  const chatEndRef = useRef(null);

  const GLOBAL_STICKERS = [
    { id: 'st1', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f680/512.webp', label: 'Rocket' },
    { id: 'st2', url: 'https://fonts.gstatic.com/s/e/notoemoji/latest/1f525/512.webp', label: 'Fire' }
  ];

  const getRoomId = (id1, id2) => [id1, id2].sort().join('_');

  const [posts, setPosts] = useState(() => {
    try {
      const savedPosts = localStorage.getItem('devsync_global_posts');
      return savedPosts ? JSON.parse(savedPosts) : [];
    } catch (e) { return []; }
  });

  const [conversations, setConversations] = useState(() => {
    try {
      const savedChats = localStorage.getItem('devsync_global_chats');
      return savedChats ? JSON.parse(savedChats) : {};
    } catch(e) { return {}; }
  });
  
  const [chatClearTimestamps, setChatClearTimestamps] = useState(() => {
    try {
      const cacheClears = localStorage.getItem('devsync_chat_clears');
      return cacheClears ? JSON.parse(cacheClears) : {};
    } catch(e) { return {}; }
  });

  const [hiddenChats, setHiddenChats] = useState(() => {
    try {
      const cacheHidden = localStorage.getItem('devsync_hidden_chats');
      return cacheHidden ? JSON.parse(cacheHidden) : {};
    } catch(e) { return {}; }
  });

  const [unreadCounts, unreadCountsSet] = useState(() => {
    try {
      const cacheUnread = localStorage.getItem('devsync_global_unread_badges');
      return cacheUnread ? JSON.parse(cacheUnread) : {};
    } catch(e) { return {}; }
  });

  const [notifications, setNotifications] = useState(() => {
    try {
      const cacheAlerts = localStorage.getItem('devsync_global_alerts');
      return cacheAlerts ? JSON.parse(cacheAlerts) : [];
    } catch(e) { return []; }
  });

  const [networkUsersDirectory, setNetworkUsersDirectory] = useState([]);

  const updateGlobalDirectoryRecords = () => {
    try {
      const savedUsers = JSON.parse(localStorage.getItem('devsync_global_users')) || [];
      const blueprintMap = new Map();
      savedUsers.forEach(u => {
        if (u && u._id) blueprintMap.set(u._id, { ...u, followers: u.followers || [], following: u.following || [] });
      });
      const structuralDirectoryArray = Array.from(blueprintMap.values());
      setNetworkUsersDirectory(structuralDirectoryArray);
      
      const updatedSelfContext = structuralDirectoryArray.find(u => u._id === user._id);
      if (updatedSelfContext) {
        setUser(updatedSelfContext);
      }
    } catch(e) { setNetworkUsersDirectory([]); }
  };

  useEffect(() => {
    const hashtagCounts = {};
    posts.forEach(p => {
      if (p && p.content) {
        const matches = p.content.match(/#[a-zA-Z0-9_]+/g);
        if (matches) {
          matches.forEach(tag => {
            const cleanTag = tag.toUpperCase();
            hashtagCounts[cleanTag] = (hashtagCounts[cleanTag] || 0) + 1 + (p.likes?.length || 0); 
          });
        }
      }
    });
    const sortedTrends = Object.entries(hashtagCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(entry => entry[0]);
    setDynamicTrending(sortedTrends.length > 0 ? sortedTrends : ['#NEONLOGIC', '#REACTJS', '#CODING']);
  }, [posts]);

  useEffect(() => { updateGlobalDirectoryRecords(); }, []);
  
  useEffect(() => { if(posts) localStorage.setItem('devsync_global_posts', JSON.stringify(posts)); }, [posts]);
  useEffect(() => { 
    if(conversations) localStorage.setItem('devsync_global_chats', JSON.stringify(conversations)); 
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }); 
  }, [conversations]);
  useEffect(() => { localStorage.setItem('devsync_chat_clears', JSON.stringify(chatClearTimestamps)); }, [chatClearTimestamps]);
  useEffect(() => { localStorage.setItem('devsync_hidden_chats', JSON.stringify(hiddenChats)); }, [hiddenChats]);
  useEffect(() => { localStorage.setItem('devsync_global_unread_badges', JSON.stringify(unreadCounts)); }, [unreadCounts]);
  useEffect(() => { localStorage.setItem('devsync_global_alerts', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem(`devsync_saved_${user._id}`, JSON.stringify(savedPosts)); }, [savedPosts, user._id]);

  useEffect(() => {
    setShowChatMenu(false);
    if (selectedMessageUser) {
      const roomId = getRoomId(user._id, selectedMessageUser._id);
      const myUnreadKey = `${roomId}_${user._id}`;
      if (unreadCounts[myUnreadKey]) {
        unreadCountsSet(prev => { const next = { ...prev }; delete next[myUnreadKey]; return next; });
      }
      setTimeout(() => { chatEndRef.current?.scrollIntoView({ behavior: 'instant' }); }, 50);
    }
  }, [selectedMessageUser]);

  const showToast = (message, type = 'success') => { setToast({ message, type }); };

  const handleStoryUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if(reader.result) {
        const newStory = { id: `s_${Date.now()}`, user: { name: user.name, avatar: user.avatar, _id: user._id }, image: reader.result };
        setLocalStories([newStory, ...localStories]);
        showToast("Story uploaded successfully!", "success");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfileConfiguration = (updatedConfig) => {
    try {
      const rawUsers = localStorage.getItem('devsync_global_users');
      const storedUsers = rawUsers ? JSON.parse(rawUsers) : [];
      if(!Array.isArray(storedUsers)) return;

      const freshUserObj = { ...user, ...updatedConfig };
      const updatedStoredList = storedUsers.map(u => u && u._id === user._id ? freshUserObj : u).filter(Boolean);
      if (!updatedStoredList.some(u => u._id === user._id)) updatedStoredList.push(freshUserObj);

      localStorage.setItem('devsync_global_users', JSON.stringify(updatedStoredList));
      localStorage.setItem('devsync_active_session', JSON.stringify(freshUserObj));
      
      setUser(freshUserObj);
      setNetworkUsersDirectory(updatedStoredList);

      setPosts(prevPosts => prevPosts.map(p => {
        if (p && p.user && p.user._id === user._id) {
          return { ...p, user: { ...p.user, name: freshUserObj.name, avatar: freshUserObj.avatar, username: freshUserObj.username } };
        }
        return p;
      }));
      
      showToast("Profile configurations updated globally!", "success");
    } catch(e) { showToast("Profile serialization filter error.", "error"); }
    setIsEditModalOpen(false);
  };


const handleConfirmDeleteAccount = (password, reason) => {
    try {
      const targetId = String(user._id);
      const rawUsers = localStorage.getItem('devsync_global_users');
      const storedUsers = rawUsers ? JSON.parse(rawUsers) : [];

      const currentUser = storedUsers.find(u => u && u._id === targetId);
      const isDefaultAdmin = user.email === "vivek@nexus.com";
      
      if (isDefaultAdmin && password !== "Password123") {
        return { success: false, message: "Oops! Incorrect password. Please try again." };
      } else if (!isDefaultAdmin && (!currentUser || currentUser.password !== password)) {
        return { success: false, message: "Oops! Incorrect password. Please try again." };
      }

      console.log(`Account Deleted - Reason: ${reason}`);

      // 🔥 FIX 1: User ko completely remove mat karo, Ghost account mein convert kar do
      if (Array.isArray(storedUsers)) {
        const purgedUsersList = storedUsers.map(u => {
          if (u && u._id === targetId) {
            return {
              ...u,
              name: "DELETED ACCOUNT", // Name change
              email: `deleted_${Date.now()}@nexus.com`, // Fake email to block future logins
              password: `null_${Date.now()}`, // Fake password
              isDeleted: true, // Ghost flag
              followers: [],
              following: [],
              bio: "This account has been permanently deleted.",
              avatar: "https://images.unsplash.com/photo-1594322436404-5a0526db4d13?w=150" // Ghost avatar (optional)
            };
          }
          return { ...u, followers: Array.isArray(u.followers) ? u.followers.filter(id => id !== targetId) : [], following: Array.isArray(u.following) ? u.following.filter(id => id !== targetId) : [] };
        });
        localStorage.setItem('devsync_global_users', JSON.stringify(purgedUsersList));
      }

      // Posts delete rahenge
      const rawPosts = localStorage.getItem('devsync_global_posts');
      const globalPosts = rawPosts ? JSON.parse(rawPosts) : [];
      if (Array.isArray(globalPosts)) {
        const cleanedPosts = globalPosts.filter(p => p && p.user && p.user._id !== targetId).map(p => ({ ...p, likes: Array.isArray(p.likes) ? p.likes.filter(id => id !== targetId) : [], comments: Array.isArray(p.comments) ? p.comments.filter(c => c && c.user && c.user._id !== targetId) : [] }));
        localStorage.setItem('devsync_global_posts', JSON.stringify(cleanedPosts));
        setPosts(cleanedPosts);
      }

      // 🔥 FIX 2: CHAT DELETE WALA LOGIC HATA DIYA GAYA HAI (Chats safe rahengi)

      localStorage.removeItem(`devsync_saved_${targetId}`);
      
      setIsDeleteModalOpen(false);
      setIsSettingsModalOpen(false);
      showToast("ACCOUNT DELETED, SEE YOU SOON!", "success");
      setTimeout(() => { onLogout(); }, 1500);
      
      return { success: true };

    } catch (e) {
      return { success: false, message: "System error. Please try again later." };
    }
  };


  const handleCreatePost = (newPostData) => {
    const freshPost = { _id: `p_own_${Date.now()}`, user: { _id: user._id, name: user.name, username: user.username, avatar: user.avatar }, content: newPostData.content, image: newPostData.image || (newPostData.sticker ? newPostData.sticker : null), isStickerFormat: !!newPostData.sticker, likes: [], comments: [] };
    setPosts([freshPost, ...posts]);
    showToast("Post published successfully.", "success");
  };
  const handlePostDelete = (postId) => { setPosts(posts.filter(p => p && p._id !== postId)); setSavedPosts(prev => prev.filter(id => id !== postId)); showToast("Post deleted permanently.", "error"); };
  const handlePostDeleteByContext = (postId) => { setPosts(posts.filter(p => p && p._id !== postId)); setSavedPosts(prev => prev.filter(id => id !== postId)); };
  const handlePostEdit = (postId, updatedText) => { setPosts(posts.map(p => p && p._id === postId ? { ...p, content: updatedText } : p)); showToast("Post modified successfully.", "success"); };
  

  const handleLikeToggle = (postId) => {
    setPosts(prevPosts => prevPosts.map(p => {
      if (p && p._id === postId) {
        const safeLikes = Array.isArray(p.likes) ? p.likes : [];
        const hasLiked = safeLikes.includes(user._id);
        
        // Like Notification Trigger
        if (!hasLiked && p.user._id !== user._id) {
          setNotifications(prev => [{
            id: `alert_${Date.now()}`,
            recipientId: p.user._id,
            message: `@${user.username} liked your post ❤️`
          }, ...prev]);
        }
        
        return { ...p, likes: hasLiked ? safeLikes.filter(id => id !== user._id) : [...safeLikes, user._id] };
      }
      return p;
    }));
  };
  const handleCommentAdd = (postId, commentObj) => { 
    setPosts(prevPosts => prevPosts.map(p => {
      if(p && p._id === postId) {
        const safeComments = Array.isArray(p.comments) ? p.comments : [];
        return { ...p, comments: [...safeComments, commentObj] };
      }
      return p;
    })); 
  };
  
  const handleSaveToggle = (postId) => {
    if (savedPosts.includes(postId)) {
      setSavedPosts(savedPosts.filter(id => id !== postId));
      showToast("Post removed from saved collection.", "error");
    } else {
      setSavedPosts([...savedPosts, postId]);
      showToast("Post bookmarked securely.", "success");
    }
  };

  const handleUserClick = (targetUser) => {
    // if (!targetUser || !targetUser._id) return;
    if (!targetUser || !targetUser._id || targetUser.isDeleted) return;
    setShowNetworkListModal(false); 
    const verifiedGlobalNode = networkUsersDirectory.find(u => u && (u._id === targetUser._id || u.username === targetUser.username)) || targetUser;
    if (verifiedGlobalNode._id === user._id) { setActiveTab('profile'); setViewedProfile(null); } 
    else { setActiveTab('profile-view'); setViewedProfile({ ...verifiedGlobalNode, followers: verifiedGlobalNode.followers || [], following: verifiedGlobalNode.following || [], bio: verifiedGlobalNode.bio || "Active Node User." }); }
  };

  const handleFollowToggle = (targetUser) => {
    if (!targetUser || !targetUser._id) return;
    try {
      const myNode = networkUsersDirectory.find(u => u && u._id === user._id) || user;
      const targetNode = networkUsersDirectory.find(u => u && u._id === targetUser._id) || targetUser;
      
      let myFollowing = Array.isArray(myNode.following) ? [...myNode.following] : [];
      let targetFollowers = Array.isArray(targetNode.followers) ? [...targetNode.followers] : [];
      const isCurrentlyFollowing = myFollowing.includes(targetNode._id);

      if (isCurrentlyFollowing) {
        myFollowing = myFollowing.filter(id => id !== targetNode._id);
        targetFollowers = targetFollowers.filter(id => id !== myNode._id);
        showToast(`Unfollowed @${targetNode.username}`, "error");
      } else {
        myFollowing.push(targetNode._id);
        targetFollowers.push(myNode._id);
        showToast(`Started following @${targetNode.username}`, "success");
        setNotifications([{ id: `alert_${Date.now()}`, recipientId: targetNode._id, message: `@${user.username} (${user.name}) started following your tech portfolio.` }, ...notifications]);
      }

      const freshDir = networkUsersDirectory.map(u => {
        if (u && u._id === myNode._id) return { ...u, following: myFollowing };
        if (u && u._id === targetNode._id) return { ...u, followers: targetFollowers };
        return u;
      });
      localStorage.setItem('devsync_global_users', JSON.stringify(freshDir));
      setNetworkUsersDirectory(freshDir);
      
      const refreshedSelfContext = freshDir.find(u => u && u._id === user._id);
      if (refreshedSelfContext) { setUser(refreshedSelfContext); localStorage.setItem('devsync_active_session', JSON.stringify(refreshedSelfContext)); }
      const refreshedTargetContext = freshDir.find(u => u && u._id === targetUser._id);
      if (refreshedTargetContext && activeTab === 'profile-view') setViewedProfile(refreshedTargetContext);
    } catch(e) { showToast("Database synchronization pipeline failed.", "error"); }
  };

  const handleChatFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => { 
      if (reader.result) {
        setChatSelectedFile(String(reader.result));
        showToast("Media attachment buffered successfully.", "success"); 
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSendFullPageMessage = (e) => {
    if (e) { e.preventDefault(); e.stopPropagation(); }
    if (!typedMessagePacket.trim() && !chatSelectedFile) return;

    const targetId = selectedMessageUser?._id;
    if(!targetId) return;
    
    const roomId = getRoomId(user._id, targetId);
    const filePayloadString = chatSelectedFile ? String(chatSelectedFile) : null;
    const messageTextPayload = typedMessagePacket.trim() ? String(typedMessagePacket) : null;

    const newPacket = { 
      id: `msg_${Date.now()}`,
      sender: String(user._id), 
      senderUsername: String(user.username),
      text: messageTextPayload, 
      image: filePayloadString, 
      sticker: null,
      timestamp: Date.now()
    };

    try {
      const localDataCacheMap = JSON.parse(localStorage.getItem('devsync_global_chats')) || {};
      const targetRoomCache = Array.isArray(localDataCacheMap[roomId]) ? [...localDataCacheMap[roomId]] : [];
      targetRoomCache.push(newPacket);
      localDataCacheMap[roomId] = targetRoomCache;
      localStorage.setItem('devsync_global_chats', JSON.stringify(localDataCacheMap));

      setConversations({ ...localDataCacheMap });
      setHiddenChats(prev => ({ ...prev, [roomId]: { ...(prev[roomId] || {}), [user._id]: false } }));


      if (String(targetId) !== String(user._id)) {
        const targetUnreadKey = `${roomId}_${targetId}`;
        unreadCountsSet(prev => ({ ...prev, [targetUnreadKey]: (prev[targetUnreadKey] || 0) + 1 }));
      }
    } catch(err) { showToast("Memory mapping bounds failure.", "error"); }

    setTypedMessagePacket(''); setChatSelectedFile(null);
  };

  const handleSendStickerMessage = (stickerUrl) => {
    if(!selectedMessageUser) return;
    const targetId = selectedMessageUser._id;
    const roomId = getRoomId(user._id, targetId);
    const newPacket = { id: `msg_${Date.now()}`, sender: user._id, senderUsername: user.username, text: null, image: null, sticker: stickerUrl, timestamp: Date.now() };
    
    try {
      const localDataCacheMap = JSON.parse(localStorage.getItem('devsync_global_chats')) || {};
      const targetRoomCache = Array.isArray(localDataCacheMap[roomId]) ? [...localDataCacheMap[roomId]] : [];
      targetRoomCache.push(newPacket);
      localDataCacheMap[roomId] = targetRoomCache;
      localStorage.setItem('devsync_global_chats', JSON.stringify(localDataCacheMap));

      setConversations({ ...localDataCacheMap });
      setHiddenChats(prev => ({ ...prev, [roomId]: { ...(prev[roomId] || {}), [user._id]: false } }));
     
      // const targetUnreadKey = `${roomId}_${targetId}`;
      // unreadCountsSet(prev => ({ ...prev, [targetUnreadKey]: (prev[targetUnreadKey] || 0) + 1 }));
    if (String(targetId) !== String(user._id)) {
        const targetUnreadKey = `${roomId}_${targetId}`;
        unreadCountsSet(prev => ({ ...prev, [targetUnreadKey]: (prev[targetUnreadKey] || 0) + 1 }));
      }
    
    } catch(err) {}
    setShowChatStickers(false);
  };

  const handleClearHistory = () => {
    if(!selectedMessageUser) return;
    const roomId = getRoomId(user._id, selectedMessageUser._id);
    setChatClearTimestamps(prev => ({ ...prev, [roomId]: { ...(prev[roomId] || {}), [user._id]: Date.now() } }));
    setShowChatMenu(false); showToast("Chat history cleared. Active status remains.", "success");
  };

  const handleDeleteChat = () => {
    if(!selectedMessageUser) return;
    const roomId = getRoomId(user._id, selectedMessageUser._id);
    setChatClearTimestamps(prev => ({ ...prev, [roomId]: { ...(prev[roomId] || {}), [user._id]: Date.now() } }));
    setHiddenChats(prev => ({ ...prev, [roomId]: { ...(prev[roomId] || {}), [user._id]: true } }));
    setSelectedMessageUser(null); setShowChatMenu(false); showToast("Chat deleted and removed from active list.", "error");
  };

  const handleClearAllNotifications = () => { setNotifications(prev => prev.filter(n => n && n.recipientId !== user._id)); showToast("Notifications cleared successfully.", "error"); };

  const myNode = networkUsersDirectory.find(u => u && u._id === user._id) || user;
  const myFollowingList = Array.isArray(myNode?.following) ? myNode.following : [];
  const ownPosts = posts.filter(p => p && p.user && (p.user._id === user._id || p.user.username === user.username || p.user.name === user.name));

  const getTargetFollowersList = (targetUserId) => {
    const targetNode = networkUsersDirectory.find(u => u && u._id === targetUserId);
    if (!targetNode || !Array.isArray(targetNode.followers)) return [];
    return networkUsersDirectory.filter(u => u && targetNode.followers.includes(u._id));
  };
  const getTargetFollowingList = (targetUserId) => {
    const targetNode = networkUsersDirectory.find(u => u && u._id === targetUserId);
    if (!targetNode || !Array.isArray(targetNode.following)) return [];
    return networkUsersDirectory.filter(u => u && targetNode.following.includes(u._id));
  };

  const myPersonalNotifications = notifications.filter(n => n && (n.recipientId === user._id || n.recipientId === 'all'));

  const activeChatUsersList = networkUsersDirectory.filter(u => {
    if (!u || !u._id) return false;
    const roomId = getRoomId(user._id, u._id);
    if (hiddenChats[roomId]?.[user._id]) return false;
    const myClearTime = chatClearTimestamps[roomId]?.[user._id] || 0;
    const hasVisibleMessages = Array.isArray(conversations[roomId]) && conversations[roomId].some(msg => msg && msg.timestamp > myClearTime);
    return hasVisibleMessages || (selectedMessageUser && selectedMessageUser._id === u._id);
  });

  // 🔥 UPDATE: Removed 'u._id !== user._id' so you can search yourself in the Chat Search Box too!
  const displayedChatUsers = chatSearchQuery.trim() !== ''
    ? networkUsersDirectory.filter(u => u && (u.name?.toLowerCase().includes(chatSearchQuery.toLowerCase()) || u.username?.toLowerCase().includes(chatSearchQuery.toLowerCase())))
    : activeChatUsersList;

  const totalUnreadMessages = Object.entries(unreadCounts || {}).reduce((total, [key, count]) => {
    if (key.endsWith(`_${user._id}`)) return total + count;
    return total;
  }, 0);

  return (
    <div className="min-h-screen bg-[#07080E]">
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      {/* 📸 STORY VIEWER */}
      {activeStoryView && (
        <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col animate-in zoom-in-95 duration-200">
          <div className="p-4 flex items-center justify-between z-10 absolute top-0 w-full bg-gradient-to-b from-black/60 to-transparent">
            <div className="flex items-center gap-3">
              <img src={activeStoryView.user?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} className="h-10 w-10 rounded-full border-2 border-indigo-500 object-cover" />
              <span className="text-white font-bold">{activeStoryView.user?.name || 'User'}</span>
            </div>
            <button type="button" onClick={() => setActiveStoryView(null)} className="p-2 text-white hover:bg-white/10 rounded-full"><X size={24}/></button>
          </div>
          <div className="flex-1 flex items-center justify-center relative">
            <img src={activeStoryView.image} className="max-w-full max-h-full object-contain" />
          </div>
          <div className="p-4 flex gap-2 w-full absolute bottom-0 bg-gradient-to-t from-black/80 to-transparent">
            <input type="text" placeholder={`Reply...`} className="flex-1 bg-white/10 border border-white/20 rounded-full px-5 py-3 text-sm text-white focus:outline-none placeholder:text-gray-300 backdrop-blur-md" />
            <button type="button" className="h-12 w-12 rounded-full bg-indigo-600 text-white flex items-center justify-center"><Send size={18}/></button>
          </div>
        </div>
      )}

      {/* GLOBAL SETTINGS MODAL */}
      {isSettingsModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-sm rounded-3xl border border-white/10 shadow-2xl relative bg-[#07080E] overflow-hidden">
            <div className="p-5 border-b border-white/5 flex items-center justify-between bg-[#0A0C16]">
              <h3 className="text-sm font-extrabold text-white tracking-tight flex items-center gap-2"><Settings size={16} className="text-indigo-400"/> Settings</h3>
              <button type="button" onClick={() => setIsSettingsModalOpen(false)} className="p-1 rounded-lg text-gray-400 hover:text-white bg-white/5"><X size={16} /></button>
            </div>
            <div className="p-2">
              <button type="button" onClick={() => { setIsSettingsModalOpen(false); setIsEditModalOpen(true); }} className="w-full flex items-center justify-between p-4 hover:bg-gray-900/50 rounded-xl transition-colors text-left group">
                <div className="flex items-center gap-3 text-gray-300 group-hover:text-white"><User size={18} className="text-indigo-400" /> <span className="text-xs font-bold">Edit Personal Details</span></div>
                <ChevronRight size={14} className="text-gray-600 group-hover:text-white" />
              </button>
              <button type="button" onClick={() => { setIsSettingsModalOpen(false); setActiveTab('saved'); }} className="w-full flex items-center justify-between p-4 hover:bg-gray-900/50 rounded-xl transition-colors text-left group">
                <div className="flex items-center gap-3 text-gray-300 group-hover:text-white"><Bookmark size={18} className="text-amber-400" /> <span className="text-xs font-bold">Saved Posts</span></div>
                <ChevronRight size={14} className="text-gray-600 group-hover:text-white" />
              </button>
              <div className="h-px bg-white/5 my-2 mx-4"></div>
<button type="button" onClick={() => { setIsSettingsModalOpen(false); setIsDeleteModalOpen(true); }} className="w-full flex items-center justify-between p-4 hover:bg-rose-500/10 rounded-xl transition-colors text-left group">
  <div className="flex items-center gap-3 text-rose-400 group-hover:text-rose-300"><Trash2 size={18} /> <span className="text-xs font-extrabold">Delete Account</span></div>
  <AlertCircle size={14} className="text-rose-500/50 group-hover:text-rose-400" />
</button>
            </div>
          </div>
        </div>
      )}

      {/* LOGOUT SECURE MODAL */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="glass-panel w-full max-w-sm rounded-3xl p-6 border border-white/10 shadow-2xl relative bg-[#07080E] text-center">
            <div className="w-12 h-12 bg-rose-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/30"><Power className="text-rose-400" size={24} /></div>
            <h3 className="text-lg font-extrabold text-white tracking-tight mb-2">Log Out</h3>
            <p className="text-xs text-gray-400 font-medium mb-6 px-4">Are you sure you want to log out of your account?</p>
            <div className="flex gap-3">
              <button type="button" onClick={() => setShowLogoutModal(false)} className="flex-1 py-3 rounded-xl border border-gray-800 text-gray-300 font-bold text-xs hover:bg-gray-900/50 hover:text-white transition-all">Cancel</button>
              <button type="button" onClick={() => { setShowLogoutModal(false); onLogout(); }} className="flex-1 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md shadow-rose-900/40 transition-all">Yes, Logout</button>
            </div>
          </div>
        </div>
      )}
      
      <header className="glass-panel sticky top-0 z-30 w-full px-4 lg:px-6 py-4 flex items-center justify-between border-b border-white/5 bg-[#07080E]">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => { setActiveTab('home'); setViewedProfile(null); }}>
          <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center"><span className="text-white font-extrabold text-sm">D</span></div>
          <span className="text-lg font-extrabold tracking-wider bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent hidden sm:block">DevSync</span>
        </div>
        <span className="text-[10px] bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 px-3 py-1 rounded-xl font-bold uppercase tracking-widest">{activeTab.toUpperCase()}</span>
      </header>

      {/* MOBILE NAV BAR */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-[#07080E]/95 backdrop-blur-xl border-t border-white/10 z-40 flex items-center justify-around px-2 py-3 pb-safe">
        <button type="button" onClick={() => { setActiveTab('home'); setViewedProfile(null); }} className={`p-3 rounded-xl transition-all ${activeTab === 'home' ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-500 hover:text-gray-300'}`}><Home size={22} /></button>
        <button type="button" onClick={() => { setActiveTab('messages'); setViewedProfile(null); }} className={`p-3 rounded-xl relative transition-all ${activeTab === 'messages' ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-500 hover:text-gray-300'}`}>
          <MessageSquare size={22} />
          {totalUnreadMessages > 0 && <span className="absolute top-2 right-2 h-3.5 w-3.5 bg-rose-500 rounded-full border-2 border-[#07080E] text-white text-[8px] font-extrabold flex items-center justify-center">{totalUnreadMessages}</span>}
        </button>
        <button type="button" onClick={() => { setActiveTab('alerts'); setViewedProfile(null); }} className={`p-3 rounded-xl relative transition-all ${activeTab === 'alerts' ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-500 hover:text-gray-300'}`}>
          <Bell size={22} />
          {myPersonalNotifications.length > 0 && <span className="absolute top-2 right-2 h-2.5 w-2.5 bg-rose-500 rounded-full border-2 border-[#07080E]"></span>}
        </button>
        <button type="button" onClick={() => { setActiveTab('profile'); setViewedProfile(null); }} className={`p-3 rounded-xl transition-all ${activeTab === 'profile' ? 'text-indigo-400 bg-indigo-500/10' : 'text-gray-500 hover:text-gray-300'}`}><User size={22} /></button>
      </div>

      <div className="w-full max-w-7xl mx-auto px-0 sm:px-4 lg:px-6 pt-0 sm:pt-6 flex gap-6 pb-20 lg:pb-0">
        <Sidebar currentUser={user} onLogoutInit={() => setShowLogoutModal(true)} activeTab={activeTab} setActiveTab={setActiveTab} notificationCount={myPersonalNotifications.length} unreadMessageCount={totalUnreadMessages} allUsers={networkUsersDirectory} onUserClick={handleUserClick} />

        <main className="flex-1 lg:ml-78 w-full max-w-2xl lg:pb-24">
          
          {/* HOME TAB LAYER */}
          {activeTab === 'home' && (
            <div className="p-4 sm:p-0">
              
              {/* REAL FUNCTIONAL STORIES CONTAINER */}
              <div className="flex gap-4 overflow-x-auto custom-scroll pb-4 mb-2 pt-2">
                <div className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0" onClick={() => storyUploadRef.current?.click()}>
                  <input type="file" accept="image/*" className="hidden" ref={storyUploadRef} onChange={handleStoryUpload} />
                  <div className="h-16 w-16 rounded-full p-[2px] border-2 border-dashed border-gray-700 hover:border-indigo-500 transition-colors">
                    <div className="bg-[#07080E] h-full w-full rounded-full p-[2px] relative overflow-hidden group">
                      <img src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} className="h-full w-full rounded-full object-cover opacity-60 group-hover:opacity-40" />
                      <div className="absolute inset-0 flex items-center justify-center"><div className="bg-indigo-600 rounded-full p-1"><PlusCircle className="text-white" size={16}/></div></div>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold text-indigo-400">Add Story</span>
                </div>

                {localStories.map(story => story && story.user && (
                  <div key={story.id} className="flex flex-col items-center gap-1.5 cursor-pointer flex-shrink-0" onClick={() => setActiveStoryView(story)}>
                    <div className="h-16 w-16 rounded-full p-[2px] bg-gradient-to-tr from-amber-500 via-rose-500 to-fuchsia-600">
                      <div className="bg-[#07080E] h-full w-full rounded-full p-[2px] relative overflow-hidden"><img src={story.user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} className="h-full w-full rounded-full object-cover" /></div>
                    </div>
                    <span className="text-[10px] font-bold text-gray-400">{story.user.name ? story.user.name.split(' ')[0] : 'User'}</span>
                  </div>
                ))}
              </div>

              <CreatePost currentUser={user} onPostCreated={handleCreatePost} showToast={showToast} />
              <div className="space-y-2">
                {posts.map(post => post && post.user && (
                  <div key={post._id}>
                    <PostCard 
                      post={post} currentUser={user} allUsers={networkUsersDirectory} followedUsersList={myFollowingList} isSaved={Array.isArray(savedPosts) && savedPosts.includes(post._id)}
                      onUserClick={handleUserClick} onDirectMessageInit={(u) => { setActiveTab('messages'); setSelectedMessageUser(u); }} onPostDelete={handlePostDelete} onPostEdit={handlePostEdit} onLikeToggle={handleLikeToggle}
                      onCommentAdd={handleCommentAdd} onFollowToggle={handleFollowToggle} onSaveToggle={handleSaveToggle}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SAVED TAB COLLECTION */}
          {activeTab === 'saved' && (
            <div className="p-4 sm:p-0 space-y-4">
              <div className="border-b border-gray-800/80 pb-4 mb-4 flex items-center gap-3">
                <Bookmark className="text-indigo-400" size={24} />
                <div>
                  <h2 className="text-xl font-extrabold text-white tracking-tight">Saved Collection</h2>
                  <p className="text-xs text-gray-500 font-medium mt-0.5">Your securely bookmarked portfolio elements.</p>
                </div>
              </div>
              {(!Array.isArray(savedPosts) || savedPosts.length === 0) ? (
                <div className="glass-card rounded-2xl p-12 text-center flex flex-col items-center opacity-50"><Bookmark size={48} className="text-gray-700 mb-4" /><p className="text-sm font-bold text-gray-500">No saved posts found.</p></div>
              ) : (
                posts.filter(p => p && p._id && savedPosts.includes(p._id)).map(post => (
                  <PostCard 
                    key={post._id} post={post} currentUser={user} allUsers={networkUsersDirectory} followedUsersList={myFollowingList} isSaved={true}
                    onUserClick={handleUserClick} onDirectMessageInit={(u) => { setActiveTab('messages'); setSelectedMessageUser(u); }} onPostDelete={handlePostDeleteByContext} onPostEdit={handlePostEdit} onLikeToggle={handleLikeToggle}
                    onCommentAdd={handleCommentAdd} onFollowToggle={handleFollowToggle} onSaveToggle={handleSaveToggle}
                  />
                ))
              )}
            </div>
          )}

          {/* MESSAGES TAB */}
          {activeTab === 'messages' && (
            <div className="glass-card rounded-none sm:rounded-3xl border-x-0 sm:border border-white/5 h-[calc(100vh-130px)] sm:h-[600px] flex overflow-hidden bg-[#05060A]/20 relative w-full">
              <div className={`w-full lg:w-1/3 lg:border-r border-gray-900/60 p-4 space-y-3 bg-[#080911]/30 overflow-y-auto custom-scroll h-full flex-shrink-0 ${selectedMessageUser ? 'hidden lg:block' : 'block'}`}>
                <h3 className="text-[10px] font-extrabold tracking-widest text-indigo-400 uppercase px-1">Chats Directory</h3>
                <div className="px-1 mb-3"><div className="relative"><Search className="absolute left-3 top-2.5 text-gray-500" size={14} /><input type="text" placeholder="Search friends..." className="w-full bg-[#0E101C] border border-gray-800 rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:border-indigo-500 text-white placeholder:text-gray-600" value={chatSearchQuery} onChange={(e) => setChatSearchQuery(e.target.value)} /></div></div>
                <div className="space-y-1">
                  {displayedChatUsers.length === 0 && <div className="text-center py-6 px-2 text-[10px] font-bold text-gray-600">No contacts found.</div>}
                  {displayedChatUsers.map(netUser => {
                    if(!netUser || !netUser._id) return null;
                    const roomId = getRoomId(user._id, netUser._id);
                    const myUnreadKey = `${roomId}_${user._id}`;
                    return (
                    <div key={netUser._id} onClick={() => { setSelectedMessageUser(netUser); setShowChatStickers(false); setChatSearchQuery(''); }} className={`flex items-center justify-between p-3 rounded-2xl cursor-pointer transition-all ${selectedMessageUser?._id === netUser._id ? 'bg-indigo-600/10 border border-indigo-500/20 text-white' : 'hover:bg-gray-900/30 text-gray-400'}`}>
                      <div className="flex items-center gap-3 truncate">
                        <img src={netUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} alt="Avatar" className="h-8 w-8 rounded-xl object-cover flex-shrink-0" />
                        <div className="truncate text-xs font-bold"><h4>{netUser.name || 'User'}</h4><span className="text-[9px] font-medium text-gray-500 block">@{netUser.username || 'unknown'}</span></div>
                      </div>
                      {unreadCounts && unreadCounts[myUnreadKey] > 0 && selectedMessageUser?._id !== netUser._id && ( <span className="h-5 w-5 rounded-full bg-rose-500 text-white text-[9px] font-extrabold flex items-center justify-center shadow-sm shadow-rose-500/40 flex-shrink-0 ml-1">{unreadCounts[myUnreadKey]}</span> )}
                    </div>
                  )})}
                </div>
              </div>

              <div className={`w-full lg:w-2/3 flex-col justify-between bg-[#05060A]/40 h-full overflow-hidden relative ${!selectedMessageUser ? 'hidden lg:flex' : 'flex'}`}>
                {selectedMessageUser ? (
                  <>
                    <div className="p-3 sm:p-4 border-b border-white/5 bg-[#0A0C16]/80 flex items-center justify-between flex-shrink-0">
                  
                        {/* <div className="flex items-center">
                        <button type="button" onClick={() => setSelectedMessageUser(null)} className="lg:hidden p-1.5 mr-2 text-gray-400 hover:text-white bg-white/5 rounded-lg"><ChevronLeft size={20} /></button>
                        <div onClick={() => handleUserClick(selectedMessageUser)} className="flex items-center cursor-pointer group">
                          <img src={selectedMessageUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} alt="Active" className="h-8 w-8 rounded-xl object-cover mr-3 ring-1 ring-white/10 group-hover:ring-indigo-500/40" />
                          <div><h3 className="text-xs font-extrabold text-white leading-none group-hover:text-indigo-400">{selectedMessageUser.name || 'User'}</h3><span className="text-[9px] text-gray-500 font-bold block mt-1">@{selectedMessageUser.username || 'unknown'}</span></div>
                        </div>
                        </div> */}
                        <div className="flex items-center">
                        <button type="button" onClick={() => setSelectedMessageUser(null)} className="lg:hidden p-1.5 mr-2 text-gray-400 hover:text-white bg-white/5 rounded-lg"><ChevronLeft size={20} /></button>
                        
                        {/* 🔥 CHANGED: Click karne par check karega isDeleted */}
                        <div onClick={() => handleUserClick(selectedMessageUser)} className={`flex items-center group ${selectedMessageUser.isDeleted ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}`}>
                          <img src={selectedMessageUser.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} alt="Active" className={`h-8 w-8 rounded-xl object-cover mr-3 ring-1 ring-white/10 ${!selectedMessageUser.isDeleted && 'group-hover:ring-indigo-500/40'}`} />
                          <div>
                            {/* Deleted account hai toh red color mein aayega */}
                            <h3 className={`text-xs font-extrabold leading-none ${selectedMessageUser.isDeleted ? 'text-rose-500' : 'text-white group-hover:text-indigo-400'}`}>
                              {selectedMessageUser.isDeleted ? 'DELETED ACCOUNT' : (selectedMessageUser.name || 'User')}
                            </h3>
                            {/* Username wahi rahega */}
                            <span className="text-[9px] text-gray-500 font-bold block mt-1">@{selectedMessageUser.username || 'unknown'}</span>
                          </div>
                        </div>
                      </div>
                      <div className="relative">
                        <button type="button" onClick={() => setShowChatMenu(!showChatMenu)} className="p-2 text-gray-400 hover:text-white rounded-lg hover:bg-white/5"><MoreVertical size={18} /></button>
                        {showChatMenu && (
                          <div className="absolute right-0 top-full mt-1 w-40 glass-panel border border-white/10 rounded-xl p-1.5 shadow-2xl z-50 bg-[#0A0C14]">
                            <button type="button" onClick={handleClearHistory} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-extrabold text-amber-400 hover:bg-amber-500/10 rounded-lg"><History size={14} /> Clear History</button>
                            <button type="button" onClick={handleDeleteChat} className="w-full flex items-center gap-2 px-3 py-2.5 text-xs font-extrabold text-rose-400 hover:bg-rose-500/10 rounded-lg mt-0.5"><Trash2 size={14} /> Delete Chat</button>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="p-4 flex-1 overflow-y-auto space-y-3.5 custom-scroll text-xs bg-transparent">
                      {(() => {
                        const roomId = getRoomId(user._id, selectedMessageUser._id);
                        const myClearTime = chatClearTimestamps[roomId]?.[user._id] || 0;
                        const visibleMessages = Array.isArray(conversations[roomId]) ? conversations[roomId].filter(msg => msg && msg.timestamp > myClearTime) : [];
                        if (visibleMessages.length === 0) return <div className="h-full flex flex-col items-center justify-center text-gray-600 text-[10px] font-bold uppercase tracking-widest opacity-50"><MessageSquare size={24} className="mb-2" /> Secure Terminal Session</div>;

                        return visibleMessages.map((msg, index) => {
                          if(!msg) return null;
                          const isMyMessage = msg.sender === user._id;
                          return (
                            <div key={index} className={`flex ${isMyMessage ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[80%] rounded-2xl p-3 sm:p-3.5 font-bold leading-relaxed shadow-lg border ${
                                isMyMessage ? 'bg-indigo-600 border-indigo-500/30 text-white rounded-br-none shadow-indigo-950/20' : 'bg-gradient-to-br from-emerald-500/10 to-teal-600/5 border-emerald-500/20 text-emerald-300 rounded-bl-none shadow-black/40'
                              }`}>
                                {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
                                {msg.image && (
                                  <div className="mt-2 rounded-xl overflow-hidden max-h-48 w-full border border-white/5 bg-black/20 flex items-center justify-center">
                                    <img src={String(msg.image)} alt="Media Node Attachment" className="w-full h-full object-cover" />
                                  </div>
                                )}
                                {msg.sticker && <img src={msg.sticker} alt="Sticker" className="h-20 w-20 object-contain" />}
                              </div>
                            </div>
                          );
                        });
                      })()}
                      <div ref={chatEndRef} />
                    </div>

                    {selectedMessageUser.isDeleted ? (
                      <div className="p-4 bg-[#090A12] border-t border-white/5 flex items-center justify-center flex-shrink-0 relative z-10 h-16">
                        <span className="text-xs font-bold text-rose-500 bg-rose-500/10 px-4 py-2 rounded-xl flex items-center gap-2 border border-rose-500/20">
                          <AlertCircle size={14} /> You cannot reply to a deleted account.
                        </span>
                      </div>
                    ) : (
                      <form onSubmit={handleSendFullPageMessage} className="p-3 sm:p-4 border-t border-white/5 bg-[#090A12] flex-shrink-0 space-y-2 relative z-10">
                        {chatSelectedFile && ( <div className="flex items-center justify-between p-2 bg-[#0E101C] border border-indigo-500/20 rounded-xl max-w-fit gap-4"><div className="flex items-center gap-2"><img src={chatSelectedFile} alt="Preview" className="h-8 w-8 object-cover rounded-lg" /><span className="text-[10px] text-gray-400 font-bold">Media Attached</span></div><button type="button" onClick={() => setChatSelectedFile(null)} className="p-1 text-gray-400 hover:text-white"><X size={12} /></button></div> )}
                        {showChatStickers && ( <div className="absolute bottom-20 left-4 z-50 glass-panel border border-white/10 rounded-2xl p-3 shadow-2xl grid grid-cols-5 gap-2 w-[90%] sm:w-64 bg-[#090A11]">{GLOBAL_STICKERS.map(st => ( <img key={st.id} src={st.url} alt={st.label} onClick={() => handleSendStickerMessage(st.url)} className="h-10 w-10 object-contain hover:scale-110 active:scale-95 transition-transform" /> ))}</div> )}
                        <div className="flex gap-1.5 sm:gap-2">
                          <input type="file" accept="image/*" className="hidden" ref={chatFileSelectorRef} onChange={handleChatFileChange} />
                          <button type="button" onClick={() => { chatFileSelectorRef.current.click(); setShowChatStickers(false); }} className="p-3 rounded-xl bg-[#111322] border border-gray-800 text-gray-500 hover:text-gray-300 flex-shrink-0"><ImageIcon size={14} /></button>
                          <button type="button" onClick={() => setShowChatStickers(!showChatStickers)} className={`p-3 rounded-xl border transition-all flex-shrink-0 ${showChatStickers ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/30' : 'bg-[#111322] border-gray-800 text-gray-500'}`}><Smile size={14} /></button>
                          <input type="text" placeholder="Type message..." className="flex-1 bg-[#111322] border border-gray-800 rounded-xl px-4 text-xs font-medium focus:outline-none focus:border-indigo-500 text-white min-w-0" value={typedMessagePacket} onChange={e => setTypedMessagePacket(e.target.value)} />
                          <button type="submit" className="p-3 rounded-xl bg-indigo-600 text-white flex-shrink-0"><Send size={14} /></button>
                        </div>
                      </form>
                    )}
                  </>
                ) : ( <div className="hidden lg:flex flex-col items-center justify-center h-full text-center p-6 text-gray-600"><MessageSquare size={36} className="text-gray-800 mb-3" /><h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest">No Chat Selected</h4></div> )}
              </div>
            </div>
          )}  

          {activeTab === 'profile' && (
            <div className="p-4 sm:p-0 space-y-6">
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/5 text-center relative overflow-hidden bg-[#0F111C]/10">
                <button type="button" onClick={() => setIsSettingsModalOpen(true)} className="absolute top-4 sm:top-6 right-4 sm:right-6 p-2 sm:p-2.5 rounded-xl border border-gray-800 bg-[#0E101C]/80 text-gray-400 hover:text-indigo-400 hover:border-indigo-500/40 transition-all cursor-pointer flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider z-10 shadow-lg">
                  <Settings size={14} /> <span className="hidden sm:inline">Settings</span>
                </button>
                <div className="absolute top-0 inset-x-0 h-24 sm:h-32 bg-gradient-to-r from-indigo-950/50 via-purple-950/50 to-pink-950/50" />
                <div className="relative z-10 pt-10 sm:pt-12">
                  <img src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} alt="Avatar" className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl mx-auto object-cover ring-4 ring-indigo-500 shadow-xl mb-4" />
                  <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">{user.name || 'User'}</h2>
                  <span className="text-xs font-bold text-gray-500 mt-0.5 block">@{user.username || 'unknown'}</span>
                  <div className="flex items-center justify-center gap-2 sm:gap-3 mt-4 text-[10px] sm:text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                    <span>Age: <span className="text-gray-300">{user.age || '21'}</span></span><span className="text-gray-700">•</span><span>Gen: <span className="text-gray-300">{user.gender || 'Male'}</span></span><span className="text-gray-700">•</span><span>DOB: <span className="text-gray-300">{user.dob || '2005'}</span></span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-400 font-medium max-w-md mx-auto mt-4 sm:mt-5 leading-relaxed">{user.bio || 'Hey there! I am using DevSync.'}</p>
                  
                  <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-sm mx-auto mt-6 sm:mt-8 border-t border-gray-900/60 pt-4 sm:pt-6 text-center">
                    <div className="cursor-pointer"><span className="text-lg sm:text-xl font-extrabold text-white block">{ownPosts.length}</span><span className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wider">Posts</span></div>
                    <div onClick={() => { setNetworkModalTitle('Followers Network'); setShowNetworkListModal(true); }} className="cursor-pointer group"><span className="text-lg sm:text-xl font-extrabold text-white block group-hover:text-indigo-400 transition-colors">{getTargetFollowersList(user._id).length}</span><span className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wider block mt-0.5 group-hover:text-indigo-400">Followers</span></div>
                    <div onClick={() => { setNetworkModalTitle('Following Network'); setShowNetworkListModal(true); }} className="cursor-pointer group"><span className="text-lg sm:text-xl font-extrabold text-white block group-hover:text-indigo-400 transition-colors">{getTargetFollowingList(user._id).length}</span><span className="text-[9px] sm:text-[10px] font-bold text-gray-500 uppercase tracking-wider block mt-0.5 group-hover:text-indigo-400">Following</span></div>
                  </div>
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xs font-extrabold tracking-widest text-gray-500 uppercase flex items-center gap-2 px-1 mb-2"><Layers size={14} /> My Publications ({ownPosts.length})</h3>
                {ownPosts.map(post => post && (
                  <PostCard 
                    key={post._id} post={post} currentUser={user} allUsers={networkUsersDirectory} followedUsersList={myFollowingList} isSaved={Array.isArray(savedPosts) && savedPosts.includes(post._id)}
                    onUserClick={handleUserClick} onDirectMessageInit={(u) => { setActiveTab('messages'); setSelectedMessageUser(u); }} onPostDelete={handlePostDelete} onPostEdit={handlePostEdit} onLikeToggle={handleLikeToggle}
                    onCommentAdd={handleCommentAdd} onFollowToggle={handleFollowToggle} onSaveToggle={handleSaveToggle}
                  />
                ))}
              </div>
            </div>
          )}

          {/* PROFILE VIEW TERMINAL */}
          {activeTab === 'profile-view' && viewedProfile && (
            <div className="p-4 sm:p-0 space-y-6 animate-in fade-in duration-200">
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/5 relative overflow-hidden bg-[#0F111C]/5">
                <div className="absolute top-0 inset-x-0 h-24 sm:h-32 bg-gradient-to-r from-slate-900 to-indigo-950/40" />
                <div className="relative z-10 pt-10 sm:pt-12 flex flex-col sm:flex-row sm:items-end justify-between gap-6">
                  <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
                    <img src={viewedProfile.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} alt="Target" className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl object-cover ring-4 ring-gray-800 shadow-xl" />
                    <div><h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">{viewedProfile.name || 'User'}</h2><span className="text-xs font-bold text-gray-500">@{viewedProfile.username || 'unknown'}</span></div>
                  </div>
                  <div className="flex gap-2 justify-center">
                    <button type="button" onClick={() => handleFollowToggle(viewedProfile)} className={`px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl font-extrabold text-xs transition-all flex items-center gap-1.5 ${Array.isArray(viewedProfile.followers) && viewedProfile.followers.includes(user._id) ? 'bg-[#141625] text-gray-400 border border-gray-800' : 'bg-indigo-600 text-white shadow-md'}`}>{Array.isArray(viewedProfile.followers) && viewedProfile.followers.includes(user._id) ? 'Unfollow' : 'Follow'}</button>
                    <button type="button" onClick={() => { setActiveTab('messages'); setSelectedMessageUser(viewedProfile); }} className="px-4 sm:px-5 py-2 sm:py-2.5 rounded-xl border border-gray-800 bg-[#0E101C] text-gray-300 font-extrabold text-xs">Message</button>
                  </div>
                </div>
                <p className="text-xs sm:text-sm text-gray-400 font-medium max-w-md mt-6 leading-relaxed text-center sm:text-left">{viewedProfile.bio}</p>
                <div className="grid grid-cols-3 gap-2 sm:gap-4 max-w-sm mt-6 border-t border-gray-900/40 pt-4 text-center sm:text-left">
                  <div><span className="text-lg sm:text-base font-extrabold text-white block">{posts.filter(p => p && p.user && p.user._id === viewedProfile._id).length}</span><span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider">Posts</span></div>
                  <div onClick={() => { setNetworkModalTitle(`${viewedProfile.name}'s Followers`); setShowNetworkListModal(true); }} className="cursor-pointer group"><span className="text-lg sm:text-base font-extrabold text-white block group-hover:text-indigo-400">{getTargetFollowersList(viewedProfile._id).length}</span><span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block group-hover:text-indigo-400">Followers</span></div>
                  <div onClick={() => { setNetworkModalTitle(`${viewedProfile.name}'s Following`); setShowNetworkListModal(true); }} className="cursor-pointer group"><span className="text-lg sm:text-base font-extrabold text-white block group-hover:text-indigo-400">{getTargetFollowingList(viewedProfile._id).length}</span><span className="text-[9px] font-bold text-gray-500 uppercase tracking-wider block group-hover:text-indigo-400">Following</span></div>
                </div>
              </div>
              <div className="space-y-3">
                <h3 className="text-xs font-extrabold tracking-widest text-gray-500 uppercase px-1">Publications By @{viewedProfile.username}</h3>
                {posts.filter(p => p && p.user && p.user._id === viewedProfile._id).length === 0 ? (
                  <div className="glass-card rounded-2xl p-8 text-center text-xs font-bold text-gray-600">No portfolio update records logged.</div>
                ) : (
                  posts.filter(p => p && p.user && p.user._id === viewedProfile._id).map(post => (
                    <PostCard 
                      key={post._id} post={post} currentUser={user} allUsers={networkUsersDirectory} followedUsersList={myFollowingList} isSaved={Array.isArray(savedPosts) && savedPosts.includes(post._id)}
                      onUserClick={() => {}} onDirectMessageInit={(u) => { setActiveTab('messages'); setSelectedMessageUser(u); }} onPostDelete={handlePostDeleteByContext} onPostEdit={handlePostEdit} onLikeToggle={handleLikeToggle} onCommentAdd={handleCommentAdd} onFollowToggle={handleFollowToggle} onSaveToggle={handleSaveToggle}
                    />
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === 'alerts' && (
            <div className="p-4 sm:p-0">
              <div className="glass-card rounded-3xl p-6 border border-white/5 space-y-4 bg-[#0F111C]/5">
                <div className="flex items-center justify-between border-b border-gray-900/50 pb-3">
                  <h3 className="text-xs font-extrabold tracking-widest text-indigo-400 uppercase">Account Notifications</h3>
                  {myPersonalNotifications.length > 0 && ( <button type="button" onClick={handleClearAllNotifications} className="text-[10px] font-bold text-red-400 hover:underline">Clear All</button> )}
                </div>
                <div className="space-y-2">
                  {myPersonalNotifications.length === 0 ? ( <div className="text-center py-8 text-xs font-bold text-gray-600">No logs documented.</div> ) : (
                    myPersonalNotifications.map((notif) => ( <div key={notif.id} className="p-4 rounded-2xl bg-[#0E101C] border border-white/5"><p className="text-xs font-medium text-gray-300">{notif.message}</p></div> ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* HELP & SUPPORT */}
          {activeTab === 'support' && (
            <div className="p-4 sm:p-0">
              <div className="glass-card rounded-3xl p-6 sm:p-8 border border-white/5 space-y-6 bg-gradient-to-br from-[#0e101c]/50 to-[#07080e]/90">
                <div className="border-b border-gray-800/80 pb-4"><h2 className="text-xl font-extrabold text-white tracking-tight">Developer Hub & Support Desk</h2><p className="text-xs text-gray-500 font-medium mt-1">DevSync Architecture Terminal Node v1.0.0</p></div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-[#0A0C14] border border-white/5 rounded-2xl space-y-1"><span className="text-[10px] font-extrabold text-gray-600 uppercase block">Lead Engineer</span><span className="text-sm font-extrabold text-white block">Vivek Kumar</span><span className="text-[11px] font-semibold text-indigo-400 block mt-1">Full-Stack Web Developer</span></div>
                  <div className="p-4 bg-[#0A0C14] border border-white/5 rounded-2xl space-y-1"><span className="text-[10px] font-extrabold text-gray-600 uppercase block">Institution Affiliation</span><span className="text-sm font-extrabold text-white block">National Institute of Technology (NIT), Srinagar</span><span className="text-[11px] font-semibold text-gray-400 block mt-1">Electronics and Communication Engineering</span></div>
                </div>
                <div className="p-5 bg-[#090A13]/60 border border-indigo-500/10 rounded-2xl space-y-3">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-indigo-400"><Mail size={14} className="inline mr-1" /> Support Pipelines</h4>
                  <p className="text-xs text-gray-400 font-medium leading-relaxed">For architectural feedback or technical verification pipelines regarding this platform deployment infrastructure, establish direct socket context routing through the verified terminal link below:</p>              
                 <a href="mailto:vivekkr7046@gmail.com" className="inline-flex items-center bg-indigo-600 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-md">Email Support: vivekkr7046@gmail.com</a>
                </div>
              </div>
            </div>
          )}
        </main>

        <aside className="w-80 h-fit sticky top-24 border border-white/5 bg-[#0F111C]/30 rounded-3xl p-6 hidden xl:block">
          <h3 className="text-xs font-extrabold tracking-widest text-indigo-400 uppercase flex items-center gap-2 mb-4"><TrendingUp size={16}/> Global Trends</h3>
          <div className="space-y-4">
            {dynamicTrending.map((tag, idx) => (
              <div key={idx} className="group cursor-pointer">
                <span className="text-[10px] text-gray-500 font-bold group-hover:text-indigo-400 transition-colors">Trending #{idx + 1}</span>
                <p className="text-sm font-extrabold text-gray-200 mt-0.5">{tag}</p>
              </div>
            ))}
          </div>
        </aside>
      </div>

      {showNetworkListModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass-panel w-full max-w-sm rounded-3xl p-5 border border-white/10 shadow-2xl relative bg-[#07080E] mx-4 sm:mx-0">
            <button type="button" onClick={() => setShowNetworkListModal(false)} className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white bg-[#0E101C]"><X size={14} /></button>
            <h4 className="text-xs font-extrabold text-indigo-400 uppercase tracking-wider mb-4 flex items-center gap-2"><Users size={14}/> {networkModalTitle}</h4>
            <div className="space-y-1.5 max-h-64 overflow-y-auto custom-scroll pr-1">
              {(networkModalTitle.includes('Followers') ? getTargetFollowersList(viewedProfile ? viewedProfile._id : user._id) : getTargetFollowingList(viewedProfile ? viewedProfile._id : user._id)).length === 0 ? (
                <p className="text-[11px] font-bold text-gray-600 text-center py-4">No linked nodes found in network matrix.</p>
              ) : (
                (networkModalTitle.includes('Followers') ? getTargetFollowersList(viewedProfile ? viewedProfile._id : user._id) : getTargetFollowingList(viewedProfile ? viewedProfile._id : user._id)).map(netU => (
                  <div key={netU._id} type="button" onClick={() => handleUserClick(netU)} className="flex items-center justify-between p-2.5 rounded-xl bg-[#0E101C]/60 border border-white/5 hover:bg-gray-900/30 cursor-pointer group">
                    <div className="flex items-center gap-2.5">
                      <img src={netU.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150'} className="h-7 w-7 rounded-lg object-cover" />
                      <div><h5 className="text-[11px] font-extrabold text-white group-hover:text-indigo-400">{netU.name || 'User'}</h5><span className="text-[9px] text-gray-500 block">@{netU.username || 'unknown'}</span></div>
                    </div>
                    <span className="text-[9px] font-bold text-indigo-400 uppercase bg-indigo-500/5 px-2 py-0.5 rounded border border-indigo-500/10">Profile</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
      <DeleteAccountModal 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)} 
        onConfirm={handleConfirmDeleteAccount} 
      />

      <EditProfileModal isOpen={isEditModalOpen} currentUser={user} onClose={() => setIsEditModalOpen(false)} onSave={handleSaveProfileConfiguration} />
    </div>
  );
}
 


