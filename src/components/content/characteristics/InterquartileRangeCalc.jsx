// src/components/content/characteristics/InterquartileRangeCalc.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

function InterquartileRangeCalc() {
  const { t } = useTranslation();
  const defaultPrices = [12, 15, 14, 18, 145, 16, 17];

  const getMathContent = (data, isExpanded) => {
    const n = data.length;
    if (n < 4) {
      return {
        blockMath: "IQR = ?",
        inlineMath: "IQR = ",
        resultText: t("components.characteristics.iqr.errorMin4"),
        isExpandable: false,
      };
    }

    const sorted = [...data].sort((a, b) => a - b);

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
    const iqr = q3 - q1;

    const q1Str = q1.toFixed(2).replace(/\.00$/, "");
    const q3Str = q3.toFixed(2).replace(/\.00$/, "");
    const iqrStr = iqr.toFixed(2).replace(/\.00$/, "");

    let formulaExpanded = "";
    if (isExpanded) {
      const sortedStr = sorted.join(", ");
      formulaExpanded = `
        \\text{${t("components.characteristics.iqr.sortedData")}} & ${sortedStr} \\\\[1ex]
        Q_1 (25\\%) &= ${q1Str} \\\\[1ex]
        Q_3 (75\\%) &= ${q3Str} \\\\[2ex]
      `;
    }

    return {
      formulaMath: `IQR = Q_3 - Q_1`,
      blockMath: `\\begin{aligned}
        ${formulaExpanded}
        IQR &= ${q3Str} - ${q1Str}
      \\end{aligned}`,
      inlineMath: "IQR = ",
      resultText: `${iqrStr} €/m²`,
      isExpandable: true,
    };
  };

  return (
    <CalculatorTemplate
      title={t("components.characteristics.iqr.title")}
      inputLabel={t("components.characteristics.iqr.inputLabel")}
      defaultData={defaultPrices}
      getMathContent={getMathContent}
      min={0}
      max={1000}
      step="1"
      placeholder={t("components.characteristics.iqr.placeholder")}
      sortData={true}
    />
  );
}

export default InterquartileRangeCalc;
