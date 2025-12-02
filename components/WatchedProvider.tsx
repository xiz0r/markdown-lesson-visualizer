'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';

type WatchedMap = Record<string, boolean>;

type WatchedContextValue = {
  watched: WatchedMap;
  markWatched: (path: string) => void;
};

const WatchedContext = createContext<WatchedContextValue | null>(null);

const STORAGE_KEY = 'lesson-watched';

export function WatchedProvider({ children }: { children: React.ReactNode }) {
  const [watched, setWatched] = useState<WatchedMap>(() => {
    if (typeof window === 'undefined') return {};
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Persist whenever the map changes
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(watched));
    } catch {
      // Ignore storage errors
    }
  }, [watched]);

  // Sync across tabs
  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          setWatched(JSON.parse(event.newValue));
        } catch {
          // Ignore parse errors
        }
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const markWatched = useCallback((path: string) => {
    if (!path) return;
    setWatched((prev) => {
      if (prev[path]) return prev;
      return { ...prev, [path]: true };
    });
  }, []);

  const value = useMemo(() => ({ watched, markWatched }), [watched, markWatched]);

  return <WatchedContext.Provider value={value}>{children}</WatchedContext.Provider>;
}

export function useWatchedLessons() {
  const context = useContext(WatchedContext);
  if (!context) {
    throw new Error('useWatchedLessons must be used within a WatchedProvider');
  }
  return context;
}
