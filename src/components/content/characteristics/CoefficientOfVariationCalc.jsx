// src/components/content/characteristics/CoefficientOfVariationCalc.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

/**
 * Default dataset representing typical values for variation analysis.
 */
const DEFAULT_DATA = [450, 320, 610, 200, 550];

/**
 * @component CoefficientOfVariationCalc
 * @description Interactive calculator for the Coefficient of Variation (CV).
 * It calculates the relative variability of a dataset by comparing the standard deviation
 * to the absolute value of the arithmetic mean.
 */
function CoefficientOfVariationCalc() {
  const { t } = useTranslation();

  /**
   * Processes data and generates mathematical steps for CV calculation.
   * @param {number[]} data - Input numeric values.
   * @param {boolean} isExpanded - Flag to toggle detailed steps in the output.
   * @returns {Object} LaTeX strings and result formatting.
   */
  const getMathContent = (data, isExpanded) => {
    const n = data.length;

    // CV requires at least 2 points to calculate sample standard deviation (n-1)
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

    // Avoid division by zero in CV formula
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

    // Calculate sample variance and standard deviation
    const sumSquaredDiffs = data.reduce(
      (acc, val) => acc + Math.pow(val - mean, 2),
      0,
    );
    const variance = sumSquaredDiffs / (n - 1);
    const stdDev = Math.sqrt(variance);

    // CV formula: (s / |mean|) * 100
    const cv = (stdDev / Math.abs(mean)) * 100;

    const stdDevStr = stdDev.toFixed(2);
    const meanStr = mean.toFixed(2);

    // Prepare optional expanded steps showing intermediate values
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
    />
  );
}

export default CoefficientOfVariationCalc;
