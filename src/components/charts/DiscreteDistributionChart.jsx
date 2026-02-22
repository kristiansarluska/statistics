// src/components/charts/DiscreteDistributionChart.jsx
import React, { useState, useMemo } from "react";
import {
  LineChart,
  Line,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import StyledBarChart from "./StyledBarChart";
import CustomTooltip from "./CustomTooltip"; // Potrebujeme aj tento pre CDF graf
import "../../styles/charts.css";

// --- Render funkcie pre krúžky ---
const renderOpenCircle = (props) => {
  const { cx, cy, fill } = props; // Použijeme fill pre farbu OKRAJA
  // console.log("Open Circle:", cx, cy); // Debug
  return (
    <circle cx={cx} cy={cy} r={5} fill="white" stroke={fill} strokeWidth={2} />
  );
};
const renderClosedCircle = (props) => {
  const { cx, cy, fill } = props; // Použijeme fill pre farbu VÝPLNE
  // console.log("Closed Circle:", cx, cy); // Debug
  return <circle cx={cx} cy={cy} r={5} fill={fill} />;
};
// --- Predvolené dáta ---
const defaultData = [
  { x: 0, p: 0.03125 },
  { x: 1, p: 0.15625 },
  { x: 2, p: 0.3125 },
  { x: 3, p: 0.3125 },
  { x: 4, p: 0.15625 },
  { x: 5, p: 0.03125 },
];

function DiscreteDistributionChart({ data = defaultData }) {
  // --- PMF dáta ---
  const pmfData = useMemo(() => {
    if (!data || data.length === 0) return [];
    return data.map((item) => ({ x: String(item.x), y: item.p }));
  }, [data]);

  // --- Definícia minX a maxX ---
  const { minX, maxX } = useMemo(() => {
    if (!data || data.length === 0) return { minX: 0, maxX: 1 };
    const sortedX = data.map((d) => d.x).sort((a, b) => a - b);
    return { minX: sortedX[0], maxX: sortedX[sortedX.length - 1] };
  }, [data]);

  // --- Pomocné zoradené dáta pre CustomStepDot ---
  const sortedDataForDot = useMemo(() => {
    if (!data || data.length === 0) return [];
    return [...data].sort((a, b) => a.x - b.x);
  }, [data]);

  // --- CDF dáta, krúžky, ticks ---
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
      const points = []; // Body pre Line type="stepAfter"
      const openData = [];
      const closedData = [];
      const ticks = [];

      // Použijeme minX a maxX definované vyššie
      const localMinX = minX;
      const localMaxX = maxX;

      // 1. Začiatok čiary
      points.push({ x: localMinX - 1, y: 0 }); // Segment pred minX
      points.push({ x: localMinX, y: 0 }); // Bod na (minX, 0)
      closedData.push({ x: localMinX, y: 0 }); // Zatvorený krúžok na (minX, 0)
      ticks.push(localMinX);

      // 2. Body pre schody a krúžky
      sortedData.forEach((item, i) => {
        const x_i = item.x;
        const p_i = item.p;
        const y_before = currentCDF;

        // Otvorený krúžok na začiatku skoku (dole)
        openData.push({ x: x_i, y: y_before });

        // Aktualizácia CDF
        currentCDF += p_i;
        const y_after = currentCDF;

        // Zatvorený krúžok na vrchole skoku
        closedData.push({ x: x_i, y: y_after });

        // Body pre čiaru stepAfter
        points.push({ x: x_i, y: y_after }); // Bod, kde čiara skočí hore
        const nextX = sortedData[i + 1]?.x;
        const endX = nextX ?? x_i + 1;
        points.push({ x: endX, y: y_after }); // Bod, ktorý definuje koniec horizontálneho segmentu

        if (nextX !== undefined) {
          ticks.push(nextX);
        } else {
          ticks.push(endX);
        }
      });

      // 3. Koniec čiary
      points.push({ x: localMaxX + 2, y: currentCDF }); // Potiahnutie doprava

      // Odstránime prvý otvorený krúžok na (minX, 0)
      if (
        openData.length > 0 &&
        openData[0].x === localMinX &&
        openData[0].y === 0
      ) {
        openData.shift();
      }

      // Unikátne ticky
      const uniqueTicks = Array.from(new Set(ticks.sort((a, b) => a - b)));

      return {
        cdfPoints: points,
        openCircleData: openData,
        closedCircleData: closedData,
        xTicks: uniqueTicks,
      };
    }, [data, minX, maxX]); // Pridané minX, maxX

  if (!data || data.length === 0) {
    return <div>Chýbajú dáta pre diskrétne rozdelenie.</div>;
  }

  return (
    <div className="charts-wrapper">
      {/* PMF Graf */}
      <div>
        <h3>Pravdepodobnostná funkcia (PMF)</h3>
        <StyledBarChart
          data={pmfData}
          xLabel="x"
          yLabel="P(X=x)"
          yDomain={[0, "auto"]}
        />
      </div>

      {/* CDF Graf */}
      <div>
        <h3>Distribučná funkcia (CDF)</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart
            data={cdfPoints}
            margin={{ top: 20, right: 30, left: 20, bottom: 25 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
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
              domain={[0, "auto"]}
            />

            {/* Využitie nášho nového CustomTooltip pre CDF */}
            <Tooltip content={<CustomTooltip xLabel="x" yLabel="F(x)" />} />

            <Line
              type="stepAfter"
              dataKey="y"
              stroke="var(--bs-primary)"
              fill="var(--bs-primary)"
              strokeWidth={2}
              dot={false}
              isAnimationActive={false}
            />
            <Scatter
              name="Open"
              data={openCircleData}
              fill="var(--bs-primary)"
              shape={renderOpenCircle}
              isAnimationActive={false}
            />
            <Scatter
              name="Closed"
              data={closedCircleData}
              fill="var(--bs-primary)"
              shape={renderClosedCircle}
              isAnimationActive={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default DiscreteDistributionChart;
