// import.meta.env typing can be missing in some TS configs; cast to any to be safe
const meta: any = import.meta;
export const API_BASE = (meta.env && meta.env.VITE_API_URL) || 'http://localhost:4000';

export async function signup(name: string, email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Signup failed');
  // store full auth payload (includes token)
  localStorage.setItem('cinepass_user', JSON.stringify(data));
  return data;
}

export async function sendOTP(email: string) {
  const res = await fetch(`${API_BASE}/api/auth/send-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to send OTP');
  return data;
}

export async function verifyOTP(email: string, otp: string) {
  const res = await fetch(`${API_BASE}/api/auth/verify-otp`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Invalid OTP');
  localStorage.setItem('cinepass_user', JSON.stringify(data));
  return data;
}

export async function login(email: string, password: string) {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Login failed');
  localStorage.setItem('cinepass_user', JSON.stringify(data));
  return data;
}

export function logout() {
  localStorage.removeItem('cinepass_user');
}

export function getCurrentUser() {
  try {
    const raw = localStorage.getItem('cinepass_user');
    return raw ? JSON.parse(raw) : null;
  } catch (e) {
    return null;
  }
}

export function getToken() {
  const user = getCurrentUser();
  return user && user.token ? user.token : null;
}

export async function authFetch(input: RequestInfo, init?: RequestInit) {
  const token = getToken();
  const headers = new Headers(init && init.headers ? init.headers : {});
  if (token) headers.set('Authorization', `Bearer ${token}`);
  const res = await fetch(input, { ...init, headers });
  return res;
}

export async function forgotPassword(email: string) {
  const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to send reset code');
  return data;
}

export async function resetPassword(email: string, otp: string, newPassword: string) {
  const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, otp, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to reset password');
  return data;
}

export async function getWishlist(): Promise<string[]> {
  try {
    const res = await authFetch(`${API_BASE}/api/wishlist`);
    if (!res.ok) return [];
    return await res.json();
  } catch (err) {
    return [];
  }
}

export async function toggleWishlist(movieId: string): Promise<string[]> {
  const res = await authFetch(`${API_BASE}/api/wishlist/toggle`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ movieId })
  });
  if (!res.ok) throw new Error('Failed to toggle wishlist');
  const data = await res.json();
  return data.wishlist;
}
