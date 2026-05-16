import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart } from 'lucide-react';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';
import { getWishlist, getCurrentUser } from '../utils/auth';
import { fetchMovieDetails } from '../utils/tmdb';
import { MOVIES as FALLBACK_MOVIES } from '../constants';

export default function Wishlist() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      const user = getCurrentUser();
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const ids = await getWishlist();
        const moviePromises = ids.map(async (id) => {
          // Try to fetch from API
          const movie = await fetchMovieDetails(id);
          if (movie) return movie;
          // Fallback to static data if ID exists there
          return FALLBACK_MOVIES.find(m => m.id === id) || null;
        });

        const results = await Promise.all(moviePromises);
        setMovies(results.filter((m): m is Movie => m !== null));
      } catch (err) {
        console.error('Failed to load wishlist:', err);
      } finally {
        setLoading(false);
      }
    };

    loadWishlist();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto px-4 py-12 pb-24"
    >
      <div className="space-y-1 mb-12 text-center">
        <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">
          My <span className="text-gradient font-black">Wishlist</span>
        </h1>
        <p className="text-slate-500 font-medium">Movies you've saved to watch later.</p>
      </div>

      {movies.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          <AnimatePresence mode="popLayout">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-32 space-y-6">
          <div className="w-24 h-24 bg-rose-50 rounded-full flex items-center justify-center mx-auto">
            <Heart size={40} className="text-rose-400" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-slate-900">Your wishlist is empty</h2>
            <p className="text-slate-500 max-w-sm mx-auto">
              Start adding movies you love to your wishlist to keep track of them!
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/movies'}
            className="px-8 py-4 rounded-full gradient-primary text-white font-bold shadow-lg shadow-rose-200 hover:scale-105 transition-all"
          >
            Explore Movies
          </button>
        </div>
      )}
    </motion.div>
  );
}
