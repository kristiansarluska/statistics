// src/components/content/anova/AnovaSimulation.jsx
import React, { useState, useEffect, useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  generateSample,
  calculateKDE,
  calculateANOVA,
  calculateTukeyHSD,
} from "../../../utils/anovaMath";
import AnovaControls from "./AnovaControls";
import AnovaDistributionChart from "../../charts/anova/AnovaDistributionChart";
import AnovaTable from "./AnovaTable";
import TukeyChart from "../../charts/anova/TukeyChart";
import ResetButton from "../../charts/helpers/ResetButton";
import DataPreviewTable from "../../charts/helpers/DataPreviewTable";

const SAMPLE_SIZE = 31;
const X_MIN = 5;
const X_MAX = 40;
const KDE_BANDWIDTH = 1.4;

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

function AnovaSimulation() {
  const { t } = useTranslation();
  const [groups, setGroups] = useState([]);
  const [originalGroups, setOriginalGroups] = useState([]);
  const [isModified, setIsModified] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

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

        rows.forEach((row) => {
          const cols = row.split(",");
          if (cols.length >= 4) {
            olomouc.push(Number(cols[1]));
            prerov.push(Number(cols[2]));
            jesenik.push(Number(cols[3]));
          }
        });

        // City names kept as data values (proper nouns)
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

  const [modifiedGroups, setModifiedGroups] = useState(new Set());

  const handleParamChange = (index, key, value) => {
    const groupName = groups[index].name;

    setGroups((prev) => {
      const updatedGroups = [...prev];
      const group = { ...updatedGroups[index], [key]: value };

      const newSample = generateSample(group.mean, group.std, SAMPLE_SIZE);
      const newKde = calculateKDE(newSample, KDE_BANDWIDTH, X_MIN, X_MAX);

      updatedGroups[index] = { ...group, sample: newSample, kde: newKde };
      return updatedGroups;
    });

    setModifiedGroups((prev) => new Set(prev).add(groupName));
  };

  const handleReset = () => {
    setGroups(originalGroups);
    setModifiedGroups(new Set());
  };

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

  const anovaStats = useMemo(() => {
    if (groups.length === 0) return null;
    const rawDataGroups = groups.map((g) => g.sample);
    return calculateANOVA(rawDataGroups);
  }, [groups]);

  const tukeyResults = useMemo(() => {
    if (!anovaStats) return [];

    const rawResults = calculateTukeyHSD(anovaStats.groupStats, anovaStats.msW);

    return rawResults.map((res) => {
      const short1 = groups[res.group1].name.substring(0, 3);
      const short2 = groups[res.group2].name.substring(0, 3);

      return {
        ...res,
        pair: `${short1}–${short2}`,
      };
    });
  }, [anovaStats, groups]);

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
            {isThisGroupModified && (
              <small
                className="ms-1"
                style={{ fontSize: "0.65rem", verticalAlign: "top" }}
              ></small>
            )}
          </span>
        ),
      });
    });

    return cols;
  }, [groups, modifiedGroups, t]);

  const realDataBlobUrl = useMemo(() => {
    if (originalGroups.length === 0) return null;
    const headers = [
      t("components.anovaSimulation.dayOfMonth"),
      ...originalGroups.map((g) => g.name),
    ].join(",");
    const rows = [];
    for (let i = 0; i < SAMPLE_SIZE; i++) {
      const rowVals = [
        i + 1,
        ...originalGroups.map((g) => Number(g.sample[i]).toFixed(2)),
      ];
      rows.push(rowVals.join(","));
    }
    const csvContent = [headers, ...rows].join("\n");
    const blob = new Blob(["\uFEFF" + csvContent], {
      type: "text/csv;charset=utf-8;",
    });
    return URL.createObjectURL(blob);
  }, [originalGroups, t]);

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
      <AnovaControls params={groups} onParamChange={handleParamChange} />

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
      <div className="charts-wrapper w-100">
        <AnovaDistributionChart
          data={chartData}
          groups={groups}
          minX={X_MIN}
          maxX={X_MAX}
        />
      </div>

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

      <div className="pt-4 pb-4">
        <AnovaTable stats={anovaStats} />
      </div>

      <TukeyChart results={tukeyResults} />
    </div>
  );
}

export default AnovaSimulation;
