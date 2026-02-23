// src/components/charts/BinomialChart.jsx
import React, { useState, useMemo } from "react";
import StyledBarChart from "./StyledBarChart";
import { binomialPMF } from "../../utils/distributions";
import "../../styles/charts.css";

function BinomialChart() {
  const [n, setN] = useState(10); // Default number of trials
  const [p, setP] = useState(0.5); // Default probability of success

  const chartData = useMemo(() => {
    const data = [];
    for (let k = 0; k <= n; k++) {
      data.push({ x: k, y: binomialPMF(k, n, p) });
    }
    return data;
  }, [n, p]);

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      {/* Parameter Controls (Sliders) */}
      <div
        className="controls mb-3 d-flex flex-wrap justify-content-center gap-4"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        {/* Probability of success (p) */}
        <div style={{ flex: "1 1 200px" }}>
          <label htmlFor="pRangeBinom" className="form-label w-100 text-center">
            Pravdepodobnosť (p): <strong>{p.toFixed(2)}</strong>
          </label>
          <input
            type="range"
            className="form-range"
            id="pRangeBinom"
            min="0"
            max="1"
            step="0.01"
            value={p}
            onChange={(e) => setP(Number(e.target.value))}
          />
        </div>

        {/* Number of trials (n) */}
        <div style={{ flex: "1 1 200px" }}>
          <label htmlFor="nRangeBinom" className="form-label w-100 text-center">
            Počet pokusov (n): <strong>{n}</strong>
          </label>
          <input
            type="range"
            className="form-range"
            id="nRangeBinom"
            min="1"
            max="20"
            step="1"
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Render Chart */}
      <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
        <StyledBarChart
          data={chartData}
          xLabel="k"
          yLabel="P(X=k)"
          yDomain={[0, "auto"]}
        />
      </div>
    </div>
  );
}

export default BinomialChart;
