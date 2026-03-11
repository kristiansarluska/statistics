// src/components/content/characteristics/ArithmeticMeanCalc.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

function ArithmeticMeanCalc() {
  const { t } = useTranslation();

  return (
    <CalculatorTemplate
      title={t("components.characteristics.arithmetic.title")}
      inputLabel={t("components.characteristics.arithmetic.inputLabel")}
      defaultData={[420.15, 420.18, 420.12]}
      getMathContent={(data) => {
        const n = data.length;
        const sum = data.reduce((acc, val) => acc + val, 0);
        const mean = sum / n;
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
