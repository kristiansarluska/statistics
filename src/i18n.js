// src/i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import sk from "./locales/sk/translation.json";
import cs from "./locales/cs/translation.json";
import en from "./locales/en/translation.json";

const getInitialLanguage = () => {
  // 1. Skontrolujeme, či už používateľ predtým nezmenil jazyk
  const savedLanguage = localStorage.getItem("app_language");
  if (savedLanguage) return savedLanguage;

  // 2. Ak nie, zistíme jazyk prehliadača (vráti napr. "sk", "sk-SK", "cs", "en-US")
  const browserLang = navigator.language.toLowerCase();

  // 3. Rozhodovacia logika
  if (browserLang.startsWith("sk")) return "sk";
  if (browserLang.startsWith("cs")) return "cs";

  // Vo všetkých ostatných prípadoch (alebo ak je to priamo angličtina)
  return "en";
};

i18n.use(initReactI18next).init({
  resources: {
    sk: { translation: sk },
    cs: { translation: cs },
    en: { translation: en },
  },
  lng: getInitialLanguage(),
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
