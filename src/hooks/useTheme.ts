// src/hooks/useTheme.ts
import { useState, useEffect } from 'react';

const useTheme = () => {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('theme') === 'dark') {
      return true;
    }
    return false;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark'); //
      localStorage.setItem('theme', 'dark'); //
    } else {
      root.classList.remove('dark'); //
      localStorage.setItem('theme', 'light'); //
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev); //

  return { isDarkMode, toggleTheme };
};

export default useTheme;