// src/components/content/characteristics/CoefficientOfVariationCalc.jsx
import React from "react";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

function CoefficientOfVariationCalc() {
  const defaultPrecipitation = [450, 320, 610, 200, 550];

  const getMathContent = (data, isExpanded) => {
    const n = data.length;
    if (n < 2) {
      return {
        blockMath: "v_k = ?",
        inlineMath: "v_k = ",
        resultText: "Nedostatok dát (n > 1)",
        isExpandable: false,
      };
    }

    const sum = data.reduce((acc, val) => acc + val, 0);
    const mean = sum / n;

    if (mean === 0) {
      return {
        blockMath: "\\bar{x} = 0 \\implies \\text{Delenie nulou}",
        inlineMath: "v_k = ",
        resultText: "Nedefinované (priemer je 0)",
        isExpandable: false,
      };
    }

    const sumSquaredDiffs = data.reduce(
      (acc, val) => acc + Math.pow(val - mean, 2),
      0,
    );
    const variance = sumSquaredDiffs / (n - 1);
    const stdDev = Math.sqrt(variance);
    const cv = (stdDev / Math.abs(mean)) * 100;

    const stdDevStr = stdDev.toFixed(2);
    const meanStr = mean.toFixed(2);

    let formulaExpanded = "";
    if (isExpanded) {
      formulaExpanded = `
        \\bar{x} &= ${meanStr} \\\\[1ex]
        s &= ${stdDevStr} \\\\[2ex]
      `;
    }

    return {
      formulaMath: `v_k = \\frac{s}{|\\bar{x}|} \\cdot 100\\%`,
      blockMath: `\\begin{aligned}
        ${formulaExpanded}
        v_k &= \\frac{${stdDevStr}}{|${meanStr}|} \\cdot 100\\%
      \\end{aligned}`,
      inlineMath: "v_k \\approx ",
      resultText: `${cv.toFixed(2)} %`,
      isExpandable: true,
    };
  };

  return (
    <CalculatorTemplate
      title="Výpočet variačného koeficientu (Zrážkové úhrny)"
      inputLabel="Ročný úhrn zrážok (mm):"
      defaultData={defaultPrecipitation}
      getMathContent={getMathContent}
      min={0}
      max={3000}
      step="1"
      placeholder="Úhrn (mm)"
    />
  );
}

export default CoefficientOfVariationCalc;
