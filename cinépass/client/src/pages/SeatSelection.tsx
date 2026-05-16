import { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, Info, Armchair } from 'lucide-react';
import { fetchMovieDetails } from '../utils/tmdb';
import { MOVIES as FALLBACK_MOVIES } from '../constants'; // Fallback
import { Movie } from '../types';

export default function SeatSelection() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const time = searchParams.get('time') || '06:00 PM';
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);
  const [theaters, setTheaters] = useState<any[]>([]);
  const [selectedTheater, setSelectedTheater] = useState<any>(null);

  useEffect(() => {
    if (id) {
      fetchMovieDetails(id).then(data => {
        if (data) {
          setMovie(data);
        } else {
          setMovie(FALLBACK_MOVIES.find(m => m.id === id) || null);
        }
        setLoading(false);
      });

      // Fetch nearby theaters
      const coordsRaw = localStorage.getItem('cinepass_coords');
      if (coordsRaw) {
        const { lat, lon } = JSON.parse(coordsRaw);
        const api = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';
        fetch(`${api}/api/theaters?lat=${lat}&lon=${lon}`)
          .then(res => res.json())
          .then(data => {
            setTheaters(data);
            if (data.length > 0) setSelectedTheater(data[0]);
          })
          .catch(err => console.error("Theater fetch error:", err));
      }
    }
  }, [id]);
  
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const columns = Array.from({ length: 12 }, (_, i) => i + 1);
  const occupiedSeats = ['B4', 'B5', 'C8', 'F2', 'F3', 'G10'];

  const toggleSeat = (seatId: string) => {
    if (occupiedSeats.includes(seatId)) return;
    setSelectedSeats(prev => 
      prev.includes(seatId) ? prev.filter(s => s !== seatId) : [...prev, seatId]
    );
  };

  const calculateTotal = () => selectedSeats.length * 250;

  if (!movie) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="min-h-screen bg-slate-50 flex flex-col"
    >
      {/* Header */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-50 rounded-full transition-colors">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="font-display font-bold text-lg text-slate-900">{movie.title}</h1>
              <p className="text-xs text-slate-500 font-medium">Sat, 09 May • {time}</p>
            </div>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-slate-50 border border-slate-200">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-600">80+ Seats Available</span>
          </div>
        </div>
      </div>

      <div className="flex-1 max-w-7xl mx-auto w-full px-4 py-12 flex flex-col items-center">
        {/* Theater Selection */}
        {theaters.length > 0 && (
          <div className="w-full max-w-4xl mb-12 space-y-4">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest text-center">Select Theater Near You</h3>
            <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide justify-center">
              {theaters.map(t => (
                <button
                  key={t.id}
                  onClick={() => setSelectedTheater(t)}
                  className={`flex-shrink-0 px-6 py-3 rounded-2xl border-2 transition-all ${
                    selectedTheater?.id === t.id 
                      ? 'border-rose-400 bg-rose-50 text-rose-600 shadow-md shadow-rose-100' 
                      : 'border-slate-100 bg-white text-slate-500 hover:border-slate-200'
                  }`}
                >
                  <p className="font-bold whitespace-nowrap">{t.name}</p>
                  <p className="text-[10px] opacity-70 whitespace-nowrap">{t.address}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Screen */}
        <div className="w-full max-w-2xl mb-24 relative">
          <div className="h-2 w-full bg-slate-300 rounded-full shadow-[0_20px_60px_-10px_rgba(244,63,94,0.3)]" />
          <p className="text-center text-[10px] font-bold text-slate-400 mt-4 uppercase tracking-[0.3em]">Screen this way</p>
        </div>

        {/* Seat Grid */}
        <div className="space-y-4">
          {rows.map(row => (
            <div key={row} className="flex gap-4 items-center">
              <span className="w-6 text-xs font-bold text-slate-400 text-center">{row}</span>
              <div className="flex gap-2">
                {columns.map(col => {
                  const seatId = `${row}${col}`;
                  const isSelected = selectedSeats.includes(seatId);
                  const isOccupied = occupiedSeats.includes(seatId);
                  
                  return (
                    <button
                      key={col}
                      onClick={() => toggleSeat(seatId)}
                      disabled={isOccupied}
                      className={`
                        w-8 h-8 rounded-lg relative transition-all duration-300
                        flex items-center justify-center text-[10px] font-bold
                        ${isOccupied ? 'bg-slate-200 text-slate-400 cursor-not-allowed' : 
                          isSelected ? 'gradient-primary text-white scale-110 shadow-lg shadow-rose-200' : 
                          'bg-white border border-slate-200 text-slate-600 hover:border-rose-400 hover:text-rose-400'}
                        ${col === 3 || col === 9 ? 'mr-8' : ''}
                      `}
                    >
                      <Armchair size={14} className={isSelected ? 'animate-bounce' : ''} />
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Legend */}
        <div className="mt-20 flex gap-8">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-white border border-slate-200" />
            <span className="text-sm text-slate-500 font-medium">Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-slate-200" />
            <span className="text-sm text-slate-500 font-medium">Occupied</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md gradient-primary shadow-lg shadow-rose-200" />
            <span className="text-sm text-slate-500 font-medium">Selected</span>
          </div>
        </div>
      </div>

      {/* Floating Checkout Bar */}
      <AnimatePresence>
        {selectedSeats.length > 0 && (
          <motion.div
            initial={{ y: 100 }}
            animate={{ y: 0 }}
            exit={{ y: 100 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 w-[90%] max-w-4xl z-50"
          >
            <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-8">
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Seats Selected</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSeats.map(s => (
                      <span key={s} className="px-3 py-1 rounded-full bg-white/10 text-rose-400 font-display font-bold text-sm">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="h-10 w-px bg-slate-800" />
                <div>
                  <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">Total Amount</p>
                  <p className="text-2xl font-display font-bold text-white italic">₹{calculateTotal()}</p>
                </div>
              </div>
              
              <button
                onClick={async () => {
                  try {
                    const api = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';
                    const res = await (await import('../utils/auth')).authFetch(`${api}/api/bookings`, {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({
                        movieTitle: movie.title,
                        theaterName: selectedTheater?.name || 'CinéPass Multiplex',
                        seats: selectedSeats,
                        amount: `₹${calculateTotal()}`,
                        date: 'Sat, 09 May', // Mock date for now, could be dynamic
                        time: time
                      })
                    });
                    
                    if (!res.ok) throw new Error('Booking failed');
                    
                    navigate('/confirmation', { 
                      state: { 
                        movie: movie, 
                        theaterName: selectedTheater?.name || 'CinéPass Multiplex',
                        seats: selectedSeats, 
                        total: calculateTotal(),
                        time: time 
                      } 
                    });
                  } catch (err: any) {
                    alert(err.message || 'Booking failed. Please login first.');
                    navigate('/login');
                  }
                }}
                className="w-full md:w-auto px-10 py-4 rounded-2xl gradient-primary text-white font-bold text-lg hover:scale-105 active:scale-95 transition-all shadow-xl shadow-rose-500/20"
              >
                Proceed to Checkout
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
