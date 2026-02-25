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

// Custom komponent pre plynulý posun sivého kurzora (zvýraznenia stĺpca)
const AnimatedCursor = (props) => {
  const { x, y, width, height, fillOpacity } = props;

  // Ošetrenie chýbajúcich súradníc
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
}) {
  const formattedData = useMemo(() => {
    if (!data) return [];
    return data.map((entry) => ({
      ...entry,
      fill: entry.fill || "var(--bs-primary)",
    }));
  }, [data]);

  const rX1 = referenceAreaX1 !== undefined ? referenceAreaX1 : hoverX;
  const rX2 = referenceAreaX2 !== undefined ? referenceAreaX2 : hoverX;

  const maxDataY = useMemo(() => {
    if (!data || data.length === 0) return 0.1;
    return Math.max(...data.map((d) => d[barDataKey] || 0));
  }, [data, barDataKey]);

  const yDomainMin = Array.isArray(yDomain) ? yDomain[0] : 0;
  const yDomainMax = Array.isArray(yDomain) ? yDomain[1] : "auto";

  // Aplikovanie logiky pre os Y
  const yConfig = getAxisConfig(maxDataY, yDomainMin, yDomainMax, 0);

  // X os pre stĺpcové grafy je diskrétna, len ju zbavíme chýb pretečenia
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

  const handleMouseLeave = () => {
    if (setHoverX) setHoverX(null);
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={formattedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
        onMouseMove={handleChartInteraction}
        onTouchMove={handleChartInteraction}
        onTouchStart={handleChartInteraction}
        onClick={handleChartInteraction}
        onMouseLeave={handleMouseLeave}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="x"
          label={{ value: xLabel, position: "insideBottom", offset: -15 }}
          tickFormatter={formatXTick}
        />
        <YAxis
          domain={yConfig.domain}
          ticks={yConfig.ticks} // Os je teraz absolútne presná
          label={{
            value: yLabel,
            angle: -90,
            position: "insideLeft",
            offset: -10,
          }}
          tickFormatter={yConfig.formatTick}
        />

        <Tooltip
          // Ak je zapnutá ReferenceArea, kurzor sa nezobrazuje, inak vložíme náš vlastný AnimatedCursor
          cursor={
            showReferenceArea ? false : <AnimatedCursor fillOpacity={0.1} />
          }
          content={<CustomTooltip xLabel={xLabel} yLabel={yLabel} />}
          animationDuration={200} // Zladenie interného zobrazenia s CSS prechodom
        />

        {showReferenceArea && hoverX !== null && hoverX !== undefined && (
          <ReferenceArea
            x1={rX1}
            x2={rX2}
            fill="var(--bs-primary)"
            fillOpacity={0.1}
          />
        )}

        <Bar
          dataKey={barDataKey}
          maxBarSize={maxBarSize}
          isAnimationActive={true}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default StyledBarChart;
