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
  ReferenceDot,
  ResponsiveContainer,
} from "recharts";
import "../../styles/charts.css";
import CustomTooltip from "./CustomTooltip";
import { getAxisConfig } from "../../utils/distributions";

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

  const hoverY = useMemo(() => {
    if (hoverX === null || !data || data.length === 0) return null;
    let closestPoint = data[0];
    let minDiff = Math.abs(data[0].x - hoverX);
    for (let i = 1; i < data.length; i++) {
      const diff = Math.abs(data[i].x - hoverX);
      if (diff < minDiff) {
        minDiff = diff;
        closestPoint = data[i];
      }
    }
    return closestPoint.y;
  }, [data, hoverX]);

  // Vypočet maxím z dát
  const minDataX = useMemo(() => {
    if (!data || data.length === 0) return 0;
    return Math.min(...data.map((d) => d.x || 0));
  }, [data]);

  const maxDataX = useMemo(() => {
    if (!data || data.length === 0) return 1;
    return Math.max(...data.map((d) => d.x || 0));
  }, [data]);

  const maxDataY = useMemo(() => {
    if (!data || data.length === 0) return 0.1;
    return Math.max(...data.map((d) => d.y || 0));
  }, [data]);

  const yDomainMin = Array.isArray(yAxisDomain) ? yAxisDomain[0] : 0;
  const yDomainMax = Array.isArray(yAxisDomain) ? yAxisDomain[1] : "auto";

  // Aplikovanie univerzálnej logiky na obe osi
  const xConfig = getAxisConfig(maxDataX, minX, maxX, minDataX);
  const yConfig = getAxisConfig(maxDataY, yDomainMin, yDomainMax, 0);

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
            domain={xConfig.domain}
            ticks={xConfig.ticks} // Osi sú teraz absolútne presné
            allowDecimals={true}
            label={{ value: xLabel, position: "insideBottom", offset: -15 }}
            className="chart-axis"
            tickFormatter={xConfig.formatTick}
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
            tickFormatter={yConfig.formatTick}
            domain={yConfig.domain}
            ticks={yConfig.ticks} // Osi sú teraz absolútne presné
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
              stroke="var(--bs-danger, red)"
              strokeWidth={1}
              strokeDasharray="5 5"
              ifOverflow="extendDomain"
            />
          )}

          {type === "cdf" && hoverY !== null && (
            <ReferenceLine
              y={hoverY}
              stroke="var(--bs-danger, red)"
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
              fill="var(--bs-primary)"
              fillOpacity={0.1}
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
            activeDot={false}
            isAnimationActive={animated}
            animationDuration={animated ? 700 : 0}
          />

          {hoverX !== null && hoverY !== null && (
            <ReferenceDot
              x={hoverX}
              y={hoverY}
              r={5}
              fill="var(--bs-primary)"
              stroke="var(--bs-body-color, black)"
              strokeWidth={2}
              isFront={true}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StyledLineChart;
