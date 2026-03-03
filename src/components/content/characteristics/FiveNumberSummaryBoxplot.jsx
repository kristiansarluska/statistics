// src/components/content/characteristics/FiveNumberSummaryBoxplot.jsx
import React, { useState, useMemo } from "react";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Scatter,
} from "recharts";

// --- VLASTNÉ TVARY (SHAPES) PRE RECHARTS ---
const BottomCapShape = (props) => {
  const { x, y, width, payload } = props;
  if (!width) return null;
  const stroke = payload.color || "var(--bs-primary)";
  const capW = Math.min(width * 0.5, 40);
  const offset = (width - capW) / 2;
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

const WhiskerShape = (props) => {
  const { x, y, width, height, payload } = props;
  const stroke = payload.color || "var(--bs-primary)";
  const centerX = x + width / 2;
  return (
    <line
      x1={centerX}
      y1={y}
      x2={centerX}
      y2={y + height}
      stroke={stroke}
      strokeWidth={2}
    />
  );
};

const BoxBottomShape = (props) => {
  const { x, y, width, height, payload } = props;
  const stroke = payload.color || "var(--bs-primary)";
  return (
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
};

const BoxTopShape = (props) => {
  const { x, y, width, height, payload } = props;
  const stroke = payload.color || "var(--bs-primary)";
  return (
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
        y1={y}
        x2={x + width}
        y2={y}
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
};

const TopWhiskerWithCapShape = (props) => {
  const { x, y, width, height, payload } = props;
  const stroke = payload.color || "var(--bs-primary)";
  const centerX = x + width / 2;
  const capW = Math.min(width * 0.5, 40);
  const offset = (width - capW) / 2;
  return (
    <g>
      <line
        x1={centerX}
        y1={y}
        x2={centerX}
        y2={y + height}
        stroke={stroke}
        strokeWidth={2}
      />
      <line
        x1={x + offset}
        y1={y}
        x2={x + width - offset}
        y2={y}
        stroke={stroke}
        strokeWidth={2}
      />
    </g>
  );
};

// Tvar pre extrémy
const ScatterDot = (props) => {
  const { cx, cy, payload } = props;
  return (
    <circle cx={cx} cy={cy} r={4} fill={payload.color || "var(--bs-danger)"} />
  );
};

// Tooltip
const CustomBoxplotTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    if (!data.stats) return null;

    return (
      <div
        className="p-3 bg-white border rounded shadow-sm"
        style={{ fontSize: "0.85rem", borderColor: data.color }}
      >
        <strong className="d-block mb-2" style={{ color: data.color }}>
          {label}
        </strong>
        <div>
          Max (s extrémami): <strong>{data.stats.max.toFixed(1)}</strong>
        </div>
        <div className="text-muted">
          Horný fúz: {data.stats.whiskerMax.toFixed(1)}
        </div>
        <div className="mt-1" style={{ color: data.color }}>
          Horný kvartil (Q3): <strong>{data.stats.q3.toFixed(1)}</strong>
        </div>
        <div className="text-danger">
          Medián: <strong>{data.stats.median.toFixed(1)}</strong>
        </div>
        <div className="mb-1" style={{ color: data.color }}>
          Dolný kvartil (Q1): <strong>{data.stats.q1.toFixed(1)}</strong>
        </div>
        <div className="text-muted">
          Dolný fúz: {data.stats.whiskerMin.toFixed(1)}
        </div>
        <div>
          Min (s extrémami): <strong>{data.stats.min.toFixed(1)}</strong>
        </div>
      </div>
    );
  }
  return null;
};

// --- HLAVNÝ KOMPONENT ---
function FiveNumberSummaryBoxplot() {
  const [groupBy, setGroupBy] = useState("all");
  const [year, setYear] = useState("both");

  // Vzorka dát vyextrahovaná priamo z ANOVA.xlsx (viac rozmanitá)
  const regionData = [
    { id: "AT11", ai2012: 153.1, ai2016: 139.4, qol: "vysoka", geo: "vysoka" },
    { id: "AT12", ai2012: 130.6, ai2016: 144.9, qol: "vysoka", geo: "stredni" },
    { id: "AT13", ai2012: 119.2, ai2016: 125.7, qol: "vysoka", geo: "stredni" },
    { id: "AT21", ai2012: 144.5, ai2016: 136.5, qol: "vysoka", geo: "vysoka" },
    { id: "AT22", ai2012: 139.9, ai2016: 154.8, qol: "vysoka", geo: "stredni" },
    { id: "AT31", ai2012: 109.5, ai2016: 128.8, qol: "vysoka", geo: "stredni" },
    { id: "BE10", ai2012: 75.7, ai2016: 72.0, qol: "stredni", geo: "stredni" },
    {
      id: "BE21",
      ai2012: 112.9,
      ai2016: 124.5,
      qol: "stredni",
      geo: "stredni",
    },
    { id: "BE32", ai2012: 93.1, ai2016: 113.4, qol: "nizka", geo: "stredni" },
    { id: "BE33", ai2012: 103.2, ai2016: 110.7, qol: "nizka", geo: "nizky" },
    { id: "BG31", ai2012: 177.0, ai2016: 161.7, qol: "nizka", geo: "nizky" },
    { id: "BG32", ai2012: 194.2, ai2016: 180.2, qol: "nizka", geo: "nizky" },
    { id: "BG41", ai2012: 93.7, ai2016: 95.4, qol: "stredni", geo: "stredni" },
    { id: "UKI6", ai2012: 79.0, ai2016: 75.7, qol: "vysoka", geo: "nizky" },
    { id: "UKJ1", ai2012: 82.9, ai2016: 86.0, qol: "vysoka", geo: "nizky" },
    { id: "UKJ2", ai2012: 106.6, ai2016: 128.4, qol: "vysoka", geo: "stredni" },
    { id: "UKE3", ai2012: 97.6, ai2016: 105.6, qol: "nizka", geo: "nizky" },
    { id: "UKK4", ai2012: 149.4, ai2016: 156.7, qol: "stredni", geo: "nizky" },
    { id: "UKL1", ai2012: 135.4, ai2016: 135.4, qol: "stredni", geo: "nizky" },
    { id: "UKF3", ai2012: 136.3, ai2016: 150.2, qol: "vysoka", geo: "nizky" },
  ];

  const calculateStats = (values) => {
    if (values.length === 0) return null;
    const sorted = [...values].sort((a, b) => a - b);

    const getQuantile = (p) => {
      const pos = p * (sorted.length - 1);
      const base = Math.floor(pos);
      const rest = pos - base;
      return sorted[base + 1] !== undefined
        ? sorted[base] + rest * (sorted[base + 1] - sorted[base])
        : sorted[base];
    };

    const min = sorted[0];
    const max = sorted[sorted.length - 1];
    const q1 = getQuantile(0.25);
    const median = getQuantile(0.5);
    const q3 = getQuantile(0.75);
    const iqr = q3 - q1;

    const lowerFence = q1 - 1.5 * iqr;
    const upperFence = q3 + 1.5 * iqr;

    const outliers = sorted.filter((v) => v < lowerFence || v > upperFence);
    const regularValues = sorted.filter(
      (v) => v >= lowerFence && v <= upperFence,
    );

    const whiskerMin = regularValues.length > 0 ? regularValues[0] : q1;
    const whiskerMax =
      regularValues.length > 0 ? regularValues[regularValues.length - 1] : q3;

    return { min, q1, median, q3, max, whiskerMin, whiskerMax, outliers };
  };

  const { chartData, scatterData } = useMemo(() => {
    const cData = [];
    const sData = [];

    const addData = (label, values, yr) => {
      const stats = calculateStats(values);
      if (!stats) return;

      const clr = yr === "2012" ? "var(--bs-info)" : "var(--bs-primary)";

      cData.push({
        label,
        color: clr,
        min_invisible: stats.whiskerMin,
        whisker_bottom: stats.q1 - stats.whiskerMin,
        box_bottom: stats.median - stats.q1,
        box_top: stats.q3 - stats.median,
        whisker_top: stats.whiskerMax - stats.q3,
        stats,
      });

      stats.outliers.forEach((val) => {
        sData.push({ label, outlierValue: val, color: clr });
      });
    };

    if (groupBy === "all") {
      if (year === "2012" || year === "both")
        addData(
          `Všetky (${year === "both" ? "2012" : "Regióny"})`,
          regionData.map((d) => d.ai2012),
          "2012",
        );
      if (year === "2016" || year === "both")
        addData(
          `Všetky (${year === "both" ? "2016" : "Regióny"})`,
          regionData.map((d) => d.ai2016),
          "2016",
        );
    } else {
      const categories = [...new Set(regionData.map((d) => d[groupBy]))];
      categories.forEach((cat) => {
        const catData = regionData.filter((d) => d[groupBy] === cat);
        if (year === "2012" || year === "both")
          addData(
            `${cat} ${year === "both" ? "(2012)" : ""}`.trim(),
            catData.map((d) => d.ai2012),
            "2012",
          );
        if (year === "2016" || year === "both")
          addData(
            `${cat} ${year === "both" ? "(2016)" : ""}`.trim(),
            catData.map((d) => d.ai2016),
            "2016",
          );
      });
    }

    return { chartData: cData, scatterData: sData };
  }, [groupBy, year]);

  return (
    <div className="p-4 rounded-3 shadow-sm border bg-body-tertiary w-100">
      <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
        <h6 className="mb-0">Päťčíselná charakteristika (Boxplot)</h6>
        <div className="d-flex align-items-center gap-3">
          {/* Výber kategórie */}
          <div className="d-flex align-items-center gap-2">
            <label
              htmlFor="groupSelect"
              className="form-label mb-0 small text-muted text-nowrap"
            >
              Zoskupiť:
            </label>
            <select
              id="groupSelect"
              className="form-select form-select-sm w-auto"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
            >
              <option value="all">Nezoskupovať</option>
              <option value="qol">Kvalita života</option>
              <option value="geo">GEO oblasť</option>
            </select>
          </div>
          {/* Výber roku */}
          <div className="d-flex align-items-center gap-2">
            <label
              htmlFor="yearSelect"
              className="form-label mb-0 small text-muted text-nowrap"
            >
              Rok:
            </label>
            <select
              id="yearSelect"
              className="form-select form-select-sm w-auto"
              value={year}
              onChange={(e) => setYear(e.target.value)}
            >
              <option value="both">Porovnať (2012 / 2016)</option>
              <option value="2016">Len 2016</option>
              <option value="2012">Len 2012</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ width: "100%", height: 400 }}>
        <ResponsiveContainer>
          <ComposedChart
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 20, left: -20 }}
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--bs-body-color)", fontSize: 12 }}
              interval={0}
            />
            {/* Fixná doména, aby graf nikdy nespadol do NaN */}
            <YAxis domain={[50, 200]} tick={{ fill: "var(--bs-body-color)" }} />
            <Tooltip
              content={<CustomBoxplotTooltip />}
              cursor={{ fill: "rgba(0,0,0,0.05)" }}
            />

            {/* Skladačka segmentov */}
            <Bar
              stackId="a"
              dataKey="min_invisible"
              fill="transparent"
              shape={<BottomCapShape />}
              maxBarSize={50}
              isAnimationActive={false}
            />
            <Bar
              stackId="a"
              dataKey="whisker_bottom"
              shape={<WhiskerShape />}
              maxBarSize={50}
              isAnimationActive={false}
            />
            <Bar
              stackId="a"
              dataKey="box_bottom"
              shape={<BoxBottomShape />}
              maxBarSize={50}
              isAnimationActive={false}
            />
            <Bar
              stackId="a"
              dataKey="box_top"
              shape={<BoxTopShape />}
              maxBarSize={50}
              isAnimationActive={false}
            />
            <Bar
              stackId="a"
              dataKey="whisker_top"
              shape={<TopWhiskerWithCapShape />}
              maxBarSize={50}
              isAnimationActive={false}
            />

            {/* Extrémne hodnoty (Scatter bodky dokonale zarovnané so stĺpcami) */}
            <Scatter
              data={scatterData}
              dataKey="outlierValue"
              shape={<ScatterDot />}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      <p className="text-muted small mt-2 mb-0 text-center">
        * Červená čiara = Medián, Krabica = stredných 50 % dát. Pre presné
        hodnoty prejdite myšou na graf.
      </p>
    </div>
  );
}

export default FiveNumberSummaryBoxplot;
