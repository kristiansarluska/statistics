import React, { useState, useEffect, useRef } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ResponsiveContainer,
  Area,
} from "recharts";
import "../../styles/charts.css";

function StyledLineChart({
  data,
  title,
  xLabel = "x",
  yLabel = "y",
  lineClass = "chart-line-primary",
  hoverX = null,
  setHoverX = () => {},
  type = "pdf", // "pdf" alebo "cdf"
  minX = null,
  maxX = null,
}) {
  const [animated, setAnimated] = useState(true);
  const prevDataRef = useRef([]);

  useEffect(() => {
    if (JSON.stringify(prevDataRef.current) !== JSON.stringify(data)) {
      setAnimated(true);
      prevDataRef.current = data;
    } else {
      setAnimated(false);
    }
  }, [data]);

  const formatNumberSmart = (num) => {
    if (num === null || num === undefined || isNaN(num)) return "-";
    const abs = Math.abs(num);
    if (abs === 0) return "0.00";
    if (abs >= 0.1) return num.toFixed(2);
    if (abs >= 0.001) return num.toFixed(4);
    return num.toExponential(4);
  };

  const handleMouseMove = (state) => {
    if (state && state.activeLabel !== undefined) {
      setHoverX(state.activeLabel);
    }
  };
  const handleMouseLeave = () => setHoverX(null);

  // Pridanie fillY pre PDF (len pre vykreslenie oblasti)
  const dataWithFill =
    type === "pdf" && hoverX !== null
      ? data.map((point) => ({
          ...point,
          fillY: point.x <= hoverX ? point.y : 0,
        }))
      : data.map((point) => ({ ...point, fillY: 0 }));

  // Pre CDF reference line
  const refLineValue =
    type === "cdf" && hoverX !== null
      ? data.find((d) => d.x >= hoverX)?.y
      : null;

  return (
    <div className="chart-container">
      {title && <div className="chart-title">{title}</div>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={dataWithFill}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="x"
            type="number"
            domain={
              minX !== null && maxX !== null ? [minX, maxX] : ["auto", "auto"]
            }
            label={{ value: xLabel, position: "insideBottomRight", offset: -5 }}
            className="chart-axis"
            tickFormatter={formatNumberSmart}
          />
          <YAxis
            label={{ value: yLabel, angle: -90, position: "insideLeft" }}
            className="chart-axis"
            tickFormatter={formatNumberSmart}
          />
          <Tooltip
            formatter={formatNumberSmart}
            labelFormatter={formatNumberSmart}
          />

          {/* Horizontálna čiara pre CDF */}
          {type === "cdf" && refLineValue !== null && (
            <ReferenceLine
              y={refLineValue}
              stroke="red"
              strokeDasharray="3 3"
            />
          )}

          {/* Vyfarbená oblasť pod PDF */}
          {type === "pdf" && hoverX !== null && (
            <Area
              type="monotone"
              dataKey="fillY"
              stroke="none"
              fill="rgba(0, 140, 186, 0.2)"
              isAnimationActive={false}
            />
          )}

          <Line
            type="monotone"
            dataKey="y"
            className={lineClass}
            dot={false}
            isAnimationActive={animated}
            animationDuration={700}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StyledLineChart;
