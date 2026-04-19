// src/components/content/characteristics/MeanDifferenceCalc.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

/**
 * Default dataset for calculating the mean difference.
 */
const DEFAULT_DATA = [25.4, 32.1, 18.9, 41.5];

/**
 * @component MeanDifferenceCalc
 * @description Interactive calculator for Gini's Mean Difference (Delta).
 * It calculates the average of absolute differences between all possible pairs of data points.
 */
function MeanDifferenceCalc() {
  const { t } = useTranslation();

  return (
    <CalculatorTemplate
      title={t("components.characteristics.meanDifference.title")}
      inputLabel={t("components.characteristics.meanDifference.inputLabel")}
      defaultData={DEFAULT_DATA}
      placeholder={t("components.characteristics.meanDifference.placeholder")}
      min="0"
      /**
       * Logic for calculating Gini's mean difference and generating LaTeX steps.
       * @param {number[]} measurements - Array of input values.
       * @param {boolean} isExpanded - Flag to toggle display of all pairs vs. ellipsis.
       * @returns {Object} Math formatting and calculated results.
       */
      getMathContent={(measurements, isExpanded) => {
        const n = measurements.length;

        // Mean difference requires at least two values to form a pair
        if (n < 2) {
          return {
            blockMath: `\\text{${t("components.characteristics.meanDifference.errorMin2")}}`,
            inlineMath: `\\Delta = `,
            resultText: `N/A`,
          };
        }

        const pairs = [];
        let sum = 0;

        // Iterate through unique pairs (i < j) to calculate absolute differences
        for (let i = 0; i < n; i++) {
          for (let j = i + 1; j < n; j++) {
            const diff = Math.abs(measurements[i] - measurements[j]);
            pairs.push(
              `|${measurements[i].toFixed(1)} - ${measurements[j].toFixed(1)}|`,
            );
            sum += diff;
          }
        }

        // k is the total number of unique pairs: nCr(n, 2)
        const k = pairs.length;
        const delta = sum / k;

        // Expansion logic for the mathematical expression
        const isExpandable = k > 6;
        let devString = "";

        if (!isExpandable || isExpanded) {
          // Show all absolute difference pairs
          devString = pairs.join(" + ");
        } else {
          // Show only first and last pair with ellipsis
          devString = `${pairs[0]} + \\dots + ${pairs[k - 1]}`;
        }

        return {
          formulaMath: `\\Delta = \\frac{1}{k} \\sum_{i<j} |x_i - x_j| \\quad \\text{${t("components.characteristics.meanDifference.where")} } k = \\binom{n}{2}`,
          blockMath: `\\begin{gathered} 
            k = \\binom{${n}}{2} = \\frac{${n}(${n}-1)}{2} = ${k} \\\\ 
            \\Delta = \\frac{${devString}}{${k}} = ${delta.toFixed(3)} 
          \\end{gathered}`,
          inlineMath: `\\Delta = `,
          resultText: `${delta.toFixed(3)} µg/m³`,
          isExpandable,
        };
      }}
    />
  );
}

export default MeanDifferenceCalc;
