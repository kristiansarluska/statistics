// src/components/content/PracticalExample.jsx
import React from "react";
import { useTranslation } from "react-i18next"; // Ak by si chcel aj preklady pre príklady

function PracticalExample({ title, children }) {
  const { t } = useTranslation(); // Ak budeš potrebovať prekladať titulok

  return (
    <div className="card my-4">
      {" "}
      {/* Použijeme Bootstrap kartu */}
      <div className="card-header">
        {/* Ak chceš prekladať titulok, použi t(title) alebo pridaj titleKey prop */}
        <strong>Príklad:</strong> {title}
      </div>
      <div className="card-body">
        {children} {/* Sem vložíme obsah príkladu */}
      </div>
    </div>
  );
}

export default PracticalExample;
