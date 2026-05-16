import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, User, LogIn, Menu, Film, LogOut, Heart } from 'lucide-react';
import { useState } from 'react';
import { getCurrentUser, logout } from '../utils/auth';

export default function Navbar() {
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [navSearch, setNavSearch] = useState('');
  const navigate = useNavigate();
  const [city, setCity] = useState('Mumbai');

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && navSearch.trim()) {
      navigate(`/movies?search=${encodeURIComponent(navSearch.trim())}`);
      setNavSearch('');
    }
  };

  const user = getCurrentUser();
  const [currentUser, setCurrentUser] = useState(user);

  // update when localStorage changes (login/logout)
  window.addEventListener('storage', () => setCurrentUser(getCurrentUser()));

  const detectLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setCity('Detecting...');

    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        // Using a free reverse geocoding API
        const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
        const data = await response.json();
        
        const cityName = data.city || data.locality || data.principalSubdivision || 'Mumbai';
        setCity(cityName);
        
        // Store for other components to use
        localStorage.setItem('cinepass_coords', JSON.stringify({ lat: latitude, lon: longitude }));
      } catch (err) {
        console.error("Location error:", err);
        setCity('Mumbai');
      }
    }, (error) => {
      console.error(error);
      setCity('Mumbai');
      alert("Please enable location permissions in your browser settings.");
    });
  };

  return (
    <nav className="sticky top-0 z-50 glass-dark border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 flex-shrink-0">
            <div className="w-10 h-10 rounded-xl gradient-primary flex items-center justify-center text-white shadow-lg shadow-red-900/50">
              <Film size={24} />
            </div>
            <span className="text-2xl font-display font-bold tracking-tight text-white hidden sm:block">
              Ciné<span className="text-[#9e121e]">Pass</span>
            </span>
          </Link>

          {/* Search Bar */}
          <div className={`flex-1 max-w-xl transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-red-400 transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search for movies, events, plays..."
                value={navSearch}
                onChange={(e) => setNavSearch(e.target.value)}
                onKeyDown={handleSearch}
                className="w-full bg-white/5 border-none rounded-full py-2.5 pl-10 pr-4 text-sm text-white focus:ring-2 focus:ring-red-500/30 focus:bg-white/10 transition-all outline-none placeholder:text-slate-500"
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <div 
              onClick={detectLocation}
              className="hidden lg:flex items-center gap-1.5 text-sm font-medium text-slate-300 cursor-pointer hover:text-red-400 transition-colors group"
            >
              <MapPin size={16} className="group-hover:animate-bounce" />
              <span>{city}</span>
            </div>
            
      {currentUser ? (
              <button
        onClick={() => { logout(); setCurrentUser(null); navigate('/'); }}
                className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm transition-all bg-white/5 text-slate-200 hover:bg-white/10"
              >
                <LogOut size={16} />
                Sign Out
              </button>
            ) : (
              <Link to="/login">
                <button className="hidden sm:flex items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm transition-all gradient-primary text-white shadow-lg shadow-red-900/50 hover:shadow-red-800/80 hover:translate-y-[-1px] active:translate-y-0">
                  <LogIn size={16} />
                  Sign In
                </button>
              </Link>
            )}

            <Link to="/wishlist" className="p-2 rounded-full bg-white/5 text-slate-300 hover:text-red-400 hover:bg-white/10 transition-all sm:hidden lg:block">
              <Heart size={20} />
            </Link>

            <Link to="/profile" className="p-2 rounded-full bg-white/5 text-slate-300 hover:text-red-400 hover:bg-white/10 transition-all sm:hidden lg:block">
              <User size={20} />
            </Link>

            <button className="p-2 rounded-full bg-white/5 text-slate-300 hover:bg-white/10 transition-all block lg:hidden">
              <Menu size={20} />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
