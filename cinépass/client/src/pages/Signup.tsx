import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, User, ArrowRight, ShieldCheck } from 'lucide-react';
import { signup } from '../utils/auth';

export default function Signup() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password } = formData;
    signup(name, email, password)
      .then(() => navigate('/profile'))
      .catch((err) => alert(err.message || 'Signup failed'));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-slate-50 flex items-center justify-center p-4 py-20"
    >
      <div className="w-full max-w-lg bg-white rounded-[40px] p-8 md:p-12 shadow-2xl shadow-slate-200/50 border border-slate-100 flex flex-col items-center">
        <div className="w-16 h-16 rounded-2xl gradient-primary mb-8 flex items-center justify-center text-white shadow-lg shadow-rose-100">
          <ShieldCheck size={32} />
        </div>
        
        <h1 className="text-4xl font-display font-extrabold text-slate-900 tracking-tight mb-2">Join CinéPass</h1>
        <p className="text-slate-500 font-medium mb-10 text-center">Start your luxury cinematic journey today</p>

        <form onSubmit={handleSignup} className="w-full space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-400 transition-colors" size={20} />
              <input
                type="text"
                required
                placeholder="Full Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold focus:border-rose-400/10 focus:bg-white transition-all outline-none"
              />
            </div>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-400 transition-colors" size={20} />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold focus:border-rose-400/10 focus:bg-white transition-all outline-none"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-400 transition-colors" size={20} />
              <input
                type="password"
                required
                placeholder="Create Password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold focus:border-rose-400/10 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-100 flex gap-3 italic">
            <div className="w-2 h-2 rounded-full bg-amber-400 mt-1.5 shrink-0" />
            <p className="text-[10px] text-amber-700 font-bold leading-relaxed tracking-wide">
              BY JOINING, YOU AGREE TO OUR TERMS OF SERVICE AND PRIVACY POLICY. WE PROMISE NOT TO SPAM YOUR INBOX.
            </p>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl gradient-primary text-white font-bold text-lg shadow-xl shadow-rose-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Create Account
            <ArrowRight size={20} />
          </button>
        </form>

        <p className="mt-10 text-sm font-bold text-slate-500 text-center">
          Already have an account? <Link to="/login" className="text-rose-400 hover:text-rose-500 underline underline-offset-4">Log in here</Link>
        </p>
      </div>
    </motion.div>
  );
}
