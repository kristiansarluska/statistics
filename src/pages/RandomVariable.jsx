// src/pages/RandomVariable.jsx
import React from "react";
import PdfCdf from "./randomVariable/PdfCdf";
import QuantileFunction from "./randomVariable/QuantileFunction";

const RandomVariable = () => {
  return (
    <div className="container mt-4">
      <h1 className="mb-4">Náhodná veličina</h1>

      {/* Existing content (e.g., Theory, Probability Density, Cumulative Distribution) */}
      <PdfCdf />

      {/* New Quantile Function section */}
      <QuantileFunction />
    </div>
  );
};

export default RandomVariable;
