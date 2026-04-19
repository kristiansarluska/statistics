// src/components/charts/random-variable/distribution/SimulatedPMFChart.jsx
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { Bar, Legend } from "recharts";
import StyledBarChart from "../../helpers/StyledBarChart";
import ResetButton from "../../helpers/ResetButton";

/**
 * Calculates the binomial coefficient (n choose k).
 * @param {number} n - Total number of trials
 * @param {number} k - Number of successful trials
 * @returns {number} The number of combinations
 */
const combinations = (n, k) => {
  if (k === 0 || k === n) return 1;
  let c = 1;
  for (let i = 1; i <= k; i++) c = (c * (n - i + 1)) / i;
  return c;
};

/**
 * @component SimulatedPMFChart
 * @description Simulates and visualizes a Binomial Probability Mass Function (PMF).
 * Users can generate random experiments to build an empirical distribution
 * and compare it directly against the theoretical probabilities.
 */
function SimulatedPMFChart() {
  const { t } = useTranslation();

  // Local state for tracking generated data and tooltip interactions
  const [measurements, setMeasurements] = useState([]);
  const [hoverX, setHoverX] = useState(null);

  // Hardcoded Binomial distribution parameters: n (trials) and p (probability of success)
  const n = 12;
  const p = 0.45;

  /**
   * Generates a specified number of binomial random variables.
   * Simulates 'n' independent Bernoulli trials for each measurement.
   * @param {number} count - Number of simulated measurements to add
   */
  const addMeasurements = (count) => {
    const newMeasurements = [];
    for (let i = 0; i < count; i++) {
      let successes = 0;
      for (let j = 0; j < n; j++) {
        // Increment success count if random uniform value is less than 'p'
        if (Math.random() < p) successes++;
      }
      newMeasurements.push(successes);
    }
    // Append new outcomes to the existing array
    setMeasurements((prev) => [...prev, ...newMeasurements]);
  };

  /**
   * Clears all simulated data
   */
  const handleReset = () => setMeasurements([]);

  const theoreticalKey = t(
    "components.randomVariableCharts.simulatedPMF.theoretical",
  );
  const empiricalKey = t(
    "components.randomVariableCharts.simulatedPMF.empirical",
  );

  /**
   * Prepares chart data by calculating exact theoretical probabilities
   * and empirical relative frequencies based on user simulations.
   */
  const { chartData, customMaxY } = useMemo(() => {
    const total = measurements.length;
    // Array to hold frequency counts for each possible outcome (0 to n)
    const bins = Array(n + 1).fill(0);

    // Populate empirical frequency bins
    if (total > 0) measurements.forEach((val) => bins[val]++);

    let maxY = 0;
    const data = [];

    for (let i = 0; i <= n; i++) {
      // Calculate Binomial probability: P(X = i) = (n choose i) * p^i * (1-p)^(n-i)
      const prob = combinations(n, i) * Math.pow(p, i) * Math.pow(1 - p, n - i);
      const empiricalProb = total > 0 ? bins[i] / total : 0;

      // Track the maximum Y value to properly scale the chart's Y-axis
      maxY = Math.max(maxY, prob, empiricalProb);

      data.push({
        x: String(i),
        [theoreticalKey]: Number(prob.toFixed(4)),
        [empiricalKey]: Number(empiricalProb.toFixed(4)),
      });
    }

    // Add a 10% padding to the max Y-axis domain
    return { chartData: data, customMaxY: maxY * 1.1 };
  }, [measurements, n, p, theoreticalKey, empiricalKey]);

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-5 w-100">
      <h6 className="mb-4 text-center">
        {t("components.randomVariableCharts.simulatedPMF.title")}
      </h6>

      {/* Controls Section */}
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

        {/* Measurement Counter Badge */}
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

      {/* Chart Visualization */}
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
