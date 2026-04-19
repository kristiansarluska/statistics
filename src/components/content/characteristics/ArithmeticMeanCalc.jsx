// src/components/content/characteristics/ArithmeticMeanCalc.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

/**
 * Default dataset used for the initial state of the calculator.
 * Represents measured values (e.g., in meters).
 */
const DEFAULT_DATA = [420.15, 420.18, 420.12];

/**
 * @component ArithmeticMeanCalc
 * @description Interactive calculator component for computing the arithmetic mean.
 * It uses the CalculatorTemplate to handle user input and displays the step-by-step
 * mathematical calculation using LaTeX formatting.
 */
function ArithmeticMeanCalc() {
  const { t } = useTranslation();

  return (
    <CalculatorTemplate
      title={t("components.characteristics.arithmetic.title")}
      inputLabel={t("components.characteristics.arithmetic.inputLabel")}
      defaultData={DEFAULT_DATA}
      /**
       * Processes the input data to generate mathematical formulas and results.
       * @param {number[]} data - Array of numeric values from user input.
       * @returns {Object} Math content strings for display.
       */
      getMathContent={(data) => {
        const n = data.length;
        const sum = data.reduce((acc, val) => acc + val, 0);
        const mean = sum / n;

        // Return LaTeX strings and formatted result for the template
        return {
          formulaMath: `\\bar{x} = \\frac{ \\sum_{i=1}^{n} x_i }{ n }`,
          blockMath: `\\bar{x} = \\frac{ ${data.join(" + ")} }{ ${n} }`,
          inlineMath: `\\bar{x} = `,
          resultText: `${mean.toFixed(3)} m`,
        };
      }}
    />
  );
}

export default ArithmeticMeanCalc;
