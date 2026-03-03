// src/components/charts/random-variable/characteristics/FiveNumberSummaryBoxplot.jsx
import React, { useState, useMemo, useEffect } from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Customized,
} from "recharts";

// ─── Constants ────────────────────────────────────────────────────────────────
const CATEGORY_ORDER = ["low", "medium", "high"];
const CATEGORY_LABELS = { low: "Low", medium: "Medium", high: "High" };
const YEAR_COLORS = { 2012: "var(--bs-info)", 2016: "var(--bs-primary)" };

// Backwards-compat: still works if the CSV hasn't been migrated to English yet
const TRANSLATE = {
  nizka: "low",
  nizky: "low",
  stredni: "medium",
  vysoka: "high",
};
const normalise = (v) => TRANSLATE[v] ?? v;

// Must stay in sync with barCategoryGap / barGap props on <ComposedChart>
const BAR_CAT_GAP_RATIO = 0.4;
const BAR_GAP_PX = 3;

// ─── Shape helpers ────────────────────────────────────────────────────────────
// Injects the correct year's colour from the payload before rendering a shape
const withYear = (Shape, yr) => (props) => {
  const color = props.payload?.[`color_${yr}`] || YEAR_COLORS[yr];
  return <Shape {...props} resolvedColor={color} />;
};

const BottomCapShape = ({
  x,
  y,
  width,
  resolvedColor: stroke = "var(--bs-primary)",
}) => {
  if (!width) return null;
  const capW = Math.min(width * 0.5, 40),
    offset = (width - capW) / 2;
  return (
    <line
      x1={x + offset}
      y1={y}
      x2={x + width - offset}
      y2={y}
      stroke={stroke}
      strokeWidth={2}
    />
  );
};

const WhiskerShape = ({
  x,
  y,
  width,
  height,
  resolvedColor: stroke = "var(--bs-primary)",
}) => (
  <line
    x1={x + width / 2}
    y1={y}
    x2={x + width / 2}
    y2={y + height}
    stroke={stroke}
    strokeWidth={2}
  />
);

const BoxBottomShape = ({
  x,
  y,
  width,
  height,
  resolvedColor: stroke = "var(--bs-primary)",
}) => (
  <g>
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={stroke}
      fillOpacity="0.2"
      stroke="none"
    />
    <line
      x1={x}
      y1={y + height}
      x2={x + width}
      y2={y + height}
      stroke={stroke}
      strokeWidth={2}
    />
    <line
      x1={x}
      y1={y}
      x2={x}
      y2={y + height}
      stroke={stroke}
      strokeWidth={2}
    />
    <line
      x1={x + width}
      y1={y}
      x2={x + width}
      y2={y + height}
      stroke={stroke}
      strokeWidth={2}
    />
  </g>
);

const BoxTopShape = ({
  x,
  y,
  width,
  height,
  resolvedColor: stroke = "var(--bs-primary)",
}) => (
  <g>
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      fill={stroke}
      fillOpacity="0.2"
      stroke="none"
    />
    <line x1={x} y1={y} x2={x + width} y2={y} stroke={stroke} strokeWidth={2} />
    <line
      x1={x}
      y1={y}
      x2={x}
      y2={y + height}
      stroke={stroke}
      strokeWidth={2}
    />
    <line
      x1={x + width}
      y1={y}
      x2={x + width}
      y2={y + height}
      stroke={stroke}
      strokeWidth={2}
    />
    <line
      x1={x}
      y1={y + height}
      x2={x + width}
      y2={y + height}
      stroke="var(--bs-danger)"
      strokeWidth={3}
    />
  </g>
);

const TopWhiskerWithCapShape = ({
  x,
  y,
  width,
  height,
  resolvedColor: stroke = "var(--bs-primary)",
}) => {
  const cx = x + width / 2,
    capW = Math.min(width * 0.5, 40),
    off = (width - capW) / 2;
  return (
    <g>
      <line
        x1={cx}
        y1={y}
        x2={cx}
        y2={y + height}
        stroke={stroke}
        strokeWidth={2}
      />
      <line
        x1={x + off}
        y1={y}
        x2={x + width - off}
        y2={y}
        stroke={stroke}
        strokeWidth={2}
      />
    </g>
  );
};

// ─── Outlier dots (via <Customized> — zero XAxis side-effects) ────────────────
const OutliersLayer = ({ xAxisMap, yAxisMap, scatterData, yearMode }) => {
  const xAxis = xAxisMap?.[0],
    yAxis = yAxisMap?.[0];
  if (!xAxis?.scale || !yAxis?.scale || !scatterData?.length) return null;

  const bw = xAxis.scale.bandwidth ? xAxis.scale.bandwidth() : 0;
  const margin = (bw * BAR_CAT_GAP_RATIO) / 2;
  const usable = bw * (1 - BAR_CAT_GAP_RATIO);
  const barW = (usable - BAR_GAP_PX) / 2;

  return (
    <g>
      {scatterData.map((pt, i) => {
        const xBand = xAxis.scale(pt.label);
        if (xBand === undefined) return null;
        let cx;
        if (yearMode === "both") {
          cx =
            pt.year === "2012"
              ? xBand + margin + barW / 2
              : xBand + margin + barW + BAR_GAP_PX + barW / 2;
        } else {
          cx = xBand + bw / 2;
        }
        return (
          <circle
            key={i}
            cx={cx}
            cy={yAxis.scale(pt.outlierValue)}
            r={4}
            fill={pt.color || "var(--bs-danger)"}
          />
        );
      })}
    </g>
  );
};

// ─── Tooltip ──────────────────────────────────────────────────────────────────
const StatBlock = ({ stats, color, yr }) => (
  <div
    style={{
      borderLeft: `3px solid ${color}`,
      paddingLeft: 8,
      marginBottom: 6,
    }}
  >
    <div style={{ color, fontWeight: 700, marginBottom: 2 }}>{yr}</div>
    <div>
      Max: <strong>{stats.max.toFixed(1)}</strong>
    </div>
    <div className="text-muted" style={{ fontSize: "0.78rem" }}>
      Upper whisker: {stats.whiskerMax.toFixed(1)}
    </div>
    <div style={{ color }}>
      Q3: <strong>{stats.q3.toFixed(1)}</strong>
    </div>
    <div className="text-danger">
      Median: <strong>{stats.median.toFixed(1)}</strong>
    </div>
    <div style={{ color }}>
      Q1: <strong>{stats.q1.toFixed(1)}</strong>
    </div>
    <div className="text-muted" style={{ fontSize: "0.78rem" }}>
      Lower whisker: {stats.whiskerMin.toFixed(1)}
    </div>
    <div>
      Min: <strong>{stats.min.toFixed(1)}</strong>
    </div>
  </div>
);

const CustomBoxplotTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const entry = payload[0]?.payload;
  if (!entry) return null;
  const blocks = [];
  if (entry.stats_2012)
    blocks.push({
      yr: "2012",
      stats: entry.stats_2012,
      color: YEAR_COLORS["2012"],
    });
  if (entry.stats_2016)
    blocks.push({
      yr: "2016",
      stats: entry.stats_2016,
      color: YEAR_COLORS["2016"],
    });
  if (!blocks.length) return null;
  return (
    <div
      className="p-3 bg-white border rounded shadow-sm"
      style={{ fontSize: "0.82rem", minWidth: 160 }}
    >
      <strong className="d-block mb-2">
        {CATEGORY_LABELS[label] ?? label}
      </strong>
      {blocks.map(({ yr, stats, color }) => (
        <StatBlock key={yr} stats={stats} color={color} yr={yr} />
      ))}
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
function FiveNumberSummaryBoxplot() {
  const [groupBy, setGroupBy] = useState("geo");
  const [year, setYear] = useState("both");
  const [rawData, setRawData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${import.meta.env.BASE_URL}data/QoL.csv`);
        const csvText = await response.text();
        const lines = csvText.trim().split("\n");
        const headers = lines[0]
          .split(";")
          .map((h) => h.trim().replace(/^\uFEFF/, ""));

        const ai2012Idx = headers.indexOf("AI_2012");
        const ai2016Idx = headers.indexOf("AI_2016");
        const qolIdx = headers.indexOf("QoL");
        const geoIdx = headers.indexOf("GEO_oblast");
        const maxIdx = Math.max(ai2012Idx, ai2016Idx, qolIdx, geoIdx);

        const parsed = lines
          .slice(1)
          .map((line) => {
            const cols = line.split(";");
            if (cols.length <= maxIdx) return null;
            return {
              ai2012: parseFloat(cols[ai2012Idx].replace(",", ".")),
              ai2016: parseFloat(cols[ai2016Idx].replace(",", ".")),
              qol: normalise(cols[qolIdx]?.trim()),
              geo: normalise(cols[geoIdx]?.trim()),
            };
          })
          .filter(
            (item) =>
              item !== null && !isNaN(item.ai2012) && !isNaN(item.ai2016),
          );

        setRawData(parsed);
      } catch (err) {
        console.error("Failed to fetch Boxplot CSV:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

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

  const buildEntry = (stats, yr) =>
    !stats
      ? {}
      : {
          [`color_${yr}`]: YEAR_COLORS[yr],
          [`stats_${yr}`]: stats,
          [`min_invisible_${yr}`]: stats.whiskerMin,
          [`whisker_bottom_${yr}`]: stats.q1 - stats.whiskerMin,
          [`box_bottom_${yr}`]: stats.median - stats.q1,
          [`box_top_${yr}`]: stats.q3 - stats.median,
          [`whisker_top_${yr}`]: stats.whiskerMax - stats.q3,
        };

  const { chartData, scatterData } = useMemo(() => {
    if (!rawData.length) return { chartData: [], scatterData: [] };
    const sData = [];
    const cData = CATEGORY_ORDER.map((cat) => {
      const rows = rawData.filter((d) => d[groupBy] === cat);
      const entry = { label: cat };
      ["2012", "2016"].forEach((yr) => {
        if (yr !== year && year !== "both") return;
        const vals = rows.map((d) => (yr === "2012" ? d.ai2012 : d.ai2016));
        const stats = calculateStats(vals);
        Object.assign(entry, buildEntry(stats, yr));
        stats?.outliers.forEach((val) =>
          sData.push({
            label: cat,
            outlierValue: val,
            year: yr,
            color: YEAR_COLORS[yr],
          }),
        );
      });
      return entry;
    });
    return { chartData: cData, scatterData: sData };
  }, [rawData, groupBy, year]);

  if (isLoading)
    return <div className="p-4 text-center text-muted">Loading CSV data…</div>;

  const show2012 = year === "2012" || year === "both";
  const show2016 = year === "2016" || year === "both";

  return (
    <div className="p-4 rounded-3 shadow-sm border bg-body-tertiary w-100">
      {/* ── Controls ── */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-3">
        <h6 className="mb-0">Five-Number Summary (Boxplot)</h6>
        <div className="d-flex align-items-center gap-3 flex-wrap">
          <div className="d-flex align-items-center gap-2">
            <label
              htmlFor="groupSelect"
              className="form-label mb-0 small text-muted text-nowrap"
            >
              Group by:
            </label>
            <select
              id="groupSelect"
              className="form-select form-select-sm w-auto"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
            >
              <option value="geo">GEO region</option>
              <option value="qol">Quality of Life</option>
            </select>
          </div>
          <div className="d-flex align-items-center gap-2">
            <label
              htmlFor="yearSelect"
              className="form-label mb-0 small text-muted text-nowrap"
            >
              Year:
            </label>
            <select
              id="yearSelect"
              className="form-select form-select-sm w-auto"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="both">Compare (2012 / 2016)</option>
              <option value="2016">2016 only</option>
              <option value="2012">2012 only</option>
            </select>
          </div>
        </div>
      </div>

      {/* ── Legend ── */}
      <div className="d-flex gap-4 mb-3 ps-1">
        {show2012 && (
          <span className="small d-flex align-items-center gap-1">
            <span
              style={{
                display: "inline-block",
                width: 14,
                height: 14,
                borderRadius: 2,
                background: "var(--bs-info)",
              }}
            />
            2012
          </span>
        )}
        {show2016 && (
          <span className="small d-flex align-items-center gap-1">
            <span
              style={{
                display: "inline-block",
                width: 14,
                height: 14,
                borderRadius: 2,
                background: "var(--bs-primary)",
              }}
            />
            2016
          </span>
        )}
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
          Median
        </span>
      </div>

      {/* ── Chart ── */}
      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 20, left: -20 }}
            barCategoryGap="40%"
            barGap={BAR_GAP_PX}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tickFormatter={(v) => CATEGORY_LABELS[v] ?? v}
              tick={{ fill: "var(--bs-body-color)", fontSize: 13 }}
              interval={0}
            />
            <YAxis domain={[50, 200]} tick={{ fill: "var(--bs-body-color)" }} />
            <Tooltip
              content={<CustomBoxplotTooltip />}
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
            />

            {show2012 && (
              <>
                <Bar
                  stackId="stack2012"
                  dataKey="min_invisible_2012"
                  fill="transparent"
                  shape={withYear(BottomCapShape, "2012")}
                  maxBarSize={60}
                  isAnimationActive={false}
                />
                <Bar
                  stackId="stack2012"
                  dataKey="whisker_bottom_2012"
                  shape={withYear(WhiskerShape, "2012")}
                  maxBarSize={60}
                  isAnimationActive={false}
                />
                <Bar
                  stackId="stack2012"
                  dataKey="box_bottom_2012"
                  shape={withYear(BoxBottomShape, "2012")}
                  maxBarSize={60}
                  isAnimationActive={false}
                />
                <Bar
                  stackId="stack2012"
                  dataKey="box_top_2012"
                  shape={withYear(BoxTopShape, "2012")}
                  maxBarSize={60}
                  isAnimationActive={false}
                />
                <Bar
                  stackId="stack2012"
                  dataKey="whisker_top_2012"
                  shape={withYear(TopWhiskerWithCapShape, "2012")}
                  maxBarSize={60}
                  isAnimationActive={false}
                />
              </>
            )}

            {show2016 && (
              <>
                <Bar
                  stackId="stack2016"
                  dataKey="min_invisible_2016"
                  fill="transparent"
                  shape={withYear(BottomCapShape, "2016")}
                  maxBarSize={60}
                  isAnimationActive={false}
                />
                <Bar
                  stackId="stack2016"
                  dataKey="whisker_bottom_2016"
                  shape={withYear(WhiskerShape, "2016")}
                  maxBarSize={60}
                  isAnimationActive={false}
                />
                <Bar
                  stackId="stack2016"
                  dataKey="box_bottom_2016"
                  shape={withYear(BoxBottomShape, "2016")}
                  maxBarSize={60}
                  isAnimationActive={false}
                />
                <Bar
                  stackId="stack2016"
                  dataKey="box_top_2016"
                  shape={withYear(BoxTopShape, "2016")}
                  maxBarSize={60}
                  isAnimationActive={false}
                />
                <Bar
                  stackId="stack2016"
                  dataKey="whisker_top_2016"
                  shape={withYear(TopWhiskerWithCapShape, "2016")}
                  maxBarSize={60}
                  isAnimationActive={false}
                />
              </>
            )}

            <Customized
              component={(props) => (
                <OutliersLayer
                  {...props}
                  scatterData={scatterData}
                  yearMode={year}
                />
              )}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <p className="text-muted small mt-2 mb-0 text-center">
        * Red line = Median · Box = middle 50% of data · Dots = outliers · Hover
        bars for exact values
      </p>
    </div>
  );
}

export default FiveNumberSummaryBoxplot;
