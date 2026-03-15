// src/components/content/parameterEstimation/PointEstimationSimulation.jsx
import React, { useState, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { ReferenceLine } from "recharts";
import { BlockMath } from "react-katex";
import StyledLineChart from "../../charts/helpers/StyledLineChart";
import BackgroundArea from "../../charts/helpers/BackgroundArea";
import { randomNormal, normalPdf } from "../../../utils/distributions";

function PointEstimationSimulation() {
  const { t } = useTranslation();

  const [popMean, setPopMean] = useState(312);
  const [popStd, setPopStd] = useState(8);
  const [n, setN] = useState(15);
  const [targetParam, setTargetParam] = useState("mean");

  const [sampleData, setSampleData] = useState([]);
  const [stats, setStats] = useState({ mean: 0, std: 0, sem: 0 });
  const [hoverX, setHoverX] = useState(null);
  // Incrementing key forces BackgroundArea remount → replays animation on each new sample
  const [histogramKey, setHistogramKey] = useState(0);

  // Regenerate sample on slider change
  useEffect(() => {
    const data = [];
    let sum = 0;
    for (let i = 0; i < n; i++) {
      const val = randomNormal(popMean, popStd);
      data.push(val);
      sum += val;
    }
    const sampleMean = sum / n;

    let sumSq = 0;
    for (let i = 0; i < n; i++) {
      sumSq += Math.pow(data[i] - sampleMean, 2);
    }
    const sampleStd = Math.sqrt(sumSq / (n - 1));
    const sem = popStd / Math.sqrt(n);

    setSampleData(data);
    setStats({ mean: sampleMean, std: sampleStd, sem });
    setHistogramKey((k) => k + 1);
  }, [popMean, popStd, n]);

  // Fine-grained x-axis points to avoid flat peak on normal curve
  const chartData = useMemo(() => {
    if (sampleData.length === 0) return [];

    const minX = popMean - 4 * popStd;
    const maxX = popMean + 4 * popStd;
    const numBins = 30;
    const binWidth = (maxX - minX) / numBins;

    const bins = new Array(numBins).fill(0);
    sampleData.forEach((val) => {
      const binIdx = Math.floor((val - minX) / binWidth);
      if (binIdx >= 0 && binIdx < numBins) bins[binIdx] += 1;
    });

    const points = [];
    const numPoints = 200;
    const step = (maxX - minX) / numPoints;

    for (let i = 0; i <= numPoints; i++) {
      const x = minX + i * step;
      const binIdx = Math.max(
        0,
        Math.min(numBins - 1, Math.floor((x - minX) / binWidth)),
      );
      points.push({
        x: Number(x.toFixed(2)),
        y: normalPdf(x, popMean, popStd),
        empirical: bins[binIdx] / (n * binWidth),
      });
    }

    return points;
  }, [sampleData, popMean, popStd, n]);

  // Snap hoverX to the centre of the nearest histogram bin for a consistent empirical value
  const snappedEmpirical = useMemo(() => {
    if (hoverX === null || chartData.length === 0) return null;
    const minX = popMean - 4 * popStd;
    const maxX = popMean + 4 * popStd;
    const numBins = 30;
    const binWidth = (maxX - minX) / numBins;
    const binIdx = Math.max(
      0,
      Math.min(numBins - 1, Math.floor((hoverX - minX) / binWidth)),
    );
    // Find a chartData point that falls in the same bin to read its empirical density
    const sample = chartData.find((p) => {
      const idx = Math.max(
        0,
        Math.min(numBins - 1, Math.floor((p.x - minX) / binWidth)),
      );
      return idx === binIdx;
    });
    return sample ? sample.empirical : null;
  }, [hoverX, chartData, popMean, popStd]);

  // Legend items for mean mode and std mode
  const legendMean = [
    { label: `μ = ${popMean}`, color: "var(--bs-success)", dashed: false },
    {
      label: `x̄ = ${stats.mean.toFixed(1)}`,
      color: "var(--bs-primary)",
      dashed: true,
    },
  ];
  const legendStd = [
    {
      label: `μ ± σ = ${popMean - popStd} / ${popMean + popStd}`,
      color: "var(--bs-warning)",
      dashed: true,
    },
    {
      label: `x̄ ± s = ${(stats.mean - stats.std).toFixed(1)} / ${(stats.mean + stats.std).toFixed(1)}`,
      color: "var(--bs-danger)",
      dashed: true,
    },
  ];

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-5 w-100">
      {/* ── Controls ── */}
      <div
        className="controls mb-4 w-100 d-flex flex-column align-items-center"
        style={{ maxWidth: "800px" }}
      >
        {/* Target parameter toggle — pill btn-group matching TTestDashboard */}
        <div className="d-flex flex-column align-items-center mb-4">
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
                labelKey:
                  "parameterEstimation.pointEstimation.simulation.controls.targetMean",
              },
              {
                value: "std",
                labelKey:
                  "parameterEstimation.pointEstimation.simulation.controls.targetStd",
              },
            ].map(({ value, labelKey }, index, arr) => (
              <button
                key={value}
                type="button"
                className={`btn btn-sm px-3 btn-outline-primary ${targetParam === value ? "active" : ""} ${index === 0 ? "rounded-start-pill" : index === arr.length - 1 ? "rounded-end-pill" : ""}`}
                onClick={() => setTargetParam(value)}
              >
                {t(labelKey)}
              </button>
            ))}
          </div>
        </div>

        {/* Sliders — three columns on desktop, wrap on mobile */}
        <div className="d-flex flex-wrap justify-content-center gap-4">
          {[
            {
              key: "popMean",
              value: popMean,
              set: setPopMean,
              min: 100,
              max: 1000,
              step: 10,
              labelKey:
                "parameterEstimation.pointEstimation.simulation.controls.popMean",
            },
            {
              key: "popStd",
              value: popStd,
              set: setPopStd,
              min: 1,
              max: 100,
              step: 1,
              labelKey:
                "parameterEstimation.pointEstimation.simulation.controls.popStd",
            },
            {
              key: "n",
              value: n,
              set: setN,
              min: 5,
              max: 200,
              step: 5,
              labelKey:
                "parameterEstimation.pointEstimation.simulation.controls.sampleSize",
            },
          ].map(({ key, value, set, min, max, step, labelKey }) => (
            <div key={key} className="d-flex flex-column align-items-center">
              <label
                className="form-label fw-bold mb-2 text-center"
                style={{ fontSize: "0.9rem" }}
              >
                {t(labelKey)}
                <span
                  className="text-primary d-inline-block text-start ms-2"
                  style={{ width: "35px" }}
                >
                  {value}
                </span>
              </label>
              <input
                type="range"
                className="form-range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => set(Number(e.target.value))}
                style={{ maxWidth: "180px" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* ── Chart title ── */}
      <h6 className="mb-3 text-center">
        {t("parameterEstimation.pointEstimation.simulation.title")}
      </h6>

      {/* ── Stats badge — above chart, below title ── */}
      <div className="w-100 mb-2 text-center" style={{ maxWidth: "800px" }}>
        <div
          className="px-4 py-2 rounded-pill bg-body-tertiary border shadow-sm d-inline-flex flex-wrap justify-content-center gap-4 align-items-center"
          style={{ fontSize: "0.95rem" }}
        >
          <div>
            <span className="text-muted me-2">
              {t(
                "parameterEstimation.pointEstimation.simulation.results.sampleMean",
              )}
              :
            </span>
            <strong className="text-primary text-nowrap">
              {stats.mean.toFixed(2)}
            </strong>
          </div>
          <div>
            <span className="text-muted me-2">
              {t(
                "parameterEstimation.pointEstimation.simulation.results.sampleStd",
              )}
              :
            </span>
            <strong className="text-warning text-nowrap">
              {stats.std.toFixed(2)}
            </strong>
          </div>
          <div className="border-start ps-4">
            <span className="text-muted me-2">
              {t("parameterEstimation.pointEstimation.simulation.results.sem")}:
            </span>
            <strong className="text-success text-nowrap">
              {stats.sem.toFixed(2)}
            </strong>
          </div>
        </div>
      </div>

      {/* ── SEM formula ── */}
      <div
        className="w-100 mb-4 text-center overflow-auto py-1"
        style={{ maxWidth: "800px" }}
      >
        <BlockMath
          math={`\\sigma_{\\bar{x}} = \\frac{\\sigma}{\\sqrt{n}} = \\frac{${popStd}}{\\sqrt{${n}}} = ${stats.sem.toFixed(4)}`}
        />
      </div>

      {/* ── Legend — outside charts-wrapper to avoid grid column layout ── */}
      <div
        className="d-flex justify-content-center flex-wrap gap-3 mb-2 w-100"
        style={{ maxWidth: "800px" }}
      >
        {(targetParam === "mean" ? legendMean : legendStd).map(
          ({ label, color, dashed }) => (
            <span key={label} className="small d-flex align-items-center gap-1">
              <svg width="18" height="10">
                {dashed ? (
                  <>
                    <line
                      x1="0"
                      y1="5"
                      x2="4"
                      y2="5"
                      stroke={color}
                      strokeWidth="2"
                    />
                    <line
                      x1="7"
                      y1="5"
                      x2="11"
                      y2="5"
                      stroke={color}
                      strokeWidth="2"
                    />
                    <line
                      x1="14"
                      y1="5"
                      x2="18"
                      y2="5"
                      stroke={color}
                      strokeWidth="2"
                    />
                  </>
                ) : (
                  <line
                    x1="0"
                    y1="5"
                    x2="18"
                    y2="5"
                    stroke={color}
                    strokeWidth="2"
                  />
                )}
              </svg>
              <span style={{ color }}>{label}</span>
            </span>
          ),
        )}
      </div>

      {/* ── Chart ── */}
      <div
        className="charts-wrapper w-100 mx-auto"
        style={{ maxWidth: "800px" }}
      >
        <StyledLineChart
          data={chartData}
          xLabel="x"
          yLabel="f(x)"
          type="pdf"
          lineClass="chart-line-secondary"
          hoverX={hoverX}
          setHoverX={setHoverX}
          extraRows={
            snappedEmpirical !== null
              ? [
                  {
                    label: "f̂(x)",
                    value: snappedEmpirical,
                    color: "var(--bs-primary)",
                  },
                ]
              : []
          }
        >
          {/* key forces remount → replays fill animation on every new sample */}
          <BackgroundArea
            key={histogramKey}
            dataKey="empirical"
            type="stepBefore"
            color="var(--bs-primary)"
            fillOpacity={0.25}
            strokeWidth={0}
            isAnimationActive={true}
            animationDuration={600}
          />

          {targetParam === "mean" ? (
            <>
              <ReferenceLine
                x={popMean}
                stroke="var(--bs-success)"
                strokeWidth={2}
                opacity={0.8}
              />
              <ReferenceLine
                x={stats.mean}
                stroke="var(--bs-primary)"
                strokeDasharray="5 5"
                strokeWidth={2}
              />
            </>
          ) : (
            <>
              <ReferenceLine
                x={popMean - popStd}
                stroke="var(--bs-warning)"
                strokeDasharray="3 3"
                opacity={0.8}
              />
              <ReferenceLine
                x={popMean + popStd}
                stroke="var(--bs-warning)"
                strokeDasharray="3 3"
                opacity={0.8}
              />
              <ReferenceLine
                x={stats.mean - stats.std}
                stroke="var(--bs-danger)"
                strokeDasharray="5 5"
              />
              <ReferenceLine
                x={stats.mean + stats.std}
                stroke="var(--bs-danger)"
                strokeDasharray="5 5"
              />
            </>
          )}
        </StyledLineChart>
      </div>
    </div>
  );
}

export default PointEstimationSimulation;
