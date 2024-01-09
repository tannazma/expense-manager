import React, { useContext, ChangeEvent } from "react";
import ThemeContext from "./ThemeContext";

export function ThemeSwitcher() {
  const { theme, setTheme } = useContext(ThemeContext);

  function handleThemeChange(e: ChangeEvent<HTMLSelectElement>) {
    setTheme(e.target.value);
  }

  return (
    <select value={theme} onChange={handleThemeChange}>
      <option value="default">Default</option>
      <option value="dark">Dark</option>
      <option value="light">Light</option>
    </select>
  );
}