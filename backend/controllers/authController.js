import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

export const registerUser = async (req, res) => {


const validateEmail = (email) => {
    // 1. Regex check (Standard email format)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return false;

    // 2. Disposable Email Blocklist (Inhe copy-paste kar lo)
    const blockedDomains = ['tempmail.com', 'trashmail.com', '10minutemail.com', 'guerrillamail.com'];
    const domain = email.split('@')[1];
    if (blockedDomains.includes(domain)) return false;

    return true;
};
// Register function mein ise use karo:
if (!validateEmail(req.body.email)) {
    return res.status(400).json({ message: "Please enter a valid, non-disposable email address." });
}

  const { name, email, password } = req.body;
  try {
    const userExists = await User.findOne({ email });
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({ name, email, password: hashedPassword });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, avatar: user.avatar, token: generateToken(user._id) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user && (await bcrypt.compare(password, user.password))) {
      res.json({ _id: user._id, name: user.name, email: user.email, avatar: user.avatar, token: generateToken(user._id) });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const googleAuth = async (req, res) => {
  const { name, email, googleId, avatar } = req.body;
  try {
    let user = await User.findOne({ email });
    if (!user) {
      user = await User.create({ name, email, googleId, avatar, password: null });
    } else if (!user.googleId) {
      user.googleId = googleId;
      await user.save();
    }
    res.json({ _id: user._id, name: user.name, email: user.email, avatar: user.avatar, token: generateToken(user._id) });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const deleteAccount = async (req, res) => {
  const { password, reason } = req.body;
  const userId = req.user._id; 

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Account not found." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      return res.status(401).json({ message: "Oops! Incorrect password. Please try again." });
    }

    console.log(`Account Deleted - User: ${user.email} | Reason: ${reason}`);
    await User.findByIdAndDelete(userId);
    
    res.status(200).json({ message: "ACCOUNT DELETED, SEE YOU SOON!" });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong on our end. Please try again later." });
  }
};

