export type Classification = 'rock_solid' | 'chronically_weak' | 'one_off_incident' | 'volatile';
export type Trend = 'improving' | 'worsening' | 'flat';

export interface SeriesPoint {
  month: string;
  td_pct: number | null;
  bd_pct: number | null;
  approved_pct: number | null;
  volume_mn: number | null;
}

export interface BankStats {
  mean_td: number;
  std_td: number;
  max_td: number;
  latest_td: number;
  months: number;
  classification: Classification;
  impact_score: number;
  trend: Trend;
  mean_volume_mn: number;
}

export interface BankEntry {
  bank: string;
  role: string;
  series: SeriesPoint[];
  stats: BankStats;
}

export interface Meta {
  last_updated: string;
  months: string[];
  roles: string[];
  source: string;
  notes: string;
}

export type SortKey = 'worst_sustained' | 'worst_single' | 'biggest_impact';
