// LanguageSwitcher.jsx
import React from "react";
import { useTranslation } from "react-i18next";

function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
  };

  return (
    <select
      onChange={(e) => changeLanguage(e.target.value)}
      value={i18n.language}
    >
      <option value="sk">Slovenčina</option>
      <option value="cs">Čeština</option>
      <option value="en">English</option>
    </select>
  );
}

export default LanguageSwitcher;
