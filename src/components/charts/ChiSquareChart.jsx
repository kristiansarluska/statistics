// src/components/charts/ChiSquareChart.jsx
import React, { useState, useMemo, useEffect } from "react";
import { chiSquarePDF } from "../../utils/distributions";
import StyledLineChart from "./StyledLineChart";
import useDebouncedValue from "../../hooks/useDebouncedValue";
import "../../styles/charts.css";

// Formatter pre ticky osí (zostáva)
const formatTick = (value) => {
  if (value === 0) return "0";
  if (Math.abs(value) < 0.01 && value !== 0) return value.toExponential(1);
  // Pre Y-os, chceme viac desatinných miest pre malé hodnoty hustoty
  if (Math.abs(value) < 1) return value.toFixed(2);
  return value.toFixed(1);
};

function ChiSquareChart() {
  // Použijeme hook s validátorom a postValidationAction
  const [kInput, kDebounced, setKValue] = useDebouncedValue("5", 1000); // initialValue='5', delay=1000ms

  // Validátor: Povolí prázdny string alebo kladné celé číslo (bez horného limitu tu)
  const validateKFormat = (value) => {
    const trimmedValue = String(value).trim();
    if (trimmedValue === "") return true; // Prázdny je ok pre input
    // Musí byť len z číslic a kladné
    return /^\d+$/.test(trimmedValue) && parseInt(trimmedValue, 10) > 0;
  };

  // Akcia po validácii: Prevedie na číslo a obmedzí na max 50
  const parseAndClampK = (value) => {
    // Validator zaručil, že 'value' je string reprezentujúci kladné celé číslo
    const num = parseInt(value, 10);
    return Math.min(num, 50); // Vráti číslo obmedzené na 50
  };

  const [hoverX, setHoverX] = useState(null);

  // kNumeric berie priamo debounced hodnotu, ktorá je už číslo vďaka parseAndClampK
  const kNumeric = useMemo(() => kDebounced || 1, [kDebounced]); // Fallback na 1

  // Výpočet dát pre graf (zostáva rovnaký, používa kNumeric)
  const chartData = useMemo(() => {
    const dataPoints = [];
    const maxX = Math.max(20, kNumeric + 5 * Math.sqrt(2 * kNumeric));
    const step = maxX / 200;
    for (let x = step; x <= maxX; x += step) {
      const y = chiSquarePDF(x, kNumeric);
      if (!isNaN(y) && isFinite(y)) {
        dataPoints.push({ x: parseFloat(x.toFixed(2)), y: y });
      }
    }
    if (kNumeric > 2 && dataPoints.length > 0 && dataPoints[0].x > step / 2) {
      dataPoints.unshift({ x: 0, y: 0 });
    }
    return dataPoints;
  }, [kNumeric]);

  // Nájdenie maxima Y pre škálovanie osi (zostáva rovnaké)
  const { minY, maxY, minX, maxX } = useMemo(() => {
    if (!chartData || chartData.length === 0)
      return { minY: 0, maxY: 1, minX: 0, maxX: 10 };
    const ys = chartData.map((p) => p.y);
    const xs = chartData.map((p) => p.x);
    const calculatedMaxY = Math.max(...ys.filter((y) => isFinite(y)), 0); // Filter pre prípad Infinity pri k=1
    return {
      minY: 0,
      maxY: calculatedMaxY > 0 ? calculatedMaxY * 1.1 : 0.5,
      minX: 0,
      maxX: Math.max(...xs),
    };
  }, [chartData]);

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-4">
      {/* Ovládanie stupňov voľnosti */}
      <div className="controls mb-3">
        <label className="d-flex align-items-center">
          Stupne voľnosti (k):
          <input
            type="number" // Môže zostať number, ale validácia sa deje v JS
            min="1"
            step="1" // Len celé čísla
            value={kInput} // Hodnota pre input
            // Voláme setValue s options objektom
            onChange={(e) =>
              setKValue(e.target.value, {
                validator: validateKFormat,
                postValidationAction: parseAndClampK,
              })
            }
            style={{ width: "80px", marginLeft: "10px" }}
          />
        </label>
      </div>

      {/* Použitie StyledLineChart */}
      <div
        className="chart-container"
        style={{ width: "100%", minWidth: "300px", maxWidth: "600px" }}
      >
        <StyledLineChart
          data={chartData}
          title={`Chí kvadrát rozdelenie (k=${kNumeric})`}
          xLabel="x"
          yLabel="f(x; k)"
          lineClass="chart-line-primary"
          hoverX={hoverX}
          setHoverX={setHoverX}
          minX={minX} // Použijeme vypočítané minX
          maxX={maxX} // Použijeme vypočítané maxX
          type="pdf"
          showReferenceArea={false}
          yAxisDomain={[minY, maxY]} // Použijeme explicitne vypočítanú doménu Y
          // xAxisTickFormatter={formatTick} // Voliteľné - ak treba špecifické formátovanie
          // yAxisTickFormatter={formatTick} // Voliteľné
        />
      </div>
    </div>
  );
}

export default ChiSquareChart;
