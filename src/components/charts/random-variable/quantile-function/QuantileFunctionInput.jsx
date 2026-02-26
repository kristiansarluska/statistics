// src/components/charts/random-variable/quantile-function/QuantileFunctionInput.jsx
import React, { useState, useMemo } from "react";
import { ReferenceLine } from "recharts";
import StyledLineChart from "../../../charts/helpers/StyledLineChart";

const QuantileFunctionInput = () => {
  const [data, setData] = useState([
    5, 5, 15, 15, 16, 16, 20, 20, 21, 21, 25, 25, 26, 26, 27, 27, 30, 30, 30,
    30, 31, 31, 32, 32, 34, 34, 35, 35, 38, 38, 38, 38, 41, 41, 43, 43, 47, 47,
    66, 66,
  ]);
  const [inputValue, setInputValue] = useState("");
  const [activeQuantile, setActiveQuantile] = useState("none");
  const [hoverX, setHoverX] = useState(null);

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

  const quantileData = useMemo(() => {
    if (n === 0 || activeQuantile === "none") {
      return { lines: [], activeIndices: [], injectedValues: [] };
    }

    const ps =
      activeQuantile === "median"
        ? [0.5]
        : activeQuantile === "quartiles"
          ? [0.25, 0.5, 0.75]
          : Array.from({ length: 9 }, (_, i) => (i + 1) * 0.1);

    const activeIndices = [];
    const lines = [];
    const injectedValues = [];

    ps.forEach((p) => {
      const exactK = p * n;
      const isIntegerK = Math.abs(exactK - Math.round(exactK)) < 1e-9;
      const k = Math.round(exactK);

      let value;
      if (isIntegerK && k > 0 && k < n) {
        value = (sortedData[k - 1] + sortedData[k]) / 2;
        activeIndices.push(k - 1, k);
        injectedValues.push({ p, value, insertAfterIdx: k - 1 });
      } else {
        const idx = Math.ceil(exactK) - 1;
        value = sortedData[idx];
        activeIndices.push(idx);
      }

      lines.push({ x: p, y: value });
    });

    return { lines, activeIndices, injectedValues };
  }, [n, activeQuantile, sortedData]);

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

  const referenceLines = quantileData.lines.map((lineData, i) => (
    <React.Fragment key={`ref-${i}`}>
      <ReferenceLine
        x={lineData.x}
        stroke="var(--bs-success)"
        strokeWidth={1}
        opacity={0.8}
      />
      <ReferenceLine
        y={lineData.y}
        stroke="var(--bs-success)"
        strokeWidth={1}
        opacity={0.8}
      />
    </React.Fragment>
  ));

  return (
    <div className="card shadow-sm p-4 mb-4">
      <h5 className="mb-4">Interaktívna kvantilová funkcia z vlastných dát</h5>

      <div className="d-flex flex-wrap gap-2 mb-4">
        {["none", "median", "quartiles", "deciles"].map((qType) => (
          <button
            key={qType}
            className={`btn rounded-pill ${activeQuantile === qType ? "btn-primary" : "btn-outline-primary"}`}
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

      <div className="mb-4 w-100 mx-auto" style={{ maxWidth: "800px" }}>
        <StyledLineChart
          data={chartData}
          xLabel="p"
          yLabel="x"
          lineType="stepBefore"
          type="cdf"
          hoverX={hoverX}
          setHoverX={setHoverX}
        >
          {referenceLines}
        </StyledLineChart>
      </div>

      <div>
        <h6>Vstupné dáta</h6>
        <div className="d-flex flex-wrap gap-2 mb-3 align-items-center">
          {sortedData.map((val, idx) => {
            const isHighlighted = quantileData.activeIndices.includes(idx);
            const injected = quantileData.injectedValues.filter(
              (q) => q.insertAfterIdx === idx,
            );

            return (
              <React.Fragment key={idx}>
                <button
                  type="button"
                  className={`btn btn-sm rounded-pill d-flex align-items-center ${isHighlighted ? "btn-success" : "btn-light"}`}
                  style={{ fontSize: "0.85rem" }}
                  onClick={() => handleRemoveNumber(idx)}
                  title="Kliknutím odstrániš"
                >
                  {val}{" "}
                  <span aria-hidden="true" className="ms-1">
                    &times;
                  </span>
                </button>

                {/* Vymenené triedy pre svetlozelený vzhľad (Bootstrap 5.3) */}
                {injected.map((q, i) => (
                  <span
                    key={`inj-${i}`}
                    className="badge rounded-pill border border-success bg-success-subtle text-success"
                    style={{ fontSize: "0.8rem", userSelect: "none" }}
                    title={`Vypočítaný kvantil (${q.p})`}
                  >
                    ={q.value}
                  </span>
                ))}
              </React.Fragment>
            );
          })}
        </div>

        {/* Úprava form: flex-nowrap a fixná malá šírka pre input */}
        <form
          onSubmit={handleAddNumber}
          className="controls d-flex flex-nowrap align-items-center gap-2 m-0"
        >
          <input
            type="number"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Hodnota"
            step="any"
            required
            className="form-control"
            style={{ width: "100px" }}
          />
          <button
            type="submit"
            className="btn btn-success rounded-pill text-nowrap"
          >
            Pridať
          </button>
        </form>
      </div>
    </div>
  );
};

export default QuantileFunctionInput;
