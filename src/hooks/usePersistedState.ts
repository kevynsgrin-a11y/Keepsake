import { useState, useEffect, Dispatch, SetStateAction } from 'react';

// Persists state to localStorage under `key`. Falls back to `initial` (and
// still works for the session) if localStorage is unavailable — private
// browsing, quota exceeded, or a non-browser test environment.
export function usePersistedState<T>(
  key: string,
  initial: T
): [T, Dispatch<SetStateAction<T>>] {
  const [state, setState] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved ? (JSON.parse(saved) as T) : initial;
    } catch {
      return initial;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {
      // ignore — nothing durable to do if storage is unavailable
    }
  }, [key, state]);

  return [state, setState];
}
