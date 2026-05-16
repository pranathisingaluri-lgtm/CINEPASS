const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const OTP = require('../models/OTP');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

const nodemailer = require('nodemailer');

// Send OTP
router.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  
  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.deleteMany({ email }); // Clear existing OTPs for this email
    const newOtp = new OTP({ email, otp: otpCode });
    await newOtp.save();
    
    // Set up nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"CinéPass" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Your CinéPass Login Code',
      text: `Your OTP code is ${otpCode}. It is valid for 5 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 40px;">
          <h2>CinéPass Login</h2>
          <p>Your secure one-time password is:</p>
          <h1 style="font-size: 40px; letter-spacing: 5px; color: #f43f5e;">${otpCode}</h1>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[DEV] OTP sent to ${email}`);
    
    return res.json({ message: 'OTP sent successfully to your email.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Verify OTP & Login/Signup
router.post('/verify-otp', async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ message: 'Missing fields' });
  
  try {
    const record = await OTP.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: 'Invalid or expired OTP' });
    
    // Check if user exists, if not create one
    let user = await User.findOne({ email });
    if (!user) {
      user = new User({ 
        name: email.split('@')[0], 
        email, 
        passwordHash: 'otp_user' // placeholder
      });
      await user.save();
    }
    
    await OTP.deleteMany({ email }); // Use OTP only once
    
    const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
    return res.json({ id: user._id, name: user.name, email: user.email, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Signup - create a new user
router.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
  try {
    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'User already exists' });
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
  const user = new User({ name, email, passwordHash });
  await user.save();
  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  return res.status(201).json({ id: user._id, name: user.name, email: user.email, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Login - verify credentials
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });
    const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) return res.status(401).json({ message: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  return res.json({ id: user._id, name: user.name, email: user.email, token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Forgot Password - Send OTP if user exists
router.post('/forgot-password', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: 'Email is required' });
  
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    await OTP.deleteMany({ email });
    const newOtp = new OTP({ email, otp: otpCode });
    await newOtp.save();
    
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"CinéPass" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Code - CinéPass',
      html: `
        <div style="font-family: Arial, sans-serif; text-align: center; padding: 40px;">
          <h2>Reset Your Password</h2>
          <p>Your password reset code is:</p>
          <h1 style="font-size: 40px; letter-spacing: 5px; color: #f43f5e;">${otpCode}</h1>
          <p>This code will expire in 5 minutes.</p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    return res.json({ message: 'Reset code sent to your email.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

// Reset Password - Verify OTP and update password
router.post('/reset-password', async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) return res.status(400).json({ message: 'Missing fields' });
  
  try {
    const record = await OTP.findOne({ email, otp });
    if (!record) return res.status(400).json({ message: 'Invalid or expired code' });
    
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: 'User not found' });

    const saltRounds = 10;
    user.passwordHash = await bcrypt.hash(newPassword, saltRounds);
    await user.save();
    
    await OTP.deleteMany({ email }); // Clear OTP
    
    return res.json({ message: 'Password updated successfully. You can now login.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
