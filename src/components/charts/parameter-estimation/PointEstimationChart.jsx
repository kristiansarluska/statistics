// src/components/content/parameterEstimation/PointEstimationChart.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ReferenceLine } from "recharts";
import { BlockMath } from "react-katex";
import StyledLineChart from "../helpers/StyledLineChart";
import BackgroundArea from "../helpers/BackgroundArea";
import AnimatedRefLine from "../helpers/AnimatedRefLine";
import StatsBadge from "../../content/helpers/StatsBadge";
import ResetButton from "../helpers/ResetButton";
import { randomNormal, normalPdf } from "../../../utils/distributions";

// Fixed population parameters for Mount Praděd height measurement simulation
const PRADED_MEAN = 1492.0;
const PRADED_STD = 5.0;
const MAX_SAMPLES = 100;

/**
 * @component PointEstimationChart
 * @description Simulates and visualizes the process of point estimation by repeatedly drawing random samples from a known normal distribution. It compares empirical sample distributions against the theoretical population distribution.
 */
function PointEstimationChart() {
  const { t } = useTranslation();

  const [n, setN] = useState(15);
  const [targetParam, setTargetParam] = useState("mean");
  const [samplesHistory, setSamplesHistory] = useState([]);
  const [hoverX, setHoverX] = useState(null);

  /**
   * Generates new random samples based on the current sample size (n).
   * Calculates the sample mean and sample standard deviation for each draw.
   * @param {number} count - Number of independent samples to draw.
   */
  const draw = (count) => {
    const newSamples = [];
    for (let j = 0; j < count; j++) {
      const data = [];
      let sum = 0;
      // Generate individual random data points
      for (let i = 0; i < n; i++) {
        const val = randomNormal(PRADED_MEAN, PRADED_STD);
        data.push(val);
        sum += val;
      }
      const sampleMean = sum / n;

      // Calculate unbiased sample standard deviation (n-1)
      let sumSq = 0;
      for (let i = 0; i < n; i++) {
        sumSq += Math.pow(data[i] - sampleMean, 2);
      }
      const sampleStd = Math.sqrt(sumSq / (n - 1));

      newSamples.push({ mean: sampleMean, std: sampleStd, data });
    }
    // Append new samples and keep history within the maximum limit
    setSamplesHistory((prev) => [...prev, ...newSamples].slice(-MAX_SAMPLES));
  };

  // Reset history and draw 1 initial sample whenever sample size changes
  useEffect(() => {
    setSamplesHistory([]);
    draw(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  const lastSample = samplesHistory[samplesHistory.length - 1] || {
    mean: 0,
    std: 0,
    data: [],
  };
  const totalSamples = samplesHistory.length;
  // Calculate Standard Error of the Mean (SEM)
  const sem = PRADED_STD / Math.sqrt(n);

  /**
   * Constructs the dataset for the Recharts visualization.
   * Includes both the theoretical PDF curve and empirical density steps (histogram approximation).
   */
  const chartData = useMemo(() => {
    if (lastSample.data.length === 0) return [];

    const minX = PRADED_MEAN - 4 * PRADED_STD;
    const maxX = PRADED_MEAN + 4 * PRADED_STD;

    // Create frequency bins for the empirical distribution area
    const numBins = 30;
    const binWidth = (maxX - minX) / numBins;
    const bins = new Array(numBins).fill(0);

    lastSample.data.forEach((val) => {
      const binIdx = Math.floor((val - minX) / binWidth);
      if (binIdx >= 0 && binIdx < numBins) bins[binIdx] += 1;
    });

    const points = [];
    const numPoints = 200;
    const step = (maxX - minX) / numPoints;

    // Generate smooth line points and align them with step-area empirical bins
    for (let i = 0; i <= numPoints; i++) {
      const x = minX + i * step;
      const binIdx = Math.max(
        0,
        Math.min(numBins - 1, Math.floor((x - minX) / binWidth)),
      );
      const empiricalDensity = bins[binIdx] / (n * binWidth);

      points.push({
        x: Number(x.toFixed(2)),
        y: normalPdf(x, PRADED_MEAN, PRADED_STD),
        empirical: empiricalDensity,
      });
    }

    return points;
  }, [lastSample.data, n]);

  // Calculate precise local maximum for Y-axis to dynamically remove excessive top gap
  const maxY = useMemo(() => {
    if (chartData.length === 0) return 0.1;
    return Math.max(...chartData.map((d) => Math.max(d.y, d.empirical || 0)));
  }, [chartData]);

  const badgeItems = [
    {
      label: t(
        "parameterEstimation.pointEstimation.simulation.results.sampleMean",
      ),
      value: lastSample.mean.toFixed(2),
      color: "text-success",
      groupStart: true,
    },
    {
      label: t(
        "parameterEstimation.pointEstimation.simulation.results.sampleStd",
      ),
      value: lastSample.std.toFixed(2),
      color: "text-warning",
      groupStart: false,
    },
    {
      label: t("parameterEstimation.pointEstimation.simulation.results.sem"),
      value: sem.toFixed(2),
      color: "text-primary",
      groupStart: true,
    },
  ];

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-5 w-100">
      {/* Simulation Controls Panel */}
      <div
        className="controls mb-4 d-flex flex-wrap justify-content-center gap-4 w-100"
        style={{ maxWidth: "800px" }}
      >
        {/* Target Parameter Toggle (Mean vs Std) */}
        <div className="d-flex flex-column align-items-center">
          <label
            className="form-label fw-bold mb-2 text-center"
            style={{ fontSize: "0.9rem" }}
          >
            {t(
              "parameterEstimation.pointEstimation.simulation.controls.target",
            )}
          </label>
          <div className="btn-group" role="group">
            {[
              {
                value: "mean",
                label: t(
                  "parameterEstimation.pointEstimation.simulation.controls.targetMean",
                ),
              },
              {
                value: "std",
                label: t(
                  "parameterEstimation.pointEstimation.simulation.controls.targetStd",
                ),
              },
            ].map(({ value, label }, i) => (
              <button
                key={value}
                type="button"
                className={`btn btn-sm px-3 btn-outline-primary ${targetParam === value ? "active" : ""} ${i === 0 ? "rounded-start-pill" : "rounded-end-pill"}`}
                onClick={() => setTargetParam(value)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons & Sample Size Slider */}
        <div className="d-flex flex-wrap align-items-center justify-content-center gap-4 mt-2 w-100">
          <div className="d-flex align-items-center gap-2">
            <label className="fw-bold small mb-0 text-nowrap">
              n = <span className="parameter-value">{n}</span>
            </label>
            <input
              type="range"
              className="form-range mb-0"
              min="5"
              max="50"
              step="5"
              value={n}
              onChange={(e) => setN(Number(e.target.value))}
              style={{ width: "130px" }}
            />
          </div>

          <button
            type="button"
            className="btn btn-primary btn-sm px-4 rounded-pill shadow-sm"
            onClick={() => draw(1)}
          >
            {t(
              "parameterEstimation.pointEstimation.simulation.actions.generateNew",
            )}
          </button>

          <ResetButton
            onClick={() => {
              setSamplesHistory([]);
              draw(1);
            }}
            disabled={totalSamples <= 1}
            title={t(
              "parameterEstimation.pointEstimation.simulation.actions.clearHistory",
            )}
          />
        </div>
      </div>

      <div className="w-100 mb-4 text-center" style={{ maxWidth: "800px" }}>
        {/* Real-time Current Sample Statistics Badge */}
        <div className="mb-3">
          <StatsBadge items={badgeItems} />
        </div>

        {/* History of recorded sample means/stds presented as small pill badges */}
        {samplesHistory.length > 0 && (
          <div className="w-100 mb-3 text-center d-flex justify-content-center">
            <div
              className="px-3 py-2 rounded-4 bg-body-tertiary border shadow-sm d-inline-flex flex-wrap justify-content-center gap-2 align-items-center"
              style={{ fontSize: "0.85rem" }}
            >
              <span className="text-muted" style={{ fontSize: "0.82rem" }}>
                {targetParam === "mean"
                  ? t(
                      "parameterEstimation.pointEstimation.simulation.results.recordedMeans",
                    )
                  : t(
                      "parameterEstimation.pointEstimation.simulation.results.recordedStds",
                    )}
              </span>
              {samplesHistory.map((s, i) => {
                const isLatest = i === samplesHistory.length - 1;
                const val = targetParam === "mean" ? s.mean : s.std;
                return (
                  <span
                    key={i}
                    className="badge rounded-pill"
                    style={{
                      background: isLatest
                        ? "var(--bs-primary)"
                        : "var(--bs-secondary-bg)",
                      color: isLatest ? "#fff" : "var(--bs-body-color)",
                      border: "1px solid var(--bs-border-color)",
                      fontSize: "0.82rem",
                    }}
                  >
                    {val.toFixed(2)}
                  </span>
                );
              })}
            </div>
          </div>
        )}

        {/* Dynamic SEM Formula block */}
        <div className="overflow-auto py-1">
          <BlockMath
            math={`\\sigma_{\\bar{x}} = \\frac{\\sigma}{\\sqrt{n}} = \\frac{${PRADED_STD}}{\\sqrt{${n}}} = ${sem.toFixed(4)}`}
          />
        </div>
      </div>

      {/* Main Chart Visualization */}
      <div
        className="charts-wrapper w-100 mx-auto"
        style={{ maxWidth: "800px" }}
      >
        <StyledLineChart
          data={chartData}
          xLabel={t(
            "parameterEstimation.pointEstimation.simulation.chart.xAxisLabel",
          )}
          yLabel={t(
            "parameterEstimation.pointEstimation.simulation.chart.yAxisLabel",
          )}
          type="pdf"
          lineClass="chart-line-secondary"
          hoverX={hoverX}
          setHoverX={setHoverX}
          minX={PRADED_MEAN - 4 * PRADED_STD}
          maxX={PRADED_MEAN + 4 * PRADED_STD}
          yAxisDomain={[0, maxY * 1.05]}
          margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
        >
          {/* Renders the background step-area histogram of the empirical sample */}
          <BackgroundArea
            dataKey="empirical"
            type="stepBefore"
            color="var(--bs-primary)"
            fillOpacity={0.25}
            strokeWidth={0}
            isAnimationActive={true}
            animationDuration={600}
          />

          {/* Ghost lines representing historical samples (excluding the most recent one) */}
          {samplesHistory.slice(0, -1).map((s, i) => (
            <React.Fragment key={i}>
              {targetParam === "mean" ? (
                <ReferenceLine
                  x={s.mean}
                  stroke="var(--bs-success)"
                  strokeWidth={1}
                  opacity={0.3}
                />
              ) : (
                <>
                  <ReferenceLine
                    x={s.mean - s.std}
                    stroke="var(--bs-warning)"
                    strokeWidth={1}
                    opacity={0.2}
                  />
                  <ReferenceLine
                    x={s.mean + s.std}
                    stroke="var(--bs-warning)"
                    strokeWidth={1}
                    opacity={0.2}
                  />
                </>
              )}
            </React.Fragment>
          ))}

          {/* Highlight line for the newest, currently active sample */}
          {targetParam === "mean" ? (
            <ReferenceLine
              x={lastSample.mean}
              className="animated-reference"
              shape={
                <AnimatedRefLine
                  lineColor="var(--bs-success)"
                  labelText={`x̄ = ${lastSample.mean.toFixed(2)}`}
                  labelPosition="right"
                />
              }
            />
          ) : (
            <>
              <ReferenceLine
                x={lastSample.mean - lastSample.std}
                className="animated-reference"
                shape={
                  <AnimatedRefLine
                    lineColor="var(--bs-warning)"
                    labelText={`x̄ - ${lastSample.std.toFixed(2)}`}
                    labelPosition="left"
                  />
                }
              />
              <ReferenceLine
                x={lastSample.mean + lastSample.std}
                className="animated-reference"
                shape={
                  <AnimatedRefLine
                    lineColor="var(--bs-warning)"
                    labelText={`x̄ + ${lastSample.std.toFixed(2)}`}
                    labelPosition="right"
                  />
                }
              />
            </>
          )}
        </StyledLineChart>
      </div>
    </div>
  );
}

export default PointEstimationChart;
