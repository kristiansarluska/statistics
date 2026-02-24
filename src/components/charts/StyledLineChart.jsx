// src/components/charts/StyledLineChart.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";
import "../../styles/charts.css";
import CustomTooltip, { formatNumberSmart } from "./CustomTooltip";

function StyledLineChart({
  data,
  title,
  xLabel = "x",
  yLabel = "y",
  yAxisDomain = [0, "auto"],
  lineClass = "chart-line-primary",
  hoverX = null,
  setHoverX = () => {},
  type = "pdf",
  minX = null,
  maxX = null,
  showReferenceArea = false,
}) {
  const [animated, setAnimated] = useState(true);
  const prevDataRef = useRef([]);
  const displayYLabel = yLabel || (type === "cdf" ? "F(x)" : "f(x)");

  useEffect(() => {
    if (JSON.stringify(prevDataRef.current) !== JSON.stringify(data)) {
      setAnimated(true);
      prevDataRef.current = data;
    } else {
      setAnimated(false);
    }
  }, [data, hoverX]);

  // Spoločný handler pre myš aj dotykové udalosti
  const handleChartInteraction = (state) => {
    if (state && state.activePayload && state.activePayload.length > 0) {
      const currentX = state.activePayload[0].payload.x;
      if (hoverX !== currentX) {
        setHoverX(currentX);
      }
    } else if (
      state &&
      state.activeLabel !== undefined &&
      state.activeLabel !== null
    ) {
      const roundedX = parseFloat(state.activeLabel.toFixed(2));
      if (hoverX !== roundedX) {
        setHoverX(roundedX);
      }
    }
  };

  const handleMouseLeave = () => setHoverX(null);

  const cdfRefLineY = useMemo(() => {
    if (type !== "cdf" || hoverX === null) return null;
    let pointY = null;
    let closestPoint = null;
    let minDiff = Infinity;

    for (const point of data) {
      const diff = Math.abs(point.x - hoverX);
      if (diff < minDiff) {
        minDiff = diff;
        closestPoint = point;
      }
      if (point.x >= hoverX) {
        pointY = point.y;
        break;
      }
    }
    if (pointY === null && data.length > 0) {
      pointY = closestPoint ? closestPoint.y : data[data.length - 1].y;
    }
    return pointY;
  }, [data, hoverX, type]);

  const areaStartX = minX ?? (data.length > 0 ? data[0].x : 0);

  return (
    <div className="chart-container">
      {title && <div className="chart-title">{title}</div>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          onMouseMove={handleChartInteraction}
          onTouchMove={handleChartInteraction}
          onTouchStart={handleChartInteraction}
          onClick={handleChartInteraction}
          onMouseLeave={handleMouseLeave}
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="x"
            type="number"
            domain={
              minX !== null && maxX !== null ? [minX, maxX] : ["auto", "auto"]
            }
            tickCount={9}
            allowDecimals={true}
            label={{ value: xLabel, position: "insideBottom", offset: -15 }}
            className="chart-axis"
            tickFormatter={formatNumberSmart}
            allowDuplicatedCategory={false}
          />
          <YAxis
            label={{
              value: displayYLabel,
              angle: -90,
              position: "insideLeft",
              offset: -10,
            }}
            className="chart-axis"
            tickFormatter={formatNumberSmart}
            domain={yAxisDomain || [0, "auto"]}
            tickCount={6}
            allowDataOverflow={false}
          />
          <Tooltip
            content={<CustomTooltip xLabel={xLabel} yLabel={displayYLabel} />}
            cursor={false}
            animationDuration={50}
          />

          {hoverX !== null && (
            <ReferenceLine
              x={hoverX}
              stroke="red"
              strokeWidth={1}
              strokeDasharray="5 5"
              ifOverflow="extendDomain"
            />
          )}

          {type === "cdf" && cdfRefLineY !== null && (
            <ReferenceLine
              y={cdfRefLineY}
              stroke="red"
              strokeWidth={1}
              strokeDasharray="3 3"
              ifOverflow="extendDomain"
            />
          )}

          {showReferenceArea && type === "pdf" && hoverX !== null && (
            <ReferenceArea
              x1={areaStartX}
              x2={hoverX}
              y1={0}
              fill="rgba(0, 140, 186, 0.2)"
              stroke="none"
              ifOverflow="hidden"
              isAnimationActive={false}
            />
          )}

          <Line
            type="monotone"
            dataKey="y"
            className={lineClass}
            strokeWidth={2}
            dot={false}
            isAnimationActive={animated}
            animationDuration={animated ? 700 : 0}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StyledLineChart;
