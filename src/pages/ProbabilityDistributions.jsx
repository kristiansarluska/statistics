// src/pages/ProbabilityDistributions.jsx
import { useTranslation } from "react-i18next";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import "../styles/charts.css";

// Pod-komponenty
import Motivation from "./probabilityDistributions/Motivation";
import DiscreteDistributions from "./probabilityDistributions/DiscreteDistributions";
import ContinuousDistributions from "./probabilityDistributions/ContinuousDistributions";

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
    <>
      <h1 id="page-title">{t("topics.probabilityDistributions")}</h1>
      <Motivation />
      <DiscreteDistributions />
      <ContinuousDistributions />
    </>
  );
}

export default ProbabilityDistributions;
