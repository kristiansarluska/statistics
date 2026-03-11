// src/components/charts/random-variable/distribution/SimulatedPMFChart.jsx
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Bar, Legend } from "recharts";
import StyledBarChart from "../../helpers/StyledBarChart";
import ResetButton from "../../helpers/ResetButton";

const combinations = (n, k) => {
  if (k === 0 || k === n) return 1;
  let c = 1;
  for (let i = 1; i <= k; i++) c = (c * (n - i + 1)) / i;
  return c;
};

function SimulatedPMFChart() {
  const { t } = useTranslation();
  const [measurements, setMeasurements] = useState([]);
  const [hoverX, setHoverX] = useState(null);

  const n = 12;
  const p = 0.45;

  const addMeasurements = (count) => {
    const newMeasurements = [];
    for (let i = 0; i < count; i++) {
      let successes = 0;
      for (let j = 0; j < n; j++) {
        if (Math.random() < p) successes++;
      }
      newMeasurements.push(successes);
    }
    setMeasurements((prev) => [...prev, ...newMeasurements]);
  };

  const handleReset = () => setMeasurements([]);

  const theoreticalKey = t(
    "components.randomVariableCharts.simulatedPMF.theoretical",
  );
  const empiricalKey = t(
    "components.randomVariableCharts.simulatedPMF.empirical",
  );

  const { chartData, customMaxY } = useMemo(() => {
    const total = measurements.length;
    const bins = Array(n + 1).fill(0);

    if (total > 0) measurements.forEach((val) => bins[val]++);

    let maxY = 0;
    const data = [];

    for (let i = 0; i <= n; i++) {
      const prob = combinations(n, i) * Math.pow(p, i) * Math.pow(1 - p, n - i);
      const empiricalProb = total > 0 ? bins[i] / total : 0;

      maxY = Math.max(maxY, prob, empiricalProb);

      data.push({
        x: String(i),
        [theoreticalKey]: Number(prob.toFixed(4)),
        [empiricalKey]: Number(empiricalProb.toFixed(4)),
      });
    }

    return { chartData: data, customMaxY: maxY * 1.1 };
  }, [measurements, n, p, theoreticalKey, empiricalKey]);

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-5 w-100">
      <h6 className="mb-4 text-center">
        {t("components.randomVariableCharts.simulatedPMF.title")}
      </h6>

      <div className="controls mb-4 d-flex flex-wrap justify-content-center align-items-center gap-3 w-100">
        <div className="btn-group shadow-sm rounded-pill overflow-hidden">
          <button
            className="btn btn-primary btn-sm px-3"
            style={{ borderRight: "1px solid rgba(255,255,255,0.3)" }}
            onClick={() => addMeasurements(1)}
          >
            + 1
          </button>
          <button
            className="btn btn-primary btn-sm px-3"
            style={{ borderRight: "1px solid rgba(255,255,255,0.3)" }}
            onClick={() => addMeasurements(10)}
          >
            + 10
          </button>
          <button
            className="btn btn-primary btn-sm px-3"
            onClick={() => addMeasurements(100)}
          >
            + 100
          </button>
        </div>

        <div
          className="fw-bold text-success bg-success-subtle px-3 py-1 rounded-pill shadow-sm text-nowrap"
          style={{ fontSize: "0.9rem" }}
        >
          {t("components.randomVariableCharts.measurements", {
            count: measurements.length,
          })}
        </div>

        <ResetButton
          onClick={handleReset}
          disabled={measurements.length === 0}
        />
      </div>

      <div className="w-100 mx-auto" style={{ maxWidth: "800px" }}>
        <StyledBarChart
          data={chartData}
          xLabel={t("components.randomVariableCharts.simulatedPMF.xLabel")}
          yLabel={t("components.randomVariableCharts.simulatedPMF.yLabel")}
          customMaxY={customMaxY}
          hoverX={hoverX}
          setHoverX={setHoverX}
        >
          <Legend
            verticalAlign="top"
            wrapperStyle={{ paddingBottom: "20px" }}
            height={40}
          />
          <Bar
            dataKey={theoreticalKey}
            fill="var(--bs-primary)"
            radius={[4, 4, 0, 0]}
            animationDuration={500}
          />
          <Bar
            dataKey={empiricalKey}
            fill="var(--bs-gray-400)"
            radius={[4, 4, 0, 0]}
            animationDuration={500}
          />
        </StyledBarChart>
      </div>
    </div>
  );
}

export default SimulatedPMFChart;
