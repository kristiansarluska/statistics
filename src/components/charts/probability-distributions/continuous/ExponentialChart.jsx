// src/components/charts/probability-distributions/continuous/ExponentialChart.jsx
import React, { useState, useMemo } from "react";
import StyledLineChart from "../../helpers/StyledLineChart";
import {
  exponentialPDF,
  exponentialCDF,
} from "../../../../utils/distributions";
import "../../../../styles/charts.css";

function ExponentialChart() {
  const [lambda, setLambda] = useState(1);
  const [hoverX, setHoverX] = useState(null);

  // Fixný rozsah pre os X, aby študenti videli reálnu zmenu tvaru krivky
  const minX = 0;
  const maxX = 10;

  const { dataPDF, dataCDF } = useMemo(() => {
    const pdf = [];
    const cdf = [];
    const step = maxX / 200;

    for (let i = 0; i <= 200; i++) {
      const x = i === 200 ? maxX : i * step;
      pdf.push({ x, y: exponentialPDF(x, lambda) });
      cdf.push({ x, y: exponentialCDF(x, lambda) });
    }
    return { dataPDF: pdf, dataCDF: cdf };
  }, [lambda]);

  const maxY_PDF = useMemo(() => {
    // Krivka vždy začína v bode y = lambda.
    // Pridáme 10 % rezervu a zaokrúhlime na desatiny pre pekný vzhľad.
    return (Math.floor(lambda * 1.1 * 10) + 1) / 10;
  }, [lambda]);

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      {/* Ovládacie prvky (Slider) */}
      <div
        className="controls mb-4"
        style={{ width: "100%", maxWidth: "300px" }}
      >
        <label
          htmlFor="lambdaRangeExp"
          className="form-label w-100 text-center"
        >
          Parameter (λ): <strong>{lambda.toFixed(1)}</strong>
        </label>
        <input
          type="range"
          className="form-range"
          id="lambdaRangeExp"
          min="0.1"
          max="5"
          step="0.1"
          value={lambda}
          onChange={(e) => setLambda(Number(e.target.value))}
        />
      </div>

      {/* Prepojené grafy v spoločnom wrapperi */}
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
            yAxisDomain={[0, 1.1]}
            type="cdf"
            showReferenceArea={false}
          />
        </div>
      </div>
    </div>
  );
}

export default ExponentialChart;
