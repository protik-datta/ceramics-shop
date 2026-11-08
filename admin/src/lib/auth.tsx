import { createContext, useContext, useState, type ReactNode } from 'react';

const KEY = 'bdc-admin-session';
const LOCK_KEY = 'bdc-admin-lock';
const MAX_ATTEMPTS = 5;
const LOCK_MS = 60_000;

const ADMIN_EMAIL = (import.meta.env.VITE_ADMIN_EMAIL as string | undefined) ?? '';
const ADMIN_PASSWORD = (import.meta.env.VITE_ADMIN_PASSWORD as string | undefined) ?? '';

interface Lock { n: number; until: number }
const readLock = (): Lock => {
  try { return JSON.parse(sessionStorage.getItem(LOCK_KEY) || '') as Lock; } catch { return { n: 0, until: 0 }; }
};

interface Ctx {
  authed: boolean;
  configured: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
}
const AuthCtx = createContext<Ctx>(null!);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem(KEY) === '1');
  const configured = !!ADMIN_EMAIL && !!ADMIN_PASSWORD;

  const login: Ctx['login'] = async (email, password) => {
    if (!configured) return { ok: false, error: 'Admin credentials are not set in admin/.env' };
    const lock = readLock();
    if (lock.until > Date.now()) {
      return { ok: false, error: `Too many attempts. Try again in ${Math.ceil((lock.until - Date.now()) / 1000)}s` };
    }
    await new Promise((r) => setTimeout(r, 600));
    if (email.trim().toLowerCase() === ADMIN_EMAIL.toLowerCase() && password === ADMIN_PASSWORD) {
      sessionStorage.removeItem(LOCK_KEY);
      sessionStorage.setItem(KEY, '1');
      setAuthed(true);
      return { ok: true };
    }
    const n = (lock.until && lock.until <= Date.now() ? 0 : lock.n) + 1;
    sessionStorage.setItem(LOCK_KEY, JSON.stringify({ n: n >= MAX_ATTEMPTS ? 0 : n, until: n >= MAX_ATTEMPTS ? Date.now() + LOCK_MS : 0 }));
    return { ok: false, error: n >= MAX_ATTEMPTS ? 'Too many attempts. Try again in 60s' : 'Invalid email or password' };
  };

  const logout = () => {
    sessionStorage.removeItem(KEY);
    setAuthed(false);
  };

  return <AuthCtx.Provider value={{ authed, configured, login, logout }}>{children}</AuthCtx.Provider>;
}
