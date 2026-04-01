// src/components/charts/helpers/StyledScatterChart.jsx
import React from "react";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  Cell,
  ReferenceLine,
  Label,
} from "recharts";

// Scatter tooltip shows X and Y without the duplication that CustomTooltip causes
// (Recharts Scatter passes both axes as separate payload entries)
const ScatterTooltip = ({ active, payload, xLabel, yLabel }) => {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;
  return (
    <div
      className="custom-tooltip bg-body border rounded shadow-sm p-2"
      style={{ fontSize: "0.9rem" }}
    >
      <p className="mb-0 fw-bold">{`${xLabel ?? "X"}: ${Number(point.x).toFixed(2)}`}</p>
      <p className="mb-0" style={{ color: "var(--bs-primary)" }}>
        {`${yLabel ?? "Y"}: ${Number(point.y).toFixed(2)}`}
      </p>
    </div>
  );
};

const StyledScatterChart = ({
  data,
  xDataKey = "x",
  yDataKey = "y",
  xAxisDomain = ["auto", "auto"],
  yAxisDomain = ["auto", "auto"],
  xLabel,
  yLabel,
  hideXAxis = false,
  hideYAxis = false,
  hideTooltip = false,
  fillColor = "var(--bs-primary)",
  opacity = 0.7,
  height = 300,
  referenceLines = [],
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart margin={{ top: 5, right: 30, left: 20, bottom: 25 }}>
        <CartesianGrid strokeDasharray="3 3" />

        <XAxis
          type="number"
          dataKey={xDataKey}
          domain={xAxisDomain}
          allowDataOverflow
          hide={hideXAxis}
          className="chart-axis"
        >
          {xLabel && (
            <Label value={xLabel} position="insideBottom" offset={-15} />
          )}
        </XAxis>

        <YAxis
          type="number"
          dataKey={yDataKey}
          domain={yAxisDomain}
          allowDataOverflow
          hide={hideYAxis}
          className="chart-axis"
        >
          {yLabel && (
            <Label
              value={yLabel}
              angle={-90}
              position="insideLeft"
              offset={-10}
              style={{ textAnchor: "middle" }}
            />
          )}
        </YAxis>

        {!hideTooltip && (
          <Tooltip
            content={<ScatterTooltip xLabel={xLabel} yLabel={yLabel} />}
            cursor={{ strokeDasharray: "3 3" }}
          />
        )}

        {referenceLines.map((line, i) => (
          <ReferenceLine
            key={i}
            x={line.x}
            y={line.y}
            stroke={line.stroke || "var(--bs-danger)"}
            strokeDasharray={line.strokeDasharray || "5 5"}
            label={line.label}
          />
        ))}

        <Scatter data={data} fill={fillColor}>
          {data.map((_, index) => (
            <Cell
              key={`cell-${index}`}
              fill={fillColor}
              fillOpacity={opacity}
            />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default StyledScatterChart;
