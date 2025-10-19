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
  ResponsiveContainer,
  Area,
} from "recharts";
import "../../styles/charts.css";

function StyledLineChart({
  data,
  title,
  xLabel = "x", // Label pre X os (a tooltip)
  yLabel = "y", // Label pre Y os (a tooltip) - budeš posielať f(x) alebo F(x)
  lineClass = "chart-line-primary",
  hoverX = null,
  setHoverX = () => {},
  type = "pdf",
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
  }, [data, hoverX]);

  const formatNumberSmart = (num) => {
    if (num === null || num === undefined || isNaN(num)) return "-";
    const abs = Math.abs(num);
    if (abs === 0) return "0.00";
    if (abs >= 0.1) return num.toFixed(2);
    if (abs >= 0.001) return num.toFixed(4);
    return num.toExponential(4);
  };

  const handleMouseMove = (state) => {
    if (state && state.activePayload && state.activePayload.length > 0) {
      const currentX = state.activePayload[0].payload.x;
      if (hoverX !== currentX) {
        setHoverX(currentX);
      }
    } else if (state && state.activeLabel !== undefined) {
      // Fallback ak activePayload nie je dostupný
      const roundedX = parseFloat(state.activeLabel.toFixed(2));
      if (hoverX !== roundedX) {
        setHoverX(roundedX);
      }
    }
  };
  const handleMouseLeave = () => setHoverX(null);

  const dataWithFill = useMemo(() => {
    if (type !== "pdf" || hoverX === null) {
      return data.map((point) => ({ ...point, fillY: 0 }));
    }
    // console.log("Recalculating fill for hoverX:", hoverX); // DEBUGGING
    return data.map((point) => ({
      ...point,
      fillY: point.x <= hoverX ? point.y : 0,
    }));
  }, [data, hoverX, type]);

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

  // === UPRAVENÝ TOOLTIP CONTENT ===
  const renderTooltipContent = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const point = payload[0].payload;
      const formattedX = formatNumberSmart(point.x);
      const formattedY = formatNumberSmart(point.y);

      return (
        <div
          className="custom-tooltip"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            padding: "5px 10px",
            border: "1px solid #ccc",
            borderRadius: "3px",
            fontSize: "0.85rem",
          }}
        >
          {/* Odstránené tučné písmo */}
          <p style={{ margin: 0 }}>{`${xLabel}: ${formattedX}`}</p>
          {/* Použije sa yLabel prop (f(x) alebo F(x)) */}
          <p
            style={{ margin: 0, color: payload[0].color || "#000" }}
          >{`${yLabel}: ${formattedY}`}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="chart-container">
      {title && <div className="chart-title">{title}</div>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={dataWithFill}
          onMouseMove={handleMouseMove}
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
            label={{ value: xLabel, position: "insideBottom", offset: -15 }}
            className="chart-axis"
            tickFormatter={formatNumberSmart}
            allowDuplicatedCategory={false}
          />
          <YAxis
            label={{
              value: yLabel,
              angle: -90,
              position: "insideLeft",
              offset: -10,
            }}
            className="chart-axis"
            tickFormatter={formatNumberSmart}
            domain={["auto", "auto"]}
          />
          <Tooltip
            content={renderTooltipContent}
            cursor={{ stroke: "#aaa", strokeWidth: 1 }}
            animationDuration={50}
          />

          {/* Vertikálna čiara - BEZ LABELU */}
          {hoverX !== null && (
            <ReferenceLine
              x={hoverX}
              stroke="red"
              strokeWidth={1}
              strokeDasharray="3 3"
              ifOverflow="extendDomain"
            />
          )}

          {/* Horizontálna čiara pre CDF - BEZ LABELU */}
          {type === "cdf" && cdfRefLineY !== null && (
            <ReferenceLine
              y={cdfRefLineY}
              stroke="red"
              strokeWidth={1}
              strokeDasharray="3 3"
              ifOverflow="extendDomain"
              // Odstránený label prop
            />
          )}

          {/* Vyfarbená oblasť pod PDF */}
          {type === "pdf" && hoverX !== null && (
            <Area
              // Skúsime pridať key={hoverX} - syntax je bez zložených zátvoriek navyše
              key={hoverX}
              type="monotone"
              dataKey="fillY"
              stroke="none"
              fill="rgba(0, 140, 186, 0.2)"
              isAnimationActive={false}
              animationDuration={0}
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
