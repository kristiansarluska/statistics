// src/pages/HypothesisTesting.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import Introduction from "./hypothesisTesting/Introduction";
import GeneralProcedure from "./hypothesisTesting/GeneralProcedure";
import TTestDashboard from "./hypothesisTesting/TTestDashboard"; // <-- IMPORT

function HypothesisTesting() {
  const { t } = useTranslation();

  return (
    <div className="container-fluid mb-5">
      <h1 className="mb-4">{t("topics.hypothesisTesting")}</h1>
      <Introduction />
      <hr className="my-5" />
      <GeneralProcedure />
      <hr className="my-5" />
      <TTestDashboard />
    </div>
  );
}

export default HypothesisTesting;
