// src/components/charts/NormalDistributionChart.jsx
import React, { useMemo } from "react";
import StyledLineChart from "./StyledLineChart";
import { normalPDF } from "../../utils/distributions"; // normalCDF tu netreba

function NormalDistributionChart({ mean, sd, hoverX, setHoverX }) {
  // Vypočítame minX a maxX pre doménu
  const minX = mean - 4 * sd;
  const maxX = mean + 4 * sd;

  const data = useMemo(() => {
    const points = [];
    const step = (maxX - minX) / 200; // Presnejší krok
    // Začneme od minX a ideme po maxX
    for (let i = 0; i <= 200; i++) {
      const x = minX + i * step;
      points.push({ x: parseFloat(x.toFixed(2)), y: normalPDF(x, mean, sd) });
    }
    return points;
  }, [mean, sd, minX, maxX]); // Pridaj minX, maxX do závislostí

  // Nájdeme maxY pre Y os
  const maxY = useMemo(() => {
    if (!data || data.length === 0) return 1;
    const maxVal = Math.max(...data.map((p) => p.y), 0);
    return maxVal > 0 ? maxVal * 1.1 : 1; // 10% rezerva
  }, [data]);

  return (
    <StyledLineChart
      title="Normálne rozdelenie (PDF)" // Upresnený titulok
      data={data}
      xLabel="x"
      yLabel="f(x)"
      lineClass="chart-line-primary"
      hoverX={hoverX}
      setHoverX={setHoverX}
      minX={minX} // <-- Posielame minX
      maxX={maxX} // <-- Posielame maxX
      yAxisDomain={[0, maxY]} // <-- Posielame vypočítanú doménu Y
      type="pdf" // Typ pre StyledLineChart
      showReferenceArea={false} // Nechceme ReferenceArea tu
    />
  );
}

export default NormalDistributionChart;
