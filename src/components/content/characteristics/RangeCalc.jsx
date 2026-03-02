// src/components/content/characteristics/RangeCalc.jsx
import React from "react";
import CalculatorTemplate from "../helpers/CalculatorTemplate";

// Geoinformatics-themed data: Elevations of a ski slope in Malá Morávka (m a.s.l.)
const DEFAULT_DATA = [695.57, 702.16, 715.84, 728.3, 740.21];

function RangeCalc() {
  return (
    <CalculatorTemplate
      title="Výpočet variačného rozpätia: Výškový profil lyžiarskeho svahu"
      inputLabel="Namerané nadmorské výšky (m n. m.) – Zoradené:"
      defaultData={DEFAULT_DATA}
      sortData={true}
      placeholder="Nová výška"
      getMathContent={(measurements) => {
        const n = measurements.length;
        const minVal = measurements[0];
        const maxVal = measurements[n - 1];
        const range = maxVal - minVal;

        // Highlight the minimum (first) and maximum (last) values
        const highlightIndices = n > 1 ? [0, n - 1] : [0];

        return {
          blockMath: `R = x_{\\max} - x_{\\min} = ${maxVal} - ${minVal} = ${range.toFixed(1)}`,
          inlineMath: `R = `,
          resultText: `${range.toFixed(1)} m`,
          highlightIndices,
        };
      }}
    />
  );
}

export default RangeCalc;
