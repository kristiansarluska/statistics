// src/components/charts/helpers/StyledDiscreteCDFChart.jsx
import React, { useMemo } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Label,
} from "recharts";
import CustomTooltip from "./CustomTooltip";

/**
 * Custom tooltip renderer for the discrete CDF chart.
 * Calculates the exact cumulative probability up to the hovered X value.
 */
const renderCDFTooltip = ({
  active,
  label,
  data,
  xLabel,
  yLabel,
  minX,
  maxX,
}) => {
  if (active && label !== null && label !== undefined) {
    if (label < minX || label > maxX) return null;

    let cdfValue = 0;
    const sorted = [...data].sort((a, b) => a.x - b.x);
    for (const item of sorted) {
      if (item.x <= label) {
        cdfValue += item.p;
      } else {
        break;
      }
    }

    const correctedValue = Math.round(cdfValue * 10000) / 10000;
    const correctedPayload = [
      {
        value: correctedValue,
        payload: { x: label, y: correctedValue },
      },
    ];

    return (
      <CustomTooltip
        active={active}
        label={label}
        payload={correctedPayload}
        xLabel={xLabel}
        yLabel={yLabel}
      />
    );
  }
  return null;
};

/**
 * @component StyledDiscreteCDFChart
 * @description Renders a discrete Cumulative Distribution Function (CDF) chart using Recharts. It generates step-function lines and handles open/closed interval visualization.
 * @param {Object} props
 * @param {Array} props.data - Dataset containing discrete values (x) and probabilities (p).
 * @param {number|string|null} props.hoverX - Active X value for cross-chart highlight synchronization.
 * @param {Function} props.setHoverX - Callback to update the hover state.
 * @param {string} [props.xLabel="x"] - Label for the X-axis.
 * @param {string} [props.yLabel="F(x)"] - Label for the Y-axis.
 */
function StyledDiscreteCDFChart({
  data,
  hoverX,
  setHoverX,
  xLabel = "x",
  yLabel = "F(x)",
}) {
  // Calculate domain boundaries based on the dataset
  const { minX, maxX } = useMemo(() => {
    if (!data || data.length === 0) return { minX: 0, maxX: 1 };
    const sortedX = data.map((d) => d.x).sort((a, b) => a - b);
    return { minX: sortedX[0], maxX: sortedX[sortedX.length - 1] };
  }, [data]);

  // Generate points for step lines, open/closed interval circles, and dynamic X-axis ticks
  const { cdfPoints, openCircleData, closedCircleData, xTicks } =
    useMemo(() => {
      if (!data || data.length === 0)
        return {
          cdfPoints: [],
          openCircleData: [],
          closedCircleData: [],
          xTicks: [],
        };

      let currentCDF = 0;
      const sortedData = [...data].sort((a, b) => a.x - b.x);

      const points = [];
      const openData = [];
      const closedData = [];
      const ticks = [];

      points.push({ x: minX - 1, y: 0 });
      points.push({ x: minX, y: 0 });
      points.push({ x: minX, y: null });

      openData.push({ x: minX, y: 0 });
      ticks.push(minX);

      sortedData.forEach((item, i) => {
        const x_i = item.x;
        const p_i = item.p;

        currentCDF += p_i;
        const y_val = Math.round(currentCDF * 10000) / 10000;

        closedData.push({ x: x_i, y: y_val });

        const nextX = sortedData[i + 1]?.x;
        const endX = nextX !== undefined ? nextX : x_i + 1;

        points.push({ x: x_i, y: y_val });
        points.push({ x: endX, y: y_val });
        points.push({ x: endX, y: null });

        if (nextX !== undefined) {
          openData.push({ x: endX, y: y_val });
          ticks.push(nextX);
        } else {
          ticks.push(endX);
        }
      });

      const uniqueTicks = Array.from(new Set(ticks.sort((a, b) => a - b)));

      return {
        cdfPoints: points,
        openCircleData: openData,
        closedCircleData: closedData,
        xTicks: uniqueTicks,
      };
    }, [data, minX]);

  /**
   * Extracts hovered label and updates shared state.
   * Required for highlighting reference lines across multiple synchronized charts.
   */
  const handleChartInteraction = (state) => {
    if (
      state &&
      state.isTooltipActive &&
      state.activeLabel !== undefined &&
      state.activeLabel !== null
    ) {
      const labelNum = Number(state.activeLabel);
      if (!isNaN(labelNum)) {
        if (setHoverX) setHoverX(String(Math.round(labelNum)));
      }
    }
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ComposedChart
        margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
        onMouseMove={handleChartInteraction}
        onTouchMove={handleChartInteraction}
        onTouchStart={handleChartInteraction}
        onClick={handleChartInteraction}
        onMouseLeave={() => setHoverX && setHoverX(null)}
      >
        {/* Base Grid & Axes */}
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="x"
          type="number"
          domain={[minX - 0.5, maxX + 1.5]}
          ticks={xTicks}
        >
          <Label value={xLabel} position="insideBottom" offset={-15} />
        </XAxis>
        <YAxis domain={[0, 1.1]} ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}>
          <Label
            value={yLabel}
            angle={-90}
            position="insideLeft"
            offset={-10}
            style={{ textAnchor: "middle" }}
          />
        </YAxis>

        <Tooltip
          cursor={false}
          content={(props) =>
            renderCDFTooltip({
              ...props,
              data,
              xLabel: xLabel,
              yLabel: yLabel,
              minX,
              maxX,
            })
          }
        />

        {/* Continuous step lines connecting intervals */}
        <Line
          data={cdfPoints}
          type="linear"
          dataKey="y"
          stroke="var(--bs-primary)"
          strokeWidth={2}
          dot={false}
          activeDot={false}
          connectNulls={false}
          isAnimationActive={true}
          animationDuration={700}
        />

        {/* Open interval circles (limits) */}
        <Line
          data={openCircleData}
          type="linear"
          dataKey="y"
          stroke="none"
          activeDot={false}
          isAnimationActive={true}
          animationDuration={700}
          dot={(props) => {
            const { cx, cy, index } = props;
            if (cx == null || cy == null) return null;
            return (
              <circle
                key={`open-${index}`}
                cx={cx}
                cy={cy}
                r={4}
                fill="var(--bs-body-bg, white)"
                stroke="var(--bs-primary)"
                strokeWidth={2}
              />
            );
          }}
        />

        {/* Closed interval circles (exact values) */}
        <Line
          data={closedCircleData}
          type="linear"
          dataKey="y"
          stroke="none"
          activeDot={false}
          isAnimationActive={true}
          animationDuration={700}
          dot={(props) => {
            const { cx, cy, index, payload } = props;
            if (cx == null || cy == null) return null;
            const isHovered = hoverX !== null && Number(hoverX) === payload.x;
            return (
              <circle
                key={`closed-${index}`}
                cx={cx}
                cy={cy}
                r={isHovered ? 5 : 4}
                fill="var(--bs-primary)"
                stroke={isHovered ? "var(--bs-body-color, black)" : "none"}
                strokeWidth={isHovered ? 2 : 0}
              />
            );
          }}
        />

        {/* Synchronized Reference Line */}
        {hoverX !== null && (
          <ReferenceLine
            x={Number(hoverX)}
            stroke="var(--bs-danger, red)"
            strokeDasharray="5 5"
          />
        )}
      </ComposedChart>
    </ResponsiveContainer>
  );
}

export default StyledDiscreteCDFChart;
