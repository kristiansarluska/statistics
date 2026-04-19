// src/components/content/characteristics/QuartileDeviationCalc.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

/**
 * Default dataset used for initial quartile deviation calculation.
 */
const DEFAULT_DATA = [12, 15, 14, 18, 145, 16, 17];

/**
 * @component QuartileDeviationCalc
 * @description Interactive calculator for the Quartile Deviation (semi-interquartile range).
 * It calculates the first and third quartiles using linear interpolation and determines
 * the dispersion of the middle 50% of the data.
 */
function QuartileDeviationCalc() {
  const { t } = useTranslation();

  /**
   * Processes input data and generates mathematical output for the calculator.
   * @param {number[]} data - Array of numeric values.
   * @param {boolean} isExpanded - Flag to toggle display of detailed intermediate steps.
   * @returns {Object} LaTeX strings and calculated results for display.
   */
  const getMathContent = (data, isExpanded) => {
    const n = data.length;

    // Minimum 4 data points are recommended for meaningful quartile calculation
    if (n < 4) {
      return {
        blockMath: "Q_x = ?",
        inlineMath: "Q_x = ",
        resultText: t("components.characteristics.quartileDeviation.errorMin4"),
        isExpandable: false,
      };
    }

    // Quartiles require data to be sorted in ascending order
    const sorted = [...data].sort((a, b) => a - b);

    /**
     * Calculates the p-quantile using linear interpolation between the two closest observations.
     * @param {number} p - The probability (quantile) to calculate (e.g., 0.25 for Q1).
     */
    const calcQuantile = (p) => {
      const pos = p * (n - 1);
      const base = Math.floor(pos);
      const rest = pos - base;
      if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
      }
      return sorted[base];
    };

    const q1 = calcQuantile(0.25);
    const q3 = calcQuantile(0.75);

    // Quartile deviation formula: (Q3 - Q1) / 2
    const qd = (q3 - q1) / 2;

    // Format numbers for display (remove trailing .00 for cleaner output)
    const q1Str = q1.toFixed(2).replace(/\.00$/, "");
    const q3Str = q3.toFixed(2).replace(/\.00$/, "");
    const qdStr = qd.toFixed(2).replace(/\.00$/, "");

    // Prepare optional expanded steps showing sorted data and quartile values
    let formulaExpanded = "";
    if (isExpanded) {
      const sortedStr = sorted.join(", ");
      formulaExpanded = `
        \\text{${t("components.characteristics.quartileDeviation.sortedData")}} & ${sortedStr} \\\\[1ex]
        Q_1 (25\\%) &= ${q1Str} \\\\[1ex]
        Q_3 (75\\%) &= ${q3Str} \\\\[2ex]
      `;
    }

    return {
      formulaMath: `Q_x = \\frac{Q_3 - Q_1}{2}`,
      blockMath: `\\begin{aligned}
        ${formulaExpanded}
        Q_x &= \\frac{${q3Str} - ${q1Str}}{2}
      \\end{aligned}`,
      inlineMath: "Q_x = ",
      resultText: `${qdStr} €/m²`,
      isExpandable: true,
    };
  };

  return (
    <CalculatorTemplate
      title={t("components.characteristics.quartileDeviation.title")}
      inputLabel={t("components.characteristics.quartileDeviation.inputLabel")}
      defaultData={DEFAULT_DATA}
      getMathContent={getMathContent}
      min={0}
      max={1000}
      step="1"
      placeholder={t(
        "components.characteristics.quartileDeviation.placeholder",
      )}
      sortData={true}
    />
  );
}

export default QuartileDeviationCalc;
