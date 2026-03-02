// src/components/content/characteristics/InterquartileRangeCalc.jsx
import React from "react";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

function InterquartileRangeCalc() {
  // Ceny poľnohospodárskej pôdy/záhrad (€/m²), jedna hodnota (145) je jasný extrém
  const defaultPrices = [12, 15, 14, 18, 145, 16, 17];

  const getMathContent = (data, isExpanded) => {
    const n = data.length;
    if (n < 4) {
      return {
        blockMath: "IQR = ?",
        inlineMath: "IQR = ",
        resultText: "Nedostatok dát (n ≥ 4)",
        isExpandable: false,
      };
    }

    // Dáta musia byť zoradené
    const sorted = [...data].sort((a, b) => a - b);

    // Výpočet kvartilu (štandardná interpolácia)
    const calcQuantile = (p) => {
      const pos = p * (n - 1);
      const base = Math.floor(pos);
      const rest = pos - base;
      if (sorted[base + 1] !== undefined) {
        return sorted[base] + rest * (sorted[base + 1] - sorted[base]);
      }
      return sorted[base];
    };

    const q1 = calcQuantile(0.25);
    const q3 = calcQuantile(0.75);
    const iqr = q3 - q1;

    const q1Str = q1.toFixed(2).replace(/\.00$/, "");
    const q3Str = q3.toFixed(2).replace(/\.00$/, "");
    const iqrStr = iqr.toFixed(2).replace(/\.00$/, "");

    let formulaExpanded = "";
    if (isExpanded) {
      const sortedStr = sorted.join(", ");
      formulaExpanded = `
        \\text{Zoradené dáta: } & ${sortedStr} \\\\[1ex]
        Q_1 (25\\%) &= ${q1Str} \\\\[1ex]
        Q_3 (75\\%) &= ${q3Str} \\\\[2ex]
      `;
    }

    const blockMath = `\\begin{aligned}
      IQR &= Q_3 - Q_1 \\\\[2ex]
      ${formulaExpanded}
      IQR &= ${q3Str} - ${q1Str}
    \\end{aligned}`;

    return {
      blockMath,
      inlineMath: "IQR = ",
      resultText: `${iqrStr} €/m²`,
      isExpandable: true,
    };
  };

  return (
    <CalculatorTemplate
      title="Výpočet medzikvartilového rozpätia (Ceny pozemkov)"
      inputLabel="Jednotkové ceny (€/m²):"
      defaultData={defaultPrices}
      getMathContent={getMathContent}
      min={0}
      max={1000}
      step="1"
      placeholder="Cena"
      sortData={true} // Template sa postará o to, aby sa inputy pekne zoradili
    />
  );
}

export default InterquartileRangeCalc;
