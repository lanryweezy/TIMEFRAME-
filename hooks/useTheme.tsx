import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useUIStore } from '../store/videoStore';

type Theme = 'dark' | 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const STORAGE_KEY = 'timeframe-theme';

export function ThemeProvider({ children }: { children: ReactNode }) {
  const { ui } = useUIStore();
  const theme = 'dark';

  useEffect(() => {
    const root = document.documentElement;
    
    // Enforce pure dark theme (#18)
    root.classList.remove('theme-light');
    root.classList.add('dark');

    // High Contrast
    if (ui.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Colorblind
    root.classList.remove('filter-protanopia', 'filter-deuteranopia', 'filter-tritanopia');
    if (ui.colorBlindMode !== 'none') {
      root.classList.add(`filter-${ui.colorBlindMode}`);
    }

    localStorage.setItem(STORAGE_KEY, 'dark');
  }, [ui.highContrast, ui.colorBlindMode]);

  const toggleTheme = () => {
    // Keep permanently dark
  };

  const setTheme = (newTheme: Theme) => {
    // Keep permanently dark
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}