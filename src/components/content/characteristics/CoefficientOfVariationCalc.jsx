// src/components/content/characteristics/CoefficientOfVariationCalc.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

const DEFAULT_DATA = [450, 320, 610, 200, 550];

function CoefficientOfVariationCalc() {
  const { t } = useTranslation();

  const getMathContent = (data, isExpanded) => {
    const n = data.length;
    if (n < 2) {
      return {
        blockMath: "v_x = ?",
        inlineMath: "v_x = ",
        resultText: t(
          "components.characteristics.coefficientOfVariation.errorMin2",
        ),
        isExpandable: false,
      };
    }

    const sum = data.reduce((acc, val) => acc + val, 0);
    const mean = sum / n;

    if (mean === 0) {
      return {
        blockMath: t(
          "components.characteristics.coefficientOfVariation.errorDivZeroMath",
        ),
        inlineMath: "v_x = ",
        resultText: t(
          "components.characteristics.coefficientOfVariation.errorDivZero",
        ),
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
      formulaMath: `v_x = \\frac{s_x}{|\\bar{x}|} \\cdot 100\\%`,
      blockMath: `\\begin{aligned}
        ${formulaExpanded}
        v_x &= \\frac{${stdDevStr}}{|${meanStr}|} \\cdot 100\\%
      \\end{aligned}`,
      inlineMath: "v_x \\approx ",
      resultText: `${cv.toFixed(2)} %`,
      isExpandable: true,
    };
  };

  return (
    <CalculatorTemplate
      title={t("components.characteristics.coefficientOfVariation.title")}
      inputLabel={t(
        "components.characteristics.coefficientOfVariation.inputLabel",
      )}
      defaultData={DEFAULT_DATA}
      getMathContent={getMathContent}
      min={0}
      max={3000}
      step="1"
      placeholder={t(
        "components.characteristics.coefficientOfVariation.placeholder",
      )}
    />
  );
}

export default CoefficientOfVariationCalc;
