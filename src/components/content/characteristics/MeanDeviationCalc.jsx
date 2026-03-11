// src/components/content/characteristics/MeanDeviationCalc.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

const DEFAULT_DATA = [50.12, 50.15, 50.08, 50.11, 50.14];

function MeanDeviationCalc() {
  const { t } = useTranslation();

  return (
    <CalculatorTemplate
      title={t("components.characteristics.meanDeviation.title")}
      inputLabel={t("components.characteristics.meanDeviation.inputLabel")}
      defaultData={DEFAULT_DATA}
      placeholder={t("components.characteristics.meanDeviation.placeholder")}
      getMathContent={(measurements, isExpanded) => {
        const n = measurements.length;
        const sum = measurements.reduce((acc, val) => acc + val, 0);
        const mean = sum / n;
        const meanStr = mean.toFixed(3);

        const deviations = measurements.map((x) => Math.abs(x - mean));
        const sumDeviations = deviations.reduce((acc, val) => acc + val, 0);
        const mad = sumDeviations / n;

        const isExpandable = n > 4;
        let devString = "";

        if (!isExpandable || isExpanded) {
          devString = measurements
            .map((x) => `|${x} - ${meanStr}|`)
            .join(" + ");
        } else {
          devString = `|${measurements[0]} - ${meanStr}| + \\dots + |${measurements[n - 1]} - ${meanStr}|`;
        }

        return {
          formulaMath: `\\text{MD} = \\frac{1}{n} \\sum_{i=1}^{n} |x_i - \\bar{x}|`,
          blockMath: `\\begin{gathered} 
            \\bar{x} = ${meanStr} \\text{ m} \\\\ 
            \\text{MD} = \\frac{${devString}}{${n}} = ${mad.toFixed(4)} 
          \\end{gathered}`,
          inlineMath: `\\text{MD} = `,
          resultText: `${mad.toFixed(4)} m`,
          isExpandable,
        };
      }}
    />
  );
}

export default MeanDeviationCalc;
