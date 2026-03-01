// src/components/content/characteristics/GeometricMeanCalc.jsx
import React from "react";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

function GeometricMeanCalc() {
  return (
    <CalculatorTemplate
      title="Priemerný koeficient rastu zastavanej plochy"
      inputLabel="Ročné koeficienty rastu (faktor):"
      defaultData={[1.05, 1.02, 1.08]}
      onValidate={(val) => !isNaN(val) && val > 0} // Odmocnina vyžaduje kladné čísla
      getMathContent={(data) => {
        const n = data.length;
        const product = data.reduce((acc, val) => acc * val, 1);
        const geometricMean = Math.pow(product, 1 / n);
        return {
          blockMath: `\\bar{x}_G = \\sqrt[n]{ \\prod x_i } = \\sqrt[${n}]{ ${data.join(" \\cdot ")} }`,
          inlineMath: `\\bar{x}_G = `,
          resultText: geometricMean.toFixed(3),
        };
      }}
    />
  );
}

export default GeometricMeanCalc;
