import React, { useMemo } from "react";
import StyledLineChart from "./StyledLineChart";

// PDF normálneho rozdelenia
function normalPDF(x, mean, sd) {
  return (
    (1 / (sd * Math.sqrt(2 * Math.PI))) *
    Math.exp(-0.5 * Math.pow((x - mean) / sd, 2))
  );
}

function NormalDistributionChart({ mean, sd, hoverX, setHoverX }) {
  const data = useMemo(() => {
    const points = [];
    for (let x = mean - 4 * sd; x <= mean + 4 * sd; x += 0.2) {
      points.push({ x: parseFloat(x.toFixed(2)), y: normalPDF(x, mean, sd) });
    }
    return points;
  }, [mean, sd]);

  return (
    <StyledLineChart
      title="Normálne rozdelenie"
      data={data}
      xLabel="x"
      yLabel="f(x)"
      lineClass="chart-line-primary"
      hoverX={hoverX}
      setHoverX={setHoverX}
    />
  );
}

export default NormalDistributionChart;
