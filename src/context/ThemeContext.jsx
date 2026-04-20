// src/context/ThemeContext.jsx
import React, { createContext, useState, useEffect } from "react";

/**
 * @context ThemeContext
 * @description Context object providing the current theme state (dark/light)
 * and a function to toggle between them.
 */
export const ThemeContext = createContext();

/**
 * @component ThemeProvider
 * @description State provider that manages the application's visual theme.
 * It initializes the theme based on the user's previously saved preference in localStorage,
 * falling back to the system's preferred color scheme (prefers-color-scheme: dark) if no preference exists.
 * @param {Object} props
 * @param {React.ReactNode} props.children - The application components to be wrapped by the provider.
 */
export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(() => {
    // 1. Check if user already saved a preference from previous sessions
    const savedTheme = localStorage.getItem("app_theme");
    if (savedTheme !== null) {
      return savedTheme === "dark";
    }

    // 2. If no saved preference, fallback to system (OS) preference
    if (typeof window !== "undefined" && window.matchMedia) {
      return window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    return false; // Default fallback to light mode
  });

  /**
   * Toggles the boolean state of the dark mode.
   */
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Synchronize the internal state with the DOM and persistent storage
  useEffect(() => {
    // Update the 'data-bs-theme' attribute on the body tag for Bootstrap 5 support
    document.body.setAttribute("data-bs-theme", darkMode ? "dark" : "light");

    // Save current user preference to localStorage to persist across reloads
    localStorage.setItem("app_theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}
