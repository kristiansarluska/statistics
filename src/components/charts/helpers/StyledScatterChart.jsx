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
  xTooltipLabel,
  yTooltipLabel,
  hideXAxis = false,
  hideYAxis = false,
  hideTooltip = false,
  xTickFormatter,
  yTickFormatter,
  fillColor = "var(--bs-primary)",
  opacity = 0.7,
  height = 300,
  referenceLines = [],
  crosshairPoint = null,
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

        {!hideTooltip && (
          <Tooltip
            content={
              <ScatterTooltip
                xLabel={xTooltipLabel || xLabel}
                yLabel={yTooltipLabel || yLabel}
                xTickFormatter={xTickFormatter}
                yTickFormatter={yTickFormatter}
              />
            }
            cursor={{ strokeDasharray: "3 3" }}
          />
        )}

        {referenceLines.map((line, i) => (
          <ReferenceLine key={i} {...line} />
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

        {/* NOVÉ: Nedeformovateľný kríž vykreslený presne na pixel vďaka SVG <g> */}
        {crosshairPoint && (
          <Scatter
            data={[crosshairPoint]}
            isAnimationActive={false}
            shape={(props) => {
              const { cx, cy } = props;
              // Kríž s dĺžkou 8px do každého smeru od stredu. pointerEvents="none" zabráni bugom s tooltipom.
              return (
                <g style={{ pointerEvents: "none" }}>
                  <line
                    x1={cx - 8}
                    y1={cy}
                    x2={cx + 8}
                    y2={cy}
                    stroke="var(--bs-secondary)"
                    strokeWidth={2}
                  />
                  <line
                    x1={cx}
                    y1={cy - 8}
                    x2={cx}
                    y2={cy + 8}
                    stroke="var(--bs-secondary)"
                    strokeWidth={2}
                  />
                </g>
              );
            }}
          />
        )}
      </ScatterChart>
    </ResponsiveContainer>
  );
};

export default StyledScatterChart;
