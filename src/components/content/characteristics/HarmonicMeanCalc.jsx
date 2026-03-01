// src/components/content/characteristics/HarmonicMeanCalc.jsx
import React from "react";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

function HarmonicMeanCalc() {
  return (
    <CalculatorTemplate
      title="Priemerná rýchlosť letu na zhodných úsekoch"
      inputLabel="Rýchlosti dronu (m/s):"
      defaultData={[15.2, 12.5, 18.0]}
      onValidate={(val) => !isNaN(val) && val > 0} // Zabráni deleniu nulou a negatívnym rýchlostiam
      getMathContent={(data) => {
        const n = data.length;
        const sumOfInverses = data.reduce((acc, val) => acc + 1 / val, 0);
        const harmonicMean = n / sumOfInverses;
        return {
          blockMath: `\\bar{x}_H = \\frac{ n }{ \\sum \\frac{1}{x_i} } = \\frac{ ${n} }{ ${data.map((x) => `\\frac{1}{${x}}`).join(" + ")} }`,
          inlineMath: `\\bar{x}_H = `,
          resultText: `${harmonicMean.toFixed(2)} m/s`,
        };
      }}
    />
  );
}

export default HarmonicMeanCalc;
