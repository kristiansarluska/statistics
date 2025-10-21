// src/components/charts/NormalCDFChart.jsx
import React, { useMemo } from "react";
import StyledLineChart from "./StyledLineChart";
import { normalCDF } from "../../utils/distributions"; // normalPDF tu netreba

function NormalCDFChart({ mean, sd, hoverX, setHoverX }) {
  // Vypočítame minX a maxX pre doménu
  const minX = mean - 4 * sd;
  const maxX = mean + 4 * sd;

  const data = useMemo(() => {
    const points = [];
    const step = (maxX - minX) / 200; // Presnejší krok
    // Začneme od minX a ideme po maxX
    for (let i = 0; i <= 200; i++) {
      const x = minX + i * step;
      points.push({ x: parseFloat(x.toFixed(2)), y: normalCDF(x, mean, sd) });
    }
    return points;
  }, [mean, sd, minX, maxX]); // Pridaj minX, maxX do závislostí

  return (
    <StyledLineChart
      title="Distribučná funkcia (CDF)" // Upresnený titulok
      data={data}
      xLabel="x"
      yLabel="F(x)"
      lineClass="chart-line-secondary" // Iná farba pre CDF
      hoverX={hoverX}
      setHoverX={setHoverX}
      minX={minX} // <-- Posielame minX
      maxX={maxX} // <-- Posielame maxX
      yAxisDomain={[0, 1]} // CDF ide vždy od 0 do 1
      type="cdf" // Typ pre StyledLineChart (pre horizontálnu čiaru)
      showReferenceArea={false} // Nechceme ReferenceArea
    />
  );
}

export default NormalCDFChart;
