const axios = require('axios');

const tmdb = axios.create({
    baseURL: 'https://api.themoviedb.org/3',
    headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        'Content-Type': 'application/json'
    }
});

exports.getTrendingMovies = async () => {
    const res = await tmdb.get('/trending/movie/week');

    return res.data.results;
};

exports.getMovieDetails = async (movieId) => {
    const [details, credits] = await Promise.all([
        tmdb.get(`/movie/${movieId}`),
        tmdb.get(`/movie/${movieId}/credits`)
    ]);

    return {
        ...details.data,
        credits: credits.data
    };
};

exports.searchMovies = async (query) => {
    const res = await tmdb.get('/search/movie', {
        params: { query }
    });

    return res.data.results;
};