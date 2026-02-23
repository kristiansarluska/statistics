// src/components/charts/DiscreteDistributionChart.jsx
import React, { useState, useMemo } from "react";
import {
  ComposedChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceArea,
} from "recharts";
import StyledBarChart from "./StyledBarChart";
import CustomTooltip from "./CustomTooltip";
import "../../styles/charts.css";

// --- Custom shape renderers for open and closed circles ---
const renderOpenCircle = (props) => {
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
};

const renderClosedCircle = (props) => {
  const { cx, cy, index } = props;
  if (cx == null || cy == null) return null;
  return (
    <circle
      key={`closed-${index}`}
      cx={cx}
      cy={cy}
      r={4}
      fill="var(--bs-primary)"
    />
  );
};

// --- Custom mathematically correct Tooltip wrapping CustomTooltip ---
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
    // Hide tooltip for artificial boundary points
    if (label < minX || label > maxX) {
      return null;
    }

    let cdfValue = 0;
    // Calculate right-continuous CDF value mathematically for exactly this x
    const sorted = [...data].sort((a, b) => a.x - b.x);
    for (const item of sorted) {
      if (item.x <= label) {
        cdfValue += item.p;
      } else {
        break;
      }
    }

    // Create an artificial payload that mimics Recharts native structure
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

// --- Default data fallback ---
const defaultData = [
  { x: 0, p: 0.03125 },
  { x: 1, p: 0.15625 },
  { x: 2, p: 0.3125 },
  { x: 3, p: 0.3125 },
  { x: 4, p: 0.15625 },
  { x: 5, p: 0.03125 },
];

function DiscreteDistributionChart({ data = defaultData }) {
  // --- Shared hover state for linking charts ---
  const [hoverX, setHoverX] = useState(null);

  // --- Calculate PMF data ---
  const pmfData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((item) => ({ x: String(item.x), y: item.p }));
  }, [data]);

  // --- Determine X-axis boundaries ---
  const { minX, maxX } = useMemo(() => {
    if (!data || data.length === 0) return { minX: 0, maxX: 1 };
    const sortedX = data.map((d) => d.x).sort((a, b) => a - b);
    return { minX: sortedX[0], maxX: sortedX[sortedX.length - 1] };
  }, [data]);

  // --- Generate CDF points, intervals, and axis ticks ---
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

      const localMinX = minX;

      // 1. Initial horizontal line from the left
      points.push({ x: localMinX - 1, y: 0 });
      points.push({ x: localMinX, y: 0 });
      points.push({ x: localMinX, y: null }); // Break line

      openData.push({ x: localMinX, y: 0 });
      ticks.push(localMinX);

      // 2. Generate steps and interval markers
      sortedData.forEach((item, i) => {
        const x_i = item.x;
        const p_i = item.p;

        currentCDF += p_i;
        const y_val = Math.round(currentCDF * 10000) / 10000;

        // Closed interval marker at the start of the step
        closedData.push({ x: x_i, y: y_val });

        const nextX = sortedData[i + 1]?.x;
        const endX = nextX !== undefined ? nextX : x_i + 1;

        // Step segments exactly on boundaries
        points.push({ x: x_i, y: y_val });
        points.push({ x: endX, y: y_val });
        points.push({ x: endX, y: null }); // Break line

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
    }, [data, minX, maxX]);

  if (!data || data.length === 0) {
    return <div>Missing discrete distribution data.</div>;
  }

  return (
    <div className="charts-wrapper">
      {/* PMF Chart */}
      <div>
        <h3>Pravdepodobnostná funkcia (PMF)</h3>
        <StyledBarChart
          data={pmfData}
          xLabel="x"
          yLabel="P(X=x)"
          yDomain={[0, "auto"]}
          hoverX={hoverX}
          setHoverX={setHoverX}
        />
      </div>

      {/* CDF Chart */}
      <div>
        <h3>Distribučná funkcia (CDF)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart
            margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
            onMouseMove={(state) => {
              if (
                state &&
                state.isTooltipActive &&
                state.activeLabel !== undefined
              ) {
                // Determine hovered integer x and pass to shared state as string
                const labelNum = Number(state.activeLabel);
                if (!isNaN(labelNum)) {
                  setHoverX(String(Math.round(labelNum)));
                }
              }
            }}
            onMouseLeave={() => setHoverX(null)}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />

            <XAxis
              dataKey="x"
              type="number"
              domain={[minX - 0.5, maxX + 1.5]}
              ticks={xTicks}
              allowDuplicatedCategory={false}
              label={{ value: "x", position: "insideBottom", offset: -15 }}
            />
            <YAxis
              label={{
                value: "F(x)",
                angle: -90,
                position: "insideLeft",
                offset: -10,
              }}
              domain={[0, 1.1]}
              ticks={[0, 0.2, 0.4, 0.6, 0.8, 1.0]}
            />

            {/* Injected CustomTooltip wrapper with boundaries */}
            <Tooltip
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

            {/* Reference area to visualize hover linkage from PMF chart */}
            {hoverX !== null && hoverX !== undefined && (
              <ReferenceArea
                x1={Number(hoverX) - 0.5}
                x2={Number(hoverX) + 0.5}
                fill="var(--bs-primary)"
                fillOpacity={0.1}
              />
            )}

            {/* Main steps line */}
            <Line
              data={cdfPoints}
              type="linear"
              dataKey="y"
              stroke="var(--bs-primary)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
              connectNulls={false}
            />

            {/* Open circles */}
            <Line
              data={openCircleData}
              type="linear"
              dataKey="y"
              stroke="none"
              dot={renderOpenCircle}
              activeDot={false}
              isAnimationActive={false}
            />

            {/* Closed circles */}
            <Line
              data={closedCircleData}
              type="linear"
              dataKey="y"
              stroke="none"
              dot={renderClosedCircle}
              activeDot={false}
              isAnimationActive={false}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DiscreteDistributionChart;
