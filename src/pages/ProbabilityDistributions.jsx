// src/pages/ProbabilityDistributions.jsx
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/charts.css";

// Pod-komponenty
import Introduction from "./probability-distributions/Introduction";
import DiscreteDistributions from "./probability-distributions/DiscreteDistributions";
import ContinuousDistributions from "./probability-distributions/ContinuousDistributions";

function ProbabilityDistributions() {
  const { t } = useTranslation();
  const location = useLocation();

  // --- scroll na hash po navigácii ---
  useEffect(() => {
    if (!location.pathname.startsWith("/probability-distributions")) return;

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
      <h1 id="page-title" className="mb-4">
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
