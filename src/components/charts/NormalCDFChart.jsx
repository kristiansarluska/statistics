import React, { useMemo } from "react";
import StyledLineChart from "./StyledLineChart";

// CDF normálneho rozdelenia
function normalCDF(x, mean, sd) {
  const z = (x - mean) / (sd * Math.sqrt(2));
  return 0.5 * (1 + erf(z));
}

// Aproximácia erf
function erf(x) {
  const sign = x >= 0 ? 1 : -1;
  x = Math.abs(x);
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;
  const t = 1 / (1 + p * x);
  const y =
    1 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);
  return sign * y;
}

function NormalCDFChart({ mean, sd, hoverX, setHoverX }) {
  const data = useMemo(() => {
    const points = [];
    for (let x = mean - 4 * sd; x <= mean + 4 * sd; x += 0.2) {
      points.push({ x: parseFloat(x.toFixed(2)), y: normalCDF(x, mean, sd) });
    }
    return points;
  }, [mean, sd]);

  return (
    <StyledLineChart
      title="Distribučná funkcia"
      data={data}
      xLabel="x"
      yLabel="F(x)"
      lineClass="chart-line-secondary"
      hoverX={hoverX}
      setHoverX={setHoverX}
    />
  );
}

export default NormalCDFChart;
