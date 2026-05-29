import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String }, 
  age: { type: Number, required: false },
  dob: { type: Date, required: false },
  gender: { type: String, required: false, default: 'Not Specified' },
  avatar: { type: String, default: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde' },
  bio: { type: String, default: 'Hey there! I am using Nexus.' },
  googleId: { type: String, default: null },
  followers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  following: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

const User = mongoose.model('User', userSchema);
export default User;
