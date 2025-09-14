import React, { useContext } from "react";
import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const languages = [
    { code: "sk", label: "SK", flag: "/assets/images/sk.webp" },
    { code: "cs", label: "CZ", flag: "/assets/images/cs.webp" },
    { code: "en", label: "EN", flag: "/assets/images/en.webp" },
  ];

  const changeLanguage = (lng) => i18n.changeLanguage(lng);

  return (
    <div className="dropdown">
      <button
        className="btn dropdown-toggle d-flex align-items-center"
        type="button"
        id="languageDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        <img
          src={languages.find((l) => l.code === i18n.language)?.flag}
          alt="flag"
          className="me-2 language-flag"
        />

        {languages.find((l) => l.code === i18n.language)?.label}
      </button>
      <ul
        className="dropdown-menu dropdown-menu-end"
        aria-labelledby="languageDropdown"
      >
        {languages.map((lang) => (
          <li key={lang.code}>
            <button
              className="dropdown-item d-flex align-items-center"
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
