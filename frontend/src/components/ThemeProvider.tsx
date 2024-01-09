import { ReactNode, useEffect, useState } from "react";
import ThemeContext from "./ThemeContext";

type ThemeType = {
  theme: string;
  setTheme: (value: string) => void;
};

type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setTheme] = useState<string>(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "default";
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
    <ThemeContext.Provider value={{ theme, setTheme } as ThemeType}>
      {children}
    </ThemeContext.Provider>
  );
}
