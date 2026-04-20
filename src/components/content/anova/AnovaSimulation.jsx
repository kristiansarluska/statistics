// src/components/content/anova/AnovaSimulation.jsx
import React, { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  generateSample,
  calculateKDE,
  calculateANOVA,
  calculateTukeyHSD,
} from "../../../utils/anovaMath";
import AnovaTable from "./AnovaTable";
import TukeyChart from "../../charts/anova/TukeyChart";
import ResetButton from "../../charts/helpers/ResetButton";
import DataPreviewTable from "../../charts/helpers/DataPreviewTable";
import StyledLineChart from "../../charts/helpers/StyledLineChart";
import useFetch from "../../../hooks/useFetch";

const SAMPLE_SIZE = 31;
const X_MIN = 5;
const X_MAX = 40;
const KDE_BANDWIDTH = 1.4;

/**
 * Helper function to create a standardized group object from an initial data array.
 * Calculates descriptive statistics and Kernel Density Estimation (KDE) curve points.
 */
const createGroup = (name, initialSample, color) => {
  const n = initialSample.length;
  const mean = Number(
    (initialSample.reduce((a, b) => a + b, 0) / n).toFixed(1),
  );
  const variance =
    initialSample.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (n - 1);
  const std = Number(Math.sqrt(variance).toFixed(1));

  return {
    name,
    mean,
    std,
    color,
    sample: initialSample,
    kde: calculateKDE(initialSample, KDE_BANDWIDTH, X_MIN, X_MAX),
  };
};

/**
 * Transforms raw CSV text into the initial group definitions.
 * Defined outside the component so useFetch receives a stable reference.
 */
const transformOpenMeteoCSV = (csvText) => {
  const rows = csvText.trim().split("\n").slice(1);

  const olomouc = [];
  const prerov = [];
  const jesenik = [];

  rows.forEach((row) => {
    const cols = row.split(",");
    if (cols.length >= 4) {
      olomouc.push(Number(cols[1]));
      prerov.push(Number(cols[2]));
      jesenik.push(Number(cols[3]));
    }
  });

  return [
    createGroup("Olomouc", olomouc, "var(--bs-danger)"),
    createGroup("Přerov", prerov, "var(--bs-warning)"),
    createGroup("Jeseník", jesenik, "var(--bs-info)"),
  ];
};

/**
 * @component AnovaSimulation
 * @description Interactive ANOVA dashboard. Loads historical meteorological data,
 * allows users to simulate changes in mean and standard deviation via sliders,
 * and visualizes the results using KDE distributions, ANOVA tables, and Tukey HSD charts.
 */
function AnovaSimulation() {
  const { t } = useTranslation();

  const csvUrl = `${import.meta.env.BASE_URL}data/OpenMeteo.csv`;

  // useFetch replaces the manual useEffect + fetch + state boilerplate
  const {
    data: originalGroups,
    loading: isLoading,
    error,
  } = useFetch(csvUrl, transformOpenMeteoCSV);

  // Local mutable state derived from the fetched originals
  const [groups, setGroups] = useState(null);
  const [modifiedGroups, setModifiedGroups] = useState(new Set());
  const [hoverX, setHoverX] = useState(null);

  // Sync local groups once original data arrives (only on first load)
  const activeGroups = groups ?? originalGroups ?? [];

  /**
   * Updates a specific group parameter (mean or std) based on slider input.
   * Generates a new random sample and recalculates the KDE curve.
   */
  const handleParamChange = (index, key, value) => {
    const groupName = activeGroups[index].name;

    setGroups((prev) => {
      const source = prev ?? originalGroups;
      const updatedGroups = [...source];
      const group = { ...updatedGroups[index], [key]: value };

      const newSample = generateSample(group.mean, group.std, SAMPLE_SIZE);
      const newKde = calculateKDE(newSample, KDE_BANDWIDTH, X_MIN, X_MAX);

      updatedGroups[index] = { ...group, sample: newSample, kde: newKde };
      return updatedGroups;
    });

    setModifiedGroups((prev) => new Set(prev).add(groupName));
  };

  /**
   * Restores all groups to their original historical datasets
   */
  const handleReset = () => {
    setGroups(null);
    setModifiedGroups(new Set());
  };

  /**
   * Flattens KDE data for the Recharts line chart component
   */
  const chartData = useMemo(() => {
    if (activeGroups.length === 0) return [];
    return activeGroups[0].kde.map((point, i) => {
      const dataPoint = { x: point.x };
      activeGroups.forEach((g) => {
        dataPoint[g.name] = g.kde[i].y;
      });
      return dataPoint;
    });
  }, [activeGroups]);

  /**
   * Prepares series metadata for the distribution chart
   */
  const chartSeries = useMemo(
    () =>
      activeGroups.map((g) => ({ key: g.name, name: g.name, color: g.color })),
    [activeGroups],
  );

  /**
   * Computes one-way ANOVA statistics dynamically when data changes
   */
  const anovaStats = useMemo(() => {
    if (activeGroups.length === 0) return null;
    return calculateANOVA(activeGroups.map((g) => g.sample));
  }, [activeGroups]);

  /**
   * Computes Tukey's Honestly Significant Difference (HSD) post-hoc test
   */
  const tukeyResults = useMemo(() => {
    if (!anovaStats) return [];

    return calculateTukeyHSD(anovaStats.groupStats, anovaStats.msW).map(
      (res) => ({
        ...res,
        pair: `${activeGroups[res.group1].name} – ${activeGroups[res.group2].name}`,
      }),
    );
  }, [anovaStats, activeGroups]);

  /**
   * Prepares raw data rows for the preview table
   */
  const tableData = useMemo(() => {
    if (activeGroups.length === 0) return [];
    return Array.from({ length: SAMPLE_SIZE }, (_, i) => {
      const row = { day: i + 1 };
      activeGroups.forEach((g) => {
        row[g.name] = Number(g.sample[i]).toFixed(2);
      });
      return row;
    });
  }, [activeGroups]);

  /**
   * Defines column structure for the preview table, adding visual cues for modified data
   */
  const tableColumns = useMemo(() => {
    if (activeGroups.length === 0) return [];

    return [
      { key: "day", label: t("components.anovaSimulation.dayOfMonth") },
      ...activeGroups.map((g) => ({
        key: g.name,
        label: g.name,
        render: (value) => (
          <span
            className={
              modifiedGroups.has(g.name)
                ? "text-warning fst-italic fw-medium"
                : ""
            }
          >
            {value}
          </span>
        ),
      })),
    ];
  }, [activeGroups, modifiedGroups, t]);

  if (isLoading) {
    return (
      <div className="text-center p-5 text-muted">
        <div className="spinner-border spinner-border-sm me-2" role="status" />
        {t("components.anovaSimulation.loading")}
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger">
        {t("components.anovaSimulation.errorPrefix")} {error}
      </div>
    );
  }

  return (
    <div className="anova-simulation">
      {/* Inline styles for custom slider colors */}
      <style>
        {`
          .colored-slider::-webkit-slider-thumb {
            background-color: var(--slider-color) !important;
          }
          .colored-slider::-moz-range-thumb {
            background-color: var(--slider-color) !important;
          }
        `}
      </style>

      {/* Controls Section */}
      <div className="row g-3 mb-4">
        {activeGroups.map((group, index) => (
          <div key={group.name} className="col-md-4">
            <div
              className="card border-0"
              style={{ borderTop: `4px solid ${group.color}` }}
            >
              <div className="card-body">
                <h6
                  className="card-title fw-bold"
                  style={{ color: group.color }}
                >
                  {t("components.anovaSimulation.city", { name: group.name })}
                </h6>

                <label className="form-label small mb-0">μ: {group.mean}</label>
                <input
                  type="range"
                  className="form-range colored-slider"
                  style={{ "--slider-color": group.color }}
                  min="8"
                  max="32"
                  step="0.1"
                  value={group.mean}
                  onChange={(e) =>
                    handleParamChange(index, "mean", Number(e.target.value))
                  }
                />

                <label className="form-label small mb-0 mt-2">
                  σ: {group.std}
                </label>
                <input
                  type="range"
                  className="form-range colored-slider"
                  style={{ "--slider-color": group.color }}
                  min="0.5"
                  max="5"
                  step="0.1"
                  value={group.std}
                  onChange={(e) =>
                    handleParamChange(index, "std", Number(e.target.value))
                  }
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Reset Area */}
      <div className="d-flex justify-content-end align-items-center mb-4 mt-n2 gap-2 text-muted small">
        {modifiedGroups.size > 0 && (
          <span className="fst-italic">
            {t("components.anovaSimulation.simulatedDataWarning")}
          </span>
        )}
        <ResetButton
          onClick={handleReset}
          disabled={modifiedGroups.size === 0}
          title={t("components.anovaSimulation.resetTitle")}
        />
      </div>

      {/* Distribution Chart Visualization */}
      <div className="charts-wrapper w-100">
        <StyledLineChart
          data={chartData}
          xLabel={t("components.anovaSimulation.distributionChart.xAxis")}
          yLabel={t("components.anovaSimulation.distributionChart.yAxis")}
          series={chartSeries}
          hoverX={hoverX}
          setHoverX={setHoverX}
          minX={X_MIN}
          maxX={X_MAX}
          yDomain={[0, "dataMax"]}
          yTickCount={8}
          yTickFormatter={(val) => val.toFixed(2)}
        />
      </div>

      {/* Post-Hoc Analysis and ANOVA Table */}
      <TukeyChart results={tukeyResults} />

      <div className="pt-4 pb-4">
        <AnovaTable stats={anovaStats} />
      </div>

      {/* Data Table Preview */}
      <div
        className="mb-4 mx-auto"
        style={{ maxWidth: "800px", width: "100%" }}
      >
        <DataPreviewTable
          data={tableData}
          columns={tableColumns}
          previewRows={5}
          title={
            <span
              className={
                modifiedGroups.size > 0 ? "text-warning" : "text-success"
              }
            >
              <i
                className={`bi ${modifiedGroups.size > 0 ? "bi-exclamation-triangle-fill" : "bi-check-circle-fill"} me-2`}
              />
              {modifiedGroups.size > 0
                ? t("components.anovaSimulation.simulationTitle", {
                    cities: Array.from(modifiedGroups).join(", "),
                  })
                : t("components.anovaSimulation.historicalTitle")}
            </span>
          }
          originalFileUrl={csvUrl}
          originalFileName="OpenMeteo.csv"
          downloadBtnLabel={t("components.anovaSimulation.downloadBtn")}
        />
      </div>
    </div>
  );
}

export default AnovaSimulation;
