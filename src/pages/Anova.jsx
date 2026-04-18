// src/pages/Anova.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import Introduction from "./anova/Introduction";
import SingleFactorAnova from "./anova/SingleFactorAnova";
import PostHocTests from "./anova/PostHocTests";
import AssumptionViolations from "./anova/AssumptionViolations";

function Anova() {
  const { t } = useTranslation();

  return (
    <div className="container-fluid mb-5">
      <h1 id="anova" className="mb-4">
        {t("topics.anova")}
      </h1>

      <Introduction />

      <hr className="my-5" />

      <SingleFactorAnova />

      <hr className="my-5" />

      <PostHocTests />

      <hr className="my-5" />

      <AssumptionViolations />
    </div>
  );
}

export default Anova;
