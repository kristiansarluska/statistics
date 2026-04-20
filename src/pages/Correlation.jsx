// src/pages/Correlation.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import Introduction from "./correlation/Introduction";
import CorrelationAnalysis from "./correlation/CorrelationAnalysis";
import CorrelationCoefficients from "./correlation/CorrelationCoefficients";

/**
 * @component Correlation
 * @description The main page component for the Correlation chapter.
 */
function Correlation() {
  const { t } = useTranslation();

  return (
    <div className="container-fluid mb-5">
      <h1 id="correlation" className="mb-4">
        {t("topics.correlation")}
      </h1>

      <Introduction />

      <hr className="my-5" />

      <CorrelationAnalysis />

      <hr className="my-5" />

      <CorrelationCoefficients />
    </div>
  );
}

export default Correlation;
