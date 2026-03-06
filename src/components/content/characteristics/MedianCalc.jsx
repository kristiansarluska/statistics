// src/components/content/characteristics/MedianCalc.jsx
import React from "react";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

const DEFAULT_DATA = [12, 15, 15, 18, 21, 24, 72];

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
        let formulaMath = "";
        let blockMath = `\\begin{gathered} \\{ ${sortedStr} \\} \\\\ `;
        let median;
        let highlightIndices = [];
        let injectedMedian = null;

        if (n % 2 !== 0) {
          const m = Math.floor(n / 2);
          median = measurements[m];
          highlightIndices = [m];
          formulaMath = `\\tilde{x} = x_{\\frac{n+1}{2}} \\quad \\text{(pre nepárny počet dát)}`;
          blockMath += `\\tilde{x} = x_{${m + 1}} = ${median} \\end{gathered}`;
        } else {
          const m1 = n / 2 - 1;
          const m2 = n / 2;
          median = (measurements[m1] + measurements[m2]) / 2;
          highlightIndices = [m1, m2];
          injectedMedian = { value: median, insertAfterIdx: m1 };
          formulaMath = `\\tilde{x} = \\frac{x_{\\frac{n}{2}} + x_{\\frac{n}{2}+1}}{2} \\quad \\text{(pre párny počet dát)}`;
          blockMath += `\\tilde{x} = \\frac{${measurements[m1]} + ${measurements[m2]}}{2} = ${median} \\end{gathered}`;
        }

        return {
          formulaMath,
          blockMath,
          inlineMath: `\\tilde{x} = `,
          resultText: `${median.toFixed(2)} m`,
          highlightIndices,
          injectedMedian,
        };
      }}
      renderExtra={(val, idx, mathContent) => {
        if (mathContent?.injectedMedian?.insertAfterIdx === idx) {
          return (
            <span
              key={`inj-${idx}`}
              className="badge rounded-pill border border-info bg-info-subtle text-info"
              style={{ fontSize: "0.85rem", userSelect: "none", zIndex: 1 }}
              title="Vypočítaný medián"
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
      // Informačný panel s priemerom pre porovnanie
      bottomContent={(measurements) => {
        if (measurements.length === 0) return null;
        const sum = measurements.reduce((a, b) => a + b, 0);
        const mean = sum / measurements.length;
        return (
          <div className="alert alert-secondary text-center shadow-sm py-2 mb-0 border-secondary-subtle">
            <span className="fw-bold">Pre porovnanie:</span> Aritmetický priemer
            týchto dát je{" "}
            <strong className="text-primary">{mean.toFixed(2)} m</strong>.
            <div className="small mt-1 text-muted">
              Vyskúšajte pridať extrémnu hodnotu a sledujte, ako masívne sa
              zmení priemer v porovnaní s mediánom.
            </div>
          </div>
        );
      }}
    />
  );
}

export default MedianCalc;
