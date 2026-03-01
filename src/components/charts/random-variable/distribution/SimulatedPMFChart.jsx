// src/components/charts/random-variable/distribution/SimulatedPMFChart.jsx
import React, { useState, useMemo } from "react";
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
  const [measurements, setMeasurements] = useState([]);
  const [hoverX, setHoverX] = useState(null);

  const n = 12; // celkový počet satelitov
  const p = 0.45; // pravdepodobnosť fixu

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

  const { chartData, customMaxY } = useMemo(() => {
    const total = measurements.length;
    const bins = Array(n + 1).fill(0);

    if (total > 0) measurements.forEach((val) => bins[val]++);

    let maxY = 0;
    const data = [];

    for (let i = 0; i <= n; i++) {
      const prob = combinations(n, i) * Math.pow(p, i) * Math.pow(1 - p, n - i);
      const empiricalProb = total > 0 ? bins[i] / total : 0;

      // Zachytenie najvyššieho stĺpca pre os Y
      maxY = Math.max(maxY, prob, empiricalProb);

      data.push({
        x: String(i),
        Teoretická: Number(prob.toFixed(4)),
        Empirická: Number(empiricalProb.toFixed(4)),
      });
    }
    return { chartData: data, customMaxY: maxY };
  }, [measurements, n, p]);

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-5">
      <div className="controls mb-4 d-flex flex-wrap justify-content-center align-items-center gap-3">
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
          className="fw-bold text-success bg-success-subtle px-3 py-1 rounded-pill shadow-sm"
          style={{ fontSize: "0.9rem" }}
        >
          Merania: {measurements.length}
        </div>

        <ResetButton
          onClick={handleReset}
          disabled={measurements.length === 0}
        />
      </div>

      <div className="charts-wrapper w-100" style={{ maxWidth: "800px" }}>
        <h6 className="mb-3 text-center">
          Simulácia počtu zachytených satelitov (Binomické rozdelenie)
        </h6>

        <StyledBarChart
          data={chartData}
          xLabel="Počet satelitov (k)"
          yLabel="P(X=k)"
          customMaxY={customMaxY}
          hoverX={hoverX}
          setHoverX={setHoverX}
        >
          <Legend verticalAlign="top" height={36} />
          <Bar
            dataKey="Empirická"
            fill="var(--bs-info)"
            radius={[4, 4, 0, 0]}
            animationDuration={500}
          />
          <Bar
            dataKey="Teoretická"
            fill="var(--bs-primary)"
            radius={[4, 4, 0, 0]}
            animationDuration={500}
          />
        </StyledBarChart>
      </div>
    </div>
  );
}

export default SimulatedPMFChart;
