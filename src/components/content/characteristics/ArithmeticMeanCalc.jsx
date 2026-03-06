// src/components/content/characteristics/ArithmeticMeanCalc.jsx
import React from "react";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

function ArithmeticMeanCalc() {
  return (
    <CalculatorTemplate
      title="Výpočet priemernej nadmorskej výšky bodu"
      inputLabel="Namerané hodnoty (m):"
      defaultData={[420.15, 420.18, 420.12]}
      getMathContent={(data) => {
        const n = data.length;
        const sum = data.reduce((acc, val) => acc + val, 0);
        const mean = sum / n;
        return {
          // Oddelený všeobecný vzorec
          formulaMath: `\\bar{x} = \\frac{ \\sum_{i=1}^{n} x_i }{ n }`,
          // Dosadené čísla na samostatnom riadku
          blockMath: `\\bar{x} = \\frac{ ${data.join(" + ")} }{ ${n} }`,
          inlineMath: `\\bar{x} = `,
          resultText: `${mean.toFixed(3)} m`,
        };
      }}
    />
  );
}

export default ArithmeticMeanCalc;
