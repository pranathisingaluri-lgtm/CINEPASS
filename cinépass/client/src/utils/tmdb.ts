import { Movie, Mood } from '../types';
import { API_BASE } from './auth';

// The user should place their TMDB API Key in a .env file as VITE_TMDB_API_KEY
const API_KEY = import.meta.env.VITE_TMDB_API_KEY || 'YOUR_TMDB_API_KEY_HERE';
const BASE_URL = 'https://api.themoviedb.org/3';

// A simple map to convert TMDB genre IDs to strings
const genreMap: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Sci-Fi',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western'
};

// Maps TMDB genre IDs to our app's Mood types roughly
const mapGenresToMood = (genreIds: number[]): Mood[] => {
  const moods: Set<Mood> = new Set();
  if (!genreIds) return ['chill'];

  if (genreIds.includes(35) || genreIds.includes(16) || genreIds.includes(10751)) moods.add('happy');
  if (genreIds.includes(18) || genreIds.includes(10752)) moods.add('sad');
  if (genreIds.includes(10749)) moods.add('romantic');
  if (genreIds.includes(53) || genreIds.includes(27) || genreIds.includes(9648)) moods.add('thriller');
  if (genreIds.includes(99) || genreIds.includes(878)) moods.add('chill');

  if (moods.size === 0) moods.add('chill'); // Default
  return Array.from(moods);
};

export const mapTMDBToMovie = (tmdbMovie: any): Movie => {
  return {
    id: tmdbMovie.id.toString(),
    title: tmdbMovie.title,
    rating: Math.round(tmdbMovie.vote_average * 10) / 10,
    language: tmdbMovie.original_language === 'en' ? 'English' : tmdbMovie.original_language.toUpperCase(),
    genre: tmdbMovie.genre_ids ? tmdbMovie.genre_ids.map((id: number) => genreMap[id] || 'Unknown') : (tmdbMovie.genres ? tmdbMovie.genres.map((g: any) => g.name) : ['Action']),
    mood: tmdbMovie.genre_ids ? mapGenresToMood(tmdbMovie.genre_ids) : ['chill'],
    duration: tmdbMovie.runtime ? `${Math.floor(tmdbMovie.runtime / 60)}h ${tmdbMovie.runtime % 60}m` : '2h 10m',
    description: tmdbMovie.overview,
    cast: [], // Can be populated if credits are fetched
    poster: tmdbMovie.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbMovie.poster_path}` : 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=800&q=80',
    banner: tmdbMovie.backdrop_path ? `https://image.tmdb.org/t/p/original${tmdbMovie.backdrop_path}` : 'https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1200&q=80',
    showtimes: ['10:30 AM', '02:00 PM', '06:30 PM', '09:45 PM'], // Mock showtimes
  };
};

export const fetchPopularMovies = async (): Promise<Movie[]> => {
  try {
    const response = await fetch(`${API_BASE}/api/movies/trending`);
    if (!response.ok) return [];
    const data = await response.json();
    if (data.success && data.movies) {
      return data.movies.map(mapTMDBToMovie);
    }
    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const searchMovies = async (query: string): Promise<Movie[]> => {
  try {
    const response = await fetch(`${API_BASE}/api/movies/search?query=${encodeURIComponent(query)}`);
    if (!response.ok) return [];
    const data = await response.json();
    if (data.success && data.movies) {
      return data.movies.map(mapTMDBToMovie);
    }
    return [];
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const fetchMovieDetails = async (id: string): Promise<Movie | null> => {
  try {
    const response = await fetch(`${API_BASE}/api/movies/${id}`);
    if (!response.ok) return null;
    
    const data = await response.json();
    if (data.success && data.movie) {
      const movie = mapTMDBToMovie(data.movie);
      // Backend already included credits in the detail call
      if (data.movie.credits && data.movie.credits.cast) {
        movie.cast = data.movie.credits.cast.slice(0, 5).map((actor: any) => actor.name);
      }
      return movie;
    }
    return null;
  } catch (error) {
    console.error(error);
    return null;
  }
};
