// src/components/content/characteristics/RangeCalc.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

const DEFAULT_DATA = [695.57, 702.16, 715.84, 728.3, 740.21];

function RangeCalc() {
  const { t } = useTranslation();

  return (
    <CalculatorTemplate
      title={t("components.characteristics.range.title")}
      inputLabel={t("components.characteristics.range.inputLabel")}
      defaultData={DEFAULT_DATA}
      sortData={true}
      placeholder={t("components.characteristics.range.placeholder")}
      getMathContent={(measurements) => {
        const n = measurements.length;
        const minVal = measurements[0];
        const maxVal = measurements[n - 1];
        const range = maxVal - minVal;

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
