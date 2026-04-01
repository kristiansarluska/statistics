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

// ZMENA: Kompletná prerábka pre lepšiu podporu geografických dát (name, id)
const ScatterTooltip = ({ active, payload, xLabel, yLabel }) => {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  // Hľadáme priestorové identifikátory
  const regionName = point.name || point.Region_Name || null;
  const regionId = point.id || point.NUTS2_Code || null;

  return (
    <div
      className="custom-tooltip bg-body border rounded shadow-sm p-3"
      style={{ fontSize: "0.85rem", maxWidth: "250px" }}
    >
      {/* Hlavička s názvom a kódom, ak existujú */}
      {regionName && (
        <p className="mb-1 fw-bold text-wrap border-bottom pb-2">
          {regionName}
          {regionId && (
            <span className="text-muted fw-normal small ms-2">
              ({regionId})
            </span>
          )}
        </p>
      )}

      {/* Samotné hodnoty (X a Y), zaokrúhlené */}
      <div className="d-flex justify-content-between mt-2 pt-1">
        <span className="text-muted pe-3">{xLabel ?? "X"}:</span>
        <strong className="text-body-emphasis">
          {point.x ? Number(point.x).toFixed(1) : "-"}
        </strong>
      </div>
      <div className="d-flex justify-content-between mt-1">
        <span className="text-muted pe-3">{yLabel ?? "Y"}:</span>
        <strong className="text-primary">
          {point.y ? Number(point.y).toFixed(1) : "-"}
        </strong>
      </div>
    </div>
  );
};

// Zvyšok komponentu StyledScatterChart zostáva nezmenený, len pridáva nové rekvizity pre Tooltip
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
  xTickFormatter,
  yTickFormatter,
  fillColor = "var(--bs-primary)",
  opacity = 0.7,
  height = 300,
  referenceLines = [],
  onClick,
  cursor = "default",
}) => {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <ScatterChart
        margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
        style={{ cursor: cursor }}
      >
        <CartesianGrid strokeDasharray="3 3" opacity={0.5} />

        <XAxis
          type="number"
          dataKey={xDataKey}
          domain={xAxisDomain}
          allowDataOverflow
          hide={hideXAxis}
          tickFormatter={xTickFormatter}
          className="chart-axischart-x-axis"
        >
          {xLabel && (
            <Label
              value={xLabel}
              position="insideBottom"
              offset={-15}
              style={{ fontSize: "12px" }}
            />
          )}
        </XAxis>

        <YAxis
          type="number"
          dataKey={yDataKey}
          domain={yAxisDomain}
          allowDataOverflow
          hide={hideYAxis}
          tickFormatter={yTickFormatter}
          className="chart-axis"
          width={hideYAxis ? 10 : 45}
        >
          {yLabel && (
            <Label
              value={yLabel}
              angle={-90}
              position="insideLeft"
              offset={-10}
              style={{ textAnchor: "middle", fontSize: "12px" }}
            />
          )}
        </YAxis>

        {/* ZMENA: Tooltip teraz prijíma popisy osí, aby ich mohol zobraziť k hodnotám */}
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
          {data.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={entry.fill || fillColor}
              fillOpacity={opacity}
            />
          ))}
        </Scatter>
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default StyledScatterChart;
