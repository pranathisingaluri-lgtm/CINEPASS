import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Mail, Lock, Key, ArrowLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword, resetPassword } from '../utils/auth';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP & New Password, 3: Success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await forgotPassword(email);
      setStep(2);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      await resetPassword(email, otp, newPassword);
      setStep(3);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 pb-12 flex flex-col items-center justify-center bg-slate-50 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl p-8 shadow-2xl shadow-slate-200 border border-slate-100"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Key className="text-rose-500" size={32} />
          </div>
          <h1 className="text-3xl font-display font-bold text-slate-900 tracking-tight">
            Forgot Password?
          </h1>
          <p className="text-slate-500 mt-2">
            {step === 1 
              ? "No worries! Enter your email and we'll send you a reset code." 
              : step === 2 
                ? "Enter the 6-digit code sent to your email and your new password."
                : "Your password has been successfully updated."}
          </p>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-rose-50 text-rose-600 p-4 rounded-xl text-sm font-medium mb-6 border border-rose-100"
          >
            {error}
          </motion.div>
        )}

        {step === 1 && (
          <form onSubmit={handleSendOTP} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-400 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all font-medium"
                  placeholder="name@example.com"
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 rounded-2xl gradient-primary text-white font-bold shadow-lg shadow-rose-200 hover:shadow-rose-300 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Send Reset Code"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">6-Digit Code</label>
              <div className="relative">
                <Key className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="text"
                  maxLength={6}
                  required
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-400 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all font-medium tracking-[0.5em] text-center"
                  placeholder="000000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-slate-50 border-2 border-transparent focus:border-rose-400 focus:bg-white rounded-2xl py-3.5 pl-12 pr-4 outline-none transition-all font-medium"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              disabled={loading}
              type="submit"
              className="w-full py-4 rounded-2xl gradient-primary text-white font-bold shadow-lg shadow-rose-200 hover:shadow-rose-300 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : "Update Password"}
            </button>
          </form>
        )}

        {step === 3 && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle2 size={64} className="text-emerald-500" />
            </div>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-4 rounded-2xl gradient-primary text-white font-bold shadow-lg shadow-rose-200 hover:shadow-rose-300 transition-all"
            >
              Back to Login
            </button>
          </div>
        )}

        <div className="mt-8 pt-6 border-t border-slate-100 flex justify-center">
          <Link to="/login" className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-rose-500 transition-colors">
            <ArrowLeft size={16} />
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
