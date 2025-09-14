// ThemeToggle.jsx
import React, { useContext } from "react";
import { ThemeContext } from "../context/ThemeContext";
import "../styles/theme.css";

function ThemeToggle() {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  return (
    <label className="switch">
      <input type="checkbox" checked={darkMode} onChange={toggleDarkMode} />
      <span className="slider">
        <img
          src="../assets/images/sun.png"
          alt="Light mode"
          className="icon sun"
        />
        <img
          src="../assets/images/night-mode.png"
          alt="Dark mode"
          className="icon moon"
        />
      </span>
    </label>
  );
}

export default ThemeToggle;
