import { ReactNode, useEffect, useState } from "react";
import ThemeContext, { Theme, ThemeType } from "./ThemeContext";


type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      return (localStorage.getItem("theme") as Theme) || "default";
    } else {
      return "default";
    }
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.documentElement.className = theme;
      localStorage.setItem("theme", theme);
    }
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, setTheme, 
    isDarkMode: theme === 'dark',
    isGreen: theme === 'green',
    isBlue: theme === 'blue',
    isRed: theme === 'red'
    } as ThemeType}>
      {children}
    </ThemeContext.Provider>
  );
}
