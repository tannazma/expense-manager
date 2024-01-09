import React, { useContext, ChangeEvent } from "react";
import ThemeContext, { Theme } from "./ThemeContext";

export function ThemeSwitcher() {
  const { theme, setTheme } = useContext(ThemeContext);

  function handleThemeChange(e: ChangeEvent<HTMLSelectElement>) {
    setTheme(e.target.value as Theme);
  }

  return (
    <select value={theme} onChange={handleThemeChange}>
      <option value="default">Default</option>
      <option value="dark">Dark</option>
      <option value="blue">Blue</option>
      <option value="red">Red</option>
      <option value="green">Green</option>
    </select>
  );
}
