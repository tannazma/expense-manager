import { createContext } from "react";

export type Theme = "dark" | "default" | "blue" | "red" | "green";

export type ThemeType = {
  theme: Theme;
  setTheme: (value: Theme) => void;
  isDarkMode: boolean;
  isRed: boolean;
  isGreen: boolean;
  isBlue: boolean;
};

const ThemeContext = createContext<ThemeType>({
  theme: "default",
  setTheme: () => {},
  isDarkMode: false,
  isBlue: false,
  isGreen: false,
  isRed: false,
});
export default ThemeContext;
