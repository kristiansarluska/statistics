// src/components/charts/random-variable/characteristics/SkewnessChart.jsx
import React, { useState, useMemo } from "react";
import StyledLineChart from "../../helpers/StyledLineChart";

function SkewnessChart() {
  const [skewValue, setSkewValue] = useState(0);
  const [hoverX, setHoverX] = useState(null);

  const chartData = useMemo(() => {
    const alpha = 5 - 4 * skewValue;
    const beta = 5 + 4 * skewValue;

    let sum = 0;
    const rawData = [];

    for (let x = 0; x <= 100; x += 2) {
      // Ošetrenie presnosti floatu v JS
      const t = Math.max(0, Math.min(1, x / 100));

      // Výpočet Y s ochranou proti NaN
      let y = Math.pow(t, alpha - 1) * Math.pow(1 - t, beta - 1);
      if (isNaN(y) || !isFinite(y)) y = 0;

      rawData.push({ x, y });
      sum += y;
    }

    return rawData.map((point) => ({
      x: point.x,
      y: sum > 0 ? Number(((point.y / sum) * 100).toFixed(2)) : 0,
    }));
  }, [skewValue]);

  let skewText = "Symetrické rozdelenie";
  let skewColor = "text-success";
  if (skewValue > 0.2) {
    skewText = "Kladná šikmosť";
    skewColor = "text-primary";
  } else if (skewValue < -0.2) {
    skewText = "Záporná šikmosť";
    skewColor = "text-danger";
  }

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center w-100 mt-2">
      <h6 className="mb-4 text-center">
        Tvar rozdelenia: <span className={skewColor}>{skewText}</span>
      </h6>

      <div
        className="controls mb-4 d-flex flex-wrap justify-content-center gap-4"
        style={{ width: "100%", maxWidth: "300px" }}
      >
        <div style={{ flex: "1 1 100%" }}>
          <label
            htmlFor="skewSlider"
            className="form-label w-100 text-center mb-2"
          >
            Hodnota šikmosti:{" "}
            <strong>{skewValue > 0 ? `+${skewValue}` : skewValue}</strong>
          </label>
          <input
            type="range"
            className="form-range"
            id="skewSlider"
            min="-1"
            max="1"
            step="0.1"
            value={skewValue}
            onChange={(e) => setSkewValue(parseFloat(e.target.value))}
          />
          <div
            className="d-flex justify-content-between text-muted small mt-1"
            style={{ fontSize: "0.8rem" }}
          >
            <span>Záporná</span>
            <span>Kladná</span>
          </div>
        </div>
      </div>

      <div className="charts-wrapper w-100">
        <StyledLineChart
          data={chartData}
          xLabel="Vek stromov (roky)"
          yLabel="Početnosť (%)"
          lineClass="chart-line-primary"
          hoverX={hoverX}
          setHoverX={setHoverX}
          type="line"
          showReferenceArea={false}
          minX={0} // FIXED: Pevné uzamknutie začiatku osi X
          maxX={100} // FIXED: Pevné uzamknutie konca osi X
        />
      </div>
    </div>
  );
}

export default SkewnessChart;
