export const DUMMY_USERS = [
  { _id: "u1", name: "Vivek Kumar", username: "vivek_ece", avatar: "https://i.pravatar.cc/150?u=1", bio: "ECE Student @NIT Srinagar. Building the future.", followers: ["u2", "u3", "u4"], following: ["u5", "u6"] },
  { _id: "u2", name: "Sarah Jenkins", username: "sarah_codes", avatar: "https://i.pravatar.cc/150?u=2", bio: "Full Stack Engineer from London. ☕ Coffee & Code.", followers: ["u1"], following: ["u1", "u3"] },
  { _id: "u3", name: "Rahul Sharma", username: "rahul_dev", avatar: "https://i.pravatar.cc/150?u=3", bio: "Competitive Programmer. Exploring React & Node.", followers: ["u1", "u2"], following: ["u4", "u5"] },
  { _id: "u4", name: "Yuki Tanaka", username: "yuki_tech", avatar: "https://i.pravatar.cc/150?u=4", bio: "Tokyo based UI/UX Designer. Minimalist life.", followers: ["u1"], following: ["u2", "u3"] },
  { _id: "u5", name: "Arpit Gupta", username: "arpit_g", avatar: "https://i.pravatar.cc/150?u=5", bio: "Frontend enthusiast. Love building UI.", followers: ["u6"], following: ["u1", "u2"] },
  { _id: "u6", name: "Elena Rossi", username: "elena_designs", avatar: "https://i.pravatar.cc/150?u=6", bio: "Italian artist & dev. Creating digital magic.", followers: ["u5"], following: ["u4", "u1"] },
  { _id: "u7", name: "Khaniya Kumar", username: "khaniya_biz", avatar: "https://i.pravatar.cc/150?u=7", bio: "Entrepreneur at heart. Business & Tech.", followers: ["u1"], following: ["u8"] },
  { _id: "u8", name: "David Miller", username: "david_ops", avatar: "https://i.pravatar.cc/150?u=8", bio: "DevOps Engineer. Cloud architecture lover.", followers: ["u7"], following: ["u9", "u10"] },
  { _id: "u9", name: "Arpita Gupta", username: "arpita_g", avatar: "https://i.pravatar.cc/150?u=9", bio: "Learning backend. Java & Spring Boot.", followers: ["u8"], following: ["u3"] },
  { _id: "u10", name: "Suraj Kumar", username: "suraj_eng", avatar: "https://i.pravatar.cc/150?u=10", bio: "Engineering student. Exploring AI/ML.", followers: ["u8"], following: ["u1"] }
];

export const DUMMY_POSTS = [
  { _id: "p1", user: DUMMY_USERS[1], content: "Just deployed my first MERN app! 🚀 #react #devsync", likes: ["u1", "u3"], comments: [] },
  { _id: "p2", user: DUMMY_USERS[2], content: "Stuck on a bug for 3 hours, finally fixed it! 💪", likes: ["u4", "u5"], comments: [] },
  { _id: "p3", user: DUMMY_USERS[3], content: "Tokyo sunset while coding is a vibe. 🌅", likes: ["u1", "u2", "u6"], comments: [] },
  // ... aise hi har user ke liye 3-4 posts add kar sakte ho
];