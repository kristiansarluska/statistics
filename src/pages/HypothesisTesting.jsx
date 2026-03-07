import React from "react";
import { useTranslation } from "react-i18next";
import Introduction from "../pages/hypothesisTesting/Introduction";
import GeneralProcedure from "../pages/hypothesisTesting/GeneralProcedure";

function HypothesisTesting() {
  const { t } = useTranslation();

  return (
    <div className="container-fluid mb-5">
      <h1 className="mb-4">{t("topics.hypothesisTesting")}</h1>

      {/* Sections rendering */}
      <Introduction />
      <hr className="my-5" />
      <GeneralProcedure />
    </div>
  );
}

export default HypothesisTesting;
