import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Star, Clock, Globe, Calendar, Share2, Heart, Play } from 'lucide-react';
import { useState, useEffect } from 'react';
import { fetchMovieDetails } from '../utils/tmdb';
import { MOVIES as FALLBACK_MOVIES } from '../constants'; // Fallback
import { Movie } from '../types';
import { toggleWishlist, getWishlist, getCurrentUser } from '../utils/auth';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (id) {
      fetchMovieDetails(id).then(data => {
        if (data) {
          setMovie(data);
        } else {
          // Fallback to constants if API key is not set or fetch fails
          setMovie(FALLBACK_MOVIES.find(m => m.id === id) || null);
        }
        setLoading(false);
      });

      const user = getCurrentUser();
      if (user) {
        getWishlist().then(list => {
          setIsSaved(list.includes(id));
        });
      }
    }
  }, [id]);

  const handleToggleWishlist = async () => {
    if (!id) return;
    if (!getCurrentUser()) {
      navigate('/login');
      return;
    }
    try {
      const newList = await toggleWishlist(id);
      setIsSaved(newList.includes(id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-20 text-center text-slate-500 font-bold">Loading movie details...</div>;
  if (!movie) return <div className="p-20 text-center font-bold text-xl">Movie not found</div>;

  const dates = [
    { day: 'TODAY', date: '09 MAY' },
    { day: 'TOM', date: '10 MAY' },
    { day: 'MON', date: '11 MAY' },
    { day: 'TUE', date: '12 MAY' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="pb-20"
    >
      {/* Banner */}
      <div className="relative h-[60vh] overflow-hidden">
        <img
          src={movie.banner}
          className="w-full h-full object-cover"
          alt={movie.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
        
        <div className="absolute bottom-10 left-0 w-full">
          <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-end gap-8">
            <motion.div
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="w-48 sm:w-64 aspect-[2/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/10 hidden sm:block"
            >
              <img src={movie.poster} className="w-full h-full object-cover" alt="" />
            </motion.div>
            
            <div className="flex-1 space-y-4 pb-4">
              <div className="flex flex-wrap gap-2">
                {movie.genre.map(g => (
                  <span key={g} className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/10 uppercase tracking-widest">
                    {g}
                  </span>
                ))}
              </div>
              <h1 className="text-4xl md:text-6xl font-display font-extrabold text-white tracking-tight">
                {movie.title}
              </h1>
              <div className="flex flex-wrap items-center gap-6 text-slate-300 font-medium">
                <div className="flex items-center gap-2">
                  <Star className="text-yellow-400 fill-yellow-400" size={18} />
                  <span className="text-white font-bold">{movie.rating}</span>
                  <span className="text-xs text-slate-400">/ 10</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={18} />
                  <span>{movie.duration}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Globe size={18} />
                  <span>{movie.language}</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 mb-4">
              <button 
                onClick={handleToggleWishlist}
                className={`p-4 rounded-full backdrop-blur-md border transition-all ${
                  isSaved ? 'bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-500/50' : 'bg-white/10 border-white/20 text-white hover:bg-white/20'
                }`}
              >
                <Heart size={20} className={isSaved ? 'fill-white' : ''} />
              </button>
              <button className="p-4 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all">
                <Share2 size={20} />
              </button>
            </div>
          </div>
        </div>
        
        <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center text-white border border-white/30 hover:scale-110 transition-transform group">
          <Play size={40} className="fill-white translate-x-1" />
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-4 mt-12">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            <section className="space-y-4">
              <h2 className="text-2xl font-display font-bold text-slate-900 italic">About the Movie</h2>
              <p className="text-slate-600 leading-relaxed text-lg">
                {movie.description}
              </p>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-display font-bold text-slate-900 italic">Top Cast</h2>
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
                {movie.cast.map((actor) => (
                  <div key={actor} className="flex-shrink-0 text-center space-y-3">
                    <div className="w-20 h-20 rounded-full bg-slate-200 shadow-inner flex items-center justify-center text-slate-400 font-bold text-xl uppercase">
                      {actor[0]}
                    </div>
                    <span className="block text-sm font-semibold text-slate-800 whitespace-nowrap">{actor}</span>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar - Quick Booking */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 space-y-8">
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-900 font-bold">
                  <Calendar size={18} className="text-rose-400" />
                  <span>Select Date</span>
                </div>
                <div className="flex gap-3">
                  {dates.map((d, index) => (
                    <button
                      key={d.date}
                      onClick={() => setSelectedDate(index)}
                      className={`flex-1 py-3 px-2 rounded-2xl border-2 transition-all ${
                        selectedDate === index
                          ? 'border-rose-400 bg-rose-50 text-rose-600 shadow-md shadow-rose-100'
                          : 'border-slate-100 bg-slate-50 text-slate-500 hover:border-slate-200'
                      }`}
                    >
                      <span className="block text-[10px] font-bold uppercase tracking-widest">{d.day}</span>
                      <span className="block text-lg font-display font-extrabold">{d.date.split(' ')[0]}</span>
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-bold text-slate-900">Showtimes</h3>
                <div className="grid grid-cols-2 gap-3">
                  {movie.showtimes.map((time) => (
                    <button
                      key={time}
                      onClick={() => navigate(`/book/${movie.id}?time=${time}`)}
                      className="py-3 px-4 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold text-sm hover:border-rose-400 hover:text-rose-400 hover:shadow-lg transition-all"
                    >
                      {time}
                    </button>
                  ))}
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 text-center">
                <p className="text-xs text-slate-400 font-medium italic">Cancellation available 2 hours before showtime</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
