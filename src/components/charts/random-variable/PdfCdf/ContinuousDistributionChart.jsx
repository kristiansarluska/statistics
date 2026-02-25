// src/components/charts/ContinuousDistributionChart.jsx
import React, { useState, useMemo } from "react";
import StyledLineChart from "../../helpers/StyledLineChart";
import { normalPDF, normalCDF } from "../../../../utils/distributions";

function ContinuousDistributionChart({ mean, sd }) {
  const [hoverX, setHoverX] = useState(null);

  const m = Number(mean);
  const s = Number(sd);

  const minX = m - 4 * s;
  const maxX = m + 4 * s;

  const { dataPDF, dataCDF } = useMemo(() => {
    const step = (maxX - minX) / 200;
    const pdf = [];
    const cdf = [];

    for (let i = 0; i <= 200; i++) {
      // Posledný bod zachytíme presne na maxX, zvyšok plynulý step, žiadne zaokrúhľovanie
      const x = i === 200 ? maxX : minX + i * step;
      pdf.push({ x, y: normalPDF(x, m, s) });
      cdf.push({ x, y: normalCDF(x, m, s) });
    }

    return { dataPDF: pdf, dataCDF: cdf };
  }, [m, s, minX, maxX]);

  return (
    <div className="charts-wrapper">
      <div>
        <StyledLineChart
          data={dataPDF}
          hoverX={hoverX}
          setHoverX={setHoverX}
          title="Pravdepodobnostná funkcia (PDF)"
          xLabel="x"
          yLabel="f(x)"
          lineClass="chart-line-primary"
          minX={minX}
          maxX={maxX}
          type="pdf"
          showReferenceArea={true}
        />
      </div>

      <div>
        <StyledLineChart
          data={dataCDF}
          hoverX={hoverX}
          setHoverX={setHoverX}
          title="Distribučná funkcia (CDF)"
          xLabel="x"
          yLabel="F(x)"
          minX={minX}
          maxX={maxX}
          type="cdf"
        />
      </div>
    </div>
  );
}

export default ContinuousDistributionChart;
