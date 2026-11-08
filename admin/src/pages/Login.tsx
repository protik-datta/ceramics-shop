import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../lib/auth';
import { btnPrimary, inputCls } from '../components/ui';

export default function Login() {
  const { authed, login, configured } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  if (authed) return <Navigate to="/" replace />;

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const r = await login(email, password);
    if (!r.ok) setError(r.error || 'Login failed');
    setBusy(false);
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={submit} className="w-full max-w-sm rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="text-center text-2xl font-extrabold text-brand">Admin Login</h1>
        <p className="mt-1 text-center text-sm text-gray-500">BD Ceramics Shop</p>
        {!configured && <p role="alert" className="mt-4 rounded bg-amber-50 p-3 text-sm text-amber-800">Set VITE_ADMIN_EMAIL and VITE_ADMIN_PASSWORD in admin/.env</p>}
        <label htmlFor="email" className="mt-6 block text-sm font-semibold">Email</label>
        <input id="email" type="email" autoComplete="username" required value={email} onChange={(e) => setEmail(e.target.value)} className={`mt-1 ${inputCls}`} />
        <label htmlFor="password" className="mt-4 block text-sm font-semibold">Password</label>
        <input id="password" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} className={`mt-1 ${inputCls}`} />
        {error && <p role="alert" className="mt-3 text-sm font-medium text-red-600">{error}</p>}
        <button type="submit" disabled={busy} className={`${btnPrimary} mt-6 w-full`}>{busy ? 'Signing in...' : 'Sign in'}</button>
      </form>
    </div>
  );
}
