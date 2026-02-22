// src/pages/ProbabilityDistributions.jsx
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import useDebouncedValue from "../hooks/useDebouncedValue";
import "../styles/charts.css";

// Pod-komponenty
import Motivation from "./probabilityDistributions/Motivation";
import PdfCdf from "./probabilityDistributions/PdfCdf";
import DiscreteDistributions from "./probabilityDistributions/DiscreteDistributions";
import ContinuousDistributions from "./probabilityDistributions/ContinuousDistributions";

function ProbabilityDistributions() {
  const { t } = useTranslation();
  const location = useLocation();

  // Spoločný stav
  const [meanInput, mean, setMeanValue] = useDebouncedValue(0, 1000);
  const validateMean = (value) => !isNaN(parseFloat(value));

  const [sdInput, sd, setSdValue] = useDebouncedValue(1, 1000);
  const validateSd = (value) => {
    const num = parseFloat(value);
    return !isNaN(num) && num > 0;
  };

  const [hoverX, setHoverX] = useState(null);

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
      <PdfCdf mean={mean} sd={sd} />
      <DiscreteDistributions />
      <ContinuousDistributions
        mean={mean}
        meanInput={meanInput}
        setMeanValue={setMeanValue}
        validateMean={validateMean}
        sd={sd}
        sdInput={sdInput}
        setSdValue={setSdValue}
        validateSd={validateSd}
        hoverX={hoverX}
        setHoverX={setHoverX}
      />
    </>
  );
}

export default ProbabilityDistributions;
