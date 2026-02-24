// src/components/charts/StyledBarChart.jsx
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

function StyledBarChart({
  data,
  xLabel,
  yLabel,
  yDomain = [0, "auto"],
  maxBarSize = 60,
  hoverX,
  setHoverX,
  showReferenceArea = false,
  referenceAreaX1, // Pridaný parameter pre začiatok zvýraznenia
  referenceAreaX2, // Pridaný parameter pre koniec zvýraznenia
  barDataKey = "y",
}) {
  const formattedData = useMemo(() => {
    if (!data) return [];
    return data.map((entry) => ({
      ...entry,
      fill: entry.fill || "var(--bs-primary)",
    }));
  }, [data]);

  // Ak nepríde špecifická hranica, použijeme aktuálny hoverX
  const rX1 = referenceAreaX1 !== undefined ? referenceAreaX1 : hoverX;
  const rX2 = referenceAreaX2 !== undefined ? referenceAreaX2 : hoverX;

  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart
        data={formattedData}
        margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
        onMouseMove={(state) => {
          if (
            setHoverX &&
            state &&
            state.isTooltipActive &&
            state.activeLabel !== undefined &&
            state.activeLabel !== null
          ) {
            setHoverX(String(state.activeLabel));
          }
        }}
        onMouseLeave={() => {
          if (setHoverX) setHoverX(null);
        }}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="x"
          label={{ value: xLabel, position: "insideBottom", offset: -15 }}
        />
        <YAxis
          domain={yDomain}
          label={{
            value: yLabel,
            angle: -90,
            position: "insideLeft",
            offset: -10,
          }}
        />

        {/* Priehľadný kurzor (fillOpacity: 0.1) pre štandardné stĺpcové grafy, vypnutý ak showReferenceArea=true */}
        <Tooltip
          cursor={
            showReferenceArea
              ? false
              : { fill: "var(--bs-secondary, gray)", fillOpacity: 0.1 }
          }
          content={<CustomTooltip xLabel={xLabel} yLabel={yLabel} />}
        />

        {/* Vykreslenie oblasti prepojenej s iným grafom */}
        {showReferenceArea && hoverX !== null && hoverX !== undefined && (
          <ReferenceArea
            x1={rX1}
            x2={rX2}
            fill="var(--bs-primary)"
            fillOpacity={0.1}
          />
        )}

        <Bar dataKey={barDataKey} maxBarSize={maxBarSize} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export default StyledBarChart;
