// src/components/charts/StyledBarChart.jsx
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

function StyledBarChart({
  data,
  xLabel,
  yLabel,
  yDomain = [0, "auto"],
  maxBarSize = 60,
  hoverX,
  setHoverX,
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
        onMouseMove={(state) => {
          if (
            setHoverX &&
            state &&
            state.isTooltipActive &&
            state.activeLabel !== undefined
          ) {
            setHoverX(String(state.activeLabel));
          }
        }}
        onMouseLeave={() => {
          if (setHoverX) setHoverX(null);
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="x"
          label={{ value: xLabel, position: "insideBottom", offset: -15 }}
        />
        <YAxis
          domain={yDomain}
          label={{
            value: yLabel,
            angle: -90,
            position: "insideLeft",
            offset: -10,
          }}
        />
        <Tooltip content={<CustomTooltip xLabel={xLabel} yLabel={yLabel} />} />
        <Bar dataKey="y" maxBarSize={maxBarSize}>
          {data.map((entry, index) => {
            // Určenie farby: ak je stĺpec "hovernutý", použijeme tmavší odtieň alebo inú farbu
            const isHovered =
              hoverX !== undefined &&
              hoverX !== null &&
              hoverX === String(entry.x);
            return (
              <Cell
                key={`cell-${index}`}
                fill={
                  isHovered
                    ? "var(--bs-primary-border-subtle, #0a58ca)"
                    : "var(--bs-primary)"
                }
                style={{ transition: "fill 0.2s ease" }}
              />
            );
          })}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default StyledBarChart;
