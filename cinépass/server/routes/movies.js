const express = require('express');
const router = express.Router();
const { fetchTrendingMovies, fetchMovieDetails, searchMovies } = require('../controllers/movieController');

router.get('/trending', fetchTrendingMovies);
router.get('/search', searchMovies);
router.get('/:id', fetchMovieDetails);

module.exports = router;