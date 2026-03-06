// src/components/content/characteristics/VarianceCalc.jsx
import React from "react";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

const DEFAULT_DATA = [12, 15, 18, 14, 21];

function VarianceCalc() {
  return (
    <CalculatorTemplate
      title="Výpočet rozptylu: Variabilita hustoty LiDARových dát"
      inputLabel="Nameraná hustota bodov (body/m²):"
      defaultData={DEFAULT_DATA}
      placeholder="Nová hodnota"
      getMathContent={(measurements, isExpanded) => {
        const n = measurements.length;

        if (n < 2) {
          return {
            blockMath: `\\text{Pre výpočet výberového rozptylu sú potrebné aspoň 2 hodnoty.}`,
            inlineMath: `s^2 = `,
            resultText: `N/A`,
          };
        }

        const sum = measurements.reduce((acc, val) => acc + val, 0);
        const mean = sum / n;
        const meanStr = mean.toFixed(2);

        const squaredDeviations = measurements.map((x) =>
          Math.pow(x - mean, 2),
        );
        const sumSquaredDev = squaredDeviations.reduce(
          (acc, val) => acc + val,
          0,
        );
        const variance = sumSquaredDev / (n - 1);

        const isExpandable = n > 4;
        let devString = "";

        if (!isExpandable || isExpanded) {
          devString = measurements
            .map((x) => `(${x} - ${meanStr})^2`)
            .join(" + ");
        } else {
          devString = `(${measurements[0]} - ${meanStr})^2 + \\dots + (${measurements[n - 1]} - ${meanStr})^2`;
        }

        return {
          formulaMath: `s^2 = \\frac{1}{n-1} \\sum_{i=1}^{n} (x_i - \\bar{x})^2`,
          blockMath: `\\begin{gathered} 
            \\bar{x} = ${meanStr} \\text{ bodov/m}^2 \\\\ 
            s^2 = \\frac{${devString}}{${n} - 1} = ${variance.toFixed(3)} 
          \\end{gathered}`,
          inlineMath: `s^2 = `,
          resultText: `${variance.toFixed(3)} (bodov/m²)²`,
          isExpandable,
        };
      }}
    />
  );
}

export default VarianceCalc;
