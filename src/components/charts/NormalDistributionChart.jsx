// src/components/charts/NormalDistributionChart.jsx
import React, { useState, useMemo } from "react";
import StyledLineChart from "./StyledLineChart";
import { normalPDF, normalCDF } from "../../utils/distributions";
import "../../styles/charts.css";

function NormalDistributionChart() {
  const [mean, setMean] = useState(0);
  const [sd, setSd] = useState(1);
  const [hoverX, setHoverX] = useState(null);

  const m = Number(mean);
  const s = Number(sd);

  // Zafixujeme os X ("kamera" stojí na mieste)
  // Rozsah -20 až 20 bezpečne pokryje posuny meanu od -10 do 10 a všetky šírky
  const minX = -20;
  const maxX = 20;

  const { dataPDF, dataCDF } = useMemo(() => {
    // Zvýšime počet bodov na 500, aby sme nevynechali ostrý vrchol pri malej odchýlke
    const step = (maxX - minX) / 500;
    const pdf = [];
    const cdf = [];

    for (let i = 0; i <= 500; i++) {
      const x = i === 500 ? maxX : minX + i * step;
      pdf.push({ x, y: normalPDF(x, m, s) });
      cdf.push({ x, y: normalCDF(x, m, s) });
    }

    return { dataPDF: pdf, dataCDF: cdf };
  }, [m, s, minX, maxX]); // odstránili sme minX a maxX zo závislostí pre slider, lebo sú to konštanty

  const maxY_PDF = useMemo(() => {
    if (!dataPDF || dataPDF.length === 0) return 1;
    const maxVal = Math.max(...dataPDF.map((p) => p.y), 0);
    return (Math.floor(maxVal * 1.1 * 10) + 1) / 10;
  }, [dataPDF]);

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      {/* Ovládacie prvky (Slidery) */}
      <div
        className="controls mb-4 d-flex flex-wrap justify-content-center gap-4"
        style={{ width: "100%", maxWidth: "600px" }}
      >
        <div style={{ flex: "1 1 200px" }}>
          <label
            htmlFor="meanRangeNormal"
            className="form-label w-100 text-center"
          >
            Stredná hodnota (μ): <strong>{m.toFixed(1)}</strong>
          </label>
          <input
            type="range"
            className="form-range"
            id="meanRangeNormal"
            min="-10"
            max="10"
            step="0.5"
            value={m}
            onChange={(e) => setMean(Number(e.target.value))}
          />
        </div>

        <div style={{ flex: "1 1 200px" }}>
          <label
            htmlFor="sdRangeNormal"
            className="form-label w-100 text-center"
          >
            Smerodajná odchýlka (σ): <strong>{s.toFixed(1)}</strong>
          </label>
          <input
            type="range"
            className="form-range"
            id="sdRangeNormal"
            min="0.1"
            max="5"
            step="0.1"
            value={s}
            onChange={(e) => setSd(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Prepojené grafy */}
      <div className="charts-wrapper w-100">
        <div>
          <StyledLineChart
            data={dataPDF}
            title="Hustota pravdepodobnosti (PDF)"
            xLabel="x"
            yLabel="f(x)"
            lineClass="chart-line-primary"
            hoverX={hoverX}
            setHoverX={setHoverX}
            minX={minX}
            maxX={maxX}
            yAxisDomain={[0, maxY_PDF]}
            type="pdf"
            showReferenceArea={true}
          />
        </div>
        <div>
          <StyledLineChart
            data={dataCDF}
            title="Distribučná funkcia (CDF)"
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
        </div>
      </div>
    </div>
  );
}

export default NormalDistributionChart;
