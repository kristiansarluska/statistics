// src/components/charts/helpers/CustomTooltip.jsx
import React from "react";

// Vylepšená formatter funkcia pre inteligentné zaokrúhľovanie
export const formatNumberSmart = (value) => {
  if (value === null || value === undefined) return "";

  const num = Number(value);
  if (isNaN(num)) return value;

  if (num === 0) return 0;

  const absNum = Math.abs(num);

  if (absNum < 0.01) {
    return Number(num.toPrecision(2));
  }

  return Number(num.toFixed(2));
};

function CustomTooltip({
  active,
  payload,
  xLabel = "x",
  yLabel = "f(x)",
  overrideY = null,
}) {
  if (active && payload && payload.length) {
    // Odstránime z tooltipu záznamy patriace BackgroundArea
    const validPayload = payload.filter(
      (entry) => entry.name !== "ignore_tooltip",
    );

    if (validPayload.length === 0) return null;

    const point = validPayload[0].payload;
    const xVal =
      point.x !== undefined
        ? point.x
        : point.name !== undefined
          ? point.name
          : validPayload[0].name;

    const formattedX =
      typeof xVal === "number" ? formatNumberSmart(xVal) : xVal;

    return (
      <div className="custom-tooltip">
        <p className="mb-0 fw-bold">{`${xLabel}: ${formattedX}`}</p>
        {validPayload.map((entry, index) => {
          const val =
            index === 0 && overrideY !== null
              ? overrideY
              : entry.value !== undefined
                ? entry.value
                : point.y;

          const formattedY =
            typeof val === "number" ? formatNumberSmart(val) : val;

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
      </div>
    );
  }
  return null;
}

export default CustomTooltip;
