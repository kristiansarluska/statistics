// src/components/content/characteristics/MeanDeviationCalc.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

/**
 * Default dataset for calculating mean deviation.
 */
const DEFAULT_DATA = [50.12, 50.15, 50.08, 50.11, 50.14];

/**
 * @component MeanDeviationCalc
 * @description Interactive calculator for the Mean Absolute Deviation (MAD).
 * It calculates the average of the absolute differences between each data point and the arithmetic mean.
 */
function MeanDeviationCalc() {
  const { t } = useTranslation();

  return (
    <CalculatorTemplate
      title={t("components.characteristics.meanDeviation.title")}
      inputLabel={t("components.characteristics.meanDeviation.inputLabel")}
      defaultData={DEFAULT_DATA}
      placeholder={t("components.characteristics.meanDeviation.placeholder")}
      /**
       * Logic for calculating the mean deviation and generating LaTeX steps.
       * @param {number[]} measurements - Array of input values.
       * @param {boolean} isExpanded - Flag to toggle display of full sum vs. ellipsis.
       * @returns {Object} Math formatting and calculated results.
       */
      getMathContent={(measurements, isExpanded) => {
        const n = measurements.length;
        const sum = measurements.reduce((acc, val) => acc + val, 0);
        const mean = sum / n;
        const meanStr = mean.toFixed(3);

        // Calculate individual absolute deviations from the mean
        const deviations = measurements.map((x) => Math.abs(x - mean));
        const sumDeviations = deviations.reduce((acc, val) => acc + val, 0);
        const mad = sumDeviations / n;

        // Determine if the formula should be truncated for UI clarity
        const isExpandable = n > 4;
        let devString = "";

        if (!isExpandable || isExpanded) {
          // Show all terms in the sum
          devString = measurements
            .map((x) => `|${x} - ${meanStr}|`)
            .join(" + ");
        } else {
          // Show only first and last terms with ellipsis
          devString = `|${measurements[0]} - ${meanStr}| + \\dots + |${measurements[n - 1]} - ${meanStr}|`;
        }

        return {
          formulaMath: `\\bar{d}_{\\bar{x}} = \\frac{1}{n} \\sum_{i=1}^{n} |x_i - \\bar{x}|`,
          blockMath: `\\begin{gathered} 
    \\bar{x} = ${meanStr} \\text{ m} \\\\ 
    \\bar{d}_{\\bar{x}} = \\frac{${devString}}{${n}} = ${mad.toFixed(4)} 
  \\end{gathered}`,
          inlineMath: `\\bar{d}_{\\bar{x}} = `,
          resultText: `${mad.toFixed(4)} m`,
          isExpandable,
        };
      }}
    />
  );
}

export default MeanDeviationCalc;
