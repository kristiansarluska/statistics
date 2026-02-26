// src/components/charts/helpers/CustomTooltip.jsx
import React from "react";

// Vylepšená formatter funkcia pre inteligentné zaokrúhľovanie
export const formatNumberSmart = (value) => {
  if (value === null || value === undefined) return "";

  const num = Number(value);
  if (isNaN(num)) return value;

  if (num === 0) return 0;

  const absNum = Math.abs(num);

  // Ak je číslo veľmi malé (začína nulami, napr. 0.0036), zachováme platné číslice
  if (absNum < 0.01) {
    // toPrecision(3) zabezpečí, že napr. 0.003612 sa zaokrúhli na 0.00361
    return Number(num.toPrecision(2));
  }

  // Pre bežné čísla aplikujeme zaokrúhlenie na max 2 desatinné miesta
  // Vonkajší Number() odstráni prebytočné nuly na konci (napr. 5.10 -> 5.1)
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
    const point = payload[0].payload;
    const xVal =
      point.x !== undefined
        ? point.x
        : point.name !== undefined
          ? point.name
          : payload[0].name;

    // Ak máme overrideY (náš vypočítaný vrch schodu), použije ten, inak pôvodné
    const yVal =
      overrideY !== null
        ? overrideY
        : point.y !== undefined
          ? point.y
          : payload[0].value;

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
