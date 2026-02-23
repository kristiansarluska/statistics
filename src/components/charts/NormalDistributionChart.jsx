// src/components/charts/NormalDistributionChart.jsx
import React, { useMemo } from "react";
import StyledLineChart from "./StyledLineChart";
import { normalPDF } from "../../utils/distributions";

function NormalDistributionChart({ mean, sd, hoverX, setHoverX }) {
  const m = Number(mean);
  const s = Number(sd);

  const minX = m - 4 * s;
  const maxX = m + 4 * s;

  // Dáta teraz rátame na 2 riadky s maximálnou matematickou presnosťou
  const data = useMemo(() => {
    const step = (maxX - minX) / 200;
    return Array.from({ length: 201 }, (_, i) => {
      const x = minX + i * step; // ŽIADNE ZAOKRÚHĽOVANIE!
      return { x, y: normalPDF(x, m, s) };
    });
  }, [m, s, minX, maxX]);

  const maxY = useMemo(() => {
    if (!data || data.length === 0) return 1;
    const maxVal = Math.max(...data.map((p) => p.y), 0);
    return maxVal > 0 ? maxVal * 1.1 : 1;
  }, [data]);

  return (
    <StyledLineChart
      title="Hustota pravdepodobnosti (PDF)"
      data={data}
      // xTicks prop sme ÚPLNE VYMAZALI, StyledLineChart si to spraví sám
      xLabel="x"
      yLabel="f(x)"
      lineClass="chart-line-primary"
      hoverX={hoverX}
      setHoverX={setHoverX}
      minX={minX}
      maxX={maxX}
      yAxisDomain={[0, maxY]}
      type="pdf"
      showReferenceArea={true}
    />
  );
}

export default NormalDistributionChart;
