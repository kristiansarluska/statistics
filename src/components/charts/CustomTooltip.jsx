// src/components/charts/CustomTooltip.jsx
import React from "react";

// Formatter function moved here for reusability
export const formatNumberSmart = (num) => {
  if (num === null || num === undefined || isNaN(num)) return "-";
  const abs = Math.abs(num);
  if (abs === 0) return "0.00";
  if (abs >= 0.1) return num.toFixed(2);
  if (abs >= 0.001) return num.toFixed(4);
  return num.toExponential(4);
};

function CustomTooltip({ active, payload, xLabel = "x", yLabel = "f(x)" }) {
  if (active && payload && payload.length) {
    // Check where the value is stored (LineCharts use point.x/y, BarCharts use standard payload)
    const point = payload[0].payload;
    const xVal =
      point.x !== undefined
        ? point.x
        : point.name !== undefined
        ? point.name
        : payload[0].name;
    const yVal = point.y !== undefined ? point.y : payload[0].value;

    const formattedX =
      typeof xVal === "number" ? formatNumberSmart(xVal) : xVal;
    const formattedY =
      typeof yVal === "number" ? formatNumberSmart(yVal) : yVal;

    return (
      <div className="custom-tooltip">
        <p className="mb-0 fw-bold">{`${xLabel}: ${formattedX}`}</p>
        <p
          className="mb-0"
          style={{ color: payload[0].color || "var(--bs-primary)" }}
        >
          {`${yLabel}: ${formattedY}`}
        </p>
      </div>
    );
  }
  return null;
}

export default CustomTooltip;
