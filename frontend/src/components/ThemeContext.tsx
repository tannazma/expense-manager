import { createContext } from "react";

type ThemeType = {
  theme: string;
  setTheme: (value: string) => void;
};

const ThemeContext = createContext<ThemeType>({
  theme: "default",
  setTheme: () => {},
});
export default ThemeContext;
