// src/pages/randomVariable/Introduction.jsx
import React from "react";
import { useTranslation, Trans } from "react-i18next";

const Introduction = () => {
  const { t } = useTranslation();

  return (
    <section id="introduction" className="mb-5">
      <p className="fst-italic lead">{t("randomVariable.introduction.p1")}</p>
      <p>
        <Trans
          i18nKey="randomVariable.introduction.p2"
          components={{ bold: <strong /> }}
        />
      </p>
    </section>
  );
};

export default Introduction;
