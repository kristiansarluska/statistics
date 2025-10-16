// src/components/charts/LinkedPDFCDF.jsx
import React, { useState, useMemo } from "react";
import StyledLineChart from "./StyledLineChart";
import { normalPDF, normalCDF } from "../../utils/distributions"; // už existujúce funkcie

function LinkedPDFCDF({ mean, sd }) {
  const [hoverX, setHoverX] = useState(null);

  // Rozsah osí X (fixovaný)
  const minX = mean - 4 * sd;
  const maxX = mean + 4 * sd;

  // Generovanie dát
  const dataPDF = useMemo(() => {
    const step = (maxX - minX) / 200;
    return Array.from({ length: 201 }, (_, i) => {
      const x = minX + i * step;
      return { x, y: normalPDF(x, mean, sd) };
    });
  }, [mean, sd, minX, maxX]);

  const dataCDF = useMemo(() => {
    const step = (maxX - minX) / 200;
    return Array.from({ length: 201 }, (_, i) => {
      const x = minX + i * step;
      return { x, y: normalCDF(x, mean, sd) };
    });
  }, [mean, sd, minX, maxX]);

  // Pre PDF vyfarbenie ľavej oblasti
  const pdfWithFill = useMemo(() => {
    if (hoverX === null) return dataPDF;
    return dataPDF.map((point) => ({
      ...point,
      fillY: point.x <= hoverX ? point.y : 0,
    }));
  }, [dataPDF, hoverX]);

  // Pre CDF horizontálna čiara
  const cdfRefLine = useMemo(() => {
    if (hoverX === null) return null;
    const yValue = normalCDF(hoverX, mean, sd);
    return yValue;
  }, [hoverX, mean, sd]);

  return (
    <div className="charts-wrapper">
      <div>
        <StyledLineChart
          data={pdfWithFill}
          hoverX={hoverX}
          setHoverX={setHoverX}
          title="Pravdepodobnostná funkcia (PDF)"
          xLabel="x"
          yLabel="f(x)"
          lineClass="chart-line-primary"
          minX={minX}
          maxX={maxX}
          type="pdf"
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
          lineClass="chart-line-success"
          minX={minX}
          maxX={maxX}
          referenceY={cdfRefLine}
          type="cdf"
        />
      </div>
    </div>
  );
}

export default LinkedPDFCDF;
