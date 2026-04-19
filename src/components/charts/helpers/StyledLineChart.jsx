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

/**
 * @component StyledLineChart
 * @description Highly customizable line chart wrapper for statistical data (PDFs, CDFs). Supports multi-series, synchronized hover, reference lines, and dynamic area filling.
 * @param {Object} props
 * @param {Array} props.data - Primary dataset for the chart.
 * @param {string} [props.title] - Chart title.
 * @param {string} [props.xLabel="x"] - Label for the X-axis.
 * @param {string} [props.yLabel="y"] - Label for the Y-axis.
 * @param {Array} [props.yAxisDomain=[0, "auto"]] - Domain limits for Y-axis.
 * @param {string} [props.lineClass="chart-line-primary"] - Custom CSS class for the primary line.
 * @param {number|null} [props.hoverX=null] - Synchronized X coordinate for cross-chart interactions.
 * @param {Function} [props.setHoverX] - Callback to update the global/local hover state.
 * @param {string} [props.type="pdf"] - Chart type affecting axis defaults (e.g., "pdf", "cdf").
 * @param {number|null} [props.minX=null] - Forced minimum X value.
 * @param {number|null} [props.maxX=null] - Forced maximum X value.
 * @param {boolean} [props.showReferenceArea=false] - If true, fills the area under the curve up to hoverX.
 * @param {string} [props.lineType="monotone"] - SVG curve interpolation type.
 * @param {string} [props.hoverLineType="segment"] - Render style for reference lines upon hover ("segment" or full line).
 * @param {number|null} [props.areaValue=null] - Explicit override value for the calculated area.
 * @param {Array} [props.extraRows=[]] - Additional data rows injected into the CustomTooltip.
 * @param {Array} [props.series=null] - Configuration for multi-line rendering [{ key, name, color }].
 * @param {React.ReactNode} [props.children] - Additional Recharts components to render inside ComposedChart.
 */
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
  series = null,
  children,
}) {
  const [animated, setAnimated] = useState(true);
  const prevDataRef = useRef([]);
  const gradientId = useId();
  const displayYLabel = yLabel || (type === "cdf" ? "F(x)" : "f(x)");

  // Re-trigger animation only when underlying data explicitly changes
  useEffect(() => {
    if (JSON.stringify(prevDataRef.current) !== JSON.stringify(data)) {
      setAnimated(true);
      prevDataRef.current = data;
    } else {
      setAnimated(false);
    }
  }, [data]);

  /**
   * Syncs chart interaction with the external hover state.
   */
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

  /**
   * Interpolates the corresponding Y value for the current hoverX.
   * Required to precisely position reference dots on the curve, including step functions.
   */
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

    // Handle step function edges specifically
    if (lineType === "stepBefore" && lastIdx < data.length - 1) {
      const nextY = data[lastIdx + 1].y;
      if (nextY > bestY) bestY = nextY;
    } else if (lineType === "stepAfter" && firstIdx > 0) {
      const prevY = data[firstIdx - 1].y;
      if (prevY > bestY) bestY = prevY;
    }

    return bestY;
  }, [data, hoverX, lineType, series]);

  // Dynamically resolve domain boundaries
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
      // Find max Y across all active series keys for multi-line charts
      return Math.max(
        ...data.map((d) => Math.max(...series.map((s) => d[s.key] || 0))),
      );
    }
    return Math.max(...data.map((d) => d.y || 0));
  }, [data, series]);

  const yDomainMin = Array.isArray(yAxisDomain) ? yAxisDomain[0] : 0;
  const yDomainMax = Array.isArray(yAxisDomain) ? yAxisDomain[1] : "auto";

  // Fetch standardized tick and domain configurations based on data ranges
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

  // Calculates percentage position of hoverX for the gradient mask
  const hoverPercent = useMemo(() => {
    if (hoverX === null) return 0;
    if (chartDomainMax <= chartDomainMin) return 0;
    const percent =
      ((hoverX - chartDomainMin) / (chartDomainMax - chartDomainMin)) * 100;
    return Math.max(0, Math.min(100, percent));
  }, [hoverX, chartDomainMin, chartDomainMax]);

  // Filter for X-axis to prevent ticks from overflowing chart bounds
  const validXTicks = useMemo(() => {
    if (!xConfig.ticks) return undefined;
    return xConfig.ticks.filter(
      (t) => t >= chartDomainMin && t <= chartDomainMax,
    );
  }, [xConfig.ticks, chartDomainMin, chartDomainMax]);

  // Force strict [0, 1] domain and ticks for CDF probability
  const finalYDomain = type === "cdf" ? [0, 1] : yConfig.domain;
  const finalYTicks = useMemo(() => {
    if (type === "cdf" && yConfig.ticks)
      return yConfig.ticks.filter((t) => t <= 1);
    return yConfig.ticks;
  }, [type, yConfig.ticks]);

  /**
   * Estimates area under curve (integral) up to hoverX using trapezoidal rule.
   * Disabled for multi-series graphs to avoid array mismatch errors.
   */
  const calculatedArea = useMemo(() => {
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
        // Interpolate exactly at hover boundary
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
            {/* Dynamic gradient used to visually fill the PDF area up to hoverX */}
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
            ticks={validXTicks}
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
            domain={finalYDomain}
            ticks={finalYTicks}
            allowDataOverflow={true}
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

          {/* Area fill renderer - enabled only for single series PDF charts */}
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
              stroke="var(--bs-danger, red)"
              strokeWidth={1}
              strokeDasharray="5 5"
              isFront={true}
              {...(!series && hoverY !== null
                ? {
                    segment: [
                      { x: hoverX, y: chartDomainYMin },
                      { x: hoverX, y: hoverY },
                    ],
                  }
                : { x: hoverX })}
              ifOverflow="visible"
            />
          )}

          {/* Vertical Reference Line - Displayed always on hover */}
          {hoverX !== null && (
            <ReferenceLine
              stroke="var(--bs-danger, red)"
              strokeWidth={1}
              strokeDasharray="5 5"
              isFront={true}
              // If series exists, draw full line across axis.
              // Otherwise, in segment mode, draw a line segment terminating at hoverY.
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

          {/* Horizontal Reference Line - Allowed only for single curve */}
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

          {/* Data Lines Render */}
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
                // activeDot ensures marker display on every curve during hover
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

          {/* Custom reference dot - Rendered only for single series mode */}
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
