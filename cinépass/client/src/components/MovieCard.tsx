import React, { useState, useEffect } from 'react';
import { Movie } from '../types';
import { Star, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { toggleWishlist, getWishlist, getCurrentUser } from '../utils/auth';

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      getWishlist().then(list => {
        setIsSaved(list.includes(movie.id));
      });
    }
  }, [movie.id]);

  const handleToggle = async (e: React.MouseEvent) => {
    e.preventDefault(); // prevent navigation to details page
    if (!getCurrentUser()) {
      navigate('/login');
      return;
    }
    try {
      const newList = await toggleWishlist(movie.id);
      setIsSaved(newList.includes(movie.id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      whileHover={{ y: -8 }}
      className="group relative"
    >
      <Link to={`/movie/${movie.id}`}>
        <div className="aspect-[2/3] rounded-24 overflow-hidden relative shadow-lg shadow-slate-200/50">
          <img
            src={movie.poster}
            alt={movie.title}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-5">
            <button className="w-full py-3 rounded-full bg-white text-rose-400 font-bold text-sm shadow-xl transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
              Book Tickets
            </button>
          </div>

          {/* Rating Badge */}
          <div className="absolute top-3 left-3 px-2 py-1 rounded-lg bg-black/50 backdrop-blur-md flex items-center gap-1 text-white">
            <Star size={14} className="fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-bold">{movie.rating}</span>
          </div>

          <button 
            onClick={handleToggle}
            className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-colors ${
              isSaved ? 'bg-rose-400 text-white shadow-lg shadow-rose-400/50' : 'bg-black/20 text-white hover:bg-rose-400'
            }`}
          >
            <Heart size={16} className={isSaved ? 'fill-white' : ''} />
          </button>
        </div>

        <div className="mt-4 space-y-1 px-1">
          <h3 className="font-display font-bold text-lg text-slate-900 group-hover:text-rose-400 transition-colors line-clamp-1">
            {movie.title}
          </h3>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500 uppercase tracking-wider">
            <span>{movie.language}</span>
            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
            <span>{movie.genre[0]}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default MovieCard;
