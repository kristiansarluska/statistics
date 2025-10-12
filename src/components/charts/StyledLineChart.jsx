import React, { useEffect, useRef, useState } from "react";
import {
  LineChart,
  Line,
  ReferenceLine,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "../../styles/charts.css";

/**
 * Wrapper pre jednotný štýl grafov
 * @param {Array} data - dáta vo formáte [{ x: number, y: number }]
 * @param {string} title - názov grafu
 * @param {string} xLabel - popis osi X
 * @param {string} yLabel - popis osi Y
 * @param {string} lineClass - CSS trieda pre čiaru (default: chart-line-primary)
 * @param {number|null} hoverX - hodnota X, nad ktorou sa nachádza kurzor
 * @param {function} setHoverX - funkcia na nastavenie hodnoty hoverX
 */
function StyledLineChart({
  data,
  title,
  xLabel = "x",
  yLabel = "y",
  lineClass = "chart-line-primary",
  hoverX = null,
  setHoverX = () => {},
}) {
  const [animated, setAnimated] = useState(true);
  const prevDataRef = useRef([]);

  //  Inteligentné formátovanie čísel pre tooltip
  //  Inteligentné formátovanie čísel pre tooltip
  const formatNumberSmart = (num) => {
    if (num === null || num === undefined || isNaN(num)) return "-";

    const abs = Math.abs(num);
    if (abs === 0) return "0.00";

    // väčšie alebo rovné 0.1 → 2 desatinné miesta
    if (abs >= 0.1) return num.toFixed(2);

    // medzi 0.001 a 0.1 → 4 desatinné miesta
    if (abs >= 0.001) return num.toFixed(4);

    // menšie než 0.001 → zobraz viac, kým nie sú aspoň dve nenulové číslice
    const str = num.toExponential(10); // vedecký zápis, napr. 3.2658e-5
    const fixed = num.toFixed(10).replace(/0+$/, ""); // bežný zápis
    const match = fixed.match(/0\.0*(\d{2,})/);

    if (match) {
      const nonZeroDigits = match[1];
      const decimalsNeeded =
        nonZeroDigits.length + (match[0].length - match[1].length);
      return num.toFixed(Math.min(decimalsNeeded, 8));
    }

    return str;
  };

  // Ak sa zmenili dáta (nie iba hover), spusti animáciu
  useEffect(() => {
    if (JSON.stringify(prevDataRef.current) !== JSON.stringify(data)) {
      setAnimated(true);
      prevDataRef.current = data;
    } else {
      setAnimated(false);
    }
  }, [data]);

  const handleMouseMove = (state) => {
    if (state && state.activeLabel !== undefined) {
      setHoverX(state.activeLabel);
    }
  };

  const handleMouseLeave = () => {
    setHoverX(null);
  };

  return (
    <div className="chart-container">
      {title && <div className="chart-title">{title}</div>}
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={data}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="x"
            type="number"
            label={{ value: xLabel, position: "insideBottomRight", offset: -5 }}
            className="chart-axis"
            tickFormatter={(value) => formatNumberSmart(value)}
          />
          <YAxis
            label={{ value: yLabel, angle: -90, position: "insideLeft" }}
            className="chart-axis"
            tickFormatter={(value) => formatNumberSmart(value)}
          />
          <Tooltip
            formatter={(value) => formatNumberSmart(value)}
            labelFormatter={(label) => formatNumberSmart(label)}
          />
          {hoverX !== null && (
            <ReferenceLine x={hoverX} stroke="red" strokeDasharray="3 3" />
          )}
          <Line
            type="monotone"
            dataKey="y"
            className={lineClass}
            dot={false}
            isAnimationActive={animated}
            animationDuration={700}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StyledLineChart;
