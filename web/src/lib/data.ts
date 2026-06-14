import type { BankEntry, Meta } from './types';

let banksCache: BankEntry[] | null = null;
let metaCache: Meta | null = null;

export async function fetchBanks(): Promise<BankEntry[]> {
  if (banksCache) return banksCache;
  const res = await fetch('/data/banks.json');
  if (!res.ok) throw new Error(`Failed to load banks.json: ${res.status}`);
  banksCache = await res.json();
  return banksCache!;
}

export async function fetchMeta(): Promise<Meta> {
  if (metaCache) return metaCache;
  const res = await fetch('/data/meta.json');
  if (!res.ok) throw new Error(`Failed to load meta.json: ${res.status}`);
  metaCache = await res.json();
  return metaCache!;
}

/* ---- Reliability scale (traffic-light, tuned for light theme) ---- */
export function tdColor(td: number | null): string {
  if (td === null) return '#C9C3B6';
  if (td < 0.5) return '#12A150'; // excellent — UPI green
  if (td < 1.0) return '#62B95C'; // good
  if (td < 1.5) return '#E5A50A'; // fair — amber
  if (td < 3.0) return '#F2691C'; // poor — UPI-ish orange
  return '#DC2828'; // critical — red
}

export function tdLabel(td: number | null): string {
  if (td === null) return 'No data';
  if (td < 0.5) return 'Excellent';
  if (td < 1.0) return 'Good';
  if (td < 1.5) return 'Fair';
  if (td < 3.0) return 'Poor';
  return 'Critical';
}

/** Plain-English, finance-free description of a TD% value. */
export function tdPlain(td: number | null): string {
  if (td === null) return 'No data for this month.';
  if (td < 0.5) return 'Very low Technical Decline rate — highly reliable in this period.';
  if (td < 1.0) return 'Low Technical Decline rate. Occasional processing issues, nothing sustained.';
  if (td < 1.5) return 'Moderate Technical Decline rate — some processing issues recorded in this period.';
  if (td < 3.0) return 'Above-average Technical Decline rate recorded across this period.';
  return 'High Technical Decline rate recorded. Payments faced frequent processing-side issues.';
}

/* ---- Classification ---- */
export function classificationLabel(c: string): string {
  const map: Record<string, string> = {
    rock_solid: 'Rock Solid',
    chronically_weak: 'Recurring Declines',
    one_off_incident: 'Isolated Incident',
    volatile: 'Variable Pattern',
  };
  return map[c] ?? c;
}

export function classificationColor(c: string): string {
  const map: Record<string, string> = {
    rock_solid: '#12A150',
    chronically_weak: '#DC2828',
    one_off_incident: '#E5A50A',
    volatile: '#6D4AFF',
  };
  return map[c] ?? '#9A9DA7';
}

export function classificationIcon(c: string): string {
  const map: Record<string, string> = {
    rock_solid: '◆',
    chronically_weak: '▲',
    one_off_incident: '●',
    volatile: '◇',
  };
  return map[c] ?? '?';
}

/** Plain-English one-liner for each classification. */
export function classificationPlain(c: string): string {
  const map: Record<string, string> = {
    rock_solid: 'Low, consistent Technical Decline rate across the observed period.',
    chronically_weak: 'Elevated Technical Decline rate recorded consistently across multiple months in the data.',
    one_off_incident: 'Generally low TD rate, with one month showing a notable spike in the data.',
    volatile: 'Technical Decline rate varies significantly month-to-month — no clear stable pattern.',
  };
  return map[c] ?? '';
}

/* ---- Trend ---- */
export function trendIcon(t: string): string {
  return ({ improving: '↘', worsening: '↗', flat: '→' } as Record<string, string>)[t] ?? '→';
}
export function trendColor(t: string): string {
  return ({ improving: '#12A150', worsening: '#DC2828', flat: '#9A9DA7' } as Record<string, string>)[t] ?? '#9A9DA7';
}
export function trendPlain(t: string): string {
  return (
    {
      improving: 'Technical Decline rate has been trending lower over time.',
      worsening: 'Technical Decline rate has been trending higher in recent data.',
      flat: 'Technical Decline rate has remained broadly stable.',
    } as Record<string, string>
  )[t] ?? '';
}

export function formatMonth(m: string): string {
  const [y, mo] = m.split('-');
  const date = new Date(Number(y), Number(mo) - 1, 1);
  return date.toLocaleDateString('en-IN', { month: 'short', year: '2-digit' });
}

/** Deterministic warm/cool brand color for a bank monogram avatar. */
const AVATAR_COLORS = [
  '#FF6A1A', '#12A150', '#1B2A4A', '#6D4AFF', '#E5A50A',
  '#0EA5A5', '#E2540B', '#3B6FE0', '#0A7C3C', '#C0392B',
];
export function avatarColor(name: string): string {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}

export function initials(name: string): string {
  const words = name.replace(/[^A-Za-z ]/g, '').split(/\s+/).filter(Boolean);
  if (words.length === 0) return '?';
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
}
