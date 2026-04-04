// src/pages/HypothesisTesting.jsx
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import Introduction from "./hypothesis-testing/Introduction";
import GeneralProcedure from "./hypothesis-testing/GeneralProcedure";
import TTestDashboard from "./hypothesis-testing/TTestDashboard";

function HypothesisTesting() {
  const { t } = useTranslation();
  const location = useLocation();

  // --- Smooth scroll to hash after navigation ---
  useEffect(() => {
    if (!location.pathname.startsWith("/hypothesis-testing")) return;

    if (location.hash) {
      const id = location.hash.replace("#", "");
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "start" });
        } else {
          window.scrollTo({ top: 0, behavior: "smooth" });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, [location.pathname, location.hash]);

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
