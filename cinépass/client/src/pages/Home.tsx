import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, Play, Ticket } from 'lucide-react';
import { Mood, Movie } from '../types';
import MovieCard from '../components/MovieCard';
import MoodFilter from '../components/MoodFilter';
import { fetchPopularMovies } from '../utils/tmdb';
import { MOVIES as FALLBACK_MOVIES } from '../constants'; // Fallback

export default function Home() {
  const [activeMood, setActiveMood] = useState<Mood | null>(null);
  const [movies, setMovies] = useState<Movie[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchPopularMovies().then(data => {
      // If no API key or error, use fallback
      setMovies(data.length > 0 ? data : FALLBACK_MOVIES);
    });
  }, []);

  const filteredMovies = useMemo(() => {
    if (!activeMood) return movies;
    return movies.filter(m => m.mood.includes(activeMood));
  }, [activeMood, movies]);

  const handleRandom = () => {
    if (movies.length === 0) return;
    const randomMovie = movies[Math.floor(Math.random() * movies.length)];
    navigate(`/movie/${randomMovie.id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-20"
    >
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?auto=format&fit=crop&w=2000&q=80"
            className="w-full h-full object-cover brightness-[0.4]"
            alt="Hero Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-bold uppercase tracking-widest mb-6">
              <Ticket size={14} />
              <span>Trending Worldwide</span>
            </div>
            <h1 className="text-6xl md:text-7xl font-display font-extrabold text-white leading-tight tracking-tight mb-6">
              Experience the Magic of <span className="text-gradient">Cinema</span>
            </h1>
            <p className="text-lg text-slate-300 mb-10 leading-relaxed max-w-lg">
              Check out the latest releases, pick your favorite mood, and book your tickets in seconds. Premium comfort, legendary films.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => navigate('/movies')}
                className="flex items-center gap-2 px-8 py-4 rounded-full gradient-primary text-white font-bold text-lg shadow-xl shadow-rose-500/10 hover:scale-105 transition-transform"
              >
                Book Now
                <ChevronRight size={20} />
              </button>
              <button className="flex items-center gap-2 px-8 py-4 rounded-full bg-white/10 backdrop-blur-md text-white font-bold text-lg hover:bg-white/20 transition-all border border-white/20">
                <Play size={20} className="fill-white" />
                Watch Trailer
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Recommended Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-20">
        <MoodFilter 
          activeMood={activeMood} 
          onMoodChange={setActiveMood} 
          onRandom={handleRandom} 
        />

        <div className="mt-16 space-y-8">
          <div className="flex justify-between items-end">
            <div className="space-y-1">
              <h2 className="text-3xl font-display font-bold text-slate-900 italic">
                {activeMood ? `Showing ${activeMood} movies` : 'Most Popular Right Now'}
              </h2>
              <div className="h-1.5 w-24 gradient-primary rounded-full" />
            </div>
            <button 
              onClick={() => navigate('/movies')}
              className="text-rose-400 font-bold text-sm flex items-center gap-1 hover:gap-2 transition-all"
            >
              See all movies
              <ChevronRight size={16} />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 lg:gap-8">
            <AnimatePresence mode="popLayout">
              {filteredMovies.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </AnimatePresence>
          </div>
          
          {filteredMovies.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="py-20 text-center space-y-4"
            >
              <div className="text-6xl text-slate-200">🎬</div>
              <h3 className="text-xl font-bold text-slate-400">No movies found for this mood yet.</h3>
              <button 
                onClick={() => setActiveMood(null)}
                className="text-rose-400 font-bold"
              >
                Reset Filter
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
