'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';

type Theme = 'light' | 'dark';

const ThemeContext = createContext<{ theme: Theme; toggle: () => void }>({
  theme: 'dark',
  toggle: () => {},
});

export function useTheme() {
  return useContext(ThemeContext);
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Lazily sync with the class set by the blocking script in <head> so the
  // first client render already matches what was painted (no extra render).
  const [theme, setTheme] = useState<Theme>(() =>
    typeof document !== 'undefined' && !document.documentElement.classList.contains('dark')
      ? 'light'
      : 'dark'
  );

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    try {
      localStorage.setItem('esoviets-theme', theme);
    } catch {
      // private mode — theme simply won't persist
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggle: () => setTheme((t) => (t === 'dark' ? 'light' : 'dark')) }}>
      {children}
    </ThemeContext.Provider>
  );
}
