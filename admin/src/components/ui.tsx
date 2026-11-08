import type { ReactNode } from 'react';
import { X } from 'lucide-react';
import type { Status } from '../lib/types';

const colors: Record<Status, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};
export const StatusBadge = ({ s }: { s: Status }) => (
  <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${colors[s]}`}>{s}</span>
);

export function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onMouseDown={onClose} role="dialog" aria-modal="true" aria-label={title}>
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-xl" onMouseDown={(e) => e.stopPropagation()}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold">{title}</h2>
          <button onClick={onClose} aria-label="Close" className="rounded p-1 hover:bg-gray-100"><X className="h-5 w-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

export const Skeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-3 p-4" aria-hidden>
    {Array.from({ length: rows }, (_, i) => <div key={i} className="h-10 animate-pulse rounded bg-gray-200" />)}
  </div>
);

export const Empty = ({ text }: { text: string }) => <p className="p-10 text-center text-sm text-gray-500">{text}</p>;

export const ErrorBox = ({ message, onRetry }: { message: string; onRetry?: () => void }) => (
  <div role="alert" className="m-4 rounded-lg bg-red-50 p-4 text-sm text-red-700">
    {message}
    {onRetry && <button onClick={onRetry} className="ml-3 font-semibold underline">Retry</button>}
  </div>
);

export const btn = 'inline-flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-60';
export const btnPrimary = `${btn} bg-brand text-white hover:bg-brand-dark`;
export const btnGhost = `${btn} border border-gray-300 bg-white text-gray-800 hover:bg-gray-50`;
export const inputCls = 'h-10 w-full rounded-lg border border-gray-300 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand/40';
