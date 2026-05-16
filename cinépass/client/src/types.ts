export type Mood = 'happy' | 'sad' | 'romantic' | 'thriller' | 'chill';

export interface Movie {
  id: string;
  title: string;
  rating: number;
  language: string;
  genre: string[];
  mood: Mood[];
  duration: string;
  description: string;
  cast: string[];
  poster: string;
  banner: string;
  showtimes: string[];
}

export interface User {
  id: string;
  name: string;
  email: string;
  bookings: Booking[];
}

export interface Booking {
  id: string;
  movieId: string;
  movieTitle: string;
  showtime: string;
  seats: string[];
  totalAmount: number;
  date: string;
}
