// src/components/charts/helpers/StyledBarChart.jsx
import React, { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
  Label,
} from "recharts";
import CustomTooltip from "./CustomTooltip";
import { getAxisConfig } from "../../../utils/distributions";

/**
 * @component AnimatedCursor
 * @description Custom SVG rectangle used as a cursor in BarChart to provide smooth transitions between bars.
 */
const AnimatedCursor = (props) => {
  const { x, y, width, height, fillOpacity } = props;
  if (x == null || y == null) return null;
  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill="var(--bs-gray-400, gray)"
      fillOpacity={fillOpacity || 0.1}
      style={{ transition: "x 0.2s ease, width 0.2s ease" }}
      className="recharts-tooltip-cursor"
    />
  );
};

/**
 * @component AnimatedAreaShape
 * @description Custom shape for ReferenceArea that animates its width and position when hover state changes.
 */
const AnimatedAreaShape = (props) => {
  const { x, y, width, height } = props;
  if (x == null || y == null || isNaN(width) || isNaN(height)) return null;

  return (
    <rect
      x={x}
      y={y}
      width={Math.max(0, width)}
      height={Math.max(0, height)}
      fill="var(--bs-primary)"
      fillOpacity={0.1}
      style={{ transition: "x 0.2s ease, width 0.2s ease" }}
    />
  );
};

/**
 * @component StyledBarChart
 * @description A standardized wrapper for Recharts BarChart, featuring dynamic axis scaling,
 * synchronized hover interactions, and support for highlighted reference areas.
 * @param {Object} props
 * @param {Array} props.data - Array of {x, y} data points.
 * @param {string} props.xLabel - Horizontal axis title.
 * @param {string} props.yLabel - Vertical axis title.
 * @param {Array} [props.yDomain=[0, "auto"]] - Manual Y-axis boundaries.
 * @param {number} [props.maxBarSize=60] - Constraint for bar width.
 * @param {string|null} props.hoverX - Current active X coordinate from external state.
 * @param {Function} props.setHoverX - Callback to update the active X coordinate.
 * @param {boolean} [props.showReferenceArea=false] - Toggle to display the shaded probability region.
 * @param {number} [props.referenceAreaX1] - Start of reference area (defaults to hoverX).
 * @param {number} [props.referenceAreaX2] - End of reference area (defaults to hoverX).
 * @param {string} [props.barDataKey="y"] - Data key for the primary bar series.
 * @param {number|null} [props.customMaxY=null] - Optional override for Y-axis scale calculation.
 */
function StyledBarChart({
  data,
  xLabel,
  yLabel,
  yDomain = [0, "auto"],
  maxBarSize = 60,
  hoverX,
  setHoverX,
  showReferenceArea = false,
  referenceAreaX1,
  referenceAreaX2,
  barDataKey = "y",
  customMaxY = null,
  children,
}) {
  // Resolve reference area boundaries; falls back to current hover position for interactive distributions
  const rX1 = referenceAreaX1 !== undefined ? referenceAreaX1 : hoverX;
  const rX2 = referenceAreaX2 !== undefined ? referenceAreaX2 : hoverX;

  // Find max value for consistent axis scaling, prioritizing custom override if provided
  const maxDataY = useMemo(() => {
    if (customMaxY !== null) return customMaxY;
    if (!data || data.length === 0) return 0.1;
    return Math.max(...data.map((d) => d[barDataKey] || 0));
  }, [data, barDataKey, customMaxY]);

  const yDomainMin = Array.isArray(yDomain) ? yDomain[0] : 0;
  const yDomainMax = Array.isArray(yDomain) ? yDomain[1] : "auto";

  // Generate dynamic ticks and domain configuration based on the data range
  const yConfig = getAxisConfig(maxDataY, yDomainMin, yDomainMax, 0);

  /**
   * Formats X-axis ticks to a consistent precision for numerical distributions.
   */
  const formatXTick = (val) => {
    if (val === null || val === undefined) return "";
    const numericVal = Number(val);
    if (isNaN(numericVal)) return val;
    return Number(numericVal.toFixed(4));
  };

  /**
   * Syncs chart hover events with external state to drive tooltips and reference areas.
   */
  const handleChartInteraction = (state) => {
    if (
      setHoverX &&
      state &&
      state.isTooltipActive &&
      state.activeLabel !== undefined &&
      state.activeLabel !== null
    ) {
      setHoverX(String(state.activeLabel));
    }
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={data}
        margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
        onMouseMove={handleChartInteraction}
        onTouchMove={handleChartInteraction}
        onTouchStart={handleChartInteraction}
        onClick={handleChartInteraction}
        onMouseLeave={() => setHoverX && setHoverX(null)}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />

        {/* Axes Section */}
        <XAxis dataKey="x" tickFormatter={formatXTick}>
          <Label value={xLabel} position="insideBottom" offset={-15} />
        </XAxis>
        <YAxis
          domain={yConfig.domain}
          ticks={yConfig.ticks}
          tickFormatter={yConfig.formatTick}
        >
          <Label
            value={yLabel}
            angle={-90}
            position="insideLeft"
            offset={-10}
            style={{ textAnchor: "middle" }}
          />
        </YAxis>

        {/* Interaction Overlays */}
        <Tooltip
          cursor={
            showReferenceArea ? false : <AnimatedCursor fillOpacity={0.1} />
          }
          content={<CustomTooltip xLabel={xLabel} yLabel={yLabel} />}
          animationDuration={200}
        />

        {/* Highlighted Region (e.g., Probability Area) */}
        {showReferenceArea && hoverX !== null && hoverX !== undefined && (
          <ReferenceArea x1={rX1} x2={rX2} shape={<AnimatedAreaShape />} />
        )}

        {/* Data Series: Renders children if provided (for multiple bars), else default single bar */}
        {children ? (
          children
        ) : (
          <Bar
            dataKey={barDataKey}
            fill="var(--bs-primary)"
            maxBarSize={maxBarSize}
            isAnimationActive={true}
            radius={[4, 4, 0, 0]}
          />
        )}
      </BarChart>
    </ResponsiveContainer>
  );
}

export default StyledBarChart;
