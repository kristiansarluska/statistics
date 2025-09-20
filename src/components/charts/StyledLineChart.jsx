import React from "react";
import {
  LineChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../../styles/charts.css";

function StyledLineChart({
  data,
  title,
  xLabel = "x",
  yLabel = "y",
  lineClass = "chart-line-primary",
  hoverX = null, // pridané
  setHoverX = () => {}, // pridané (ak chceš meniť hoverX)
}) {
  return (
    <div className="chart-container">
      {title && <div className="chart-title">{title}</div>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          onMouseMove={(state) => {
            if (state && state.activeLabel != null)
              setHoverX(state.activeLabel);
          }}
          onMouseLeave={() => setHoverX(null)}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="x"
            type="number"
            label={{ value: xLabel, position: "insideBottomRight", offset: -5 }}
            className="chart-axis"
          />
          <YAxis
            label={{ value: yLabel, angle: -90, position: "insideLeft" }}
            className="chart-axis"
          />
          <Tooltip />
          {hoverX !== null && (
            <ReferenceLine x={hoverX} stroke="red" strokeDasharray="3 3" />
          )}
          <Line type="monotone" dataKey="y" className={lineClass} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StyledLineChart;
