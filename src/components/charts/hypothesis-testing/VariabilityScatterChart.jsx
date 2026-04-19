// src/components/charts/hypothesis-testing/VariabilityScatterChart.jsx
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ReferenceLine,
  ReferenceDot,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

/**
 * @component VariabilityScatterChart
 * @description Renders a 1D scatter plot (using Y-axis jitter for visual separation) to display data distribution. It highlights the expected population mean versus the actual sample mean.
 * @param {Object} props
 * @param {Array} props.data - Dataset containing municipalities with their values and pre-calculated jitter.
 * @param {number} props.expectedValue - The expected mean under the null hypothesis (μ₀).
 * @param {number} props.mean - The calculated sample mean (x̄).
 * @param {string|null} props.hoveredObec - The ID of the currently hovered municipality for cross-component synchronization.
 * @param {Function} props.setHoveredObec - Callback to update the active hovered municipality.
 */
function VariabilityScatterChart({
  data,
  expectedValue,
  mean,
  hoveredObec,
  setHoveredObec,
}) {
  const { t } = useTranslation();

  // Retrieve the specific data point currently being hovered to render its highlight
  const highlightedPoint = useMemo(() => {
    return data.find((d) => d.kod === hoveredObec) || null;
  }, [data, hoveredObec]);

  return (
    <div className="chart-container">
      <div className="chart-title">
        {t("hypothesisTesting.tTestDashboard.charts.scatterTitle")}
      </div>

      {/* Custom Legend Container */}
      <div className="d-flex justify-content-center gap-4 mb-1">
        {/* Null Hypothesis Mean (μ₀) Legend */}
        <span className="small d-flex align-items-center gap-1">
          <svg width="18" height="10">
            <line
              x1="0"
              y1="5"
              x2="18"
              y2="5"
              stroke="var(--bs-danger)"
              strokeWidth="2"
            />
          </svg>
          <span style={{ color: "var(--bs-danger)" }}>
            μ₀ = {expectedValue} %
          </span>
        </span>

        {/* Actual Sample Mean (x̄) Legend */}
        <span className="small d-flex align-items-center gap-1">
          <svg width="18" height="10">
            <line
              x1="0"
              y1="5"
              x2="4"
              y2="5"
              stroke="var(--bs-success)"
              strokeWidth="2"
            />
            <line
              x1="7"
              y1="5"
              x2="11"
              y2="5"
              stroke="var(--bs-success)"
              strokeWidth="2"
            />
            <line
              x1="14"
              y1="5"
              x2="18"
              y2="5"
              stroke="var(--bs-success)"
              strokeWidth="2"
            />
          </svg>
          <span style={{ color: "var(--bs-success)" }}>
            x̄ = {mean.toFixed(2)} %
          </span>
        </span>
      </div>

      <ResponsiveContainer width="100%" height={300}>
        <ScatterChart
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
          onMouseLeave={() => setHoveredObec(null)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            type="number"
            dataKey="podiel_nad65"
            domain={["auto", "auto"]}
            className="chart-axis"
            tickFormatter={(v) => `${v.toFixed(1)} %`}
            label={{
              value: t("hypothesisTesting.tTestDashboard.charts.scatterXAxis"),
              position: "insideBottom",
              offset: -15,
            }}
          />
          {/* Y-Axis is hidden as it only serves for random jitter to prevent point overlap */}
          <YAxis
            type="number"
            dataKey="jitter"
            domain={[0, 1]}
            tick={false}
            axisLine={false}
            tickLine={false}
            width={45}
            label={{
              value: " ",
              angle: -90,
              position: "insideLeft",
              offset: -10,
            }}
          />

          {/* Custom tooltip displaying location name and exact value */}
          <RechartsTooltip
            cursor={false}
            content={({ active, payload }) => {
              if (active && payload?.length) {
                const d = payload[0].payload;
                return (
                  <div
                    className="bg-body text-body border rounded shadow-sm p-2"
                    style={{ fontSize: "0.85rem" }}
                  >
                    <div className="fw-bold">{d.nazev}</div>
                    <div className="text-primary mt-1">
                      {t(
                        "hypothesisTesting.tTestDashboard.charts.scatterTooltip",
                        { value: d.podiel_nad65.toFixed(2) },
                      )}
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />

          <Scatter
            name="Obce"
            data={data}
            fill="var(--bs-primary)"
            opacity={0.6}
            onMouseOver={(payload) => setHoveredObec(payload?.kod ?? null)}
          />

          {/* Render a secondary distinct dot over the highlighted point to emphasize selection */}
          {highlightedPoint && (
            <ReferenceDot
              x={highlightedPoint.podiel_nad65}
              y={highlightedPoint.jitter}
              r={6}
              fill="#ffffff"
              stroke="var(--bs-primary)"
              strokeWidth={2}
              isFront={true}
            />
          )}

          {/* Expected null hypothesis mean reference line */}
          <ReferenceLine
            x={expectedValue}
            stroke="var(--bs-danger)"
            strokeWidth={2}
          />
          {/* Actual sample mean reference line */}
          <ReferenceLine
            x={mean}
            stroke="var(--bs-success)"
            strokeDasharray="3 3"
            strokeWidth={2}
          />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
}

export default VariabilityScatterChart;
