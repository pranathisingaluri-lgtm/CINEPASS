const express = require('express');
const Booking = require('../models/Booking');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const PDFDocument = require('pdfkit');

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret_change_me';

// Middleware to authenticate
const authenticate = (req, res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ message: 'No token' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.userId = payload.id;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};

// Get all bookings for current user
router.get('/', authenticate, async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a new booking & send email with PDF
router.post('/', authenticate, async (req, res) => {
  const { movieTitle, date, time, seats, amount } = req.body;
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const booking = new Booking({
      userId: req.userId,
      movieTitle,
      date,
      time,
      seats,
      amount,
    });
    await booking.save();

    // Generate PDF in memory
    const doc = new PDFDocument({ size: 'A5', margin: 30 });
    let buffers = [];
    doc.on('data', buffers.push.bind(buffers));
    
    return new Promise((resolve, reject) => {
      doc.on('end', async () => {
        const pdfData = Buffer.concat(buffers);
        
        // Send Email
        try {
          const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: process.env.EMAIL_USER,
              pass: process.env.EMAIL_PASS
            }
          });

          const mailOptions = {
            from: `"CinéPass" <${process.env.EMAIL_USER}>`,
            to: user.email,
            subject: `Booking Confirmed: ${movieTitle}`,
            text: `Hi ${user.name},\n\nYour booking for ${movieTitle} is confirmed!\n\nDate: ${date}\nTime: ${time}\nSeats: ${seats.join(', ')}\nTotal: ${amount}\n\nPlease find your ticket attached.\n\nEnjoy your movie!\nCinéPass Team`,
            attachments: [
              {
                filename: `CinePass_Ticket_${booking._id.toString().substr(-6).toUpperCase()}.pdf`,
                content: pdfData
              }
            ]
          };

          await transporter.sendMail(mailOptions);
          console.log(`[DEV] Booking email sent to ${user.email}`);
          res.status(201).json(booking);
          resolve();
        } catch (emailErr) {
          console.error('Email error:', emailErr);
          // Still return booking success even if email fails
          res.status(201).json(booking);
          resolve();
        }
      });

      // PDF Content
      doc.rect(0, 0, doc.page.width, 60).fill('#f43f5e');
      doc.fillColor('#ffffff').fontSize(24).text('CinéPass Ticket', 0, 20, { align: 'center' });
      
      doc.fillColor('#1e293b').fontSize(10).text(`Booking ID: #${booking._id.toString().substr(-6).toUpperCase()}`, 0, 70, { align: 'right' });
      
      doc.fontSize(20).text(movieTitle, 30, 90);
      doc.moveTo(30, 115).lineTo(doc.page.width - 30, 115).stroke('#e2e8f0');
      
      doc.fontSize(10).fillColor('#64748b');
      doc.text('DATE', 30, 130);
      doc.text('TIME', 130, 130);
      doc.text('SEATS', 230, 130);
      
      doc.fillColor('#0f172a').fontSize(12);
      doc.text(date, 30, 145);
      doc.text(time, 130, 145);
      doc.text(seats.join(', '), 230, 145);
      
      doc.fillColor('#64748b').fontSize(10).text('TOTAL AMOUNT', 30, 175);
      doc.fillColor('#f43f5e').fontSize(14).text(amount, 30, 190);
      
      doc.fillColor('#64748b').fontSize(10).text('BOOKED BY', 30, 220);
      doc.fillColor('#0f172a').fontSize(12).text(user.name, 30, 235);
      
      doc.fontSize(8).fillColor('#94a3b8').text('Terms & Conditions Apply. Please arrive 15 minutes early.', 0, 300, { align: 'center' });
      
      doc.end();
    });

  } catch (err) {
    console.error('Booking error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
