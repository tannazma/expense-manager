import { createContext } from "react";

const ThemeContext = createContext({
  theme: "default",
  setTheme: () => {},
});
export default ThemeContext;
