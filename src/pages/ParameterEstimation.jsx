// src/pages/ParameterEstimation.jsx
import React from "react";
import { useTranslation } from "react-i18next";

// Import sections
import Introduction from "./parameter-estimation/Introduction";
import PointEstimation from "./parameter-estimation/PointEstimation";
import IntervalEstimation from "./parameter-estimation/IntervalEstimation";

function ParameterEstimation() {
  const { t } = useTranslation();

  return (
    <div className="container-fluid mb-5">
      <h1 className="mb-4">{t("topics.parameterEstimation")}</h1>

      {/* 1. Úvodná časť (bez vlastného id, priamo pod h1) */}
      <Introduction />

      <hr className="my-5" />

      {/* 2. Bodový odhad a SEM */}
      <PointEstimation />

      <hr className="my-5" />

      {/* 3. Intervalový odhad */}
      <IntervalEstimation />
    </div>
  );
}

export default ParameterEstimation;
