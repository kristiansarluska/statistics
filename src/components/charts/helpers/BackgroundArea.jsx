// src/components/charts/helpers/BackgroundArea.jsx
import React from "react";
import { Area, Line } from "recharts";

const BackgroundArea = ({
  data,
  dataKey = "y",
  type = "stepBefore",
  color = "var(--bs-gray-400)",
  fillOpacity = 0.15,
  strokeWidth = 2,
  showLine = true,
  isAnimationActive = false,
  animationDuration = 500,
}) => {
  return (
    <>
      <Area
        data={data}
        dataKey={dataKey}
        name="ignore_tooltip" // Marker pre CustomTooltip
        type={type}
        fill={color}
        fillOpacity={fillOpacity}
        stroke="none"
        isAnimationActive={isAnimationActive}
        animationDuration={animationDuration}
        activeDot={false}
      />
      {showLine && (
        <Line
          data={data}
          dataKey={dataKey}
          name="ignore_tooltip" // Marker pre CustomTooltip
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
};

export default BackgroundArea;
