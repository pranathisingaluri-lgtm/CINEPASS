const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config(); // Must be before routes

const cors = require('cors');
const authRoutes = require('./routes/auth');
const bookingRoutes = require('./routes/bookings');
const movieRoutes = require('./routes/movies');
const jwt = require('jsonwebtoken');
const User = require('./models/User');

const app = express();
app.use(express.json());
app.use(cors());

// Simple health check
app.get('/ping', (req, res) => res.send('pong'));

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/cinepass';

const connectDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`Successfully connected to MongoDB: ${MONGO_URI.includes('cluster') ? 'Atlas' : 'Local'}`);
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    process.exit(1);
  }
};

connectDB();

app.use('/api/auth', authRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/movies', movieRoutes);
app.use('/api/wishlist', require('./routes/wishlist'));
app.use('/api/theaters', require('./routes/theaters'));

// returns current user when provided Authorization: Bearer <token>
app.get('/api/me', async (req, res) => {
  const auth = req.headers.authorization;
  const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id).select('-passwordHash');
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.json(user);
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
