import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { ALL_THEMES } from '../constants/theme';

// Types
type ThemeType = 'dark' | 'light';

interface ThemeContextType {
  theme: ThemeType;
  colors: typeof ALL_THEMES.dark | typeof ALL_THEMES.light;
  toggleTheme: () => void;
  setTheme: (theme: ThemeType) => void;
}

// Création du contexte
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Hook personnalisé pour utiliser le contexte de thème
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Provider du thème
export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Récupérer le thème du système
  const colorScheme = useColorScheme();
  
  // État pour le thème actuel
  const [theme, setTheme] = useState<ThemeType>(colorScheme === 'dark' ? 'dark' : 'light');
  
  // Mettre à jour le thème si le thème système change
  useEffect(() => {
    if (colorScheme) {
      setTheme(colorScheme === 'dark' ? 'dark' : 'light');
    }
  }, [colorScheme]);
  
  // Basculer entre les thèmes
  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark' ? 'light' : 'dark'));
  };
  
  // Obtenir les couleurs du thème actuel
  const colors = ALL_THEMES[theme];
  
  // Valeur du contexte
  const value = {
    theme,
    colors,
    toggleTheme,
    setTheme,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
