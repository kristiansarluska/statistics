// src/components/charts/anova/TukeyChart.jsx
import React from "react";
import { useTranslation } from "react-i18next";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Cell,
} from "recharts";
import CustomTooltip from "../helpers/CustomTooltip";

const TukeyChart = ({ results }) => {
  const { t } = useTranslation();

  if (!results || results.length === 0) return null;

  const chartData = results.map((r) => ({
    ...r,
    range: [r.ciLower, r.ciUpper],
  }));

  const rawMin = Math.min(0, ...chartData.map((d) => d.ciLower));
  const rawMax = Math.max(0, ...chartData.map((d) => d.ciUpper));

  // Dynamic step calculation to prevent X-axis clutter on large intervals
  const valueRange = rawMax - rawMin;
  let step = 5;
  if (valueRange > 100) step = 25;
  else if (valueRange > 50) step = 10;
  else if (valueRange < 10) step = 1;

  const minVal = Math.floor(rawMin / step) * step - step;
  const maxVal = Math.ceil(rawMax / step) * step + step;

  const ticks = [];
  for (let i = 0; i >= minVal; i -= step) ticks.unshift(i);
  for (let i = step; i <= maxVal; i += step) ticks.push(i);

  const TukeyTooltipAdapter = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    const customPayload = [
      {
        dataKey: "meanDiff",
        name: t("components.anovaSimulation.tukeyChart.meanDiff"),
        value: data.meanDiff,
        color: data.isSignificant ? "var(--bs-danger)" : "var(--bs-success)",
        payload: { x: data.pair },
      },
    ];

    const extraRows = [
      {
        label: t("components.anovaSimulation.tukeyChart.confInterval"),
        value: `[${data.ciLower.toFixed(2)}, ${data.ciUpper.toFixed(2)}]`,
        color: "var(--text-secondary)",
      },
      {
        label: t("components.anovaSimulation.tukeyChart.resultLabel"),
        value: data.isSignificant
          ? t("components.anovaSimulation.tukeyChart.reject")
          : t("components.anovaSimulation.tukeyChart.fail"),
        color: data.isSignificant ? "var(--bs-danger)" : "var(--bs-success)",
      },
    ];

    return (
      <CustomTooltip
        active={active}
        payload={customPayload}
        xLabel={t("components.anovaSimulation.tukeyChart.comparison")}
        extraRows={extraRows}
      />
    );
  };

  return (
    <div className="card mb-4 border-0 fade-in">
      <div className="card-body">
        <h5 className="card-title text-center mb-1 text-muted">
          {t("components.anovaSimulation.tukeyChart.title")}
        </h5>
        <p className="text-center small mb-4">
          {t("components.anovaSimulation.tukeyChart.description")}
        </p>
        <div className="chart-container" style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer>
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 20, right: 20, left: 0, bottom: 25 }}
              barSize={12}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />

              <XAxis
                type="number"
                domain={[minVal, maxVal]}
                ticks={ticks}
                label={{
                  value: t("components.anovaSimulation.tukeyChart.xAxisLabel"),
                  position: "insideBottom",
                  offset: -5,
                }}
              />
              <YAxis
                type="category"
                dataKey="pair"
                width={30}
                tick={{
                  fontSize: 12,
                  dx: -10,
                }}
                angle={-90}
                textAnchor="middle"
              />
              <Tooltip
                content={<TukeyTooltipAdapter />}
                cursor={{ fill: "rgba(204, 204, 204, 0.1)" }}
              />

              <ReferenceLine x={0} stroke="var(--bs-success)" strokeWidth={2} />

              <Bar dataKey="range" radius={[4, 4, 4, 4]}>
                {chartData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={
                      entry.isSignificant
                        ? "var(--bs-danger)"
                        : "var(--bs-success)"
                    }
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default TukeyChart;
