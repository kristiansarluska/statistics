// src/components/charts/ChiSquareChart.jsx
import React, { useState, useMemo } from "react";
import { chiSquarePDF } from "../../utils/distributions";
import StyledLineChart from "./StyledLineChart";
import "../../styles/charts.css";

function ChiSquareChart() {
  // 1. Odstránený useDebouncedValue, používame jednoduchý state
  const [k, setK] = useState(5);

  // 2. Výpočet dát pre graf
  const chartData = useMemo(() => {
    const dataPoints = [];
    // Úplne odstránený hardcoded limit (ako 20 alebo 8).
    // Využívame len štatistický rozptyl: stredná hodnota (k) + 4 smerodajné odchýlky (sqrt(2k))
    const maxX = k + 4 * Math.sqrt(2 * k);
    const step = maxX / 200;

    for (let x = step; x <= maxX; x += step) {
      const y = chiSquarePDF(x, k);
      if (!isNaN(y) && isFinite(y)) {
        dataPoints.push({ x: parseFloat(x.toFixed(2)), y: y });
      }
    }

    if (k > 2 && dataPoints.length > 0 && dataPoints[0].x > step / 2) {
      dataPoints.unshift({ x: 0, y: 0 });
    }
    return dataPoints;
  }, [k]);

  // 3. Výpočet domény pre osi
  const { minY, maxY, minX, maxX } = useMemo(() => {
    if (!chartData || chartData.length === 0)
      return { minY: 0, maxY: 1, minX: 0, maxX: 10 };

    const ys = chartData.map((p) => p.y);
    const xs = chartData.map((p) => p.x);
    const calculatedMaxY = Math.max(...ys.filter((y) => isFinite(y)), 0);

    return {
      minY: 0,
      maxY: calculatedMaxY > 0 ? calculatedMaxY * 1.1 : 0.5,
      minX: 0,
      maxX: Math.max(...xs),
    };
  }, [chartData]);

  const [hoverX, setHoverX] = useState(null);

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      {/* Ovládanie stupňov voľnosti (Slider) */}
      <div
        className="controls mb-3"
        style={{ width: "100%", maxWidth: "300px" }}
      >
        <label htmlFor="kRange" className="form-label w-100 text-center">
          Stupne voľnosti (k): <strong>{k}</strong>
        </label>
        <input
          type="range"
          className="form-range"
          id="kRange"
          min="1"
          max="30"
          step="1"
          value={k}
          onChange={(e) => setK(Number(e.target.value))} // Okamžitá zmena stavu
        />
      </div>

      {/* Vykreslenie grafu */}
      <div
        className="chart-container"
        style={{ width: "100%", minWidth: "300px", maxWidth: "600px" }}
      >
        <StyledLineChart
          data={chartData}
          title={`Chí kvadrát rozdelenie (k=${k})`}
          xLabel="x"
          yLabel="f(x; k)"
          lineClass="chart-line-primary"
          hoverX={hoverX}
          setHoverX={setHoverX}
          minX={minX}
          maxX={maxX}
          type="pdf"
          showReferenceArea={false}
          yAxisDomain={[minY, maxY]}
        />
      </div>
    </div>
  );
}

export default ChiSquareChart;
