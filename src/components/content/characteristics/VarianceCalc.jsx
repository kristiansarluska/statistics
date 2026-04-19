// src/components/content/characteristics/VarianceCalc.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

/**
 * Default dataset used for initial variance calculation.
 */
const DEFAULT_DATA = [12, 15, 18, 14, 21];

/**
 * @component VarianceCalc
 * @description Interactive calculator for the Sample Variance (s²).
 * It calculates the average of the squared deviations from the mean,
 * using Bessel's correction (n-1) for sample data.
 */
function VarianceCalc() {
  const { t } = useTranslation();

  return (
    <CalculatorTemplate
      title={t("components.characteristics.variance.title")}
      inputLabel={t("components.characteristics.variance.inputLabel")}
      defaultData={DEFAULT_DATA}
      placeholder={t("components.characteristics.variance.placeholder")}
      /**
       * Logic for calculating the sample variance and generating LaTeX steps.
       * @param {number[]} measurements - Array of input values.
       * @param {boolean} isExpanded - Flag to toggle display of full summation vs. ellipsis.
       * @returns {Object} Math formatting and calculated results.
       */
      getMathContent={(measurements, isExpanded) => {
        const n = measurements.length;

        // Variance requires at least 2 points for sample calculation (division by n-1)
        if (n < 2) {
          return {
            blockMath: `\\text{${t("components.characteristics.variance.errorMin2")}}`,
            inlineMath: `s^2 = `,
            resultText: `N/A`,
          };
        }

        const sum = measurements.reduce((acc, val) => acc + val, 0);
        const mean = sum / n;
        const meanStr = mean.toFixed(2);

        // Calculate squared differences from the mean
        const squaredDeviations = measurements.map((x) =>
          Math.pow(x - mean, 2),
        );
        const sumSquaredDev = squaredDeviations.reduce(
          (acc, val) => acc + val,
          0,
        );

        // Sample variance formula: sum((x - mean)^2) / (n - 1)
        const variance = sumSquaredDev / (n - 1);

        // Determine if the formula should be truncated for UI clarity
        const isExpandable = n > 4;
        let devString = "";

        if (!isExpandable || isExpanded) {
          // Show all squared deviation terms
          devString = measurements
            .map((x) => `(${x} - ${meanStr})^2`)
            .join(" + ");
        } else {
          // Show only first and last terms with ellipsis
          devString = `(${measurements[0]} - ${meanStr})^2 + \\dots + (${measurements[n - 1]} - ${meanStr})^2`;
        }

        return {
          formulaMath: `s_x^2 = \\frac{1}{n-1} \\sum_{i=1}^{n} (x_i - \\bar{x})^2`,
          blockMath: `\\begin{gathered} 
            \\bar{x} = ${meanStr} \\\\ 
            s_x^2 = \\frac{${devString}}{${n} - 1} = ${variance.toFixed(3)} 
          \\end{gathered}`,
          inlineMath: `s_x^2 = `,
          resultText: `${variance.toFixed(3)} ${t("randomVariable.characteristics.variability.variance.unit")}`,
          isExpandable,
        };
      }}
    />
  );
}

export default VarianceCalc;
