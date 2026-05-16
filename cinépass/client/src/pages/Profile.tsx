import { motion } from 'motion/react';
import { User, Mail, Shield, History, ChevronRight, Settings, LogOut, Ticket } from 'lucide-react';
import { useEffect, useState } from 'react';
import { authFetch, getCurrentUser } from '../utils/auth';

export default function Profile() {
  const [user, setUser] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);

  useEffect(() => {
    const local = getCurrentUser();
    if (local) setUser(local);
    const api = (import.meta as any).env?.VITE_API_URL || 'http://localhost:4000';
    
    // Fetch user details
    authFetch(`${api}/api/me`)
      .then(async (r) => {
        if (!r.ok) return;
        const data = await r.json();
        setUser(data);
      })
      .catch(() => {});

    // Fetch real bookings
    authFetch(`${api}/api/bookings`)
      .then(async (r) => {
        if (!r.ok) return;
        const data = await r.json();
        if (Array.isArray(data)) {
          setBookings(data.map((b: any) => ({
            id: b._id.substring(b._id.length - 5).toUpperCase(),
            movie: b.movieTitle,
            date: b.date,
            time: b.time,
            seats: b.seats,
            amount: b.amount,
            status: b.status
          })));
        }
      })
      .catch(() => {});
  }, []);

  const mockBookings = [
    { id: 'BK102', movie: 'Interstellar', date: '08 May 2026', time: '06:30 PM', seats: ['A4, A5'], amount: '₹500', status: 'Upcoming' },
    { id: 'BK098', movie: 'La La Land', date: '01 May 2026', time: '04:00 PM', seats: ['C12'], amount: '₹250', status: 'Completed' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 py-12 px-4"
    >
      <div className="max-w-6xl mx-auto grid lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white rounded-[32px] p-8 shadow-xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center text-center">
            <div className="w-24 h-24 rounded-full gradient-primary p-1 mb-6">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center text-rose-400 font-display font-extrabold text-4xl">
                {user ? user.name?.[0] : 'P'}
              </div>
            </div>
            <h2 className="text-xl font-display font-extrabold text-slate-900 tracking-tight">{user ? user.name : 'Profile'}</h2>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1 mb-8">{user ? user.email : ''}</p>
            
            <button className="w-full py-4 rounded-2xl bg-slate-50 text-slate-600 font-bold text-sm hover:bg-slate-100 transition-all flex items-center justify-center gap-2">
              <Settings size={18} />
              Edit Profile
            </button>
          </div>

          <div className="bg-white rounded-[32px] p-2 shadow-xl shadow-slate-200/50 border border-slate-100 overflow-hidden">
            {[
              { icon: <History size={18} />, label: 'Booking History', active: true },
              { icon: <Ticket size={18} />, label: 'My Coupons', active: false },
              { icon: <Shield size={18} />, label: 'Security', active: false },
              { icon: <LogOut size={18} />, label: 'Logout', active: false, color: 'text-rose-400' },
            ].map((item) => (
              <button
                key={item.label}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all ${
                  item.active ? 'bg-rose-50 text-rose-600 shadow-inner' : 'hover:bg-slate-50 text-slate-600'
                } ${item.color || ''}`}
              >
                <div className="flex items-center gap-3 font-bold text-sm">
                  {item.icon}
                  {item.label}
                </div>
                <ChevronRight size={16} className={item.active ? 'opacity-100' : 'opacity-0'} />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-8">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-display font-bold text-slate-900 italic">Booking History</h1>
            <button className="text-sm font-bold text-rose-400 hover:underline">View All</button>
          </div>

          <div className="space-y-4">
                {(bookings.length ? bookings : mockBookings).map((booking) => (
              <motion.div
                key={booking.id}
                whileHover={{ scale: 1.01 }}
                className="bg-white rounded-[32px] p-6 shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col md:flex-row items-center gap-6"
              >
                <div className="w-20 h-24 rounded-2xl bg-slate-100 overflow-hidden flex-shrink-0 relative group">
                  <div className="absolute inset-0 gradient-primary opacity-10 group-hover:opacity-20 transition-opacity" />
                  <div className="w-full h-full flex items-center justify-center text-rose-300">
                    <Ticket size={24} />
                  </div>
                </div>
                
                <div className="flex-1 space-y-1 text-center md:text-left">
                  <h3 className="text-lg font-display font-extrabold text-slate-900">{booking.movie}</h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                    {booking.date} • {booking.time}
                  </p>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-1 gap-x-8 gap-y-1 text-center md:text-right">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Booking ID</p>
                  <p className="text-sm font-mono font-bold text-slate-700">#{booking.id}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                    booking.status === 'Upcoming' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {booking.status}
                  </div>
                  <button className="p-3 rounded-full bg-slate-50 text-slate-400 hover:text-rose-400 hover:bg-rose-50 transition-all">
                    <ChevronRight size={20} />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="p-8 rounded-[40px] bg-slate-950 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-rose-400 opacity-20 blur-[100px] group-hover:opacity-40 transition-opacity" />
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="space-y-2 text-center md:text-left">
                <h3 className="text-2xl font-display font-extrabold">CinéPass Prestige</h3>
                <p className="text-slate-400 text-sm max-w-sm">Unlock unlimited 2D movies and priority booking with our premium membership.</p>
              </div>
              <button className="px-10 py-4 rounded-2xl bg-white text-slate-900 font-bold text-sm hover:scale-105 active:scale-95 transition-all">
                Upgrade Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
