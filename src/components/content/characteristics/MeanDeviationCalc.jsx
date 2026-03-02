// src/components/content/characteristics/MeanDeviationCalc.jsx
import React from "react";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

// Geoinformatics-themed data: Repeated measurements of a parcel boundary length (m)
const DEFAULT_DATA = [50.12, 50.15, 50.08, 50.11, 50.14];

function MeanDeviationCalc() {
  return (
    <CalculatorTemplate
      title="Výpočet priemernej odchýlky: Presnosť opakovaného merania dĺžky"
      inputLabel="Namerané dĺžky (m):"
      defaultData={DEFAULT_DATA}
      placeholder="Nová dĺžka"
      getMathContent={(measurements) => {
        const n = measurements.length;
        const sum = measurements.reduce((acc, val) => acc + val, 0);
        const mean = sum / n;

        const deviations = measurements.map((x) => Math.abs(x - mean));
        const sumDeviations = deviations.reduce((acc, val) => acc + val, 0);
        const mad = sumDeviations / n;

        // Generate equation string safely for KaTeX
        let devString = "";
        if (n <= 4) {
          devString = measurements
            .map((x) => `|${x} - ${mean.toFixed(2)}|`)
            .join(" + ");
        } else {
          // If too many items, use ellipsis to prevent text overflow
          devString = `|${measurements[0]} - ${mean.toFixed(2)}| + \\dots + |${measurements[n - 1]} - ${mean.toFixed(2)}|`;
        }

        const blockMath = `\\begin{gathered} 
          \\bar{x} = ${mean.toFixed(3)} \\text{ m} \\\\ 
          \\text{MD} = \\frac{1}{n} \\sum_{i=1}^{n} |x_i - \\bar{x}| = \\frac{${devString}}{${n}} = ${mad.toFixed(4)} 
        \\end{gathered}`;

        return {
          blockMath,
          inlineMath: `\\text{MD} = `,
          resultText: `${mad.toFixed(4)} m`,
        };
      }}
    />
  );
}

export default MeanDeviationCalc;
