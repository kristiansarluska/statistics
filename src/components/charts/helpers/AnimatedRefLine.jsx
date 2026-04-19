// src/components/charts/helpers/AnimatedRefLine.jsx
import React from "react";

/**
 * @component AnimatedRefLine
 * @description Custom Recharts reference line that animates smoothly when its X-coordinate changes.
 * Useful for highlighting moving targets (like means or quantiles) without abrupt jumps.
 * @param {Object} props - Recharts injected props + custom configuration.
 * @param {number} props.x1 - X-coordinate (injected by Recharts).
 * @param {number} props.y1 - Starting Y-coordinate.
 * @param {number} props.y2 - Ending Y-coordinate.
 * @param {Object} [props.viewBox] - Recharts viewBox for boundary calculations.
 * @param {string} [props.strokeDasharray] - SVG stroke dash pattern.
 * @param {string} [props.labelText] - Optional text label displayed near the top of the line.
 * @param {string} [props.labelPosition="right"] - Placement of the label relative to the line ("left" or "right").
 * @param {string} [props.lineColor] - Specific color override for the line and text.
 */

function AnimatedRefLine(props) {
  const {
    x1,
    y1,
    y2,
    viewBox,
    strokeDasharray,
    labelText,
    labelPosition = "right",
    lineColor,
    stroke,
  } = props;

  // Protection against initial render before Recharts calculates dimensions
  if (typeof x1 !== "number" || isNaN(x1)) return null;

  // Determine the highest visible point on the Y-axis to ensure the label stays within the chart area
  const topY = viewBox ? viewBox.y : Math.min(y1, y2);

  const textX = labelPosition === "left" ? -6 : 6;
  const textAnchor = labelPosition === "left" ? "end" : "start";
  const finalColor = lineColor || stroke;

  return (
    <g
      style={{
        transition: "transform 0.6s cubic-bezier(0.25, 1, 0.5, 1)",
        transform: `translateX(${x1}px)`,
      }}
    >
      {/* Vertical Line */}
      <line
        x1={0}
        y1={y1}
        x2={0}
        y2={y2}
        stroke={finalColor}
        strokeWidth={2}
        strokeDasharray={strokeDasharray}
        style={{ transition: "stroke 0.6s ease" }}
      />

      {/* Optional Label */}
      {labelText && (
        <text
          x={textX}
          y={topY + 12}
          fill={finalColor}
          textAnchor={textAnchor}
          fontWeight="bold"
          fontSize={11}
          style={{ transition: "fill 0.6s ease" }}
        >
          {labelText}
        </text>
      )}
    </g>
  );
}

export default AnimatedRefLine;
