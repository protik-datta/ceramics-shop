import { useEffect, useState } from 'react';

const KEY = 'offer-end';
const DURATION = (2 * 3600 + 43 * 60 + 24) * 1000;

function getEnd(): number {
  const now = Date.now();
  try {
    const saved = Number(localStorage.getItem(KEY));
    if (saved > now) return saved;
    const end = now + DURATION;
    localStorage.setItem(KEY, String(end));
    return end;
  } catch {
    return now + DURATION;
  }
}

export function useCountdown() {
  const [end, setEnd] = useState(getEnd);
  const [left, setLeft] = useState(() => Math.max(0, end - Date.now()));

  useEffect(() => {
    const id = setInterval(() => {
      const diff = end - Date.now();
      if (diff <= 0) {
        try { localStorage.removeItem(KEY); } catch { /* ignore */ }
        setEnd(getEnd());
      } else setLeft(diff);
    }, 1000);
    return () => clearInterval(id);
  }, [end]);

  const s = Math.floor(left / 1000);
  const pad = (n: number) => String(n).padStart(2, '0');
  return { h: pad(Math.floor(s / 3600)), m: pad(Math.floor((s % 3600) / 60)), s: pad(s % 60) };
}
