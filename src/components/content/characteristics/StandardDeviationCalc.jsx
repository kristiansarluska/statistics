// src/components/content/characteristics/StandardDeviationCalc.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

/**
 * Default dataset representing temperature measurements in Celsius.
 */
const DEFAULT_DATA = [22.1, 23.5, 21.8, 24.2, 22.9];

/**
 * @component StandardDeviationCalc
 * @description Interactive calculator for the Sample Standard Deviation (s).
 * It calculates the square root of the variance to determine the average
 * amount of variability in the dataset.
 */
function StandardDeviationCalc() {
  const { t } = useTranslation();

  /**
   * Processes input data and generates mathematical output for the calculator.
   * @param {number[]} data - Array of numeric values.
   * @param {boolean} isExpanded - Flag to toggle display of full summation steps.
   * @returns {Object} LaTeX strings and calculated results for display.
   */
  const getMathContent = (data, isExpanded) => {
    const n = data.length;

    // Standard deviation requires at least 2 points for sample calculation (division by n-1)
    if (n < 2) {
      return {
        blockMath: "s = ?",
        inlineMath: "s = ",
        resultText: t("components.characteristics.standardDeviation.errorMin2"),
        isExpandable: false,
      };
    }

    const sum = data.reduce((acc, val) => acc + val, 0);
    const mean = sum / n;

    // Calculate sum of squared differences from the mean
    const squaredDiffs = data.map((x) => Math.pow(x - mean, 2));
    const sumSquaredDiffs = squaredDiffs.reduce((acc, val) => acc + val, 0);

    // Use Bessel's correction (n-1) for sample standard deviation
    const variance = sumSquaredDiffs / (n - 1);
    const stdDev = Math.sqrt(variance);

    const meanStr = Number.isInteger(mean) ? mean : mean.toFixed(2);
    const sumSquaredStr = sumSquaredDiffs.toFixed(4);

    // Prepare optional expanded steps showing individual differences
    let formulaExpanded = "";
    if (isExpanded) {
      const diffsStr = data.map((x) => `(${x} - ${meanStr})^2`).join(" + ");
      formulaExpanded = `s &= \\sqrt{\\frac{${diffsStr}}{${n} - 1}} \\\\[1ex]`;
    }

    return {
      formulaMath: `s_x = \\sqrt{\\frac{1}{n-1} \\sum_{i=1}^{n} (x_i - \\bar{x})^2}`,
      blockMath: `\\begin{aligned}
        ${formulaExpanded}
        s_x &= \\sqrt{\\frac{${sumSquaredStr}}{${n - 1}}} = \\sqrt{${variance.toFixed(4)}}
      \\end{aligned}`,
      inlineMath: "s_x \\approx ",
      resultText: `${stdDev.toFixed(4)} °C`,
      isExpandable: n > 3, // Enable expansion only for datasets where it aids clarity
    };
  };

  return (
    <CalculatorTemplate
      title={t("components.characteristics.standardDeviation.title")}
      inputLabel={t("components.characteristics.standardDeviation.inputLabel")}
      defaultData={DEFAULT_DATA}
      getMathContent={getMathContent}
    />
  );
}

export default StandardDeviationCalc;
