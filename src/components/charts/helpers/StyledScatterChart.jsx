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

/**
 * @component ScatterTooltip
 * @description Custom tooltip designed to prioritize and display geographic dataset attributes (e.g., Region_Name, NUTS2_Code) alongside standard X/Y values.
 * @param {Object} props
 * @param {boolean} props.active - Determines if tooltip is currently active
 * @param {Array} props.payload - Data payload injected by Recharts
 * @param {string} props.xLabel - Label for the X axis value
 * @param {string} props.yLabel - Label for the Y axis value
 */
const ScatterTooltip = ({ active, payload, xLabel, yLabel }) => {
  if (!active || !payload?.length) return null;
  const point = payload[0]?.payload;
  if (!point) return null;

  // Extract spatial identifiers from the dataset if present
  const regionName = point.name || point.Region_Name || null;
  const regionId = point.id || point.NUTS2_Code || null;

  return (
    <div
      className="custom-tooltip bg-body border rounded shadow-sm p-3"
      style={{ fontSize: "0.85rem", maxWidth: "250px" }}
    >
      {/* Header displaying region name and identification code */}
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

      {/* Display rounded X and Y coordinate values */}
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

/**
 * @component StyledScatterChart
 * @description A highly customizable wrapper for Recharts ScatterChart, supporting dynamic reference lines, conditional axes, and a custom SVG crosshair.
 * @param {Object} props
 * @param {Array} props.data - Dataset containing x and y coordinates.
 * @param {string} [props.xDataKey="x"] - Key for X axis data.
 * @param {string} [props.yDataKey="y"] - Key for Y axis data.
 * @param {Array} [props.xAxisDomain=["auto", "auto"]] - Extents for the X axis.
 * @param {Array} [props.yAxisDomain=["auto", "auto"]] - Extents for the Y axis.
 * @param {string} [props.xLabel] - Label for the X axis.
 * @param {string} [props.yLabel] - Label for the Y axis.
 * @param {Array} [props.referenceLines=[]] - Array of configuration objects for ReferenceLines.
 * @param {Object} [props.crosshairPoint=null] - Specific coordinate object {x, y} to render the custom crosshair.
 * @param {string} [props.crosshairColor="var(--bs-warning)"] - Color override for the crosshair point.
 */
function StyledScatterChart({
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
  crosshairColor = "var(--bs-warning)",
  cursor = "default",
}) {
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
          className="chart-axis chart-x-axis"
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

        {/* Render non-scaling crosshair using an SVG group. 
          Prevents the shape from distorting upon resizing.
        */}
        {crosshairPoint && (
          <Scatter
            data={[crosshairPoint]}
            isAnimationActive={false}
            shape={(props) => {
              const { cx, cy } = props;
              return (
                <g style={{ pointerEvents: "none" }}>
                  <line
                    x1={cx - 12}
                    y1={cy}
                    x2={cx + 12}
                    y2={cy}
                    stroke={crosshairColor}
                    strokeWidth={2}
                  />
                  <line
                    x1={cx}
                    y1={cy - 12}
                    x2={cx}
                    y2={cy + 12}
                    stroke={crosshairColor}
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
}

export default StyledScatterChart;
