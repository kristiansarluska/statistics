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
  Label,
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
  hoverLineType = "segment",
  areaValue = null,
  extraRows = [],
  series = null, // Added series prop
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
    if (hoverX === null || !data || data.length === 0 || series) return null;

    let minDiff = Infinity;
    for (let i = 0; i < data.length; i++) {
      const diff = Math.abs(data[i].x - hoverX);
      if (diff < minDiff) minDiff = diff;
    }

    const closestIndices = [];
    for (let i = 0; i < data.length; i++) {
      if (Math.abs(Math.abs(data[i].x - hoverX) - minDiff) < 1e-6) {
        closestIndices.push(i);
      }
    }

    if (closestIndices.length === 0) return null;

    let bestY = data[closestIndices[0]].y;
    for (let idx of closestIndices) {
      if (data[idx].y > bestY) bestY = data[idx].y;
    }

    const firstIdx = closestIndices[0];
    const lastIdx = closestIndices[closestIndices.length - 1];

    if (lineType === "stepBefore" && lastIdx < data.length - 1) {
      const nextY = data[lastIdx + 1].y;
      if (nextY > bestY) bestY = nextY;
    } else if (lineType === "stepAfter" && firstIdx > 0) {
      const prevY = data[firstIdx - 1].y;
      if (prevY > bestY) bestY = prevY;
    }

    return bestY;
  }, [data, hoverX, lineType, series]);

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
    if (series) {
      // Find max Y across all active series keys
      return Math.max(
        ...data.map((d) => Math.max(...series.map((s) => d[s.key] || 0))),
      );
    }
    return Math.max(...data.map((d) => d.y || 0));
  }, [data, series]);

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

  const calculatedArea = useMemo(() => {
    // Disabled calculation for multi-series graphs to avoid array mismatches
    if (
      !showReferenceArea ||
      type !== "pdf" ||
      hoverX === null ||
      !data ||
      data.length < 2 ||
      series
    ) {
      return null;
    }

    let area = 0;
    const sortedData = [...data].sort((a, b) => a.x - b.x);

    for (let i = 1; i < sortedData.length; i++) {
      const prev = sortedData[i - 1];
      const curr = sortedData[i];

      if (curr.x <= hoverX) {
        area += (curr.x - prev.x) * ((prev.y + curr.y) / 2);
      } else if (prev.x < hoverX) {
        const ratio = (hoverX - prev.x) / (curr.x - prev.x);
        const interpolatedY = prev.y + ratio * (curr.y - prev.y);
        area += (hoverX - prev.x) * ((prev.y + interpolatedY) / 2);
        break;
      }
    }
    return Math.max(0, Math.min(1, area));
  }, [data, hoverX, showReferenceArea, type, series]);

  const finalAreaValue = areaValue !== null ? areaValue : calculatedArea;

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
            className="chart-axis"
            tickFormatter={xConfig.formatTick}
            allowDuplicatedCategory={false}
          >
            <Label value={xLabel} position="insideBottom" offset={-15} />
          </XAxis>
          <YAxis
            className="chart-axis"
            tickFormatter={yConfig.formatTick}
            domain={yConfig.domain}
            ticks={yConfig.ticks}
            allowDataOverflow={false}
          >
            <Label
              value={displayYLabel}
              angle={-90}
              position="insideLeft"
              offset={-10}
              style={{ textAnchor: "middle" }}
            />
          </YAxis>

          <Tooltip
            content={
              <CustomTooltip
                xLabel={xLabel}
                yLabel={displayYLabel}
                overrideY={hoverY}
                areaValue={finalAreaValue}
                extraRows={extraRows}
              />
            }
            cursor={false}
            animationDuration={50}
          />

          {children}

          {!series &&
            showReferenceArea &&
            type === "pdf" &&
            hoverX !== null && (
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

          {/* Vertical Reference Line */}
          {hoverX !== null && (
            <ReferenceLine
              x={hoverX}
              stroke="var(--bs-danger, red)"
              strokeWidth={1}
              strokeDasharray="5 5"
              // For single series we can use segment, for multi-series full vertical line is clearer
              {...(!series && hoverLineType === "segment" && hoverY !== null
                ? {
                    segment: [
                      { x: hoverX, y: chartDomainYMin },
                      { x: hoverX, y: hoverY },
                    ],
                  }
                : {})}
              ifOverflow="visible"
            />
          )}

          {/* Vertikálna ReferenceLine - zobrazí sa vždy pri hoveri */}
          {hoverX !== null && (
            <ReferenceLine
              stroke="var(--bs-danger, red)"
              strokeWidth={1}
              strokeDasharray="5 5"
              isFront={true}
              // Ak máme series, chceme plnú čiaru (cez x).
              // Ak nie a máme segment mód, vykreslíme úsečku po hoverY.
              {...(!series && hoverLineType === "segment" && hoverY !== null
                ? {
                    segment: [
                      { x: hoverX, y: chartDomainYMin },
                      { x: hoverX, y: hoverY },
                    ],
                  }
                : { x: hoverX })}
            />
          )}

          {/* Horizontálna ReferenceLine - len pre jednu krivku */}
          {!series &&
            hoverX !== null &&
            hoverY !== null &&
            !(showReferenceArea && type === "pdf") && (
              <ReferenceLine
                isFront={true}
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
              />
            )}

          {/* Vykreslenie kriviek */}
          {series ? (
            series.map((s) => (
              <Line
                key={s.key}
                type={lineType}
                dataKey={s.key}
                name={s.name}
                stroke={s.color}
                strokeWidth={2}
                dot={false}
                // activeDot zabezpečí zobrazenie bodu na každej krivke pri hoveri
                activeDot={{
                  r: 4,
                  fill: s.color,
                  stroke: "var(--bs-body-bg, white)",
                  strokeWidth: 2,
                }}
                isAnimationActive={animated}
                animationDuration={animated ? 700 : 0}
              />
            ))
          ) : (
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
          )}

          {/* Custom reference dot - only for single series */}
          {!series && hoverX !== null && hoverY !== null && (
            <ReferenceDot
              x={hoverX}
              y={hoverY}
              r={5}
              fill="var(--bs-primary)"
              stroke="var(--bs-secondary)"
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
