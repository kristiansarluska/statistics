// src/components/content/characteristics/GeometricMeanCalc.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

/**
 * Default dataset for initial calculation.
 * Commonly used for growth rates or ratios.
 */
const DEFAULT_DATA = [1.05, 1.02, 1.08];

/**
 * @component GeometricMeanCalc
 * @description Interactive calculator for the Geometric Mean.
 * Suitable for datasets where values represent rates of change or ratios.
 * Includes validation to ensure all inputs are positive numbers.
 */
function GeometricMeanCalc() {
  const { t } = useTranslation();

  return (
    <CalculatorTemplate
      title={t("components.characteristics.geometric.title")}
      inputLabel={t("components.characteristics.geometric.inputLabel")}
      defaultData={DEFAULT_DATA}
      /**
       * Validator function to ensure geometric mean can be calculated.
       * Values must be positive (> 0) to avoid zero products or complex roots.
       */
      onValidate={(val) => !isNaN(val) && val > 0}
      /**
       * Logic for calculating the geometric mean and generating LaTeX formulas.
       * @param {number[]} data - Array of positive numeric values.
       * @returns {Object} Math formatting for display.
       */
      getMathContent={(data) => {
        const n = data.length;
        // Calculate the product of all elements
        const product = data.reduce((acc, val) => acc * val, 1);
        // Geometric mean is the n-th root of the product
        const geometricMean = Math.pow(product, 1 / n);

        return {
          formulaMath: `\\bar{x}_G = \\sqrt[n]{ \\prod_{i=1}^{n} x_i }`,
          blockMath: `\\bar{x}_G = \\sqrt[${n}]{ ${data.join(" \\cdot ")} }`,
          inlineMath: `\\bar{x}_G = `,
          resultText: geometricMean.toFixed(3),
        };
      }}
    />
  );
}

export default GeometricMeanCalc;
