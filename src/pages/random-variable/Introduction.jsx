// src/pages/randomVariable/Introduction.jsx
import React from "react";
import { useTranslation, Trans } from "react-i18next";

/**
 * @component Introduction
 * @description Renders the foundational introductory section for the Random Variable chapter.
 * It formally defines a random variable as a numerical mapping of outcomes from a random
 * experiment (sample space) to the real number line. This section sets the stage for
 * understanding how abstract events are quantified for further statistical analysis.
 */
function Introduction() {
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
}

export default Introduction;
