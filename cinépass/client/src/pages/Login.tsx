import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Mail, Lock, ArrowRight, Github } from 'lucide-react';
import { login } from '../utils/auth';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      login(email, password)
        .then(() => navigate('/profile'))
        .catch((err) => alert(err.message || 'Login failed'));
    }
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
          <Lock size={32} />
        </div>
        
        <h1 className="text-4xl font-display font-extrabold text-slate-900 tracking-tight mb-2">Welcome Back</h1>
        <p className="text-slate-500 font-medium mb-10 text-center">Enter your details to access your CinéPass account</p>

        <form onSubmit={handleLogin} className="w-full space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-400 transition-colors" size={20} />
              <input
                type="email"
                required
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold focus:border-rose-400/10 focus:bg-white transition-all outline-none"
              />
            </div>
            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-400 transition-colors" size={20} />
              <input
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 text-sm font-semibold focus:border-rose-400/10 focus:bg-white transition-all outline-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between px-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input type="checkbox" className="w-4 h-4 rounded border-slate-200 text-rose-400 focus:ring-rose-400" />
              <span className="text-xs font-bold text-slate-500 group-hover:text-slate-700 transition-colors">Remember me</span>
            </label>
            <Link to="/forgot-password">
              <button type="button" className="text-xs font-bold text-rose-400 hover:text-rose-500 transition-colors">Forgot Password?</button>
            </Link>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-2xl gradient-primary text-white font-bold text-lg shadow-xl shadow-rose-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
          >
            Sign In
            <ArrowRight size={20} />
          </button>
        </form>

        <div className="mt-10 w-full">
          <div className="relative flex items-center justify-center mb-8">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
            <span className="relative px-4 text-xs font-bold text-slate-400 uppercase tracking-widest bg-white">Or continue with</span>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm text-slate-600 hover:bg-slate-100 transition-all">
              <img src="https://www.google.com/favicon.ico" className="w-5 h-5 opacity-70" alt="" />
              Google
            </button>
            <button className="flex items-center justify-center gap-3 py-3 px-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-sm text-slate-600 hover:bg-slate-100 transition-all">
              <Github className="w-5 h-5 opacity-70" />
              GitHub
            </button>
          </div>
        </div>

        <p className="mt-10 text-sm font-bold text-slate-500 text-center">
          Prefer OTP? <Link to="/otp-login" className="text-rose-400 hover:text-rose-500 underline underline-offset-4">Login with OTP</Link>
        </p>

        <p className="mt-4 text-sm font-bold text-slate-500">
          New here? <Link to="/signup" className="text-rose-400 hover:text-rose-500 underline underline-offset-4">Create an account</Link>
        </p>
      </div>
    </motion.div>
  );
}
