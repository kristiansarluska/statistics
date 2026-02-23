// src/components/charts/FisherFChart.jsx
import React, { useState, useMemo } from "react";
import StyledLineChart from "./StyledLineChart";
import { fisherFPDF } from "../../utils/distributions";
import "../../styles/charts.css";

function FisherFChart() {
  const [d1, setD1] = useState(5);
  const [d2, setD2] = useState(5);
  const [hoverX, setHoverX] = useState(null);

  const minX = 0;
  const maxX = 5;

  const chartData = useMemo(() => {
    const data = [];
    const step = maxX / 200;

    for (let i = 0; i <= 200; i++) {
      const x = i === 200 ? maxX : i * step;
      const safeX = x === 0 ? 0.0001 : x;

      let y = fisherFPDF(safeX, d1, d2);

      // Už nezastrihávame y na 1, aby sme nesploštili vrchol pri vysokých d1, d2.
      // Zastrihneme ho len na 2.5, aby asymptota pri d1=1 "neodpálila" vykresľovanie.
      if (y > 2.5) y = 2.5;

      data.push({ x, y });
    }
    return data;
  }, [d1, d2]);

  // Dynamický výpočet pre maxY
  const maxY = useMemo(() => {
    // Nájdeme vrchol "kopčeka".
    // Ignorujeme prvé body (x < 0.1), aby asymptota pri d1=1 nespustila tento limit.
    const peak = Math.max(
      ...chartData.filter((d) => d.x >= 0.1).map((d) => d.y),
    );

    // Ak sa vrchol priblíži k 1 (napr. prevýši 0.85), zdvihneme os na 1.2
    if (peak > 0.85) {
      return 1.25;
    }

    // Štandardne držíme pevnú a peknú os 1.0
    return 1.0;
  }, [chartData]);

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      {/* Ovládacie prvky (Slidery) */}
      <div
        className="controls mb-4 d-flex flex-wrap justify-content-center gap-4"
        style={{ width: "100%", maxWidth: "500px" }}
      >
        <div style={{ flex: "1 1 200px" }}>
          <label htmlFor="d1Range" className="form-label w-100 text-center">
            Stupne voľnosti (d₁): <strong>{d1}</strong>
          </label>
          <input
            type="range"
            className="form-range"
            id="d1Range"
            min="1"
            max="30"
            step="1"
            value={d1}
            onChange={(e) => setD1(Number(e.target.value))}
          />
        </div>

        <div style={{ flex: "1 1 200px" }}>
          <label htmlFor="d2Range" className="form-label w-100 text-center">
            Stupne voľnosti (d₂): <strong>{d2}</strong>
          </label>
          <input
            type="range"
            className="form-range"
            id="d2Range"
            min="1"
            max="30"
            step="1"
            value={d2}
            onChange={(e) => setD2(Number(e.target.value))}
          />
        </div>
      </div>

      {/* Render Chart */}
      <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
        <StyledLineChart
          data={chartData}
          title={`Fisherovo F-rozdelenie (d₁=${d1}, d₂=${d2})`}
          xLabel="x"
          yLabel="f(x)"
          lineClass="chart-line-primary"
          hoverX={hoverX}
          setHoverX={setHoverX}
          minX={minX}
          maxX={maxX}
          yAxisDomain={[0, maxY]} // Bude 1.0 alebo 1.2
          type="pdf"
          showReferenceArea={false}
        />
      </div>
    </div>
  );
}

export default FisherFChart;
