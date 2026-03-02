// src/components/content/characteristics/MedianCalc.jsx
import React from "react";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

const DEFAULT_DATA = [12, 15, 15, 18, 21, 24, 25];

function MedianCalc() {
  return (
    <CalculatorTemplate
      title="Výpočet mediánu: Výška budov v mestskej zástavbe"
      inputLabel="Namerané výšky budov (m) – zoradené:"
      defaultData={DEFAULT_DATA}
      sortData={true}
      min="0"
      placeholder="Nová budova"
      getMathContent={(measurements) => {
        const n = measurements.length;
        const sortedStr = measurements.join(", ");
        let blockMath = `\\begin{gathered} \\{ ${sortedStr} \\} \\\\ `;
        let median;
        let highlightIndices = [];
        let injectedMedian = null; // Hodnota pre vykreslenie badgeu medzi dátami

        if (n % 2 !== 0) {
          const m = Math.floor(n / 2);
          median = measurements[m];
          highlightIndices = [m];
          blockMath += `\\tilde{x} = x_{\\frac{n+1}{2}} = x_{${m + 1}} = ${median} \\end{gathered}`;
        } else {
          const m1 = n / 2 - 1;
          const m2 = n / 2;
          median = (measurements[m1] + measurements[m2]) / 2;
          highlightIndices = [m1, m2];
          // Uložíme si, že stredovú hodnotu chceme vložiť hneď za index m1
          injectedMedian = { value: median, insertAfterIdx: m1 };
          blockMath += `\\tilde{x} = \\frac{x_{\\frac{n}{2}} + x_{\\frac{n}{2}+1}}{2} = \\frac{${measurements[m1]} + ${measurements[m2]}}{2} = ${median} \\end{gathered}`;
        }

        return {
          blockMath,
          inlineMath: `\\tilde{x} = `,
          resultText: `${median.toFixed(2)} m`,
          highlightIndices,
          injectedMedian, // Posunieme do CalculatorTemplate
        };
      }}
      renderExtra={(val, idx, mathContent) => {
        // Vykreslí sa jedine ak ide o párny počet prvkov a index sa zhoduje s našou značkou
        if (mathContent?.injectedMedian?.insertAfterIdx === idx) {
          return (
            <span
              key={`inj-${idx}`}
              className="badge rounded-pill border border-info bg-info-subtle text-info"
              style={{ fontSize: "0.85rem", userSelect: "none", zIndex: 1 }}
              title="Vypočítaný medián (stredná hodnota)"
            >
              =
              {mathContent.injectedMedian.value.toLocaleString("sk-SK", {
                maximumFractionDigits: 2,
              })}
            </span>
          );
        }
        return null;
      }}
    />
  );
}

export default MedianCalc;
