// src/components/charts/helpers/StyledLineChart.jsx
import React, { useState, useEffect, useRef, useMemo, useId } from "react";
import {
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceDot,
  ResponsiveContainer,
} from "recharts";
import "../../../styles/charts.css";
import CustomTooltip from "./CustomTooltip";
import { getAxisConfig } from "../../../utils/distributions";

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
  lineType = "monotone",
  hoverLineType = "segment", // "segment" (po krivku) alebo "full" (cez celý graf)
  children,
}) {
  const [animated, setAnimated] = useState(true);
  const prevDataRef = useRef([]);
  const gradientId = useId();
  const displayYLabel = yLabel || (type === "cdf" ? "F(x)" : "f(x)");

  useEffect(() => {
    if (JSON.stringify(prevDataRef.current) !== JSON.stringify(data)) {
      setAnimated(true);
      prevDataRef.current = data;
    } else {
      setAnimated(false);
    }
  }, [data]);

  const handleChartInteraction = (state) => {
    if (state && state.activePayload && state.activePayload.length > 0) {
      const currentX = state.activePayload[0].payload.x;
      if (hoverX !== currentX) setHoverX(currentX);
    } else if (
      state &&
      state.activeLabel !== undefined &&
      state.activeLabel !== null
    ) {
      const roundedX = parseFloat(state.activeLabel.toFixed(2));
      if (hoverX !== roundedX) setHoverX(roundedX);
    }
  };

  const handleMouseLeave = () => setHoverX(null);

  const hoverY = useMemo(() => {
    if (hoverX === null || !data || data.length === 0) return null;

    let minDiff = Infinity;
    for (let i = 0; i < data.length; i++) {
      const diff = Math.abs(data[i].x - hoverX);
      if (diff < minDiff) minDiff = diff;
    }

    // Všetky indexy, ktoré sa zhodujú s hoverX
    const closestIndices = [];
    for (let i = 0; i < data.length; i++) {
      if (Math.abs(Math.abs(data[i].x - hoverX) - minDiff) < 1e-6) {
        closestIndices.push(i);
      }
    }

    if (closestIndices.length === 0) return null;

    // Najvyššie Y z nájdených bodov
    let bestY = data[closestIndices[0]].y;
    for (let idx of closestIndices) {
      if (data[idx].y > bestY) bestY = data[idx].y;
    }

    // Trik pre Recharts: Pri step-grafoch sa skok deje vizuálne,
    // hoci vrchný bod nemusí byť v dátach na danom X fyzicky prítomný.
    const firstIdx = closestIndices[0];
    const lastIdx = closestIndices[closestIndices.length - 1];

    if (lineType === "stepBefore" && lastIdx < data.length - 1) {
      // Skok pri stepBefore ide z aktuálneho Y na NASLEDUJÚCE Y
      const nextY = data[lastIdx + 1].y;
      if (nextY > bestY) bestY = nextY;
    } else if (lineType === "stepAfter" && firstIdx > 0) {
      // Skok pri stepAfter ide z PREDCHÁDZAJÚCEHO Y na aktuálne Y
      const prevY = data[firstIdx - 1].y;
      if (prevY > bestY) bestY = prevY;
    }

    return bestY;
  }, [data, hoverX, lineType]);

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

  const xConfig = getAxisConfig(maxDataX, minX, maxX, minDataX);
  const yConfig = getAxisConfig(maxDataY, yDomainMin, yDomainMax, 0);

  const chartDomainMin =
    Array.isArray(xConfig.domain) && typeof xConfig.domain[0] === "number"
      ? xConfig.domain[0]
      : minX !== null
        ? minX
        : minDataX;

  const chartDomainMax =
    Array.isArray(xConfig.domain) && typeof xConfig.domain[1] === "number"
      ? xConfig.domain[1]
      : maxX !== null
        ? maxX
        : maxDataX;

  const chartDomainYMin =
    Array.isArray(yConfig.domain) && typeof yConfig.domain[0] === "number"
      ? yConfig.domain[0]
      : 0;

  const hoverPercent = useMemo(() => {
    if (hoverX === null) return 0;
    if (chartDomainMax <= chartDomainMin) return 0;
    const percent =
      ((hoverX - chartDomainMin) / (chartDomainMax - chartDomainMin)) * 100;
    return Math.max(0, Math.min(100, percent));
  }, [hoverX, chartDomainMin, chartDomainMax]);

  return (
    <div className="chart-container">
      {title && <div className="chart-title">{title}</div>}
      <ResponsiveContainer width="100%" height={300}>
        <ComposedChart
          data={data}
          onMouseMove={handleChartInteraction}
          onTouchMove={handleChartInteraction}
          onTouchStart={handleChartInteraction}
          onClick={handleChartInteraction}
          onMouseLeave={handleMouseLeave}
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
        >
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
              <stop
                offset={`${hoverPercent}%`}
                stopColor="var(--bs-primary)"
                stopOpacity={0.25}
              />
              <stop
                offset={`${hoverPercent}%`}
                stopColor="transparent"
                stopOpacity={0}
              />
            </linearGradient>
          </defs>

          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="x"
            type="number"
            domain={xConfig.domain}
            ticks={xConfig.ticks}
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
            ticks={yConfig.ticks}
            allowDataOverflow={false}
          />

          <Tooltip
            content={
              <CustomTooltip
                xLabel={xLabel}
                yLabel={displayYLabel}
                overrideY={hoverY}
              />
            }
            cursor={false}
            animationDuration={50}
          />

          {children}

          {showReferenceArea && type === "pdf" && hoverX !== null && (
            <Area
              type={lineType}
              dataKey="y"
              data={data}
              fill={`url(#${gradientId})`}
              stroke="none"
              isAnimationActive={false}
              activeDot={false}
              style={{ pointerEvents: "none" }}
            />
          )}

          {hoverX !== null && hoverY !== null && (
            <ReferenceLine
              {...(hoverLineType === "segment"
                ? {
                    segment: [
                      { x: hoverX, y: chartDomainYMin },
                      { x: hoverX, y: hoverY },
                    ],
                  }
                : { x: hoverX })}
              stroke="var(--bs-danger, red)"
              strokeWidth={1}
              strokeDasharray="5 5"
              ifOverflow={hoverLineType === "full" ? "extendDomain" : "hidden"}
            />
          )}

          {hoverX !== null &&
            hoverY !== null &&
            !(showReferenceArea && type === "pdf") && (
              <ReferenceLine
                {...(hoverLineType === "segment"
                  ? {
                      segment: [
                        { x: chartDomainMin, y: hoverY },
                        { x: hoverX, y: hoverY },
                      ],
                    }
                  : { y: hoverY })}
                stroke="var(--bs-danger, red)"
                strokeWidth={1}
                strokeDasharray="5 5"
                ifOverflow={
                  hoverLineType === "full" ? "extendDomain" : "hidden"
                }
              />
            )}

          <Line
            type={lineType}
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
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StyledLineChart;
