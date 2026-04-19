// src/components/content/characteristics/RangeCalc.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

/**
 * Default dataset used for initial calculation of the range.
 * Represents measured values in meters.
 */
const DEFAULT_DATA = [695.57, 702.16, 715.84, 728.3, 740.21];

/**
 * @component RangeCalc
 * @description Interactive calculator for the Variation Range (R).
 * It calculates the difference between the maximum and minimum values in a dataset.
 */
function RangeCalc() {
  const { t } = useTranslation();

  return (
    <CalculatorTemplate
      title={t("components.characteristics.range.title")}
      inputLabel={t("components.characteristics.range.inputLabel")}
      defaultData={DEFAULT_DATA}
      sortData={true} // Range calculation is easier with sorted data (min at index 0, max at last index)
      placeholder={t("components.characteristics.range.placeholder")}
      /**
       * Calculates the range and prepares LaTeX strings for display.
       * @param {number[]} measurements - Sorted array of input values.
       * @returns {Object} Math formatting and highlighting metadata.
       */
      getMathContent={(measurements) => {
        const n = measurements.length;

        // With sortData={true}, min is the first element and max is the last element
        const minVal = measurements[0];
        const maxVal = measurements[n - 1];
        const range = maxVal - minVal;

        // Highlight both extreme values in the data list
        const highlightIndices = n > 1 ? [0, n - 1] : [0];

        return {
          formulaMath: `R = x_{\\max} - x_{\\min}`,
          blockMath: `R = ${maxVal} - ${minVal} = ${range.toFixed(1)}`,
          inlineMath: `R = `,
          resultText: `${range.toFixed(1)} m`,
          highlightIndices,
        };
      }}
    />
  );
}

export default RangeCalc;
