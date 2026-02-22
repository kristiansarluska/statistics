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
  xDataKey = "x",
  yDataKey = "y",
  xLabel = "x",
  yLabel = "P(X=x)",
  yDomain = [0, "auto"],
  colors = ["var(--bs-primary)"], // Podpora pre viacero farieb
  barSize,
}) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey={xDataKey}
          interval={0}
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
        <Tooltip
          cursor={{ fill: "var(--bs-body-color)", opacity: 0.08 }}
          content={<CustomTooltip xLabel={xLabel} yLabel={yLabel} />}
        />
        <Bar dataKey={yDataKey} barSize={barSize}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

export default StyledBarChart;
