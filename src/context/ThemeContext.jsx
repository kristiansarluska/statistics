// src/context/ThemeContext.jsx
import React, { createContext, useState, useEffect } from "react";

export const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    // 1. Check if user already saved a preference
    const savedTheme = localStorage.getItem("app_theme");
    if (savedTheme !== null) {
      return savedTheme === "dark";
    }

    // 2. If not, fallback to system preference
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    return false; // Default fallback
  });

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  useEffect(() => {
    // Update DOM attribute for Bootstrap/custom CSS
    document.body.setAttribute("data-bs-theme", darkMode ? "dark" : "light");

    // Save current user preference to localStorage
    localStorage.setItem("app_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
