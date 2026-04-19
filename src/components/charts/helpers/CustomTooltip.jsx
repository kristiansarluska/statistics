// src/components/charts/helpers/CustomTooltip.jsx
import React from "react";

/**
 * Utility to format numbers for display.
 * Rounds to 2 decimal places or 2 significant figures for small values.
 * @param {number|string} value - Value to format.
 * @returns {number|string|0} Formatted value or original if not a number.
 */
export const formatNumberSmart = (value) => {
  if (value === null || value === undefined) return "";
  const num = Number(value);
  if (isNaN(num)) return value;
  if (num === 0) return 0;
  const absNum = Math.abs(num);
  if (absNum < 0.01) return Number(num.toPrecision(2));
  return Number(num.toFixed(2));
};

/**
 * @component CustomTooltip
 * @description A flexible tooltip component for Recharts that handles data filtering,
 * automatic label mapping, and additional metadata rows.
 * @param {Object} props
 * @param {boolean} props.active - Provided by Recharts (is tooltip visible).
 * @param {Array} props.payload - Provided by Recharts (data points under cursor).
 * @param {string} [props.xLabel="x"] - Label for the X-axis value.
 * @param {string} [props.yLabel="f(x)"] - Label for the Y-axis value.
 * @param {number|string} [props.overrideY=null] - Optional manual override for the Y value display.
 * @param {number|null} [props.areaValue=null] - Optional probability/area value (e.g., F(x)).
 * @param {Array} [props.extraRows=[]] - Array of {label, value, color} objects for additional info.
 */
function CustomTooltip({
  active,
  payload,
  xLabel = "x",
  yLabel = "f(x)",
  overrideY = null,
  areaValue = null,
  extraRows = [],
}) {
  if (active && payload && payload.length) {
    // Filter out internal background areas and ensure unique data keys are displayed
    const validPayload = payload
      .filter((entry) => entry.name !== "ignore_tooltip")
      .filter(
        (entry, index, self) =>
          index === self.findIndex((e) => e.dataKey === entry.dataKey),
      );

    if (validPayload.length === 0) return null;

    const point = validPayload[0].payload;

    // Resolve X-axis value from different possible data structures
    const xVal =
      point.x !== undefined
        ? point.x
        : point.name !== undefined
          ? point.name
          : validPayload[0].name;

    const formattedX =
      typeof xVal === "number" ? formatNumberSmart(xVal) : xVal;

    // Determine if rendering single or multiple lines
    const isMultiSeries = validPayload.length > 1;

    return (
      <div
        className="custom-tooltip bg-body border rounded shadow-sm p-2"
        style={{ fontSize: "0.9rem" }}
      >
        {/* X-axis Identifier */}
        <p className="mb-0 fw-bold">{`${xLabel}: ${formattedX}`}</p>

        {/* Dynamic Data Rows (Primary Series) */}
        {validPayload.map((entry, index) => {
          const val =
            !isMultiSeries && index === 0 && overrideY !== null
              ? overrideY
              : entry.value !== undefined
                ? entry.value
                : (point[entry.dataKey] ?? point.y);

          const formattedY =
            typeof val === "number" ? formatNumberSmart(val) : val;

          // Resolve label: use series name if available, otherwise fallback to yLabel
          const labelName =
            entry.name && entry.name !== "y" ? entry.name : yLabel;

          return (
            <p
              key={index}
              className="mb-0"
              style={{
                color: entry.color || entry.fill || "var(--bs-primary)",
              }}
            >
              {`${labelName}: ${formattedY}`}
            </p>
          );
        })}

        {/* Custom Additional Info Rows */}
        {extraRows.map(({ label, value, color }, i) => (
          <p
            key={`extra-${i}`}
            className="mb-0"
            style={{ color: color || "var(--bs-secondary)", opacity: 0.85 }}
          >
            {`${label}: ${formatNumberSmart(value)}`}
          </p>
        ))}

        {/* Probability Distribution Meta (CDF Area) */}
        {areaValue !== null && (
          <p
            className="mb-0 mt-1 pt-1 border-top"
            style={{ fontSize: "0.85rem", color: "var(--bs-body-color)" }}
          >
            <span className="opacity-75">F(x): </span>
            <strong style={{ color: "var(--bs-primary)" }}>
              {(areaValue * 100).toFixed(2)} %
            </strong>
          </p>
        )}
      </div>
    );
  }
  return null;
}

export default CustomTooltip;
