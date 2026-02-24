// src/components/charts/StyledLineChart.jsx
import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea, // Importuj ReferenceArea
  ResponsiveContainer,
  // Area, // Area už nepotrebujeme
} from "recharts";
import "../../styles/charts.css";
import CustomTooltip, { formatNumberSmart } from "./CustomTooltip";

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
  showReferenceArea = false, // <-- NOVÝ PROP s predvolenou hodnotou false
}) {
  const [animated, setAnimated] = useState(true);
  const prevDataRef = useRef([]);
  const displayYLabel = yLabel || (type === "cdf" ? "F(x)" : "f(x)");

  // Logika pre formátovanie a mouse move/leave zostáva rovnaká
  useEffect(() => {
    if (JSON.stringify(prevDataRef.current) !== JSON.stringify(data)) {
      setAnimated(true);
      prevDataRef.current = data;
    } else {
      setAnimated(false);
    }
  }, [data, hoverX]);

  const handleMouseMove = (state) => {
    if (state && state.activePayload && state.activePayload.length > 0) {
      const currentX = state.activePayload[0].payload.x;
      if (hoverX !== currentX) {
        setHoverX(currentX);
      }
    } else if (state && state.activeLabel !== undefined) {
      const roundedX = parseFloat(state.activeLabel.toFixed(2));
      if (hoverX !== roundedX) {
        setHoverX(roundedX);
      }
    }
  };
  const handleMouseLeave = () => setHoverX(null);

  // Odstránili sme useMemo pre dataWithFill, už ho nepotrebujeme

  const cdfRefLineY = useMemo(() => {
    // Táto logika pre CDF zostáva
    if (type !== "cdf" || hoverX === null) return null;
    let pointY = null;
    let closestPoint = null;
    let minDiff = Infinity;

    for (const point of data) {
      const diff = Math.abs(point.x - hoverX);
      if (diff < minDiff) {
        minDiff = diff;
        closestPoint = point;
      }
      if (point.x >= hoverX) {
        pointY = point.y;
        break;
      }
    }
    if (pointY === null && data.length > 0) {
      pointY = closestPoint ? closestPoint.y : data[data.length - 1].y;
    }
    return pointY;
  }, [data, hoverX, type]);

  // Určíme začiatočnú X súradnicu pre ReferenceArea
  // Ak máme minX, použijeme ho, inak prvý bod z dát alebo 0
  const areaStartX = minX ?? (data.length > 0 ? data[0].x : 0);

  return (
    <div className="chart-container">
      {title && <div className="chart-title">{title}</div>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          // Použijeme priamo pôvodné dáta
          data={data}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          margin={{ top: 5, right: 30, left: 20, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="x"
            type="number"
            domain={
              minX !== null && maxX !== null ? [minX, maxX] : ["auto", "auto"]
            }
            // TOTO JE MÁGIA: 9 bodov znamená 8 úsekov.
            // Ideálne pre grafy +- 4 sigma. Recharts to automaticky prepočíta.
            tickCount={9}
            // Ak by niekedy Recharts vymýšľal vlastné kroky, môžeme to vynútiť:
            allowDecimals={true}
            label={{ value: xLabel, position: "insideBottom", offset: -15 }}
            className="chart-axis"
            tickFormatter={formatNumberSmart} // Vizuálne zaokrúhlenie
            allowDuplicatedCategory={false}
          />
          <YAxis
            label={{
              value: displayYLabel,
              angle: -90,
              position: "insideLeft",
              offset: -10,
            }}
            className="chart-axis"
            tickFormatter={formatNumberSmart}
            domain={yAxisDomain || [0, "auto"]}
            tickCount={6}
            allowDataOverflow={false}
          />
          <Tooltip
            content={<CustomTooltip xLabel={xLabel} yLabel={displayYLabel} />}
            cursor={false}
            animationDuration={50}
          />

          {/* Vertikálna čiara zostáva */}
          {hoverX !== null && (
            <ReferenceLine
              x={hoverX}
              stroke="red"
              strokeWidth={1}
              strokeDasharray="5 5"
              ifOverflow="extendDomain"
            />
          )}

          {/* Horizontálna čiara pre CDF zostáva */}
          {type === "cdf" && cdfRefLineY !== null && (
            <ReferenceLine
              y={cdfRefLineY}
              stroke="red"
              strokeWidth={1}
              strokeDasharray="3 3"
              ifOverflow="extendDomain"
            />
          )}

          {/* NOVÉ: Použitie ReferenceArea namiesto Area pre PDF */}
          {showReferenceArea && type === "pdf" && hoverX !== null && (
            <ReferenceArea
              x1={areaStartX} // Začiatok plochy
              x2={hoverX} // Koniec plochy pri hoveri
              y1={0} // Začiatok Y na osi
              // y2 sa nenastavuje, nech sa roztiahne po vrch grafu
              fill="rgba(0, 140, 186, 0.2)" // Farba výplne
              stroke="none"
              ifOverflow="hidden" // Nech nepreteká mimo definovaný domain
              isAnimationActive={false} // Vypneme animáciu pre plynulosť
            />
          )}

          <Line
            type="monotone"
            dataKey="y"
            className={lineClass}
            strokeWidth={2}
            dot={false}
            isAnimationActive={animated}
            animationDuration={animated ? 700 : 0}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StyledLineChart;
