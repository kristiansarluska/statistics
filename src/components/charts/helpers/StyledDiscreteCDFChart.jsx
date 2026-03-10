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
} from "recharts";
import CustomTooltip from "./CustomTooltip";

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

function StyledDiscreteCDFChart({ data, hoverX, setHoverX }) {
  const { minX, maxX } = useMemo(() => {
    if (!data || data.length === 0) return { minX: 0, maxX: 1 };
    const sortedX = data.map((d) => d.x).sort((a, b) => a - b);
    return { minX: sortedX[0], maxX: sortedX[sortedX.length - 1] };
  }, [data]);

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
        onMouseLeave={() => setHoverX && setHoverX(null)}
      >
        <CartesianGrid strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="x"
          type="number"
          domain={[minX - 0.5, maxX + 1.5]}
          ticks={xTicks}
          label={{ value: "x", position: "insideBottom", offset: -15 }}
        />
        <YAxis
          domain={[0, 1.1]}
          ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
          label={{
            value: "F(x)",
            angle: -90,
            position: "insideLeft",
            offset: -10,
          }}
        />
        <Tooltip
          cursor={false}
          content={(props) =>
            renderCDFTooltip({
              ...props,
              data,
              xLabel: "x",
              yLabel: "F(x)",
              minX,
              maxX,
            })
          }
        />
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
