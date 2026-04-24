//src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import sk from "./locales/sk/translation.json";
import cs from "./locales/cs/translation.json";
import en from "./locales/en/translation.json";

/**
 * @file i18n.js
 * @description Internationalization configuration using i18next and react-i18next.
 * It manages application languages, loads translation resources, and handles
 * automatic language detection based on user preference or browser settings.
 */

/**
 * @function getInitialLanguage
 * @description Determines the starting language for the application.
 * Priority:
 * 1. Previously saved language in localStorage.
 * 2. Browser navigator language (defaults to 'sk' or 'cs' if matched).
 * 3. Default fallback to 'en'.
 * @returns {string} The detected language code (sk, cs, or en).
 */
const getInitialLanguage = () => {
  // 1. Check if the user has a manually saved preference
  const savedLanguage = localStorage.getItem("app_language");
  if (savedLanguage) return savedLanguage;

  // 2. Detect browser language setting
  const browserLang = navigator.language.toLowerCase();

  // 3. Logic for matching browser language to supported locales
  if (browserLang.startsWith("sk")) return "sk";
  if (browserLang.startsWith("cs")) return "cs";

  // Default to English for all other cases
  return "en";
};

// Initialize i18next
i18n.use(initReactI18next).init({
  resources: {
    sk: { translation: sk },
    cs: { translation: cs },
    en: { translation: en },
  },
  lng: getInitialLanguage(),
  fallbackLng: "en",
  interpolation: {
    // React already protects from XSS
    escapeValue: false,
  },
});

export default i18n;
