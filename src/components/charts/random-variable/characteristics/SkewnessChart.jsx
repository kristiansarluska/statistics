// src/components/charts/random-variable/characteristics/SkewnessChart.jsx
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import StyledLineChart from "../../helpers/StyledLineChart";

function SkewnessChart() {
  const { t } = useTranslation();
  const [skewValue, setSkewValue] = useState(0);
  const [hoverX, setHoverX] = useState(null);

  const chartData = useMemo(() => {
    const alpha = 5 - 4 * skewValue;
    const beta = 5 + 4 * skewValue;

    let sum = 0;
    const rawData = [];

    for (let x = 0; x <= 100; x += 2) {
      const t = Math.max(0, Math.min(1, x / 100));

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

  let skewText = t("components.randomVariableCharts.skewness.symmetric");
  let skewColor = "text-success";
  if (skewValue > 0.2) {
    skewText = t("components.randomVariableCharts.skewness.positive");
    skewColor = "text-primary";
  } else if (skewValue < -0.2) {
    skewText = t("components.randomVariableCharts.skewness.negative");
    skewColor = "text-danger";
  }

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center w-100 mt-2">
      <h6 className="mb-4 text-center">
        {t("components.randomVariableCharts.skewness.title")}{" "}
        <span className={skewColor}>{skewText}</span>
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
            {t("components.randomVariableCharts.skewness.sliderLabel")}{" "}
            <span className="parameter-value">{skewValue.toFixed(1)}</span>
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
            <span>
              {t("components.randomVariableCharts.skewness.sliderMin")}
            </span>
            <span>
              {t("components.randomVariableCharts.skewness.sliderMax")}
            </span>
          </div>
        </div>
      </div>

      <div className="charts-wrapper w-100">
        <StyledLineChart
          data={chartData}
          xLabel={t("components.randomVariableCharts.skewness.xLabel")}
          yLabel={t("components.randomVariableCharts.skewness.yLabel")}
          lineClass="chart-line-primary"
          hoverX={hoverX}
          setHoverX={setHoverX}
          type="line"
          showReferenceArea={false}
          minX={0}
          maxX={100}
        />
      </div>
    </div>
  );
}

export default SkewnessChart;
