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
}) => {
  return (
    <>
      <Area
        data={data}
        dataKey={dataKey}
        type={type}
        fill={color}
        fillOpacity={fillOpacity}
        stroke="none"
        isAnimationActive={false}
        activeDot={false}
      />
      {showLine && (
        <Line
          data={data}
          dataKey={dataKey}
          type={type}
          stroke={color}
          strokeWidth={strokeWidth}
          dot={false}
          activeDot={false}
          isAnimationActive={false}
        />
      )}
    </>
  );
};

export default BackgroundArea;
