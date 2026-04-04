// src/pages/probabilityDistributions/Introduction.jsx
import React from "react";
import { useTranslation, Trans } from "react-i18next";

function Introduction() {
  const { t } = useTranslation();

  return (
    <section id="introduction" className="mb-5">
      <p className="lead">
        <Trans
          i18nKey="probabilityDistributions.introduction.p1"
          components={{ bold: <strong /> }}
        />
      </p>
      <p>{t("probabilityDistributions.introduction.p2")}</p>
    </section>
  );
}

export default Introduction;
