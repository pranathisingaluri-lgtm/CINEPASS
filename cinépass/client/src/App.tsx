/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import BackgroundDecor from './components/BackgroundDecor';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import SeatSelection from './pages/SeatSelection';
import Login from './pages/Login';
import Signup from './pages/Signup';
import OTPLogin from './pages/OTPLogin';
import Profile from './pages/Profile';
import Wishlist from './pages/Wishlist';
import ForgotPassword from './pages/ForgotPassword';
import RequireAuth from './components/RequireAuth';
import BookingConfirmation from './pages/BookingConfirmation';
import MovieListing from './pages/MovieListing';

function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<Home />} />
        <Route path="/movies" element={<MovieListing />} />
        <Route path="/movie/:id" element={<MovieDetails />} />
        <Route path="/book/:id" element={<SeatSelection />} />
        <Route path="/confirmation" element={<BookingConfirmation />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp-login" element={<OTPLogin />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
        <Route path="/wishlist" element={<RequireAuth><Wishlist /></RequireAuth>} />
      </Routes>
    </AnimatePresence>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col font-sans relative overflow-hidden">
        <BackgroundDecor />
        <div className="relative z-10 flex flex-col flex-1">
          <Navbar />
          <main className="flex-1">
            <AnimatedRoutes />
          </main>
          <footer className="bg-[#0a0505]/80 backdrop-blur-md text-white py-12 border-t border-white/5">
            <div className="max-w-7xl mx-auto px-4 text-center">
              <div className="text-2xl font-display font-bold tracking-tight mb-4">
                Ciné<span className="text-[#9e121e]">Pass</span>
              </div>
              <p className="text-slate-400 text-sm max-w-md mx-auto">
                Your gateway to premium cinematic experiences. Book tickets for the latest blockbusters effortlessly.
              </p>
              <div className="mt-8 pt-8 border-t border-white/5 text-slate-500 text-xs">
                © 2026 CinéPass. All rights reserved.
              </div>
            </div>
          </footer>
        </div>
      </div>
    </BrowserRouter>
  );
}


