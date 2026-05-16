import { useLocation, useNavigate, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { CheckCircle2, QrCode, Download, ArrowLeft, Home, Calendar, Armchair, Wallet } from 'lucide-react';
import { generateTicketPDF } from '../utils/pdf';
import { getCurrentUser } from '../utils/auth';

export default function BookingConfirmation() {
  const { state } = useLocation();
  const navigate = useNavigate();

  if (!state) return <div className="p-20 text-center">No booking found</div>;

  const { movie, seats, total, time } = state;
  const movieTitle = movie.title;
  const bookingId = Math.random().toString(36).substr(2, 9).toUpperCase();

  const handleDownloadPDF = () => {
    const user = getCurrentUser();
    generateTicketPDF({
      movie,
      seats,
      date: 'Sat, 09 May', // Matches the mock date in SeatSelection
      time,
      totalPrice: total,
      bookingId,
      userName: user ? user.name : 'Guest User'
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="min-h-screen bg-slate-50 py-20 px-4"
    >
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row">
          {/* Left Panel - Success Info */}
          <div className="flex-1 p-8 md:p-12 space-y-10 border-b md:border-b-0 md:border-r border-slate-100">
            <div className="space-y-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-500">
                <CheckCircle2 size={40} />
              </div>
              <h1 className="text-4xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
                Booking <span className="text-emerald-500">Confirmed!</span>
              </h1>
              <p className="text-slate-500 font-medium leading-relaxed">
                Yay! Your tickets for <span className="font-bold text-slate-900">{movieTitle}</span> are all set. We've sent a copy to your email.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Calendar size={12} className="text-rose-400" />
                  Showtime
                </p>
                <p className="text-lg font-display font-extrabold text-slate-800">Sat, 09 May • {time}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Armchair size={12} className="text-rose-400" />
                  Seats
                </p>
                <div className="flex flex-wrap gap-1">
                  {seats.map((s: string) => (
                    <span key={s} className="font-display font-extrabold text-slate-800">{s}</span>
                  )).reduce((prev: any, curr: any) => [prev, ', ', curr])}
                </div>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                  <Wallet size={12} className="text-rose-400" />
                  Total Paid
                </p>
                <p className="text-lg font-display font-extrabold text-rose-400">₹{total}</p>
              </div>
              <div className="space-y-1">
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Booking ID</p>
                <p className="text-lg font-mono font-extrabold text-slate-800 tracking-wider">#{bookingId}</p>
              </div>
            </div>

            <div className="pt-8 flex flex-wrap gap-4">
              <button 
                onClick={handleDownloadPDF}
                className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-slate-900 text-white font-bold hover:bg-slate-800 transition-all"
              >
                <Download size={18} />
                Download Ticket
              </button>
              <button 
                onClick={() => navigate('/')}
                className="flex-1 flex items-center justify-center gap-2 py-4 px-6 rounded-2xl bg-slate-100 text-slate-700 font-bold hover:bg-slate-200 transition-all"
              >
                <Home size={18} />
                Go Home
              </button>
            </div>
          </div>

          {/* Right Panel - Ticket Visual */}
          <div className="w-full md:w-80 bg-slate-50 p-8 flex flex-col items-center justify-center space-y-8 relative">
            {/* Cutouts for ticket look */}
            <div className="absolute top-1/2 -left-4 w-8 h-8 rounded-full bg-slate-50 border-r border-slate-100 hidden md:block" />
            <div className="absolute top-1/2 -right-4 w-8 h-8 rounded-full bg-slate-50 border-l border-slate-100 hidden md:block" />
            
            <div className="p-4 bg-white rounded-3xl shadow-xl shadow-slate-200/50">
              <QrCode size={160} className="text-slate-900" />
            </div>
            <div className="text-center space-y-2">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Scan at the counter</p>
              <div className="h-1 w-12 bg-rose-400 rounded-full mx-auto" />
            </div>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button onClick={() => navigate(-1)} className="text-slate-400 font-bold text-sm flex items-center justify-center gap-2 hover:text-rose-400 transition-colors">
            <ArrowLeft size={16} />
            Need to change something?
          </button>
        </div>
      </div>
    </motion.div>
  );
}
