const { getTrendingMovies, getMovieDetails, searchMovies } = require('../services/tmdbService');

exports.searchMovies = async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) return res.status(400).json({ success: false, message: 'Query is required' });
        
        const movies = await searchMovies(query);
        res.json({
            success: true,
            movies
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.fetchTrendingMovies = async (req, res) => {
    try {
        const movies = await getTrendingMovies();

        res.json({
            success: true,
            movies
        });

    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

exports.fetchMovieDetails = async (req, res) => {
    try {
        const movie = await getMovieDetails(req.params.id);
        res.json({
            success: true,
            movie
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};