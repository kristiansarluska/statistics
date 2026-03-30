// src/components/content/parameterEstimation/PointEstimationSimulation.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ReferenceLine } from "recharts";
import { BlockMath } from "react-katex";
import StyledLineChart from "../../charts/helpers/StyledLineChart";
import BackgroundArea from "../../charts/helpers/BackgroundArea";
import StatsBadge from "../helpers/StatsBadge";
import ResetButton from "../../charts/helpers/ResetButton";
import { randomNormal, normalPdf } from "../../../utils/distributions";

// Fixed population parameters for Mount Praděd height measurement
const PRADED_MEAN = 1492.0;
const PRADED_STD = 5.0;
const MAX_SAMPLES = 100;

function PointEstimationSimulation() {
  const { t } = useTranslation();

  const [n, setN] = useState(15);
  const [targetParam, setTargetParam] = useState("mean");
  const [samplesHistory, setSamplesHistory] = useState([]);
  const [hoverX, setHoverX] = useState(null);

  // Function to draw new samples
  const draw = (count) => {
    const newSamples = [];
    for (let j = 0; j < count; j++) {
      const data = [];
      let sum = 0;
      for (let i = 0; i < n; i++) {
        const val = randomNormal(PRADED_MEAN, PRADED_STD);
        data.push(val);
        sum += val;
      }
      const sampleMean = sum / n;

      let sumSq = 0;
      for (let i = 0; i < n; i++) {
        sumSq += Math.pow(data[i] - sampleMean, 2);
      }
      const sampleStd = Math.sqrt(sumSq / (n - 1));

      newSamples.push({ mean: sampleMean, std: sampleStd, data });
    }
    // Pridanie na koniec poľa (najnovšie záznamy budú vpravo)
    setSamplesHistory((prev) => [...prev, ...newSamples].slice(-MAX_SAMPLES));
  };

  // Reset and draw 1 initial sample when sample size changes
  useEffect(() => {
    setSamplesHistory([]);
    draw(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [n]);

  // Posledný pridaný vzor je teraz na konci poľa
  const lastSample = samplesHistory[samplesHistory.length - 1] || {
    mean: 0,
    std: 0,
    data: [],
  };
  const totalSamples = samplesHistory.length;
  const sem = PRADED_STD / Math.sqrt(n);

  const chartData = useMemo(() => {
    if (lastSample.data.length === 0) return [];

    const minX = PRADED_MEAN - 4 * PRADED_STD;
    const maxX = PRADED_MEAN + 4 * PRADED_STD;

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

  // Vypočítame presné lokálne maximum Y-osi pre odstránenie prázdnej medzery na vrchu
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
      color: "text-primary",
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
      color: "text-success",
      groupStart: true,
    },
  ];

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-5 w-100">
      <div
        className="controls mb-4 d-flex flex-wrap justify-content-center gap-4 w-100"
        style={{ maxWidth: "800px" }}
      >
        {/* Target Parameter Toggle */}
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

        {/* Action Buttons & Sample Size */}
        <div className="d-flex flex-wrap align-items-center justify-content-center gap-4 mt-2 w-100">
          <div className="d-flex align-items-center gap-2">
            <label className="fw-bold small mb-0 text-nowrap">
              n ={" "}
              <span
                className="text-primary d-inline-block text-center"
                style={{ width: "24px" }}
              >
                {n}
              </span>
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
        {/* StatsBadge */}
        <div className="mb-3">
          <StatsBadge items={badgeItems} />
        </div>

        {/* História zaznamenaných výberov (Badges) */}
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

        {/* Vzorec SEM */}
        <div className="overflow-auto py-1">
          <BlockMath
            math={`\\sigma_{\\bar{x}} = \\frac{\\sigma}{\\sqrt{n}} = \\frac{${PRADED_STD}}{\\sqrt{${n}}} = ${sem.toFixed(4)}`}
          />
        </div>
      </div>

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
          yAxisDomain={[0, maxY * 1.05]}
        >
          <BackgroundArea
            dataKey="empirical"
            type="stepBefore"
            color="var(--bs-primary)"
            fillOpacity={0.25}
            strokeWidth={0}
            isAnimationActive={true}
            animationDuration={600}
          />

          {/* Ghost lines pre históriu (bez posledného výberu) */}
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
                    stroke="var(--bs-danger)"
                    strokeWidth={1}
                    opacity={0.2}
                  />
                  <ReferenceLine
                    x={s.mean + s.std}
                    stroke="var(--bs-danger)"
                    strokeWidth={1}
                    opacity={0.2}
                  />
                </>
              )}
            </React.Fragment>
          ))}

          {/* Posledný výber */}
          {targetParam === "mean" ? (
            <ReferenceLine
              x={lastSample.mean}
              stroke="var(--bs-success)"
              strokeWidth={2}
              label={{
                position: "top",
                value: `x̄ = ${lastSample.mean.toFixed(2)}`,
                fill: "var(--bs-success)",
                fontWeight: "bold",
              }}
            />
          ) : (
            <>
              <ReferenceLine
                x={lastSample.mean - lastSample.std}
                stroke="var(--bs-danger)"
                strokeWidth={2}
                label={{
                  position: "top",
                  value: `x̄ - s`,
                  fill: "var(--bs-danger)",
                  fontWeight: "bold",
                }}
              />
              <ReferenceLine
                x={lastSample.mean + lastSample.std}
                stroke="var(--bs-danger)"
                strokeWidth={2}
                label={{
                  position: "top",
                  value: `x̄ + s`,
                  fill: "var(--bs-danger)",
                  fontWeight: "bold",
                }}
              />
            </>
          )}
        </StyledLineChart>
      </div>
    </div>
  );
}

export default PointEstimationSimulation;
