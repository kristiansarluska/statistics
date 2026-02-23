// src/components/charts/NormalCDFChart.jsx
import React, { useMemo } from "react";
import StyledLineChart from "./StyledLineChart";
import { normalCDF } from "../../utils/distributions";

function NormalCDFChart({ mean, sd, hoverX, setHoverX }) {
  const m = Number(mean);
  const s = Number(sd);

  const minX = m - 4 * s;
  const maxX = m + 4 * s;

  const data = useMemo(() => {
    const step = (maxX - minX) / 200;
    return Array.from({ length: 201 }, (_, i) => {
      const x = i === 200 ? maxX : minX + i * step; // Bez zaokrúhľovania
      return { x, y: normalCDF(x, m, s) };
    });
  }, [m, s, minX, maxX]);

  return (
    <StyledLineChart
      title="Distribučná funkcia (CDF)"
      data={data}
      xLabel="x"
      yLabel="F(x)"
      lineClass="chart-line-secondary"
      hoverX={hoverX}
      setHoverX={setHoverX}
      minX={minX}
      maxX={maxX}
      type="cdf"
      showReferenceArea={false}
    />
  );
}

export default NormalCDFChart;
