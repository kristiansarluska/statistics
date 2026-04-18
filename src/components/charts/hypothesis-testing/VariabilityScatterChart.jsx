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

function VariabilityScatterChart({
  data,
  expectedValue,
  mean,
  hoveredObec,
  setHoveredObec,
}) {
  const { t } = useTranslation();

  const highlightedPoint = useMemo(() => {
    return data.find((d) => d.kod === hoveredObec) || null;
  }, [data, hoveredObec]);

  return (
    <div className="chart-container">
      <div className="chart-title">
        {t("hypothesisTesting.tTestDashboard.charts.scatterTitle")}
      </div>

      <div className="d-flex justify-content-center gap-4 mb-1">
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

          <ReferenceLine
            x={expectedValue}
            stroke="var(--bs-danger)"
            strokeWidth={2}
          />
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
