// src/components/charts/helpers/BackgroundArea.jsx
import React from "react";
import { Area, Line } from "recharts";

/**
 * @component BackgroundArea
 * @description A helper component for Recharts that renders a background area (and optionally a line).
 * Used to visualize distributions or reference shapes behind the main data series.
 * @param {Object} props
 * @param {Array} props.data - The source data for the area/line.
 * @param {string} [props.dataKey="y"] - The key to use for Y-axis values.
 * @param {string} [props.type="stepBefore"] - The interpolation type for the line/area shape.
 * @param {string} [props.color] - Stroke and fill color.
 * @param {number} [props.fillOpacity=0.15] - Opacity of the filled area.
 * @param {number} [props.strokeWidth=2] - Width of the stroke line.
 * @param {boolean} [props.showLine=true] - Whether to render the top stroke line.
 * @param {boolean} [props.isAnimationActive=false] - Toggle for Recharts animations.
 * @param {number} [props.animationDuration=500] - Duration of the animation in ms.
 */
function BackgroundArea({
  data,
  dataKey = "y",
  type = "stepBefore",
  color = "var(--bs-gray-400)",
  fillOpacity = 0.15,
  strokeWidth = 2,
  showLine = true,
  isAnimationActive = false,
  animationDuration = 500,
}) {
  return (
    <>
      {/* Background Filled Area */}
      <Area
        data={data}
        dataKey={dataKey}
        name="ignore_tooltip" // Marker to exclude this element from CustomTooltip logic
        type={type}
        fill={color}
        fillOpacity={fillOpacity}
        stroke="none"
        isAnimationActive={isAnimationActive}
        animationDuration={animationDuration}
        activeDot={false}
      />

      {/* Optional Top Boundary Line */}
      {showLine && (
        <Line
          data={data}
          dataKey={dataKey}
          name="ignore_tooltip"
          type={type}
          stroke={color}
          strokeWidth={strokeWidth}
          dot={false}
          activeDot={false}
          isAnimationActive={isAnimationActive}
          animationDuration={animationDuration}
        />
      )}
    </>
  );
}

export default BackgroundArea;
