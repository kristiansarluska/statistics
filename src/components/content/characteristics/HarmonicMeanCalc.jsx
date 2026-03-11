// src/components/content/characteristics/HarmonicMeanCalc.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

function HarmonicMeanCalc() {
  const { t } = useTranslation();

  return (
    <CalculatorTemplate
      title={t("components.characteristics.harmonic.title")}
      inputLabel={t("components.characteristics.harmonic.inputLabel")}
      defaultData={[15.2, 12.5, 18.0]}
      onValidate={(val) => !isNaN(val) && val > 0}
      getMathContent={(data) => {
        const n = data.length;
        const sumOfInverses = data.reduce((acc, val) => acc + 1 / val, 0);
        const harmonicMean = n / sumOfInverses;
        return {
          formulaMath: `\\bar{x}_H = \\frac{ n }{ \\sum_{i=1}^{n} \\frac{1}{x_i} }`,
          blockMath: `\\bar{x}_H = \\frac{ ${n} }{ ${data.map((x) => `\\frac{1}{${x}}`).join(" + ")} }`,
          inlineMath: `\\bar{x}_H = `,
          resultText: `${harmonicMean.toFixed(2)} m/s`,
        };
      }}
    />
  );
}

export default HarmonicMeanCalc;
