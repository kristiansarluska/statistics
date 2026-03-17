// src/components/content/parameterEstimation/PointEstimationSimulation.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ReferenceLine } from "recharts";
import { BlockMath } from "react-katex";
import StyledLineChart from "../../charts/helpers/StyledLineChart";
import BackgroundArea from "../../charts/helpers/BackgroundArea";
import StatsBadge from "../helpers/StatsBadge"; // <--- Import nového komponentu
import { randomNormal, normalPdf } from "../../../utils/distributions";

function PointEstimationSimulation() {
  const { t } = useTranslation();

  const [popMean, setPopMean] = useState(312);
  const [popStd, setPopStd] = useState(8);
  const [n, setN] = useState(15);
  const [targetParam, setTargetParam] = useState("mean");

  const [sampleData, setSampleData] = useState([]);
  const [stats, setStats] = useState({ mean: 0, std: 0, sem: 0 });

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
    setStats({ mean: sampleMean, std: sampleStd, sem: sem });
  }, [popMean, popStd, n]);

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
      const empiricalDensity = bins[binIdx] / (n * binWidth);

      points.push({
        x: Number(x.toFixed(2)),
        y: normalPdf(x, popMean, popStd),
        empirical: empiricalDensity,
      });
    }

    return points;
  }, [sampleData, popMean, popStd, n]);

  // Príprava dát pre StatsBadge
  const badgeItems = [
    {
      label: t(
        "parameterEstimation.pointEstimation.simulation.results.sampleMean",
      ),
      value: stats.mean.toFixed(2),
      color: "text-primary",
      groupStart: true, // Prvá položka skupiny
    },
    {
      label: t(
        "parameterEstimation.pointEstimation.simulation.results.sampleStd",
      ),
      value: stats.std.toFixed(2),
      color: "text-warning",
      groupStart: false, // Patrí k predchádzajúcej skupine (bez deliacej čiary)
    },
    {
      label: t("parameterEstimation.pointEstimation.simulation.results.sem"),
      value: stats.sem.toFixed(2),
      color: "text-success",
      groupStart: true, // Nová skupina (vytvorí deliacu čiaru)
    },
  ];

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-5 w-100">
      <div
        className="controls mb-4 d-flex flex-wrap justify-content-center gap-5 w-100"
        style={{ maxWidth: "800px" }}
      >
        <div
          className="d-flex flex-column align-items-center flex-grow-1"
          style={{ minWidth: "220px" }}
        >
          <label
            className="form-label fw-bold mb-2 text-center"
            style={{ fontSize: "0.9rem" }}
          >
            {t(
              "parameterEstimation.pointEstimation.simulation.controls.target",
            )}
          </label>
          <ul className="nav nav-pills nav-fill bg-body-tertiary p-1 rounded-pill shadow-sm w-100">
            <li className="nav-item">
              <button
                className={`nav-link rounded-pill ${targetParam === "mean" ? "active" : "text-body"}`}
                onClick={() => setTargetParam("mean")}
                style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}
              >
                {t(
                  "parameterEstimation.pointEstimation.simulation.controls.targetMean",
                )}
              </button>
            </li>
            <li className="nav-item">
              <button
                className={`nav-link rounded-pill ${targetParam === "std" ? "active" : "text-body"}`}
                onClick={() => setTargetParam("std")}
                style={{ fontSize: "0.85rem", padding: "0.4rem 0.8rem" }}
              >
                {t(
                  "parameterEstimation.pointEstimation.simulation.controls.targetStd",
                )}
              </button>
            </li>
          </ul>
        </div>

        <div className="d-flex flex-column align-items-center flex-grow-1">
          <label
            className="form-label fw-bold mb-2 text-center"
            style={{ fontSize: "0.9rem" }}
          >
            {t(
              "parameterEstimation.pointEstimation.simulation.controls.popMean",
            )}
            <span
              className="text-primary d-inline-block text-start ms-2"
              style={{ width: "35px" }}
            >
              {popMean}
            </span>
          </label>
          <input
            type="range"
            className="form-range"
            min="100"
            max="1000"
            step="10"
            value={popMean}
            onChange={(e) => setPopMean(Number(e.target.value))}
            style={{ maxWidth: "180px" }}
          />
        </div>

        <div className="d-flex flex-column align-items-center flex-grow-1">
          <label
            className="form-label fw-bold mb-2 text-center"
            style={{ fontSize: "0.9rem" }}
          >
            {t(
              "parameterEstimation.pointEstimation.simulation.controls.popStd",
            )}
            <span
              className="text-primary d-inline-block text-start ms-2"
              style={{ width: "35px" }}
            >
              {popStd}
            </span>
          </label>
          <input
            type="range"
            className="form-range"
            min="1"
            max="100"
            step="1"
            value={popStd}
            onChange={(e) => setPopStd(Number(e.target.value))}
            style={{ maxWidth: "180px" }}
          />
        </div>

        <div className="d-flex flex-column align-items-center flex-grow-1">
          <label
            className="form-label fw-bold mb-2 text-center"
            style={{ fontSize: "0.9rem" }}
          >
            {t(
              "parameterEstimation.pointEstimation.simulation.controls.sampleSize",
            )}
            <span
              className="text-primary d-inline-block text-start ms-2"
              style={{ width: "35px" }}
            >
              {n}
            </span>
          </label>
          <input
            type="range"
            className="form-range"
            min="5"
            max="200"
            step="5"
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            style={{ maxWidth: "180px" }}
          />
        </div>
      </div>

      <div className="w-100 mb-4 text-center" style={{ maxWidth: "800px" }}>
        {/* Použitie nového StatsBadge komponentu */}
        <div className="mb-3">
          <StatsBadge items={badgeItems} />
        </div>

        <div className="overflow-auto py-1">
          <BlockMath
            math={`\\sigma_{\\bar{x}} = \\frac{\\sigma}{\\sqrt{n}} = \\frac{${popStd}}{\\sqrt{${n}}} = ${stats.sem.toFixed(4)}`}
          />
        </div>
      </div>

      <h6 className="mb-3 text-center">
        {t("parameterEstimation.pointEstimation.simulation.title")}
      </h6>

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

          {targetParam === "mean" ? (
            <>
              <ReferenceLine
                x={popMean}
                stroke="var(--bs-success)"
                strokeWidth={2}
                opacity={0.8}
                label={{
                  position: "top",
                  value: `μ = ${popMean}`,
                  fill: "var(--bs-success)",
                }}
              />
              <ReferenceLine
                x={stats.mean}
                stroke="var(--bs-primary)"
                strokeDasharray="5 5"
                strokeWidth={2}
                label={{
                  position: "bottom",
                  value: `x̄ = ${stats.mean.toFixed(1)}`,
                  fill: "var(--bs-primary)",
                }}
              />
            </>
          ) : (
            <>
              <ReferenceLine
                x={popMean - popStd}
                stroke="var(--bs-warning)"
                strokeDasharray="3 3"
                opacity={0.8}
                label={{
                  position: "top",
                  value: `μ - σ = ${popMean - popStd}`,
                  fill: "var(--bs-warning)",
                }}
              />
              <ReferenceLine
                x={popMean + popStd}
                stroke="var(--bs-warning)"
                strokeDasharray="3 3"
                opacity={0.8}
                label={{
                  position: "top",
                  value: `μ + σ = ${popMean + popStd}`,
                  fill: "var(--bs-warning)",
                }}
              />

              <ReferenceLine
                x={stats.mean - stats.std}
                stroke="var(--bs-danger)"
                strokeDasharray="5 5"
                label={{
                  position: "bottom",
                  value: `x̄ - s = ${(stats.mean - stats.std).toFixed(1)}`,
                  fill: "var(--bs-danger)",
                }}
              />
              <ReferenceLine
                x={stats.mean + stats.std}
                stroke="var(--bs-danger)"
                strokeDasharray="5 5"
                label={{
                  position: "bottom",
                  value: `x̄ + s = ${(stats.mean + stats.std).toFixed(1)}`,
                  fill: "var(--bs-danger)",
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
