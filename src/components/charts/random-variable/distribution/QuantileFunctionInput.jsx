// src/components/charts/random-variable/distribution/QuantileFunctionInput.jsx
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ReferenceLine } from "recharts";
import StyledLineChart from "../../helpers/StyledLineChart";
import DataInputControl from "../../../content/helpers/DataInputControl";

const DEFAULT_DATA = [
  12.5, 14.1, 14.8, 15.2, 16.0, 16.5, 17.3, 18.1, 18.5, 19.2, 20.4, 21.0, 21.5,
  22.8, 23.4, 24.1, 25.6, 26.2, 27.5, 29.8,
];

const QuantileFunctionInput = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(DEFAULT_DATA);
  const [activeQuantile, setActiveQuantile] = useState("none");
  const [hoverX, setHoverX] = useState(null);

  const isDefault =
    data.length === DEFAULT_DATA.length &&
    data.every((val, idx) => val === DEFAULT_DATA[idx]);

  const handleReset = () => {
    setData([...DEFAULT_DATA]);
  };

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
        const rawValue = (sortedData[k - 1] + sortedData[k]) / 2;
        value = Math.round(rawValue * 1000) / 1000;
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
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-5 w-100">
      <h6 className="mb-4 text-center">
        {t("components.randomVariableCharts.quantileInput.title")}
      </h6>

      <div className="controls mb-4 d-flex flex-wrap justify-content-center align-items-center gap-3">
        <div className="btn-group shadow-sm" role="group">
          {["none", "median", "quartiles", "deciles"].map(
            (qType, index, arr) => {
              const isActive = activeQuantile === qType;
              const roundingClass =
                index === 0
                  ? "rounded-start-pill"
                  : index === arr.length - 1
                    ? "rounded-end-pill"
                    : "";

              return (
                <button
                  key={qType}
                  type="button"
                  className={`btn btn-sm px-3 btn-outline-primary ${isActive ? "active" : ""} ${roundingClass}`}
                  onClick={() => setActiveQuantile(qType)}
                >
                  {t(`components.randomVariableCharts.quantileInput.${qType}`)}
                </button>
              );
            },
          )}
        </div>
      </div>

      <div className="w-100 mb-5" style={{ maxWidth: "800px" }}>
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

      <div className="w-100 mx-auto" style={{ maxWidth: "800px" }}>
        <h6 className="mb-3 text-start" style={{ fontSize: "0.95rem" }}>
          {t("components.randomVariableCharts.quantileInput.inputDataLabel")}
        </h6>
        <DataInputControl
          data={sortedData}
          onAdd={(val) => setData([...data, val])}
          onRemove={(idxToRemove) => {
            setData(sortedData.filter((_, idx) => idx !== idxToRemove));
          }}
          onReset={handleReset}
          isDefault={isDefault}
          placeholder={t(
            "components.randomVariableCharts.quantileInput.placeholder",
          )}
          itemClassName={(_, idx) =>
            quantileData.activeIndices.includes(idx)
              ? "btn-success"
              : "btn-outline-secondary text-body"
          }
          renderExtra={(_, idx) => {
            const injected = quantileData.injectedValues.filter(
              (q) => q.insertAfterIdx === idx,
            );
            return injected.map((q, i) => (
              <span
                key={`inj-${i}`}
                className="badge rounded-pill border border-success bg-success-subtle text-success"
                style={{ fontSize: "0.8rem", userSelect: "none" }}
                title={t(
                  "components.randomVariableCharts.quantileInput.calculatedTitle",
                  { p: q.p },
                )}
              >
                ={q.value.toLocaleString("sk-SK", { maximumFractionDigits: 2 })}
              </span>
            ));
          }}
        />
      </div>
    </div>
  );
};

export default QuantileFunctionInput;
