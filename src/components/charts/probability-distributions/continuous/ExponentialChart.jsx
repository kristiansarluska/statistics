// src/components/charts/probability-distributions/continuous/ExponentialChart.jsx
import React, { useState, useMemo } from "react";
import StyledLineChart from "../../helpers/StyledLineChart";
import { exponentialPDF } from "../../../../utils/distributions";
import "../../../../styles/charts.css";

function ExponentialChart() {
  const [lambda, setLambda] = useState(1);
  const [hoverX, setHoverX] = useState(null);

  // Fixný rozsah pre os X, aby študenti videli reálnu zmenu tvaru krivky
  const minX = 0;
  const maxX = 10;

  const chartData = useMemo(() => {
    const data = [];
    const step = maxX / 200;

    for (let i = 0; i <= 200; i++) {
      const x = i === 200 ? maxX : i * step;
      data.push({ x, y: exponentialPDF(x, lambda) });
    }
    return data;
  }, [lambda]); // maxX je teraz konštanta, takže sme ju odstránili zo závislostí

  const maxY = useMemo(() => {
    // Krivka vždy začína v bode y = lambda.
    // Pridáme 10 % rezervu a zaokrúhlime na desatiny pre pekný vzhľad.
    return (Math.floor(lambda * 1.1 * 10) + 1) / 10;
  }, [lambda]);

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      {/* Parameter Control (Slider) */}
      <div
        className="controls mb-3"
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

      {/* Render Chart */}
      <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
        <StyledLineChart
          data={chartData}
          title={`Exponenciálne rozdelenie Exp(${lambda.toFixed(1)})`}
          xLabel="x"
          yLabel="f(x)"
          lineClass="chart-line-primary"
          hoverX={hoverX}
          setHoverX={setHoverX}
          minX={minX}
          maxX={maxX}
          yAxisDomain={[0, maxY]}
          type="pdf"
          showReferenceArea={false}
        />
      </div>
    </div>
  );
}

export default ExponentialChart;
