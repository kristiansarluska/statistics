// src/components/charts/probability-distributions/continuous/UniformContinuousChart.jsx
import React, { useState, useMemo, useCallback } from "react";
import StyledLineChart from "../../helpers/StyledLineChart";
import "../../../../styles/charts.css";

function UniformContinuousChart() {
  const [a, setA] = useState(-5);
  const [b, setB] = useState(5);
  const [hoverX, setHoverX] = useState(null);

  // Fixný rozsah celého grafu a slidera
  const minX = -10;
  const maxX = 10;
  const step = 1; // Krok posúvača

  // Ošetrenie, aby sa bežce neprekrížili (min. rozdiel je 1 step)
  const handleAChange = (e) => {
    const value = Math.min(Number(e.target.value), b - step);
    setA(value);
  };

  const handleBChange = (e) => {
    const value = Math.max(Number(e.target.value), a + step);
    setB(value);
  };

  // Výpočet percent pre vykreslenie modrého pásiku medzi bežcami
  const getPercent = useCallback(
    (value) => Math.round(((value - minX) / (maxX - minX)) * 100),
    [minX, maxX],
  );

  const chartData = useMemo(() => {
    const data = [];
    const height = 1 / (b - a);

    data.push({ x: minX, y: 0 });
    data.push({ x: a - 0.001, y: 0 });
    data.push({ x: a, y: height });
    data.push({ x: b, y: height });
    data.push({ x: b + 0.001, y: 0 });
    data.push({ x: maxX, y: 0 });

    return data;
  }, [a, b, minX, maxX]);

  const maxY = useMemo(() => {
    const density = 1 / (b - a);
    return (Math.floor(density * 10) + 1) / 10;
  }, [a, b]);

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      {/* Ovládacie prvky s DUAL SLIDEROM */}
      <div
        className="controls mb-4"
        style={{ width: "100%", maxWidth: "400px" }}
      >
        <div className="d-flex justify-content-between mb-2">
          <span>
            Dolná (a): <strong>{a}</strong>
          </span>
          <span>
            Horná (b): <strong>{b}</strong>
          </span>
        </div>

        {/* Vlastný obojstranný slider */}
        <div className="dual-slider-container">
          <input
            type="range"
            min={minX}
            max={maxX}
            step={step}
            value={a}
            onChange={handleAChange}
            className="dual-slider-input"
            // Z-index trik: ak je bežec "a" úplne vpravo, posunieme ho nad "b", aby sa dal chytiť
            style={{ zIndex: a > maxX - 100 ? "5" : "3" }}
          />
          <input
            type="range"
            min={minX}
            max={maxX}
            step={step}
            value={b}
            onChange={handleBChange}
            className="dual-slider-input"
            style={{ zIndex: "4" }}
          />

          <div className="dual-slider-track"></div>
          <div
            className="dual-slider-range"
            style={{
              left: `${getPercent(a)}%`,
              width: `${getPercent(b) - getPercent(a)}%`,
            }}
          ></div>
        </div>

        <div className="text-center mt-3 small text-muted w-100">
          f(x) = 1 / ({b} - {a < 0 ? `(${a})` : a}) = {(1 / (b - a)).toFixed(4)}
        </div>
      </div>

      {/* Render Chart */}
      <div style={{ width: "100%", maxWidth: "600px", margin: "0 auto" }}>
        <StyledLineChart
          data={chartData}
          title={`Spojité rovnomerné rozdelenie U(${a}, ${b})`}
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

export default UniformContinuousChart;
