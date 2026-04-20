// src/components/content/parameterEstimation/RealDataSampling.jsx
import React, { useState, useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import NutsMap from "../../maps/NutsMap";
import DataPreviewTable from "../../charts/helpers/DataPreviewTable";
import ResetButton from "../../charts/helpers/ResetButton";
import StatsBadge from "../helpers/StatsBadge";

// Population parameters based on the full NUTS3 dataset
const POP_MEAN = 46.2226;
const POP_STD = 3.7576;
const POP_VARIANCE = POP_STD * POP_STD;

/**
 * @function computeStats
 * @description Calculates essential statistical characteristics for a given array of numbers.
 * @param {number[]} vals - Array of numerical values (e.g., median ages).
 * @returns {Object} Object containing mean, standard deviation (std), variance, standard error of the mean (sem), and count (n).
 */
const computeStats = (vals) => {
  const n = vals.length;
  const mean = vals.reduce((a, b) => a + b, 0) / n;
  const variance =
    vals.reduce((a, v) => a + Math.pow(v - mean, 2), 0) / (n - 1);
  const sem = POP_STD / Math.sqrt(n);
  return { mean, std: Math.sqrt(variance), variance, sem, n };
};

/**
 * @component RealDataSampling
 * @description Interactive simulation allowing users to draw random samples from real-world geographic data.
 * It visualizes the sampled regions on a map, lists them in a table, and compares sample estimates
 * (mean or variance) against known population parameters.
 */
function RealDataSampling() {
  const { t } = useTranslation();

  // --- State Variables ---
  const [geoJsonData, setGeoJsonData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [n, setN] = useState(30);
  const [currentSample, setCurrentSample] = useState([]);
  const [targetParam, setTargetParam] = useState("mean");
  const [sampledStats, setSampledStats] = useState([]);
  const [hoveredNuts, setHoveredNuts] = useState(null);

  /**
   * Memoized column definitions for the DataPreviewTable to prevent unnecessary re-renders.
   */
  const SAMPLE_COLUMNS = useMemo(
    () => [
      {
        key: "name",
        label: t("parameterEstimation.realDataSampling.table.colRegion"),
        render: (val, row) => (
          <>
            <span className="fw-semibold">{val}</span>
            <span className="text-muted ms-2" style={{ fontSize: "0.78rem" }}>
              {row.nuts_id}
            </span>
          </>
        ),
      },
      {
        key: "country",
        label: t("parameterEstimation.realDataSampling.table.colCountry"),
      },
      {
        key: "median_age",
        label: t("parameterEstimation.realDataSampling.table.colMedianAge"),
        render: (val) => (
          <span className="text-primary fw-semibold">
            {Number(val).toFixed(1)}
          </span>
        ),
      },
    ],
    [t],
  );

  // Fetch geographical dataset on component mount
  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/NUTS3_median_age_EU.geojson`)
      .then((r) => r.json())
      .then((data) => {
        setGeoJsonData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  /**
   * @function drawSample
   * @description Randomly selects 'n' regions from the loaded GeoJSON dataset,
   * updates the current sample state, and computes/stores the statistical estimates.
   */
  const drawSample = useCallback(() => {
    if (!geoJsonData) return;
    const drawn = [...geoJsonData.features]
      .sort(() => Math.random() - 0.5)
      .slice(0, n);
    setCurrentSample(drawn);
    const stats = computeStats(drawn.map((f) => f.properties.median_age));
    setSampledStats((prev) => [...prev, stats]);
  }, [geoJsonData, n]);

  // Automatically draw the initial sample once data is loaded or when 'n' changes
  useEffect(() => {
    if (!loading && geoJsonData) {
      setSampledStats([]);
      drawSample();
    }
  }, [loading, geoJsonData, n]);

  const reset = () => {
    setSampledStats([]);
    drawSample();
  };

  /**
   * Computes statistics only for the currently displayed sample.
   */
  const currentStats = useMemo(() => {
    if (currentSample.length === 0) return null;
    return computeStats(currentSample.map((f) => f.properties.median_age));
  }, [currentSample]);

  /**
   * Calculates the arithmetic mean of all recorded sample estimates (Grand Mean).
   */
  const grandEstimate = useMemo(() => {
    if (sampledStats.length < 2) return null;
    const vals = sampledStats.map((s) =>
      targetParam === "mean" ? s.mean : s.variance,
    );
    return vals.reduce((a, b) => a + b, 0) / vals.length;
  }, [sampledStats, targetParam]);

  /**
   * Formats the statistical data to be consumed by the StatsBadge component.
   * Dynamically switches between Mean and Variance layouts based on user selection.
   */
  const badgeData = useMemo(() => {
    if (!currentStats) return { items: [], footer: null };

    const isVariance = targetParam === "variance";
    const popVal = isVariance ? POP_VARIANCE : POP_MEAN;
    const sampleVal = isVariance ? currentStats.variance : currentStats.mean;
    const estimateLabel = isVariance ? "s²" : "x̄";

    // Správne volanie funkcie t() pre získanie jednotiek
    const unitYears = t("parameterEstimation.realDataSampling.stats.years");
    const unitYearsSq = t(
      "parameterEstimation.realDataSampling.stats.yearsSquared",
    );
    const unit = isVariance ? unitYearsSq : unitYears;

    const hasMultipleSamples =
      sampledStats.length > 1 && grandEstimate !== null;
    const activeEstimate = hasMultipleSamples ? grandEstimate : sampleVal;
    const activeEstimateLabel = hasMultipleSamples
      ? `${estimateLabel}̄`
      : estimateLabel;
    const error = Math.abs(activeEstimate - popVal);

    const m = Math.max(1, sampledStats.length);
    const errorThreshold = isVariance
      ? (POP_VARIANCE * Math.sqrt(2 / (currentStats.n - 1))) / Math.sqrt(m)
      : currentStats.sem / Math.sqrt(m);

    const items = isVariance
      ? [
          {
            label: "s²",
            value: `${currentStats.variance.toFixed(3)} ${unitYearsSq}`,
            color: "text-primary",
            groupStart: true,
          },
          {
            label: "s",
            value: `${currentStats.std.toFixed(2)} ${unitYears}`,
            color: "text-warning",
            groupStart: false,
          },
          {
            label: "σ²",
            value: `${POP_VARIANCE.toFixed(3)} ${unitYearsSq}`,
            color: "text-secondary",
            groupStart: true,
          },
          {
            label: `|${activeEstimateLabel} − σ²|`,
            value: `${error.toFixed(3)} ${unitYearsSq}`,
            color: error <= errorThreshold ? "text-success" : "text-danger",
            groupStart: true,
          },
        ]
      : [
          {
            label: "x̄",
            value: `${currentStats.mean.toFixed(2)} ${unitYears}`,
            color: "text-primary",
            groupStart: true,
          },
          {
            label: "s",
            value: `${currentStats.std.toFixed(2)} ${unitYears}`,
            color: "text-warning",
            groupStart: false,
          },
          {
            label: "SEM",
            value: currentStats.sem.toFixed(3),
            color: "text-success",
            groupStart: false,
          },
          {
            label: "μ",
            value: `${POP_MEAN.toFixed(2)} ${unitYears}`,
            color: "text-secondary",
            groupStart: true,
          },
          {
            label: "σ",
            value: `${POP_STD.toFixed(2)} ${unitYears}`,
            color: "text-secondary",
            groupStart: false,
          },
          {
            label: `|${activeEstimateLabel} − μ|`,
            value: `${error.toFixed(3)} ${unitYears}`,
            color: error <= errorThreshold ? "text-success" : "text-danger",
            groupStart: true,
          },
        ];

    const footer = hasMultipleSamples ? (
      <>
        <span className="text-muted me-1">
          {t("parameterEstimation.realDataSampling.stats.grandMean", {
            count: sampledStats.length,
          })}
        </span>
        <strong style={{ color: "var(--bs-primary)" }}>
          {activeEstimateLabel} = {grandEstimate.toFixed(3)} {unit}
        </strong>
      </>
    ) : null;

    return { items, footer };
  }, [currentStats, targetParam, sampledStats, grandEstimate, t]);
  const tableRows = useMemo(
    () => currentSample.map((f) => ({ ...f.properties })),
    [currentSample],
  );

  const selectedIds = useMemo(
    () => currentSample.map((f) => f.properties.nuts_id),
    [currentSample],
  );

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="d-flex flex-column align-items-center w-100 mb-5">
      {/* ── Controls Section ── */}
      <div
        className="d-flex flex-wrap justify-content-center align-items-end gap-4 mb-4 w-100"
        style={{ maxWidth: "1100px" }}
      >
        {/* Target Parameter Toggle (Mean vs. Variance) */}
        <div className="d-flex flex-column align-items-center">
          <label
            className="form-label fw-bold mb-2 text-center"
            style={{ fontSize: "0.9rem" }}
          >
            {t("parameterEstimation.realDataSampling.controls.target")}
          </label>
          <div className="btn-group" role="group">
            {[
              {
                value: "mean",
                label: t(
                  "parameterEstimation.realDataSampling.controls.targetMean",
                ),
              },
              {
                value: "variance",
                label: t(
                  "parameterEstimation.realDataSampling.controls.targetVar",
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

        {/* Sample Size (n) Slider */}
        <div className="d-flex flex-column align-items-center">
          <label
            className="form-label fw-bold mb-2 text-center"
            style={{ fontSize: "0.9rem" }}
          >
            {t("parameterEstimation.realDataSampling.controls.sampleSize")}
            <span
              className="text-primary ms-2"
              style={{ width: 40, display: "inline-block" }}
            >
              {n}
            </span>
          </label>
          <input
            type="range"
            className="form-range"
            min={5}
            max={200}
            step={5}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            style={{ maxWidth: 200 }}
          />
        </div>

        {/* Action Buttons (Generate New Sample & Clear History) */}
        <div className="d-flex align-items-center gap-2">
          <button
            type="button"
            className="btn btn-primary btn-sm rounded-pill px-4"
            onClick={drawSample}
          >
            {t("parameterEstimation.realDataSampling.controls.generate")}
          </button>
          <ResetButton
            onClick={reset}
            disabled={sampledStats.length <= 1}
            title={t("parameterEstimation.realDataSampling.controls.clear")}
          />
        </div>
      </div>

      {/* ── Current Sample Statistics Badge ── */}
      {currentStats && (
        <div
          className="w-100 mb-3 d-flex justify-content-center px-2"
          style={{ maxWidth: "1100px" }}
        >
          <StatsBadge items={badgeData.items} footer={badgeData.footer} />
        </div>
      )}

      {/* ── History of Sampled Estimates (Pills Array) ── */}
      {sampledStats.length > 0 && (
        <div className="w-100 mb-4 text-center" style={{ maxWidth: "1100px" }}>
          <div
            className="px-3 py-2 rounded-4 bg-body-tertiary border shadow-sm d-inline-flex flex-wrap justify-content-center gap-2 align-items-center"
            style={{ fontSize: "0.85rem" }}
          >
            <span className="text-muted" style={{ fontSize: "0.82rem" }}>
              {targetParam === "mean"
                ? t("parameterEstimation.realDataSampling.stats.recordedMeans")
                : t("parameterEstimation.realDataSampling.stats.recordedVars")}
            </span>
            {sampledStats.map((s, i) => {
              const val = targetParam === "mean" ? s.mean : s.variance;
              return (
                <span
                  key={i}
                  className="badge rounded-pill"
                  style={{
                    background:
                      i === sampledStats.length - 1
                        ? "var(--bs-primary)"
                        : "var(--bs-secondary-bg)",
                    color:
                      i === sampledStats.length - 1
                        ? "#fff"
                        : "var(--bs-body-color)",
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

      {/* ── Data Visualization Section (Map & Table) ── */}
      <div
        className="w-100 d-flex flex-column flex-lg-row gap-3 align-items-start"
        style={{ maxWidth: "1100px" }}
      >
        {/* Geographic Map displaying highlighted sampled regions */}
        <div className="w-100" style={{ flex: "0 0 55%", minWidth: 0 }}>
          <NutsMap
            geoJsonData={geoJsonData}
            selectedIds={selectedIds}
            hoveredId={hoveredNuts}
            onRegionHover={setHoveredNuts}
          />
        </div>

        {/* Table representation of the current sample data */}
        <div className="w-100" style={{ flex: "1 1 0", minWidth: 0 }}>
          <DataPreviewTable
            data={tableRows}
            columns={SAMPLE_COLUMNS}
            previewRows={10}
            title={t("parameterEstimation.realDataSampling.table.title")}
            rowKey="nuts_id"
            hoveredRowKey={hoveredNuts}
            onRowHover={setHoveredNuts}
            originalFileUrl={`${import.meta.env.BASE_URL}data/NUTS3_median_age_EU.geojson`}
            originalFileName="NUTS3_median_age_EU.geojson"
          />
        </div>
      </div>
    </div>
  );
}

export default RealDataSampling;
