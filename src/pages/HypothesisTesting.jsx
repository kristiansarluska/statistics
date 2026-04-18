// src/pages/HypothesisTesting.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import Introduction from "./hypothesis-testing/Introduction";
import GeneralProcedure from "./hypothesis-testing/GeneralProcedure";
import TTestDashboard from "./hypothesis-testing/TTestDashboard";

function HypothesisTesting() {
  const { t } = useTranslation();

  return (
    <div className="container-fluid mb-5">
      <h1 id="hypothesis-testing" className="mb-4">
        {t("topics.hypothesisTesting")}
      </h1>

      <Introduction />

      <hr className="my-5" />

      <GeneralProcedure />

      <hr className="my-5" />

      <TTestDashboard />
    </div>
  );
}

export default HypothesisTesting;
