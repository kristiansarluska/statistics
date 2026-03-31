// src/pages/Correlation.jsx
import React, { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import Introduction from "./correlation/Introduction";
import CorrelationAnalysis from "./correlation/CorrelationAnalysis";
import CorrelationCoefficients from "./correlation/CorrelationCoefficients";

function Correlation() {
  const { t } = useTranslation();
  const location = useLocation();

  // --- Smooth scroll to hash after navigation ---
  useEffect(() => {
    if (!location.pathname.startsWith("/correlation")) return;

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
