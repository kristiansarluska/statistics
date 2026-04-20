// src/components/LanguageSwitcher.jsx
import React from "react";
import { useTranslation } from "react-i18next";

/**
 * @component LanguageSwitcher
 * @description A dropdown component that allows users to switch the application's language.
 * Uses react-i18next for localization and persists the user's choice in localStorage.
 */
function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    {
      code: "cs",
      label: "CZ",
      flag: `${import.meta.env.BASE_URL}assets/images/cs.webp`,
    },
    {
      code: "sk",
      label: "SK",
      flag: `${import.meta.env.BASE_URL}assets/images/sk.webp`,
    },
    {
      code: "en",
      label: "EN",
      flag: `${import.meta.env.BASE_URL}assets/images/en.webp`,
    },
  ];

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
    // Save the user's selection to local storage for future visits
    localStorage.setItem("app_language", lng);
  };

  // Fallback in case the initial language is not fully matched
  const currentLang =
    languages.find((l) => l.code === i18n.language) || languages[0];

  return (
    <div className="dropdown">
      <button
        className="btn dropdown-toggle border-0 d-flex align-items-center nav-icon-btn"
        type="button"
        id="languageDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <img src={currentLang.flag} alt="flag" className="me-2 language-flag" />
        {currentLang.label}
      </button>
      <ul
        className="dropdown-menu dropdown-menu-end shadow-sm border-0"
        aria-labelledby="languageDropdown"
      >
        {languages.map((lang) => (
          <li key={lang.code}>
            <button
              className="dropdown-item d-flex align-items-center py-2"
              onClick={() => changeLanguage(lang.code)}
            >
              <img
                src={lang.flag}
                alt={lang.label}
                className="me-2 language-flag"
              />
              {lang.label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default LanguageSwitcher;
