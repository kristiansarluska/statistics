// src/components/content/anova/TukeyChart.jsx
import React from "react";
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
  if (!results || results.length === 0) return null;

  const chartData = results.map((r) => ({
    ...r,
    range: [r.ciLower, r.ciUpper],
  }));

  const rawMin = Math.min(0, ...chartData.map((d) => d.ciLower));
  const rawMax = Math.max(0, ...chartData.map((d) => d.ciUpper));

  // Logic for generating ticks relative to 0
  const step = 5; // Adjust step size based on expected data range
  const minVal = Math.floor(rawMin / step) * step - step;
  const maxVal = Math.ceil(rawMax / step) * step + step;

  const ticks = [];
  // Generate ticks from 0 down to minVal
  for (let i = 0; i >= minVal; i -= step) ticks.unshift(i);
  // Generate ticks from step up to maxVal
  for (let i = step; i <= maxVal; i += step) ticks.push(i);

  // Adaptér pre využitie globálneho CustomTooltip
  const TukeyTooltipAdapter = ({ active, payload }) => {
    if (!active || !payload || !payload.length) return null;

    const data = payload[0].payload;

    // Vytvoríme "falošný" payload, aby CustomTooltip správne prečítal xLabel a hlavnú hodnotu
    const customPayload = [
      {
        dataKey: "meanDiff",
        name: "Rozdiel priemerov",
        value: data.meanDiff,
        color: data.isSignificant ? "var(--bs-danger)" : "var(--bs-success)",
        payload: { x: data.pair }, // Vynútenie xLabelu
      },
    ];

    // Využitie extraRows pre interval a textové zhodnotenie
    const extraRows = [
      {
        label: "95% interval spoľahlivosti",
        value: `[${data.ciLower.toFixed(2)}, ${data.ciUpper.toFixed(2)}]`,
        color: "var(--text-secondary)",
      },
      {
        label: "Výsledok",
        value: data.isSignificant ? "Zamietame H₀" : "Nezamietame H₀",
        color: data.isSignificant ? "var(--bs-danger)" : "var(--bs-success)",
      },
    ];

    return (
      <CustomTooltip
        active={active}
        payload={customPayload}
        xLabel="Porovnanie"
        extraRows={extraRows}
      />
    );
  };

  return (
    <div className="card mb-4 border-0 fade-in">
      <div className="card-body">
        <h5 className="card-title text-center mb-1 text-muted">
          Tukeyho HSD (Post-hoc analýza)
        </h5>
        <p className="text-center small text-secondary mb-4">
          Intervaly spoľahlivosti pre rozdiely stredných hodnôt. Ak interval
          nepretína nulu (zelená línia), rozdiel je štatisticky významný.
        </p>
        <div className="chart-container" style={{ width: "100%", height: 250 }}>
          <ResponsiveContainer>
            <BarChart
              layout="vertical"
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
              barSize={12}
            >
              <CartesianGrid strokeDasharray="3 3" horizontal={false} />
              <XAxis
                type="number"
                domain={[minVal, maxVal]}
                ticks={ticks}
                interval={0}
              />
              <YAxis type="category" dataKey="pair" width={60} />

              {/* Nasadenie nášho upraveného Tooltipu */}
              <Tooltip
                content={<TukeyTooltipAdapter />}
                cursor={{ fill: "rgba(204, 204, 204, 0.1)" }}
              />

              <ReferenceLine x={0} stroke="var(--bs-success)" strokeWidth={2} />

              <Bar dataKey="range" radius={[10, 10, 10, 10]}>
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
