// src/components/content/characteristics/ModeCalc.jsx
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Bar, Cell } from "recharts";
import StyledBarChart from "../../charts/helpers/StyledBarChart";
import DataInputControl from "../../content/helpers/DataInputControl";

const DEFAULT_DATA = [
  1, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 7, 7, 7, 7, 7, 7,
  8, 8, 12,
];

const ModeCalc = () => {
  const { t } = useTranslation();
  const [data, setData] = useState(DEFAULT_DATA);

  const isDefault =
    data.length === DEFAULT_DATA.length &&
    data.every((val, idx) => val === DEFAULT_DATA[idx]);

  const handleReset = () => {
    setData([...DEFAULT_DATA]);
  };

  const { chartData, modes, sortedData } = useMemo(() => {
    const counts = {};
    data.forEach((val) => {
      counts[val] = (counts[val] || 0) + 1;
    });

    const maxCount = Math.max(...Object.values(counts), 0);

    const currentModes = Object.keys(counts)
      .filter((k) => counts[k] === maxCount && maxCount > 0)
      .map(Number);

    const cData = Object.keys(counts)
      .map((k) => ({
        x: String(k),
        y: counts[k],
      }))
      .sort((a, b) => Number(a.x) - Number(b.x));

    const sorted = [...data].sort((a, b) => a - b);

    return { chartData: cData, modes: currentModes, sortedData: sorted };
  }, [data]);

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-5 w-100">
      <h6 className="mb-4 text-center">
        {t("components.characteristics.mode.title")}
      </h6>

      <div
        className="p-3 r6unded-3 shadow-sm border bg-body-tertiary text-center w-100 mb-4"
        style={{ maxWidth: "800px" }}
      >
        6{" "}
        <p className="mb-2 fw-bold text-muted" style={{ fontSize: "0.9rem" }}>
          {t("components.characteristics.mode.currentMode")}
        </p>
        <div className="fs-5 mt-2">
          {modes.length > 0 ? (
            modes.map((m, i) => (
              <span
                key={i}
                className="badge bg-info fw-bold rounded-pill mx-1 shadow-sm px-3"
              >
                {m}{" "}
                {m === 1
                  ? t("components.characteristics.mode.floor_1")
                  : m >= 2 && m <= 4
                    ? t("components.characteristics.mode.floors_2_4")
                    : t("components.characteristics.mode.floors_many")}
              </span>
            ))
          ) : (
            <span className="text-muted text-body">
              {t("components.characteristics.mode.noData")}
            </span>
          )}
        </div>
      </div>

      <div className="w-100 mb-4" style={{ maxWidth: "800px" }}>
        <StyledBarChart
          data={chartData}
          xLabel={t("components.characteristics.mode.chartXLabel")}
          yLabel={t("components.characteristics.mode.chartYLabel")}
        >
          <Bar
            dataKey="y"
            maxBarSize={60}
            isAnimationActive={true}
            radius={[4, 4, 0, 0]}
          >
            {chartData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  modes.includes(Number(entry.x))
                    ? "var(--bs-info)"
                    : "var(--bs-primary)"
                }
              />
            ))}
          </Bar>
        </StyledBarChart>
      </div>
      <div className="w-100 mx-auto" style={{ maxWidth: "800px" }}>
        <h6 className="mb-3 text-start" style={{ fontSize: "0.95rem" }}>
          {t("components.characteristics.mode.inputLabel")}
        </h6>
        <DataInputControl
          data={sortedData}
          onAdd={(val) => setData([...data, val])}
          onRemove={(idxToRemove) => {
            setData(sortedData.filter((_, idx) => idx !== idxToRemove));
          }}
          onReset={handleReset}
          isDefault={isDefault}
          min="1"
          step="1"
          placeholder={t("components.characteristics.mode.placeholder")}
          itemClassName={(val) =>
            modes.includes(val) ? "btn-info" : "btn-outline-secondary text-body"
          }
        />
      </div>
    </div>
  );
};

export default ModeCalc;
