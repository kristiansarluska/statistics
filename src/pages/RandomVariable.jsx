// src/pages/RandomVariable.jsx
import React, { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Introduction from "./random-variable/Introduction";
import ContinuousDiscrete from "./random-variable/ContinuousDiscrete";
import Distribution from "./random-variable/Distribution";
import Characteristics from "./random-variable/Characteristics";

const RandomVariable = () => {
  const { t } = useTranslation();
  const location = useLocation();

  // --- Smooth scroll to hash after navigation ---
  useEffect(() => {
    if (!location.pathname.startsWith("/random-variable")) return;

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
      <h1 id="random-variable" className="mb-4">
        Náhodná veličina
      </h1>

      <Introduction />

      <hr className="my-5" />

      <ContinuousDiscrete />

      <hr className="my-5" />

      <Distribution />

      <hr className="my-5" />

      <Characteristics />
    </div>
  );
};

export default RandomVariable;
