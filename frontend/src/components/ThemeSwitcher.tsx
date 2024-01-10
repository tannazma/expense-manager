import React, { useContext, ChangeEvent } from "react";
import ThemeContext, { Theme } from "./ThemeContext";

export function ThemeSwitcher() {
  const { theme, setTheme } = useContext(ThemeContext);

  function handleThemeChange(e: ChangeEvent<HTMLSelectElement>) {
    setTheme(e.target.value as Theme);
  }

  return (
    <div className="text-xs flex-1 items-center m-3">
      <select value={theme} onChange={handleThemeChange} className="p-1 rounded bg-white">
        <option value="default">Default</option>
        <option value="dark">Dark</option>
        <option value="blue">Blue</option>
        <option value="red">Red</option>
        <option value="green">Green</option>
      </select>
    </div>
  );
}
