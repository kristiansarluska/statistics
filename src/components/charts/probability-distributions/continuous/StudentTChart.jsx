// src/components/charts/probability-distributions/continuous/StudentTChart.jsx
import React, { useState, useMemo } from "react";
import StyledLineChart from "../../helpers/StyledLineChart";
import { studentTPDF, studentTCDF } from "../../../../utils/distributions";
import "../../../../styles/charts.css";

function StudentTChart() {
  const [k, setK] = useState(5); // Stupne voľnosti (štandardne začneme na 5)
  const [hoverX, setHoverX] = useState(null);

  // Fixný rozsah pre stabilnú os X (zameranie na stred a ťažké chvosty)
  const minX = -5;
  const maxX = 5;

  const { dataPDF, dataCDF } = useMemo(() => {
    const pdf = [];
    const cdf = [];
    const step = (maxX - minX) / 200;

    for (let i = 0; i <= 200; i++) {
      const x = i === 200 ? maxX : minX + i * step;
      pdf.push({ x, y: studentTPDF(x, k) });
      cdf.push({ x, y: studentTCDF(x, k) });
    }
    return { dataPDF: pdf, dataCDF: cdf };
  }, [k]);

  // Pevný strop osi Y pre perfektné zobrazenie toho, ako vrchol rastie s k
  const maxY_PDF = 0.5;

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      {/* Ovládacie prvky (Slider) */}
      <div
        className="controls mb-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <label htmlFor="kRangeStudent" className="form-label w-100 text-center">
          Stupne voľnosti (k): <strong>{k}</strong>
        </label>
        <input
          type="range"
          className="form-range"
          id="kRangeStudent"
          min="1"
          max="30"
          step="1"
          value={k}
          onChange={(e) => setK(Number(e.target.value))}
        />
      </div>

      {/* Prepojené grafy v spoločnom wrapperi */}
      <div className="charts-wrapper w-100">
        <div>
          <StyledLineChart
            data={dataPDF}
            title={`Hustota pravdepodobnosti (PDF)`}
            xLabel="t"
            yLabel="f(t; k)"
            lineClass="chart-line-primary"
            hoverX={hoverX}
            setHoverX={setHoverX}
            minX={minX}
            maxX={maxX}
            yAxisDomain={[0, maxY_PDF]} // Fixná os Y
            type="pdf"
            showReferenceArea={true}
          />
        </div>
        <div>
          <StyledLineChart
            data={dataCDF}
            title={`Distribučná funkcia (CDF)`}
            xLabel="t"
            yLabel="F(t; k)"
            lineClass="chart-line-secondary"
            hoverX={hoverX}
            setHoverX={setHoverX}
            minX={minX}
            maxX={maxX}
            yAxisDomain={[0, 1.1]}
            type="cdf"
            showReferenceArea={false}
          />
        </div>
      </div>
    </div>
  );
}

export default StudentTChart;
