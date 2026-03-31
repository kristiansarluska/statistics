// src/components/charts/helpers/AnimatedRefLine.jsx
import React from "react";

const AnimatedRefLine = (props) => {
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

  // Get top margin for label positioning
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
};

export default AnimatedRefLine;
