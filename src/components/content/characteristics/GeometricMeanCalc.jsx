// src/components/content/characteristics/GeometricMeanCalc.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

function GeometricMeanCalc() {
  const { t } = useTranslation();

  return (
    <CalculatorTemplate
      title={t("components.characteristics.geometric.title")}
      inputLabel={t("components.characteristics.geometric.inputLabel")}
      defaultData={[1.05, 1.02, 1.08]}
      onValidate={(val) => !isNaN(val) && val > 0}
      getMathContent={(data) => {
        const n = data.length;
        const product = data.reduce((acc, val) => acc * val, 1);
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
