//src/main.jsx
import React from "react";
import ReactDOM from "react-dom/client";
import "./i18n";
import App from "./App";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import { ThemeProvider } from "./context/ThemeContext";

/**
 * @file main.jsx
 * @description The entry point for the React application.
 * It initializes the React root, injects the global i18n configuration,
 * and mounts the App component within necessary providers (Theme, StrictMode).
 */

// Create the React root element and render the application
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>,
);
