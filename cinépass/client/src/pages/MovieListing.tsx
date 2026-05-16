import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, SlidersHorizontal, Grid, List, Star } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { Movie } from '../types';
import MovieCard from '../components/MovieCard';
import { fetchPopularMovies, searchMovies as apiSearchMovies } from '../utils/tmdb';
import { MOVIES as FALLBACK_MOVIES } from '../constants'; // Fallback

export default function MovieListing() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  
  const genres = ['All', 'Action', 'Drama', 'Sci-Fi', 'Thriller', 'Animation', 'Romance'];

  useEffect(() => {
    const query = searchParams.get('search');
    if (query) {
      setIsSearching(true);
      setSearchQuery(query);
      apiSearchMovies(query).then(data => {
        setMovies(data);
        setIsSearching(false);
      });
    } else {
      fetchPopularMovies().then(data => {
        setMovies(data.length > 0 ? data : FALLBACK_MOVIES);
      });
    }
  }, [searchParams]);

  const filteredMovies = useMemo(() => {
    return movies.filter(movie => {
      const matchesSearch = movie.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesGenre = selectedGenre === 'All' || movie.genre.includes(selectedGenre);
      return matchesSearch && matchesGenre;
    });
  }, [searchQuery, selectedGenre, movies]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-slate-50 min-h-screen pb-20"
    >
      {/* Header */}
      <div className="bg-white border-b border-slate-100 py-12">
        <div className="max-w-7xl mx-auto px-4 space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-1">
              <h1 className="text-4xl md:text-5xl font-display font-extrabold text-slate-900 tracking-tight">Now <span className="text-gradient font-black">Showing</span></h1>
              <p className="text-slate-500 font-medium">Explore the latest cinematic releases in your city.</p>
            </div>
            
            <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-50 p-1 rounded-xl">
              <button className="px-4 py-2 rounded-lg bg-white shadow-sm text-slate-900"><Grid size={14} /></button>
              <button className="px-4 py-2 rounded-lg hover:text-slate-600"><List size={14} /></button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-4 items-center">
            <div className="relative flex-1 group w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-400 transition-colors" size={20} />
              <input
                type="text"
                placeholder="Search by movie title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    setSearchParams({ search: searchQuery });
                  }
                }}
                className="w-full py-4 pl-12 pr-4 bg-slate-50 rounded-2xl font-semibold border-2 border-transparent focus:bg-white focus:border-rose-400/20 transition-all outline-none"
              />
            </div>
            
            <div className="flex gap-2 overflow-x-auto w-full lg:w-auto pb-2 lg:pb-0 scrollbar-hide">
              {genres.map(genre => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-6 py-4 rounded-2xl font-bold text-sm whitespace-nowrap transition-all ${
                    selectedGenre === genre
                      ? 'gradient-primary text-white shadow-lg shadow-rose-200'
                      : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-100'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>

            <button className="hidden lg:flex items-center gap-2 px-6 py-4 rounded-2xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all">
              <SlidersHorizontal size={18} />
              Filters
            </button>
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </AnimatePresence>
        </div>

        {filteredMovies.length === 0 && (
          <div className="text-center py-40 space-y-4">
            <div className="text-6xl text-slate-200">🔍</div>
            <h3 className="text-xl font-bold text-slate-400 italic">No movies match your filters.</h3>
            <button 
              onClick={() => { setSearchQuery(''); setSelectedGenre('All'); }}
              className="text-rose-400 font-bold underline underline-offset-4"
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
