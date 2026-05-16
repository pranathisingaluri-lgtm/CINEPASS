import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Mail, ShieldCheck, ArrowRight, Smartphone, Loader2 } from 'lucide-react';
import { sendOTP, verifyOTP } from '../utils/auth';

export default function OTPLogin() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'email' | 'otp'>('email');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await sendOTP(email);
      setStep('otp');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await verifyOTP(email, otp);
      navigate('/profile');
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
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
          <ShieldCheck size={32} />
        </div>
        
        <h1 className="text-4xl font-display font-extrabold text-slate-900 tracking-tight mb-2">
          {step === 'email' ? 'Quick Login' : 'Verify Identity'}
        </h1>
        <p className="text-slate-500 font-medium mb-10 text-center">
          {step === 'email' 
            ? 'Enter your email to receive a secure one-time password' 
            : `We've sent a 6-digit code to ${email}`}
        </p>

        <AnimatePresence mode="wait">
          {step === 'email' ? (
            <motion.form
              key="email-form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              onSubmit={handleSendOTP}
              className="w-full space-y-6"
            >
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

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl gradient-primary text-white font-bold text-lg shadow-xl shadow-rose-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Send OTP <ArrowRight size={20} /></>}
              </button>
            </motion.form>
          ) : (
            <motion.form
              key="otp-form"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              onSubmit={handleVerifyOTP}
              className="w-full space-y-6"
            >
              <div className="relative group">
                <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-400 transition-colors" size={20} />
                <input
                  type="text"
                  required
                  maxLength={6}
                  placeholder="Enter 6-digit code"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent rounded-2xl py-4 pl-12 pr-4 text-center text-xl font-display font-bold tracking-[0.5em] focus:border-rose-400/10 focus:bg-white transition-all outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 rounded-2xl gradient-primary text-white font-bold text-lg shadow-xl shadow-rose-500/10 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" /> : <>Verify & Login <ArrowRight size={20} /></>}
              </button>

              <button
                type="button"
                onClick={() => setStep('email')}
                className="w-full text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
              >
                Change Email Address
              </button>
            </motion.form>
          )}
        </AnimatePresence>

        <p className="mt-10 text-sm font-bold text-slate-500">
          Prefer password? <Link to="/login" className="text-rose-400 hover:text-rose-500 underline underline-offset-4">Sign in with password</Link>
        </p>
      </div>
    </motion.div>
  );
}
