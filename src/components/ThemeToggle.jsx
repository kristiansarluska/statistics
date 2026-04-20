// src/components/ThemeToggle.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import "../styles/theme.css";

/**
 * @component ThemeToggle
 * @description A toggle switch component that allows users to switch between light and dark modes.
 * It consumes the `ThemeContext` to trigger the global theme change and displays
 * sun/moon icons as visual cues within the slider.
 */
function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <label className="switch">
      <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
      <span className="slider">
        {/* Sun icon representing Light Mode */}
        <img
          src={`${import.meta.env.BASE_URL}assets/images/sun.png`}
          alt="Light mode"
          className="icon sun"
        />
        {/* Moon icon representing Dark Mode */}
        <img
          src={`${import.meta.env.BASE_URL}assets/images/night-mode.png`}
          alt="Dark mode"
          className="icon moon"
        />
      </span>
    </label>
  );
}

export default ThemeToggle;
