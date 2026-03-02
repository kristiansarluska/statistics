// src/components/content/characteristics/MeanDifferenceCalc.jsx
import React from "react";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

const DEFAULT_DATA = [25.4, 32.1, 18.9, 41.5];

function MeanDifferenceCalc() {
  return (
    <CalculatorTemplate
      title="Výpočet strednej diferencie: Rozdiely v znečistení ovzdušia"
      inputLabel="Namerané koncentrácie PM10 (µg/m³):"
      defaultData={DEFAULT_DATA}
      placeholder="Nová hodnota"
      min="0"
      getMathContent={(measurements, isExpanded) => {
        const n = measurements.length;

        if (n < 2) {
          return {
            blockMath: `\\text{Pre výpočet sú potrebné aspoň 2 hodnoty.}`,
            inlineMath: `\\Delta = `,
            resultText: `N/A`,
          };
        }

        const pairs = [];
        let sum = 0;

        for (let i = 0; i < n; i++) {
          for (let j = i + 1; j < n; j++) {
            const diff = Math.abs(measurements[i] - measurements[j]);
            pairs.push(
              `|${measurements[i].toFixed(1)} - ${measurements[j].toFixed(1)}|`,
            );
            sum += diff;
          }
        }

        const k = pairs.length;
        const delta = sum / k;

        // Vrátený starší breakpoint, viac ako 6 dvojíc sa zabaľuje
        const isExpandable = k > 6;
        let devString = "";

        if (!isExpandable || isExpanded) {
          devString = pairs.join(" + ");
        } else {
          devString = `${pairs[0]} + \\dots + ${pairs[k - 1]}`;
        }

        const blockMath = `\\begin{gathered} 
          \\text{Počet unikátnych dvojíc: } k = \\binom{n}{2} = \\frac{${n}(${n}-1)}{2} = ${k} \\\\ 
          \\Delta = \\frac{1}{k} \\sum_{i<j} |x_i - x_j| = \\frac{${devString}}{${k}} = ${delta.toFixed(3)} 
        \\end{gathered}`;

        return {
          blockMath,
          inlineMath: `\\Delta = `,
          resultText: `${delta.toFixed(3)} µg/m³`,
          isExpandable,
        };
      }}
    />
  );
}

export default MeanDifferenceCalc;
