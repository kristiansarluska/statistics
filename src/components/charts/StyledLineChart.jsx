import React, { useEffect, useRef, useState } from "react";
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

/**
 * Wrapper pre jednotný štýl grafov
 * @param {Array} data - dáta vo formáte [{ x: number, y: number }]
 * @param {string} title - názov grafu
 * @param {string} xLabel - popis osi X
 * @param {string} yLabel - popis osi Y
 * @param {string} lineClass - CSS trieda pre čiaru (default: chart-line-primary)
 * @param {number|null} hoverX - hodnota X, nad ktorou sa nachádza kurzor
 * @param {function} setHoverX - funkcia na nastavenie hodnoty hoverX
 */
function StyledLineChart({
  data,
  title,
  xLabel = "x",
  yLabel = "y",
  lineClass = "chart-line-primary",
  hoverX = null,
  setHoverX = () => {},
}) {
  const [animated, setAnimated] = useState(true);
  const prevDataRef = useRef([]);

  // Ak sa zmenili dáta (nie iba hover), spusti animáciu
  useEffect(() => {
    if (JSON.stringify(prevDataRef.current) !== JSON.stringify(data)) {
      setAnimated(true);
      prevDataRef.current = data;
    } else {
      setAnimated(false);
    }
  }, [data]);

  const handleMouseMove = (state) => {
    if (state && state.activeLabel !== undefined) {
      setHoverX(state.activeLabel);
    }
  };

  const handleMouseLeave = () => {
    setHoverX(null);
  };

  return (
    <div className="chart-container">
      {title && <div className="chart-title">{title}</div>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
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
