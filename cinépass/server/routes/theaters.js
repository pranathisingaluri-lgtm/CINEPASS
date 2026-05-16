const express = require('express');
const router = express.Router();
const { getNearbyTheaters } = require('../services/theaterService');

// GET /api/theaters?lat=...&lon=...
router.get('/', async (req, res) => {
  const { lat, lon } = req.query;
  if (!lat || !lon) {
    return res.status(400).json({ message: 'Latitude and Longitude are required' });
  }

  try {
    const theaters = await getNearbyTheaters(lat, lon);
    res.json(theaters);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching theaters' });
  }
});

module.exports = router;
