// src/components/charts/StudentTChart.jsx
import React, { useState, useMemo } from "react";
import StyledLineChart from "./StyledLineChart";
import { studentTPDF } from "../../utils/distributions";
import "../../styles/charts.css";

function StudentTChart() {
  const [k, setK] = useState(1); // Stupne voľnosti (štandardne začneme na 1)
  const [hoverX, setHoverX] = useState(null);

  // Fixný rozsah pre stabilnú os X (zameranie na stred a ťažké chvosty)
  const minX = -5;
  const maxX = 5;

  const chartData = useMemo(() => {
    const data = [];
    const step = (maxX - minX) / 200;

    for (let i = 0; i <= 200; i++) {
      const x = i === 200 ? maxX : minX + i * step;
      data.push({ x, y: studentTPDF(x, k) });
    }
    return data;
  }, [k]);

  // Pevný strop osi Y pre perfektné zobrazenie toho, ako vrchol rastie s k
  const maxY = 0.5;

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      {/* Parameter Control (Slider) */}
      <div
        className="controls mb-3"
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
          max="10"
          step="1"
          value={k}
          onChange={(e) => setK(Number(e.target.value))}
        />
      </div>

      {/* Render Chart */}
      <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
        <StyledLineChart
          data={chartData}
          title={`Studentovo t-rozdelenie (k=${k})`}
          xLabel="t"
          yLabel="f(t)"
          lineClass="chart-line-primary"
          hoverX={hoverX}
          setHoverX={setHoverX}
          minX={minX}
          maxX={maxX}
          yAxisDomain={[0, maxY]} // Fixná os Y
          type="pdf"
          showReferenceArea={false}
        />
      </div>
    </div>
  );
}

export default StudentTChart;
