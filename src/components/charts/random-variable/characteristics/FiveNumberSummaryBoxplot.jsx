// src/components/charts/random-variable/characteristics/FiveNumberSummaryBoxplot.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import DataPreviewTable from "../../helpers/DataPreviewTable";

const yearColors = {
  Y1960: "var(--bs-gray-500)",
  Y1980: "var(--bs-pink)",
  Y2000: "var(--bs-success)",
  Y2023: "var(--bs-primary)",
};

const yearLabels = {
  Y1960: "1960",
  Y1980: "1980",
  Y2000: "2000",
  Y2023: "2023",
};

// Custom CSV parser (handles quoted fields with commas)
const parseCSV = (str) => {
  const result = [];
  let row = [],
    inQuotes = false,
    val = "";
  for (let i = 0; i < str.length; i++) {
    const char = str[i];
    if (char === '"') inQuotes = !inQuotes;
    else if (char === "," && !inQuotes) {
      row.push(val.trim());
      val = "";
    } else if (char === "\n" && !inQuotes) {
      row.push(val.trim());
      if (row.length > 1) result.push(row);
      row = [];
      val = "";
    } else if (char !== "\r") val += char;
  }
  row.push(val.trim());
  if (row.length > 1) result.push(row);
  return result;
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

// Chart margin constants
const ML = 40,
  MR = 16,
  MT = 12,
  MB = 32;
const CAP_RATIO = 0.5; // whisker cap as fraction of box width

function BoxplotSVG({ chartData, activeSeries, yMin, yMax }) {
  const { t } = useTranslation();
  const svgRef = useRef(null);
  const [svgW, setSvgW] = useState(600);
  const [tooltip, setTooltip] = useState(null);
  const SVG_H = 320;

  useEffect(() => {
    const el = svgRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => setSvgW(el.clientWidth || 600));
    ro.observe(el);
    setSvgW(el.clientWidth || 600);
    return () => ro.disconnect();
  }, []);

  const plotW = svgW - ML - MR;
  const plotH = SVG_H - MT - MB;

  const toY = (v) => MT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const categories = chartData.map((d) => d.label);
  const nCats = categories.length;
  const nSeries = activeSeries.length;

  // Y axis ticks
  const yTicks = useMemo(() => {
    const range = yMax - yMin;
    const step = range <= 20 ? 5 : range <= 50 ? 10 : 20;
    const ticks = [];
    for (let t = Math.ceil(yMin / step) * step; t <= yMax; t += step)
      ticks.push(t);
    return ticks;
  }, [yMin, yMax]);

  const bandW = nCats > 0 ? plotW / nCats : plotW;

  // OPRAVA: Dynamický výpočet šírky aby nevytekali boxy
  const availableBandW = bandW * 0.85; // Necháme 15% priestoru na medzeru medzi kategóriami
  const gapRatio = 0.25; // Medzera medzi rokmi je 25% šírky boxu
  const denominator = nSeries > 0 ? nSeries + (nSeries - 1) * gapRatio : 1;
  const maxBoxW = availableBandW / denominator;

  const boxW = Math.max(2, Math.min(maxBoxW, 40)); // Dynamická šírka zastropená na 40px
  const seriesGap = nSeries > 1 ? boxW * gapRatio : 0;
  const totalSeriesW = nSeries * boxW + (nSeries - 1) * seriesGap;

  return (
    // OPRAVA: overflowX a paddingBottom na obal
    <div
      style={{
        position: "relative",
        width: "100%",
        overflowX: "auto",
        paddingBottom: "10px",
      }}
    >
      <svg
        ref={svgRef}
        width="100%"
        height={SVG_H}
        // OPRAVA: minWidth zaručí že sa graf na úzkych mobiloch prestane zmenšovať a radšej spraví scrollbar
        style={{ display: "block", overflow: "visible", minWidth: "650px" }}
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Y grid lines */}
        {yTicks.map((t) => (
          <line
            key={t}
            x1={ML}
            y1={toY(t)}
            x2={svgW - MR}
            y2={toY(t)}
            stroke="var(--bs-border-color)"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        ))}

        {/* Y axis */}
        <line
          x1={ML}
          y1={MT}
          x2={ML}
          y2={MT + plotH}
          stroke="var(--bs-border-color)"
          strokeWidth={1}
        />

        {/* Y ticks + labels */}
        {yTicks.map((t) => (
          <g key={t}>
            <line
              x1={ML - 4}
              y1={toY(t)}
              x2={ML}
              y2={toY(t)}
              stroke="var(--bs-body-color)"
              strokeWidth={1}
            />
            <text
              x={ML - 7}
              y={toY(t) + 4}
              textAnchor="end"
              fontSize={10}
              fill="var(--bs-body-color)"
              opacity={0.7}
            >
              {t}
            </text>
          </g>
        ))}

        {/* X axis */}
        <line
          x1={ML}
          y1={MT + plotH}
          x2={svgW - MR}
          y2={MT + plotH}
          stroke="var(--bs-border-color)"
          strokeWidth={1}
        />

        {/* Boxplots per category */}
        {chartData.map((entry, ci) => {
          const bandStart = ML + ci * bandW;
          const bandCx = bandStart + bandW / 2;

          return (
            <g key={entry.label}>
              {/* X category label */}
              <text
                x={bandCx}
                y={MT + plotH + 18}
                textAnchor="middle"
                fontSize={11}
                fill="var(--bs-body-color)"
                opacity={0.85}
              >
                {entry.label}
              </text>

              {/* One box per active series, sorted by year (ascending) */}
              {activeSeries.map(({ id, color }, si) => {
                const stats = entry[`stats_${id}`];
                if (!stats) return null;

                // Center each series box within the band
                const seriesStart = bandCx - totalSeriesW / 2;
                const bx = seriesStart + si * (boxW + seriesGap);
                const bcx = bx + boxW / 2;
                const capW = boxW * CAP_RATIO;
                const capOff = (boxW - capW) / 2;

                const yWMin = toY(stats.whiskerMin);
                const yQ1 = toY(stats.q1);
                const yMed = toY(stats.median);
                const yQ3 = toY(stats.q3);
                const yWMax = toY(stats.whiskerMax);

                return (
                  <g
                    key={id}
                    style={{ cursor: "default" }}
                    onMouseEnter={(e) => {
                      const svgRect = svgRef.current?.getBoundingClientRect();
                      if (!svgRect) return;
                      setTooltip({
                        stats,
                        id,
                        color,
                        x: e.clientX - svgRect.left,
                        y: e.clientY - svgRect.top,
                      });
                    }}
                    onMouseMove={(e) => {
                      const svgRect = svgRef.current?.getBoundingClientRect();
                      if (!svgRect) return;
                      setTooltip((prev) =>
                        prev
                          ? {
                              ...prev,
                              x: e.clientX - svgRect.left,
                              y: e.clientY - svgRect.top,
                            }
                          : prev,
                      );
                    }}
                  >
                    {/* Lower whisker line */}
                    <line
                      x1={bcx}
                      y1={yQ1}
                      x2={bcx}
                      y2={yWMin}
                      stroke={color}
                      strokeWidth={1.5}
                    />
                    {/* Lower whisker cap */}
                    <line
                      x1={bx + capOff}
                      y1={yWMin}
                      x2={bx + boxW - capOff}
                      y2={yWMin}
                      stroke={color}
                      strokeWidth={1.5}
                    />

                    {/* IQR box bottom half (Q1 → median) */}
                    <rect
                      x={bx}
                      y={yMed}
                      width={boxW}
                      height={Math.max(1, yQ1 - yMed)}
                      fill={color}
                      fillOpacity={0.18}
                      stroke={color}
                      strokeWidth={1.5}
                    />

                    {/* IQR box top half (median → Q3) */}
                    <rect
                      x={bx}
                      y={yQ3}
                      width={boxW}
                      height={Math.max(1, yMed - yQ3)}
                      fill={color}
                      fillOpacity={0.18}
                      stroke={color}
                      strokeWidth={1.5}
                    />

                    {/* Median line (highlighted) */}
                    <line
                      x1={bx}
                      y1={yMed}
                      x2={bx + boxW}
                      y2={yMed}
                      stroke="var(--bs-danger)"
                      strokeWidth={2.5}
                    />

                    {/* Upper whisker line */}
                    <line
                      x1={bcx}
                      y1={yQ3}
                      x2={bcx}
                      y2={yWMax}
                      stroke={color}
                      strokeWidth={1.5}
                    />
                    {/* Upper whisker cap */}
                    <line
                      x1={bx + capOff}
                      y1={yWMax}
                      x2={bx + boxW - capOff}
                      y2={yWMax}
                      stroke={color}
                      strokeWidth={1.5}
                    />

                    {/* Outlier dots */}
                    {stats.outliers.map((ov, oi) => (
                      <circle
                        key={oi}
                        cx={bcx}
                        cy={toY(ov)}
                        r={3}
                        fill={color}
                        opacity={0.7}
                      />
                    ))}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      {tooltip &&
        (() => {
          const { stats, id, color, x, y } = tooltip;
          const fmt = (v) => (v != null ? Number(v).toFixed(1) : "—");
          const TW = 155,
            TH = 100;
          const tx = x + TW + 8 > svgW ? x - TW - 8 : x + 10;
          const ty = Math.min(y - 10, SVG_H - TH - 4);
          return (
            <div
              className="bg-body border rounded shadow-sm p-2"
              style={{
                position: "absolute",
                top: ty,
                left: tx,
                fontSize: "0.8rem",
                pointerEvents: "none",
                width: TW,
                zIndex: 10,
              }}
            >
              <div className="mb-1" style={{ color }}>
                {yearLabels[id]}
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">
                  {t("components.randomVariableCharts.boxplot.tooltip.max")}
                </span>
                <strong>{fmt(stats.whiskerMax)}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">
                  {t("components.randomVariableCharts.boxplot.tooltip.q3")}
                </span>
                <strong style={{ color }}>{fmt(stats.q3)}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">
                  {t("components.randomVariableCharts.boxplot.tooltip.median")}
                </span>
                <strong className="text-danger">{fmt(stats.median)}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">
                  {t("components.randomVariableCharts.boxplot.tooltip.q1")}
                </span>
                <strong style={{ color }}>{fmt(stats.q1)}</strong>
              </div>
              <div className="d-flex justify-content-between">
                <span className="text-muted">
                  {t("components.randomVariableCharts.boxplot.tooltip.min")}
                </span>
                <strong>{fmt(stats.whiskerMin)}</strong>
              </div>
            </div>
          );
        })()}
    </div>
  );
}

function FiveNumberSummaryBoxplot() {
  const { t } = useTranslation();
  const [groupBy, setGroupBy] = useState("Continent");
  const [selectedYears, setSelectedYears] = useState(["Y2000", "Y2023"]);
  const [rawData, setRawData] = useState([]);
  const [rawRows, setRawRows] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const continents = ["Africa", "Americas", "Asia", "Europe", "Oceania"];
  const incomeGroups = [
    "Low income",
    "Lower middle income",
    "Upper middle income",
    "High income",
  ];

  const groupOptions = useMemo(
    () => [
      {
        value: "Continent",
        label: t(
          "components.randomVariableCharts.boxplot.groups.continent",
          "Kontinent",
        ),
      },
      {
        value: "Income.Group",
        label: t(
          "components.randomVariableCharts.boxplot.groups.incomeGroup",
          "Príjmová skupina",
        ),
      },
    ],
    [t],
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.BASE_URL}data/World_LifeExpectancy.csv`,
        );
        const csvText = await response.text();
        const rows = parseCSV(csvText);
        if (rows.length < 2) return;

        const allRows = [],
          structuredRows = [];
        rows.slice(1).forEach((cols) => {
          if (cols.length < 8 || !cols[0]) return;
          allRows.push({
            "Country.Name": cols[0],
            "Country.Code": cols[1],
            Continent: cols[2],
            "Income.Group": cols[3],
            Y1960: cols[4],
            Y1980: cols[5],
            Y2000: cols[6],
            Y2023: cols[7],
          });
          structuredRows.push({
            countryName: cols[0],
            continent: cols[2],
            incomeGroup: cols[3],
            Y1960: parseFloat(cols[4]),
            Y1980: parseFloat(cols[5]),
            Y2000: parseFloat(cols[6]),
            Y2023: parseFloat(cols[7]),
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

  const toggleYear = (y) => {
    setSelectedYears((prev) => {
      if (prev.includes(y)) {
        if (prev.length === 1) return prev;
        return prev.filter((v) => v !== y);
      }
      return [...prev, y].sort(); // always ascending
    });
  };

  // activeSeries sorted ascending by year key
  const activeSeries = useMemo(
    () => selectedYears.map((id) => ({ id, color: yearColors[id] })),
    [selectedYears],
  );

  const { chartData, yMin, yMax } = useMemo(() => {
    if (!rawData.length) return { chartData: [], yMin: 0, yMax: 100 };

    const categories = groupBy === "Continent" ? continents : incomeGroups;
    let globalMin = Infinity,
      globalMax = -Infinity;

    const cData = categories.map((cat) => {
      const translatedCat = t(
        `components.randomVariableCharts.boxplot.categories.${cat.replace(/\s+/g, "")}`,
        cat,
      );
      const entry = { label: translatedCat };
      const rows = rawData.filter((d) =>
        groupBy === "Continent" ? d.continent === cat : d.incomeGroup === cat,
      );

      activeSeries.forEach(({ id }) => {
        const vals = rows.map((d) => d[id]).filter((v) => !isNaN(v));
        const stats = calculateStats(vals);
        if (stats) {
          entry[`stats_${id}`] = stats;
          globalMin = Math.min(globalMin, stats.whiskerMin, ...stats.outliers);
          globalMax = Math.max(globalMax, stats.whiskerMax, ...stats.outliers);
        }
      });
      return entry;
    });

    const padding = (globalMax - globalMin) * 0.08;
    return {
      chartData: cData,
      yMin: Math.floor(globalMin - padding),
      yMax: Math.ceil(globalMax + padding),
    };
  }, [rawData, groupBy, activeSeries, t]);

  const tableColumns = useMemo(
    () => [
      {
        key: "Country.Name",
        label: t(
          "components.randomVariableCharts.boxplot.columns.country",
          "Krajina",
        ),
      },
      {
        key: "Continent",
        label: t(
          "components.randomVariableCharts.boxplot.groups.continent",
          "Kontinent",
        ),
      },
      {
        key: "Income.Group",
        label: t(
          "components.randomVariableCharts.boxplot.groups.incomeGroup",
          "Príjmová skupina",
        ),
      },
      { key: "Y1960", label: "1960" },
      { key: "Y1980", label: "1980" },
      { key: "Y2000", label: "2000" },
      { key: "Y2023", label: "2023" },
    ],
    [t],
  );

  if (isLoading)
    return (
      <div
        className="p-4 text-center text-muted d-flex align-items-center justify-content-center border rounded-3 w-100"
        style={{ minHeight: "800px" }}
      >
        {t("components.randomVariableCharts.boxplot.loading")}
      </div>
    );

  return (
    <div className="p-3 p-md-4">
      {/* Header + controls */}
      {/* Header + controls */}
      <div className="d-flex justify-content-center mb-4">
        <div className="d-flex flex-row gap-4 flex-wrap justify-content-center">
          {/* Group selector */}
          <div className="d-flex flex-column align-items-center gap-2">
            <span className="small text-muted text-nowrap fw-medium">
              {t("components.randomVariableCharts.boxplot.groupLabel")}
            </span>
            <div className="btn-group" role="group">
              {groupOptions.map(({ value, label }, i, arr) => (
                <button
                  key={value}
                  type="button"
                  className={`btn btn-sm px-3 btn-outline-primary ${groupBy === value ? "active" : ""} ${
                    i === 0
                      ? "rounded-start-pill"
                      : i === arr.length - 1
                        ? "rounded-end-pill"
                        : ""
                  }`}
                  onClick={() => setGroupBy(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Year multi-select */}
          <div className="d-flex flex-column align-items-center gap-2">
            <span className="small text-muted text-nowrap fw-medium">
              {t("components.randomVariableCharts.boxplot.yearLabel")}
            </span>
            <div className="btn-group" role="group">
              {["Y1960", "Y1980", "Y2000", "Y2023"].map((y, i, arr) => {
                const isActive = selectedYears.includes(y);
                return (
                  <button
                    key={y}
                    type="button"
                    className={`btn btn-sm px-2 ${isActive ? "btn-primary" : "btn-outline-primary text-primary"} ${
                      i === 0
                        ? "rounded-start-pill"
                        : i === arr.length - 1
                          ? "rounded-end-pill"
                          : ""
                    }`}
                    onClick={() => toggleYear(y)}
                  >
                    {yearLabels[y]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Color legend */}
      <div className="d-flex gap-4 mb-3 justify-content-center flex-wrap pb-3">
        {activeSeries.map(({ id, color }) => (
          <span
            key={id}
            className="small d-flex align-items-center gap-2 fw-medium"
          >
            <span
              style={{
                display: "inline-block",
                width: 14,
                height: 14,
                borderRadius: 3,
                background: color,
                boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
              }}
            />
            {yearLabels[id]}
          </span>
        ))}
      </div>

      {/* SVG boxplot */}
      <BoxplotSVG
        chartData={chartData}
        activeSeries={activeSeries}
        yMin={yMin}
        yMax={yMax}
      />

      {/* Data table */}
      <DataPreviewTable
        data={rawRows}
        columns={tableColumns}
        title={t("components.randomVariableCharts.boxplot.dataTableTitle")}
        previewRows={5}
        downloadUrl={`${import.meta.env.BASE_URL}data/World_LifeExpectancy.csv`}
        downloadFilename="World_LifeExpectancy.csv"
      />
    </div>
  );
}

export default FiveNumberSummaryBoxplot;
