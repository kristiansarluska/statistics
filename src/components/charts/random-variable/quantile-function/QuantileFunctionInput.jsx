// src/components/charts/random-variable/quantile-function/QuantileFunctionInput.jsx
import React, { useState, useMemo } from "react";
import { ReferenceLine } from "recharts";
import StyledLineChart from "../../../charts/helpers/StyledLineChart";

const QuantileFunctionInput = () => {
  const [data, setData] = useState([
    30, 16, 30, 20, 26, 15, 5, 34, 66, 43, 32, 38, 27, 21, 25, 38, 31, 47, 35,
    41, 5, 15, 16, 20, 21, 25, 26, 27, 30, 30, 31, 32, 34, 35, 38, 38, 41, 43,
    47, 66,
  ]);
  const [inputValue, setInputValue] = useState("");
  const [activeQuantile, setActiveQuantile] = useState("none");

  const { sortedData, chartData, n } = useMemo(() => {
    const sorted = [...data].sort((a, b) => a - b);
    const length = sorted.length;

    const points = sorted.map((val, idx) => ({
      x: (idx + 1) / length,
      y: val,
      index: idx,
    }));

    const fullPoints =
      length > 0 ? [{ x: 0, y: sorted[0], index: -1 }, ...points] : [];
    return { sortedData: sorted, chartData: fullPoints, n: length };
  }, [data]);

  const highlightIndices = useMemo(() => {
    if (n === 0 || activeQuantile === "none") return [];
    const getIndex = (p) => Math.ceil(p * n) - 1;

    switch (activeQuantile) {
      case "median":
        return [getIndex(0.5)];
      case "quartiles":
        return [0.25, 0.5, 0.75].map(getIndex);
      case "deciles":
        return Array.from({ length: 9 }, (_, i) => getIndex((i + 1) * 0.1));
      default:
        return [];
    }
  }, [n, activeQuantile]);

  const handleAddNumber = (e) => {
    e.preventDefault();
    const num = parseFloat(inputValue);
    if (!isNaN(num)) {
      setData([...data, num]);
      setInputValue("");
    }
  };

  const handleRemoveNumber = (indexToRemove) => {
    setData(sortedData.filter((_, idx) => idx !== indexToRemove));
  };

  const referenceLines = highlightIndices.map((idx, i) => {
    const point = chartData.find((d) => d.index === idx);
    if (!point) return null;
    return (
      <React.Fragment key={`ref-${i}`}>
        <ReferenceLine
          x={point.x}
          stroke="var(--bs-success)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          opacity={0.8}
        />
        <ReferenceLine
          y={point.y}
          stroke="var(--bs-success)"
          strokeWidth={1.5}
          strokeDasharray="4 4"
          opacity={0.8}
        />
      </React.Fragment>
    );
  });

  return (
    <div className="card shadow-sm p-4 mb-4">
      <h5 className="mb-4">Interaktívna kvantilová funkcia z vlastných dát</h5>

      <div className="d-flex flex-wrap gap-2 mb-4">
        {["none", "median", "quartiles", "deciles"].map((qType) => (
          <button
            key={qType}
            className={`btn ${activeQuantile === qType ? "btn-primary" : "btn-outline-primary"}`}
            onClick={() => setActiveQuantile(qType)}
          >
            {qType === "none"
              ? "Bez zvýraznenia"
              : qType === "median"
                ? "Medián"
                : qType === "quartiles"
                  ? "Kvartily"
                  : "Decily"}
          </button>
        ))}
      </div>

      {/* Upravený responzívny obal */}
      <div className="mb-4 w-100 mx-auto" style={{ maxWidth: "800px" }}>
        <StyledLineChart
          data={chartData}
          xLabel="Pravdepodobnosť (p)"
          yLabel="Hodnota (x)"
          lineType="stepBefore"
          type="cdf"
          useCustomCursor={false} // Aktivuje defaultný Recharts kurzor, vypne červený
        >
          {referenceLines}
        </StyledLineChart>
      </div>

      <div>
        <h6>Vstupné dáta (usporiadané)</h6>
        <div className="d-flex flex-wrap gap-2 mb-3">
          {sortedData.map((val, idx) => {
            const isHighlighted = highlightIndices.includes(idx);
            return (
              <span
                key={idx}
                className={`badge d-flex align-items-center ${isHighlighted ? "bg-success" : "bg-secondary"}`}
                style={{ fontSize: "0.9rem", cursor: "pointer" }}
                onClick={() => handleRemoveNumber(idx)}
                title="Kliknutím odstrániš"
              >
                {val} &times;
              </span>
            );
          })}
        </div>
        <form
          onSubmit={handleAddNumber}
          className="d-flex gap-2"
          style={{ maxWidth: "300px" }}
        >
          <input
            type="number"
            className="form-control"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Nová hodnota"
            step="any"
            required
          />
          <button type="submit" className="btn btn-success">
            Pridať
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuantileFunctionInput;
