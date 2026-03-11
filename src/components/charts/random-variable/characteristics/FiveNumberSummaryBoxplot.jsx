// src/components/charts/random-variable/characteristics/FiveNumberSummaryBoxplot.jsx
import React, { useState, useMemo, useEffect } from "react";
import { useTranslation } from "react-i18next";
import StyledBoxplot from "../../helpers/StyledBoxplot";
import DataPreviewTable from "../../helpers/DataPreviewTable";

const categoryOrder = ["low", "medium", "high"];
const yearColors = (id) =>
  id === "2012" ? "var(--bs-info)" : "var(--bs-primary)";

const translateInput = {
  nizka: "low",
  nizky: "low",
  stredni: "medium",
  vysoka: "high",
};
const normalise = (v) => translateInput[v] ?? v;

const categoryTextClass = {
  low: "text-danger",
  medium: "text-warning",
  high: "text-success",
};

const calculateStats = (values) => {
  if (!values?.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const q = (p) => {
    const pos = p * (sorted.length - 1),
      base = Math.floor(pos),
      rest = pos - base;
    return sorted[base + 1] !== undefined
      ? sorted[base] + rest * (sorted[base + 1] - sorted[base])
      : sorted[base];
  };
  const q1 = q(0.25),
    median = q(0.5),
    q3 = q(0.75),
    iqr = q3 - q1;
  const lf = q1 - 1.5 * iqr,
    uf = q3 + 1.5 * iqr;
  const reg = sorted.filter((v) => v >= lf && v <= uf);
  return {
    min: sorted[0],
    max: sorted[sorted.length - 1],
    q1,
    median,
    q3,
    whiskerMin: reg.length ? reg[0] : q1,
    whiskerMax: reg.length ? reg[reg.length - 1] : q3,
    outliers: sorted.filter((v) => v < lf || v > uf),
  };
};

const buildEntry = (stats, id) =>
  !stats
    ? {}
    : {
        [`color_${id}`]: yearColors(id),
        [`stats_${id}`]: stats,
        [`min_invisible_${id}`]: stats.whiskerMin,
        [`whisker_bottom_${id}`]: stats.q1 - stats.whiskerMin,
        [`box_bottom_${id}`]: stats.median - stats.q1,
        [`box_top_${id}`]: stats.q3 - stats.median,
        [`whisker_top_${id}`]: stats.whiskerMax - stats.q3,
      };

function FiveNumberSummaryBoxplot() {
  const { t } = useTranslation();
  const [groupBy, setGroupBy] = useState("geo");
  const [year, setYear] = useState("both");
  const [rawData, setRawData] = useState([]);
  const [rawRows, setRawRows] = useState([]);
  const [csvHeaders, setCsvHeaders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Dynamic translated labels
  const categoryLabels = useMemo(
    () => ({
      low: t("components.randomVariableCharts.boxplot.categories.low"),
      medium: t("components.randomVariableCharts.boxplot.categories.medium"),
      high: t("components.randomVariableCharts.boxplot.categories.high"),
    }),
    [t],
  );

  const groupOptions = useMemo(
    () => [
      {
        value: "geo",
        label: t("components.randomVariableCharts.boxplot.geoRegion"),
      },
      {
        value: "qol",
        label: t("components.randomVariableCharts.boxplot.qualityOfLife"),
      },
    ],
    [t],
  );

  const yearOptions = useMemo(
    () => [
      {
        value: "both",
        label: t("components.randomVariableCharts.boxplot.bothYears"),
      },
      { value: "2012", label: "2012" },
      { value: "2016", label: "2016" },
    ],
    [t],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}data/QoL.csv`);
        const csvText = await response.text();
        const lines = csvText.trim().split("\n");
        const headers = lines[0]
          .split(";")
          .map((h) => h.trim().replace(/^\uFEFF/, ""));
        setCsvHeaders(headers);

        const ai2012Idx = headers.indexOf("AI_2012");
        const ai2016Idx = headers.indexOf("AI_2016");
        const qolIdx = headers.indexOf("QoL");
        const geoIdx = headers.indexOf("GEO_oblast");
        const maxIdx = Math.max(ai2012Idx, ai2016Idx, qolIdx, geoIdx);

        const allRows = [],
          structuredRows = [];
        lines.slice(1).forEach((line) => {
          const cols = line.split(";");
          if (cols.length <= maxIdx) return;

          const fullRow = {};
          headers.forEach((h, i) => {
            fullRow[h] = cols[i]?.trim() ?? "";
          });
          allRows.push(fullRow);

          const ai2012 = parseFloat(cols[ai2012Idx].replace(",", "."));
          const ai2016 = parseFloat(cols[ai2016Idx].replace(",", "."));
          if (isNaN(ai2012) || isNaN(ai2016)) return;
          structuredRows.push({
            ai2012,
            ai2016,
            qol: normalise(cols[qolIdx]?.trim()),
            geo: normalise(cols[geoIdx]?.trim()),
          });
        });

        setRawRows(allRows);
        setRawData(structuredRows);
      } catch (err) {
        console.error("Failed to fetch Boxplot CSV:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const activeSeries = useMemo(
    () =>
      ["2012", "2016"]
        .filter((yr) => year === "both" || year === yr)
        .map((id) => ({ id, color: yearColors(id) })),
    [year],
  );

  const { chartData, scatterData } = useMemo(() => {
    if (!rawData.length) return { chartData: [], scatterData: [] };
    const sData = [];
    const cData = categoryOrder.map((cat) => {
      const rows = rawData.filter((d) => d[groupBy] === cat);
      const entry = { label: cat };
      activeSeries.forEach(({ id }) => {
        const vals = rows.map((d) => (id === "2012" ? d.ai2012 : d.ai2016));
        const stats = calculateStats(vals);
        Object.assign(entry, buildEntry(stats, id));
        stats?.outliers.forEach((val) =>
          sData.push({
            label: cat,
            outlierValue: val,
            seriesId: id,
            color: yearColors(id),
          }),
        );
      });
      return entry;
    });
    return { chartData: cData, scatterData: sData };
  }, [rawData, groupBy, activeSeries]);

  const tableColumns = useMemo(
    () =>
      csvHeaders.map((h) => {
        const knownLabels = {
          GEO_oblast: t("components.randomVariableCharts.boxplot.geoRegion"),
          QoL: t("components.randomVariableCharts.boxplot.qualityOfLife"),
          AI_2012: "AI 2012",
          AI_2016: "AI 2016",
        };
        const knownKeys = { QoL: true, GEO_oblast: true };
        return {
          key: h,
          label: knownLabels[h] ?? h,
          render: knownKeys[h]
            ? (val) => {
                const norm = normalise(val?.toLowerCase?.() ?? val);
                return (
                  <span
                    className={`fw-medium ${categoryTextClass[norm] ?? ""}`}
                  >
                    {categoryLabels[norm] ?? val}
                  </span>
                );
              }
            : undefined,
        };
      }),
    [csvHeaders, categoryLabels, t],
  );

  if (isLoading)
    return (
      <div className="p-4 text-center text-muted">
        {t("components.randomVariableCharts.boxplot.loading")}
      </div>
    );

  return (
    <div className="p-3 p-md-4 rounded-3 shadow-sm border w-100">
      <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center mb-3 gap-3">
        <h6 className="mb-0 text-nowrap">
          {t("components.randomVariableCharts.boxplot.title")}
        </h6>
        <div className="d-flex flex-column flex-sm-row align-items-start align-items-sm-center gap-2 gap-sm-3 flex-wrap">
          <div className="d-flex align-items-center gap-2">
            <span className="small text-muted text-nowrap">
              {t("components.randomVariableCharts.boxplot.groupLabel")}
            </span>
            <div className="btn-group shadow-sm" role="group">
              {groupOptions.map(({ value, label }, i, arr) => {
                const roundClass =
                  i === 0
                    ? "rounded-start-pill"
                    : i === arr.length - 1
                      ? "rounded-end-pill"
                      : "";
                return (
                  <button
                    key={value}
                    type="button"
                    className={`btn btn-sm px-3 btn-outline-primary ${groupBy === value ? "active" : ""} ${roundClass}`}
                    onClick={() => setGroupBy(value)}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="d-flex align-items-center gap-2">
            <span className="small text-muted text-nowrap">
              {t("components.randomVariableCharts.boxplot.yearLabel")}
            </span>
            <div className="d-flex gap-1" role="group">
              {yearOptions.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  className={`btn btn-sm btn-outline-primary rounded-pill ${year === value ? "active" : ""}`}
                  onClick={() => setYear(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="d-flex gap-4 mb-3 ps-1 flex-wrap">
        {activeSeries.map(({ id, color }) => (
          <span key={id} className="small d-flex align-items-center gap-1">
            <span
              style={{
                display: "inline-block",
                width: 14,
                height: 14,
                borderRadius: 2,
                background: color,
              }}
            />
            {id}
          </span>
        ))}
        <span className="small d-flex align-items-center gap-1 text-danger">
          <span
            style={{
              display: "inline-block",
              width: 14,
              height: 3,
              background: "var(--bs-danger)",
              marginTop: 1,
            }}
          />
          {t("components.randomVariableCharts.boxplot.legendMedian")}
        </span>
      </div>

      <StyledBoxplot
        chartData={chartData}
        scatterData={scatterData}
        series={activeSeries}
        categoryLabels={categoryLabels}
      />

      <p className="text-muted small mt-2 mb-0 text-center">
        {t("components.randomVariableCharts.boxplot.legendNote")}
      </p>

      <DataPreviewTable
        data={rawRows}
        columns={tableColumns}
        title={t("components.randomVariableCharts.boxplot.dataTableTitle")}
        previewRows={5}
        downloadUrl={`${import.meta.env.BASE_URL}data/QoL.csv`}
        downloadFilename="QoL.csv"
      />
    </div>
  );
}

export default FiveNumberSummaryBoxplot;
