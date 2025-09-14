// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import sk from "./locales/sk/translation.json";
import cs from "./locales/cs/translation.json";
import en from "./locales/en/translation.json";

i18n.use(initReactI18next).init({
  resources: {
    sk: { translation: sk },
    cs: { translation: cs },
    en: { translation: en },
  },
  lng: "sk", // aktuálny jazyk (defaultne slovenčina pre vývoj)
  fallbackLng: "cs", // keď sa niečo nenájde → čeština
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
