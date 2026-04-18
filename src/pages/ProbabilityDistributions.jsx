// src/pages/ProbabilityDistributions.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import Introduction from "./probability-distributions/Introduction";
import DiscreteDistributions from "./probability-distributions/DiscreteDistributions";
import ContinuousDistributions from "./probability-distributions/ContinuousDistributions";

function ProbabilityDistributions() {
  const { t } = useTranslation();

  return (
    <div className="container-fluid mb-5">
      <h1 id="probability-distributions" className="mb-4">
        {t("topics.probabilityDistributions")}
      </h1>

      <Introduction />

      <hr className="my-5" />

      <DiscreteDistributions />

      <hr className="my-5" />

      <ContinuousDistributions />
    </div>
  );
}

export default ProbabilityDistributions;
