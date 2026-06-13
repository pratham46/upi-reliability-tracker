import { useState, useEffect } from 'react';
import { fetchBanks, fetchMeta } from './data';
import type { BankEntry, Meta } from './types';

interface DataState {
  banks: BankEntry[];
  meta: Meta | null;
  loading: boolean;
  error: string | null;
}

export function useData(): DataState {
  const [state, setState] = useState<DataState>({
    banks: [],
    meta: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let cancelled = false;
    Promise.all([fetchBanks(), fetchMeta()])
      .then(([banks, meta]) => {
        if (!cancelled) setState({ banks, meta, loading: false, error: null });
      })
      .catch((e: Error) => {
        if (!cancelled) setState({ banks: [], meta: null, loading: false, error: e.message });
      });
    return () => { cancelled = true; };
  }, []);

  return state;
}
