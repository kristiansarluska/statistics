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
} from "recharts";
import CustomTooltip from "./CustomTooltip";
import { getAxisConfig } from "../../../utils/distributions";

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
  const rX1 = referenceAreaX1 !== undefined ? referenceAreaX1 : hoverX;
  const rX2 = referenceAreaX2 !== undefined ? referenceAreaX2 : hoverX;

  const maxDataY = useMemo(() => {
    if (customMaxY !== null) return customMaxY;
    if (!data || data.length === 0) return 0.1;
    return Math.max(...data.map((d) => d[barDataKey] || 0));
  }, [data, barDataKey, customMaxY]);

  const yDomainMin = Array.isArray(yDomain) ? yDomain[0] : 0;
  const yDomainMax = Array.isArray(yDomain) ? yDomain[1] : "auto";

  const yConfig = getAxisConfig(maxDataY, yDomainMin, yDomainMax, 0);

  const formatXTick = (val) => {
    if (val === null || val === undefined) return "";
    const numericVal = Number(val);
    if (isNaN(numericVal)) return val;
    return Number(numericVal.toFixed(4));
  };

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
        data={data} // Použitie čistých dát bez vnucovania fill farby
        margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
        onMouseMove={handleChartInteraction}
        onTouchMove={handleChartInteraction}
        onTouchStart={handleChartInteraction}
        onClick={handleChartInteraction}
        onMouseLeave={() => setHoverX && setHoverX(null)}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="x"
          label={{ value: xLabel, position: "insideBottom", offset: -15 }}
          tickFormatter={formatXTick}
        />
        <YAxis
          domain={yConfig.domain}
          ticks={yConfig.ticks}
          label={{
            value: yLabel,
            angle: -90,
            position: "insideLeft",
            offset: -10,
          }}
          tickFormatter={yConfig.formatTick}
        />

        <Tooltip
          cursor={
            showReferenceArea ? false : <AnimatedCursor fillOpacity={0.1} />
          }
          content={<CustomTooltip xLabel={xLabel} yLabel={yLabel} />}
          animationDuration={200}
        />

        {showReferenceArea && hoverX !== null && hoverX !== undefined && (
          <ReferenceArea
            x1={rX1}
            x2={rX2}
            fill="var(--bs-primary)"
            fillOpacity={0.1}
          />
        )}

        {children ? (
          children
        ) : (
          <Bar
            dataKey={barDataKey}
            fill="var(--bs-primary)" // Definovanie default farby tu
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
