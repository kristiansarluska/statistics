import React, { useMemo } from "react";
import StyledLineChart from "./StyledLineChart";
import { normalPDF, normalCDF } from "../../utils/distributions";

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
