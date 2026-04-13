// src/components/LanguageSwitcher.jsx
import React from "react";
import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
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
    // Uložíme výber používateľa, aby mal pri ďalšej návšteve preferovaný jazyk
    localStorage.setItem("app_language", lng);
  };

  // Bezpečnostná poistka pre prípad prvotného načítania
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
