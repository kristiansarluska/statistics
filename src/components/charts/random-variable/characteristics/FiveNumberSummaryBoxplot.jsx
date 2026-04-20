// src/components/charts/random-variable/characteristics/FiveNumberSummaryBoxplot.jsx
import React, { useState, useMemo, useEffect, useRef } from "react";
import { useTranslation } from "react-i18next";
import DataPreviewTable from "../../helpers/DataPreviewTable";
import useFetch from "../../../../hooks/useFetch";
import { parseCSV } from "../../../../utils/csvParser";

// Color mapping for different years in the dataset
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

/**
 * Calculates boxplot statistics (Min, Q1, Median, Q3, Max, Whiskers, Outliers).
 * Uses linear interpolation for quartiles calculation.
 * @param {Array<number>} values - Array of numerical data points
 * @returns {Object|null} Statistical summary object
 */
const calculateStats = (values) => {
  if (!values?.length) return null;
  const sorted = [...values].sort((a, b) => a - b);

  // Percentile calculation using linear interpolation
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

  // Tukey's fences for whiskers and outliers (1.5 * IQR)
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

// SVG Chart margin constants
const ML = 40,
  MR = 16,
  MT = 12,
  MB = 32;
const CAP_RATIO = 0.5; // Width of whisker cap relative to box width

/**
 * @component BoxplotSVG
 * @description Renders the core SVG boxplot visualization, including axes, grid lines, boxes, and interactive tooltips.
 */
function BoxplotSVG({ chartData, activeSeries, yMin, yMax }) {
  const { t } = useTranslation();
  const svgRef = useRef(null);
  const [svgW, setSvgW] = useState(600);
  const [tooltip, setTooltip] = useState(null);
  const SVG_H = 320;

  // Handle responsive resizing of the SVG container
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

  // Coordinate mapping from data value to SVG pixels (inverted Y-axis)
  const toY = (v) => MT + plotH - ((v - yMin) / (yMax - yMin)) * plotH;

  const categories = chartData.map((d) => d.label);
  const nCats = categories.length;
  const nSeries = activeSeries.length;

  // Dynamic Y-axis ticks generation based on data range
  const yTicks = useMemo(() => {
    const range = yMax - yMin;
    const step = range <= 20 ? 5 : range <= 50 ? 10 : 20;
    const ticks = [];
    for (let tick = Math.ceil(yMin / step) * step; tick <= yMax; tick += step)
      ticks.push(tick);
    return ticks;
  }, [yMin, yMax]);

  const bandW = nCats > 0 ? plotW / nCats : plotW;

  // Dynamic width calculation to prevent box overlap on smaller screens
  const availableBandW = bandW * 0.85;
  const gapRatio = 0.25;
  const denominator = nSeries > 0 ? nSeries + (nSeries - 1) * gapRatio : 1;
  const maxBoxW = availableBandW / denominator;

  const boxW = Math.max(2, Math.min(maxBoxW, 40));
  const seriesGap = nSeries > 1 ? boxW * gapRatio : 0;
  const totalSeriesW = nSeries * boxW + (nSeries - 1) * seriesGap;

  return (
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
        style={{ display: "block", overflow: "visible", minWidth: "650px" }}
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Horizontal grid lines */}
        {yTicks.map((tick) => (
          <line
            key={tick}
            x1={ML}
            y1={toY(tick)}
            x2={svgW - MR}
            y2={toY(tick)}
            stroke="var(--bs-border-color)"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        ))}

        {/* Y Axis line */}
        <line
          x1={ML}
          y1={MT}
          x2={ML}
          y2={MT + plotH}
          stroke="var(--bs-border-color)"
          strokeWidth={1}
        />

        {/* Y Axis ticks and labels */}
        {yTicks.map((tick) => (
          <g key={tick}>
            <line
              x1={ML - 4}
              y1={toY(tick)}
              x2={ML}
              y2={toY(tick)}
              stroke="var(--bs-body-color)"
              strokeWidth={1}
            />
            <text
              x={ML - 7}
              y={toY(tick) + 4}
              textAnchor="end"
              fontSize={10}
              fill="var(--bs-body-color)"
              opacity={0.7}
            >
              {tick}
            </text>
          </g>
        ))}

        {/* X Axis line */}
        <line
          x1={ML}
          y1={MT + plotH}
          x2={svgW - MR}
          y2={MT + plotH}
          stroke="var(--bs-border-color)"
          strokeWidth={1}
        />

        {/* Grouped Boxplots rendering */}
        {chartData.map((entry, ci) => {
          const bandStart = ML + ci * bandW;
          const bandCx = bandStart + bandW / 2;

          return (
            <g key={entry.label}>
              {/* Category label on X axis */}
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

              {/* Individual series boxes within a category */}
              {activeSeries.map(({ id, color }, si) => {
                const stats = entry[`stats_${id}`];
                if (!stats) return null;

                const seriesStart = bandCx - totalSeriesW / 2;
                const bx = seriesStart + si * (boxW + seriesGap);
                const bcx = bx + boxW / 2;
                const capW = boxW * CAP_RATIO;

                const yQ1 = toY(stats.q1);
                const yQ3 = toY(stats.q3);
                const yMed = toY(stats.median);
                const yWMin = toY(stats.whiskerMin);
                const yWMax = toY(stats.whiskerMax);

                return (
                  <g
                    key={id}
                    onMouseEnter={(e) => {
                      const svgRect =
                        svgRef.current?.getBoundingClientRect() ?? {
                          left: 0,
                          top: 0,
                        };

                      const x = e.clientX - svgRect.left;
                      const y = e.clientY - svgRect.top - 10;

                      const showOnLeft =
                        window.innerWidth - e.clientX < 200 || svgW - x < 200;

                      setTooltip({
                        x,
                        y,
                        showOnLeft,
                        stats,
                        year: yearLabels[id],
                        color,
                        label: entry.label,
                      });
                    }}
                    onMouseLeave={() => setTooltip(null)}
                    style={{ cursor: "default" }}
                  >
                    {/* Whisker: lower */}
                    <line
                      x1={bcx}
                      y1={yQ1}
                      x2={bcx}
                      y2={yWMin}
                      stroke={color}
                      strokeWidth={1.5}
                      strokeDasharray="3 2"
                    />
                    {/* Whisker cap: lower */}
                    <line
                      x1={bcx - capW / 2}
                      y1={yWMin}
                      x2={bcx + capW / 2}
                      y2={yWMin}
                      stroke={color}
                      strokeWidth={1.5}
                    />
                    {/* Whisker: upper */}
                    <line
                      x1={bcx}
                      y1={yQ3}
                      x2={bcx}
                      y2={yWMax}
                      stroke={color}
                      strokeWidth={1.5}
                      strokeDasharray="3 2"
                    />
                    {/* Whisker cap: upper */}
                    <line
                      x1={bcx - capW / 2}
                      y1={yWMax}
                      x2={bcx + capW / 2}
                      y2={yWMax}
                      stroke={color}
                      strokeWidth={1.5}
                    />
                    {/* IQR Box */}
                    <rect
                      x={bx}
                      y={yQ3}
                      width={boxW}
                      height={Math.abs(yQ1 - yQ3)}
                      fill={color}
                      fillOpacity={0.18}
                      stroke={color}
                      strokeWidth={1.5}
                      rx={2}
                    />
                    {/* Median line */}
                    <line
                      x1={bx}
                      y1={yMed}
                      x2={bx + boxW}
                      y2={yMed}
                      stroke={color}
                      strokeWidth={2.5}
                    />
                    {/* Outlier dots */}
                    {stats.outliers.map((ov, oi) => (
                      <circle
                        key={oi}
                        cx={bcx}
                        cy={toY(ov)}
                        r={3}
                        fill={color}
                        fillOpacity={0.6}
                        stroke={color}
                        strokeWidth={1}
                      />
                    ))}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      {/* Tooltip overlay */}
      {tooltip && (
        <div
          style={{
            position: "absolute",
            left: tooltip.showOnLeft ? tooltip.x - 180 : tooltip.x + 12,
            top: tooltip.y,
            background: "var(--bs-body-bg)",
            border: `1.5px solid ${tooltip.color}`,
            borderRadius: 8,
            padding: "8px 12px",
            pointerEvents: "none",
            fontSize: "0.82rem",
            zIndex: 10,
            minWidth: 160,
            boxShadow: "0 2px 8px rgba(0,0,0,0.13)",
          }}
        >
          <div
            className="fw-semibold mb-1"
            style={{ color: tooltip.color, fontSize: "0.88rem" }}
          >
            {tooltip.label} — {tooltip.year}
          </div>
          {[
            ["Max", tooltip.stats.whiskerMax],
            ["Q3", tooltip.stats.q3],
            [
              t("components.randomVariableCharts.boxplot.tooltip.median"),
              tooltip.stats.median,
            ],
            ["Q1", tooltip.stats.q1],
            ["Min", tooltip.stats.whiskerMin],
          ].map(([label, value]) => (
            <div key={label} className="d-flex justify-content-between gap-3">
              <span className="text-muted">{label}</span>
              <span className="fw-medium">{value.toFixed(1)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/**
 * Transforms raw CSV text into the two data shapes needed by the component.
 * Defined outside the component so useFetch can receive a stable reference.
 */
const transformLifeExpectancyCSV = (csvText) => {
  const rows = parseCSV(csvText);
  if (rows.length < 2) return { rawRows: [], structuredRows: [] };

  const rawRows = [];
  const structuredRows = [];

  rows.slice(1).forEach((cols) => {
    if (cols.length < 8 || !cols[0]) return;

    rawRows.push({
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

  return { rawRows, structuredRows };
};

/**
 * @component FiveNumberSummaryBoxplot
 * @description Main container component for the life expectancy boxplot feature.
 * Fetches real-world data from CSV, manages grouping and year filtering states,
 * and orchestrates the statistical visualization.
 */
function FiveNumberSummaryBoxplot() {
  const { t } = useTranslation();
  const [groupBy, setGroupBy] = useState("Continent");
  const [selectedYears, setSelectedYears] = useState(["Y2000", "Y2023"]);

  const csvUrl = `${import.meta.env.BASE_URL}data/World_LifeExpectancy.csv`;

  // useFetch replaces the manual useEffect + fetch + state pattern
  const { data: parsed, loading: isLoading } = useFetch(
    csvUrl,
    transformLifeExpectancyCSV,
  );

  const rawData = parsed?.structuredRows ?? [];
  const rawRows = parsed?.rawRows ?? [];

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
        label: t("components.randomVariableCharts.boxplot.groups.continent"),
      },
      {
        value: "Income.Group",
        label: t("components.randomVariableCharts.boxplot.groups.incomeGroup"),
      },
    ],
    [t],
  );

  const toggleYear = (y) => {
    setSelectedYears((prev) => {
      if (prev.includes(y)) {
        if (prev.length === 1) return prev;
        return prev.filter((v) => v !== y);
      }
      return [...prev, y].sort();
    });
  };

  const activeSeries = useMemo(
    () => selectedYears.map((id) => ({ id, color: yearColors[id] })),
    [selectedYears],
  );

  // Perform statistical calculations based on selected grouping and years
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
        label: t("components.randomVariableCharts.boxplot.columns.country"),
      },
      {
        key: "Continent",
        label: t("components.randomVariableCharts.boxplot.groups.continent"),
      },
      {
        key: "Income.Group",
        label: t("components.randomVariableCharts.boxplot.groups.incomeGroup"),
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
      {/* UI Controls for grouping and year selection */}
      <div className="d-flex justify-content-center mb-4">
        <div className="d-flex flex-row gap-4 flex-wrap justify-content-center">
          <div className="d-flex flex-column align-items-center gap-2">
            <span className="small text-muted text-nowrap fw-medium">
              {t("components.randomVariableCharts.boxplot.groupLabel")}
            </span>
            <div className="btn-group" role="group">
              {groupOptions.map(({ value, label }, i, arr) => (
                <button
                  key={value}
                  type="button"
                  className={`btn btn-sm px-3 btn-outline-primary ${groupBy === value ? "active" : ""} ${i === 0 ? "rounded-start-pill" : i === arr.length - 1 ? "rounded-end-pill" : ""}`}
                  onClick={() => setGroupBy(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

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
                    className={`btn btn-sm px-2 ${isActive ? "btn-primary" : "btn-outline-primary text-contrast"} ${i === 0 ? "rounded-start-pill" : i === arr.length - 1 ? "rounded-end-pill" : ""}`}
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

      {/* Series Legend */}
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

      {/* Boxplot SVG Visualization */}
      <BoxplotSVG
        chartData={chartData}
        activeSeries={activeSeries}
        yMin={yMin}
        yMax={yMax}
      />

      {/* Complementary data table for raw value inspection */}
      <DataPreviewTable
        data={rawRows}
        columns={tableColumns}
        title={t("components.randomVariableCharts.boxplot.dataTableTitle")}
        previewRows={5}
        originalFileUrl={csvUrl}
        originalFileName="World_LifeExpectancy.csv"
      />
    </div>
  );
}

export default FiveNumberSummaryBoxplot;
