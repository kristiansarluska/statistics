// src/components/content/characteristics/StandardDeviationCalc.jsx
import React from "react";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

function StandardDeviationCalc() {
  // Example: Temperatures (°C) measured at various urban sensors (Urban Heat Island analysis)
  const defaultTemperatures = [22.1, 23.5, 21.8, 24.2, 22.9];

  const getMathContent = (data, isExpanded) => {
    const n = data.length;
    if (n < 2) {
      return {
        blockMath: "s = ?",
        inlineMath: "s = ",
        resultText: "Nedostatok dát (n > 1)",
        isExpandable: false,
      };
    }

    const sum = data.reduce((acc, val) => acc + val, 0);
    const mean = sum / n;

    const squaredDiffs = data.map((x) => Math.pow(x - mean, 2));
    const sumSquaredDiffs = squaredDiffs.reduce((acc, val) => acc + val, 0);
    const variance = sumSquaredDiffs / (n - 1);
    const stdDev = Math.sqrt(variance);

    // Format mean for display
    const meanStr = Number.isInteger(mean) ? mean : mean.toFixed(2);

    // Build formula string
    let formulaExpanded = "";
    if (isExpanded) {
      const diffsStr = data.map((x) => `(${x} - ${meanStr})^2`).join(" + ");
      formulaExpanded = `s = \\sqrt{\\frac{${diffsStr}}{${n} - 1}} \\\\[1ex]`;
    }

    const sumSquaredStr = sumSquaredDiffs.toFixed(4);

    const blockMath = `
      s = \\sqrt{\\frac{\\sum_{i=1}^{n} (x_i - \\bar{x})^2}{n-1}} \\\\[2ex]
      ${formulaExpanded}
      s = \\sqrt{\\frac{${sumSquaredStr}}{${n - 1}}} = \\sqrt{${variance.toFixed(4)}}
    `;

    return {
      blockMath,
      inlineMath: "s \\approx ",
      resultText: `${stdDev.toFixed(4)} °C`,
      isExpandable: n > 3,
    };
  };

  return (
    <CalculatorTemplate
      title="Výpočet smerodajnej odchýlky (Teploty senzorov)"
      inputLabel="Namerané teploty (°C):"
      defaultData={defaultTemperatures}
      getMathContent={getMathContent}
      min={-50}
      max={60}
      step="0.1"
      placeholder="Teplota"
    />
  );
}

export default StandardDeviationCalc;
