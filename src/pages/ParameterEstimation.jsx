// src/pages/ParameterEstimation.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import Introduction from "./parameter-estimation/Introduction";
import PointEstimation from "./parameter-estimation/PointEstimation";
import IntervalEstimation from "./parameter-estimation/IntervalEstimation";

function ParameterEstimation() {
  const { t } = useTranslation();

  return (
    <div className="container-fluid mb-5">
      <h1 id="parameter-estimation" className="mb-4">
        {t("topics.parameterEstimation")}
      </h1>

      <Introduction />

      <hr className="my-5" />

      <PointEstimation />

      <hr className="my-5" />

      <IntervalEstimation />
    </div>
  );
}

export default ParameterEstimation;
