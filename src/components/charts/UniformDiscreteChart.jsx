// src/components/charts/UniformDiscreteChart.jsx
import React, { useState, useMemo } from "react";
import StyledBarChart from "./StyledBarChart";
import "../../styles/charts.css";

function UniformDiscreteChart() {
  const [n, setN] = useState(6); // Default set to 6

  // Calculate probability
  const p = 1 / n;

  const chartData = useMemo(() => {
    const data = [];
    // Generate outcomes from 1 to n
    for (let i = 1; i <= n; i++) {
      data.push({ x: i, y: p });
    }
    return data;
  }, [n, p]);

  // Calculate nicely rounded maxY (always the next tenth) to create a gap above bars
  const maxY = (Math.floor(p * 10) + 1) / 10;

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      {/* Parameter Control (Slider) */}
      <div
        className="controls mb-3"
        style={{ width: "100%", maxWidth: "300px" }}
      >
        <label htmlFor="nRange" className="form-label w-100 text-center">
          Počet možných výsledkov (n): <strong>{n}</strong>
        </label>
        <input
          type="range"
          className="form-range"
          id="nRange"
          min="2"
          max="10"
          step="1"
          value={n}
          onChange={(e) => setN(Number(e.target.value))}
        />
        <div className="text-center mt-2 small text-muted">
          P(X=x) = 1/{n} &asymp; {p.toFixed(4)}
        </div>
      </div>

      {/* Rendering using the reusable BarChart with max width and calculated Y domain */}
      <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
        <StyledBarChart
          data={chartData}
          xLabel="x"
          yLabel="P(X=x)"
          yDomain={[0, maxY]}
        />
      </div>
    </div>
  );
}

export default UniformDiscreteChart;
