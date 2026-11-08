/* Reusable Meta Pixel utility: single init, deduped events, consent-aware, no PII. */
type Fbq = ((...args: unknown[]) => void) & {
  callMethod?: (...args: unknown[]) => void;
  queue?: unknown[];
  loaded?: boolean;
  version?: string;
  push?: unknown;
};

declare global {
  interface Window {
    fbq?: Fbq;
    _fbq?: Fbq;
  }
}

const PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID as string | undefined;
const REQUIRE_CONSENT = import.meta.env.VITE_PIXEL_REQUIRE_CONSENT === 'true';
const CONSENT_KEY = 'meta-pixel-consent';

let initialized = false;
const fired = new Set<string>();
let lastPath: string | null = null;

function consentGranted(): boolean {
  if (typeof navigator !== 'undefined' && navigator.doNotTrack === '1') return false;
  if (!REQUIRE_CONSENT) return true;
  try {
    return localStorage.getItem(CONSENT_KEY) === 'granted';
  } catch {
    return false;
  }
}

function loadScript() {
  if (window.fbq) return;
  const n: Fbq = function (...args: unknown[]) {
    if (n.callMethod) n.callMethod(...args);
    else (n.queue as unknown[]).push(args);
  } as Fbq;
  window.fbq = n;
  if (!window._fbq) window._fbq = n;
  n.push = n;
  n.loaded = true;
  n.version = '2.0';
  n.queue = [];
  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://connect.facebook.net/en_US/fbevents.js';
  document.head.appendChild(s);
}

export function initPixel(): boolean {
  if (initialized) return true;
  if (!PIXEL_ID || !consentGranted()) return false;
  loadScript();
  window.fbq!('init', PIXEL_ID);
  initialized = true;
  return true;
}

/** Call from a consent banner/CMP. Stores consent and starts the pixel. */
export function setPixelConsent(granted: boolean) {
  try {
    localStorage.setItem(CONSENT_KEY, granted ? 'granted' : 'denied');
  } catch {
    /* ignore */
  }
  if (granted && initPixel()) trackPageView();
}

function track(event: string, params?: Record<string, unknown>, dedupeKey?: string, eventID?: string) {
  if (!initPixel()) return;
  if (dedupeKey) {
    if (fired.has(dedupeKey)) return;
    fired.add(dedupeKey);
  }
  window.fbq!('track', event, params ?? {}, eventID ? { eventID } : undefined);
}

export function trackPageView() {
  const path = window.location.pathname + window.location.search;
  if (path === lastPath) return;
  lastPath = path;
  if (!initPixel()) return;
  window.fbq!('track', 'PageView');
}

/** PageView on load + SPA navigation (history API). */
export function setupPageViewTracking() {
  trackPageView();
  const wrap = (m: 'pushState' | 'replaceState') => {
    const orig = history[m];
    history[m] = function (...a: Parameters<typeof orig>) {
      const r = orig.apply(this, a);
      trackPageView();
      return r;
    };
  };
  wrap('pushState');
  wrap('replaceState');
  window.addEventListener('popstate', trackPageView);
}

interface P { _id: string; name: string; price: number }

export const trackViewContent = (p: P) =>
  track(
    'ViewContent',
    { content_ids: [p._id], content_name: p.name, content_type: 'product', value: p.price, currency: 'BDT' },
    `vc:${p._id}`
  );

export const trackInitiateCheckout = (p: P) =>
  track(
    'InitiateCheckout',
    { content_ids: [p._id], content_name: p.name, content_type: 'product', num_items: 1, value: p.price, currency: 'BDT' },
    'ic'
  );

/** Only after a successful order. No name/phone/address is sent. */
export const trackLead = (p: P, orderId: string) =>
  track(
    'Lead',
    { content_ids: [p._id], content_name: p.name, value: p.price, currency: 'BDT' },
    `lead:${orderId}`,
    `lead-${orderId}`
  );
