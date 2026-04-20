// src/components/content/anova/AnovaSimulation.jsx
import React, { useState, useEffect, useMemo } from "react";
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

const SAMPLE_SIZE = 31;
const X_MIN = 5;
const X_MAX = 40;
const KDE_BANDWIDTH = 1.4;

/**
 * Helper function to create a standardized group object from an initial data array.
 * Calculates descriptive statistics and Kernel Density Estimation (KDE) curve points.
 * * @param {string} name - The name of the group (e.g., city name)
 * @param {Array<number>} initialSample - Array of numeric data points
 * @param {string} color - CSS color variable or hex code for visualizations
 * @returns {Object} Structured group object with computed stats and KDE data
 */
const createGroup = (name, initialSample, color) => {
  const n = initialSample.length;
  // Calculate sample mean
  const mean = Number(
    (initialSample.reduce((a, b) => a + b, 0) / n).toFixed(1),
  );
  // Calculate sample variance (n - 1)
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
 * @component AnovaSimulation
 * @description Interactive ANOVA dashboard. Loads historical meteorological data,
 * allows users to simulate changes in mean and standard deviation via sliders,
 * and visualizes the results using KDE distributions, ANOVA tables, and Tukey HSD charts.
 */
function AnovaSimulation() {
  const { t } = useTranslation();

  // State for dataset management
  const [groups, setGroups] = useState([]);
  const [originalGroups, setOriginalGroups] = useState([]);
  const [modifiedGroups, setModifiedGroups] = useState(new Set());

  // UI states
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoverX, setHoverX] = useState(null);

  /**
   * Fetches and parses initial CSV data on mount.
   */
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}data/OpenMeteo.csv`,
        );
        if (!response.ok)
          throw new Error(t("components.anovaSimulation.fetchError"));

        const csvText = await response.text();
        const rows = csvText.trim().split("\n").slice(1);

        const olomouc = [];
        const prerov = [];
        const jesenik = [];

        // Manual CSV parsing assuming fixed column indices
        rows.forEach((row) => {
          const cols = row.split(",");
          if (cols.length >= 4) {
            olomouc.push(Number(cols[1]));
            prerov.push(Number(cols[2]));
            jesenik.push(Number(cols[3]));
          }
        });

        // Initialize groups. City names are kept as proper nouns.
        const initialData = [
          createGroup("Olomouc", olomouc, "var(--bs-danger)"),
          createGroup("Přerov", prerov, "var(--bs-warning)"),
          createGroup("Jeseník", jesenik, "var(--bs-info)"),
        ];

        setGroups(initialData);
        setOriginalGroups(initialData);
        setIsLoading(false);
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setIsLoading(false);
      }
    };

    fetchData();
  }, [t]);

  /**
   * Updates a specific group parameter (mean or std) based on slider input.
   * Generates a new random sample and recalculates the KDE curve.
   * @param {number} index - Index of the group being modified
   * @param {string} key - Parameter to modify ('mean' or 'std')
   * @param {number} value - New parameter value
   */
  const handleParamChange = (index, key, value) => {
    const groupName = groups[index].name;

    setGroups((prev) => {
      const updatedGroups = [...prev];
      const group = { ...updatedGroups[index], [key]: value };

      // Generate new simulated dataset based on updated parameters
      const newSample = generateSample(group.mean, group.std, SAMPLE_SIZE);
      const newKde = calculateKDE(newSample, KDE_BANDWIDTH, X_MIN, X_MAX);

      updatedGroups[index] = { ...group, sample: newSample, kde: newKde };
      return updatedGroups;
    });

    // Track which groups have been altered from their historical state
    setModifiedGroups((prev) => new Set(prev).add(groupName));
  };

  /**
   * Restores all groups to their original historical datasets
   */
  const handleReset = () => {
    setGroups(originalGroups);
    setModifiedGroups(new Set());
  };

  /**
   * Flattens KDE data for the Recharts line chart component
   */
  const chartData = useMemo(() => {
    if (groups.length === 0) return [];
    return groups[0].kde.map((point, i) => {
      const dataPoint = { x: point.x };
      groups.forEach((g) => {
        dataPoint[g.name] = g.kde[i].y;
      });
      return dataPoint;
    });
  }, [groups]);

  /**
   * Prepares series metadata for the distribution chart
   */
  const chartSeries = useMemo(() => {
    return groups.map((g) => ({
      key: g.name,
      name: `${g.name}`,
      color: g.color,
    }));
  }, [groups]);

  /**
   * Computes one-way ANOVA statistics dynamically when data changes
   */
  const anovaStats = useMemo(() => {
    if (groups.length === 0) return null;
    const rawDataGroups = groups.map((g) => g.sample);
    return calculateANOVA(rawDataGroups);
  }, [groups]);

  /**
   * Computes Tukey's Honestly Significant Difference (HSD) post-hoc test
   */
  const tukeyResults = useMemo(() => {
    if (!anovaStats) return [];

    const rawResults = calculateTukeyHSD(anovaStats.groupStats, anovaStats.msW);

    return rawResults.map((res) => {
      const name1 = groups[res.group1].name;
      const name2 = groups[res.group2].name;

      return {
        ...res,
        pair: `${name1} – ${name2}`,
      };
    });
  }, [anovaStats, groups]);

  /**
   * Prepares raw data rows for the preview table
   */
  const tableData = useMemo(() => {
    if (groups.length === 0) return [];
    const rows = [];
    for (let i = 0; i < SAMPLE_SIZE; i++) {
      const row = { day: i + 1 };
      groups.forEach((g) => {
        row[g.name] = Number(g.sample[i]).toFixed(2);
      });
      rows.push(row);
    }
    return rows;
  }, [groups]);

  /**
   * Defines column structure for the preview table, adding visual cues for modified data
   */
  const tableColumns = useMemo(() => {
    if (groups.length === 0) return [];

    const cols = [
      { key: "day", label: t("components.anovaSimulation.dayOfMonth") },
    ];

    groups.forEach((g) => {
      const isThisGroupModified = modifiedGroups.has(g.name);

      cols.push({
        key: g.name,
        label: g.name,
        render: (value) => (
          <span
            className={
              isThisGroupModified ? "text-warning fst-italic fw-medium" : ""
            }
          >
            {value}
          </span>
        ),
      });
    });

    return cols;
  }, [groups, modifiedGroups, t]);

  if (isLoading) {
    return (
      <div className="text-center p-5 text-muted">
        <div
          className="spinner-border spinner-border-sm me-2"
          role="status"
        ></div>
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
      {/* Note: In a larger app, prefer CSS modules or styled-components to avoid global scope pollution */}
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
        {groups.map((group, index) => (
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
              ></i>
              {modifiedGroups.size > 0
                ? t("components.anovaSimulation.simulationTitle", {
                    cities: Array.from(modifiedGroups).join(", "),
                  })
                : t("components.anovaSimulation.historicalTitle")}
            </span>
          }
          originalFileUrl={`${import.meta.env.BASE_URL}data/OpenMeteo.csv`}
          originalFileName="OpenMeteo.csv"
          downloadBtnLabel={t("components.anovaSimulation.downloadBtn")}
        />
      </div>
    </div>
  );
}

export default AnovaSimulation;
