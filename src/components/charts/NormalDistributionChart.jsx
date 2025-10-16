import React, { useMemo } from "react";
import StyledLineChart from "./StyledLineChart";
import { normalPDF, normalCDF } from "../../utils/distributions";

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
