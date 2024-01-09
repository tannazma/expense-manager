import { useEffect, useState } from "react";
import ThemeContext from "./ThemeContext";

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(() => {
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
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}
