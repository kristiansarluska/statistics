// src/components/charts/LinkedPDFCDF.jsx (ZJEDNODUŠENÁ VERZIA)
import React, { useState, useMemo } from "react";
import StyledLineChart from "./StyledLineChart";
import { normalPDF, normalCDF } from "../../utils/distributions";

function LinkedPDFCDF({ mean, sd }) {
  const [hoverX, setHoverX] = useState(null);

  // Rozsah osí X (fixovaný)
  const minX = mean - 4 * sd;
  const maxX = mean + 4 * sd;

  // Generovanie dát (zostáva rovnaké)
  const dataPDF = useMemo(() => {
    const step = (maxX - minX) / 200;
    return Array.from({ length: 201 }, (_, i) => {
      const x = parseFloat((minX + i * step).toFixed(2)); // Zaokrúhlenie X
      return { x, y: normalPDF(x, mean, sd) };
    });
  }, [mean, sd, minX, maxX]);

  const dataCDF = useMemo(() => {
    const step = (maxX - minX) / 200;
    return Array.from({ length: 201 }, (_, i) => {
      const x = parseFloat((minX + i * step).toFixed(2)); // Zaokrúhlenie X
      return { x, y: normalCDF(x, mean, sd) };
    });
  }, [mean, sd, minX, maxX]);

  // --- ODSTRÁNENÉ VÝPOČTY pdfWithFill a cdfRefLine ---

  return (
    <div className="charts-wrapper">
      <div>
        {/* Posielame len čisté dáta a type='pdf' */}
        <StyledLineChart
          data={dataPDF} // Použijeme priamo dataPDF
          hoverX={hoverX}
          setHoverX={setHoverX}
          title="Pravdepodobnostná funkcia (PDF)"
          xLabel="x"
          yLabel="f(x)"
          lineClass="chart-line-primary"
          minX={minX}
          maxX={maxX}
          type="pdf" // StyledLineChart vie, čo robiť na základe typu
          showReferenceArea={true} // <-- PRIDANÝ PROP
        />
      </div>

      <div>
        {/* Posielame len čisté dáta a type='cdf' */}
        <StyledLineChart
          data={dataCDF} // Použijeme priamo dataCDF
          hoverX={hoverX}
          setHoverX={setHoverX}
          title="Distribučná funkcia (CDF)"
          xLabel="x"
          yLabel="F(x)"
          minX={minX}
          maxX={maxX}
          type="cdf" // StyledLineChart vie, čo robiť na základe typu
          // referenceY už netreba posielať, StyledLineChart si ho vypočíta sám
        />
      </div>
    </div>
  );
}

export default LinkedPDFCDF;
