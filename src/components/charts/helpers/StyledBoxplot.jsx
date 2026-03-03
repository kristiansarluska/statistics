// src/components/charts/helpers/StyledBoxplot.jsx
import React, { useMemo } from "react";
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
import { formatNumberSmart } from "./CustomTooltip";
import { getAxisConfig } from "../../../utils/distributions";

// ─── Internal constants ───────────────────────────────────────────────────────
const barCatGapRatio = 0.4;
const barGapPx = 3;

// ─── Shape primitives ─────────────────────────────────────────────────────────
// Each shape receives resolvedColor injected by withSeries()
const BottomCapShape = ({ x, y, width, resolvedColor: stroke }) => {
  if (!width) return null;
  const capW = Math.min(width * 0.5, 40),
    off = (width - capW) / 2;
  return (
    <line
      x1={x + off}
      y1={y}
      x2={x + width - off}
      y2={y}
      stroke={stroke}
      strokeWidth={2}
    />
  );
};
const WhiskerShape = ({ x, y, width, height, resolvedColor: stroke }) => (
  <line
    x1={x + width / 2}
    y1={y}
    x2={x + width / 2}
    y2={y + height}
    stroke={stroke}
    strokeWidth={2}
  />
);
const BoxBottomShape = ({ x, y, width, height, resolvedColor: stroke }) => (
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
const BoxTopShape = ({ x, y, width, height, resolvedColor: stroke }) => (
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
  resolvedColor: stroke,
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

// Injects series colour from payload before rendering a shape
const withSeries = (Shape, seriesId) => (props) => {
  const color = props.payload?.[`color_${seriesId}`] || "var(--bs-primary)";
  return <Shape {...props} resolvedColor={color} />;
};

// ─── Outlier dots (via <Customized> — no XAxis side-effects) ─────────────────
const OutliersLayer = ({ xAxisMap, yAxisMap, scatterData, seriesIds }) => {
  const xAxis = xAxisMap?.[0],
    yAxis = yAxisMap?.[0];
  if (!xAxis?.scale || !yAxis?.scale || !scatterData?.length) return null;

  const bw = xAxis.scale.bandwidth ? xAxis.scale.bandwidth() : 0;
  const margin = (bw * barCatGapRatio) / 2;
  const usable = bw * (1 - barCatGapRatio);
  const barW = seriesIds.length > 1 ? (usable - barGapPx) / 2 : usable;
  const dualMode = seriesIds.length > 1;

  return (
    <g>
      {scatterData.map((pt, i) => {
        const xBand = xAxis.scale(pt.label);
        if (xBand === undefined) return null;
        let cx;
        if (dualMode) {
          const idx = seriesIds.indexOf(pt.seriesId);
          cx = xBand + margin + idx * (barW + barGapPx) + barW / 2;
        } else {
          cx = xBand + margin + barW / 2;
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

// ─── Default tooltip ──────────────────────────────────────────────────────────
const fmt = (v) => formatNumberSmart(v);

const DefaultTooltip = ({
  active,
  payload,
  label,
  categoryLabels = {},
  series = [],
}) => {
  if (!active || !payload?.length) return null;
  const entry = payload[0]?.payload;
  if (!entry) return null;
  const blocks = series.filter((s) => entry[`stats_${s.id}`]);
  if (!blocks.length) return null;
  return (
    <div className="custom-tooltip" style={{ minWidth: 180 }}>
      <p className="mb-2 fw-bold">{categoryLabels[label] ?? label}</p>
      {blocks.map(({ id, color }) => {
        const s = entry[`stats_${id}`];
        return (
          <div
            key={id}
            style={{
              borderLeft: `3px solid ${color}`,
              paddingLeft: 8,
              marginBottom: 6,
            }}
          >
            <div style={{ color, fontWeight: 700, marginBottom: 2 }}>{id}</div>
            <div>
              Maximum: <strong>{fmt(s.max)}</strong>
            </div>
            <div className="text-muted" style={{ fontSize: "0.78rem" }}>
              Horný fúz: {fmt(s.whiskerMax)}
            </div>
            <div style={{ color }}>
              Q3: <strong>{fmt(s.q3)}</strong>
            </div>
            <div className="text-danger">
              Medián: <strong>{fmt(s.median)}</strong>
            </div>
            <div style={{ color }}>
              Q1: <strong>{fmt(s.q1)}</strong>
            </div>
            <div className="text-muted" style={{ fontSize: "0.78rem" }}>
              Dolný fúz: {fmt(s.whiskerMin)}
            </div>
            <div>
              Minimum: <strong>{fmt(s.min)}</strong>
            </div>
          </div>
        );
      })}
    </div>
  );
};

// ─── Main component ───────────────────────────────────────────────────────────
/**
 * Reusable boxplot chart. Analogous to StyledBarChart / StyledLineChart.
 *
 * Props:
 *   chartData      — recharts-ready array; each entry has stacked bar keys
 *                    e.g. min_invisible_<id>, whisker_bottom_<id>, ...
 *                    and stats_<id> object for the tooltip
 *   scatterData    — outlier points: [{ label, outlierValue, seriesId, color }]
 *   series         — [{ id: "2012", color: "var(--bs-info)" }]
 *   categoryLabels — { low: "Nízka", ... }  – X axis tick formatter
 *   tooltipContent — optional custom tooltip component (receives series + categoryLabels)
 *   height         — CSS height string (default "clamp(260px, 50vw, 400px)")
 *   maxBarSize     — max bar width in px (default 60)
 */
function StyledBoxplot({
  chartData = [],
  scatterData = [],
  series = [],
  categoryLabels = {},
  tooltipContent,
  height = "clamp(260px, 50vw, 400px)",
  maxBarSize = 60,
}) {
  const seriesIds = series.map((s) => s.id);

  // Compute Y-axis bounds from whisker extremes + outliers
  const yAxisConfig = useMemo(() => {
    const allVals = [];
    chartData.forEach((entry) => {
      seriesIds.forEach((id) => {
        const s = entry[`stats_${id}`];
        if (s) allVals.push(s.whiskerMin, s.whiskerMax);
      });
    });
    scatterData.forEach((pt) => allVals.push(pt.outlierValue));
    if (!allVals.length)
      return { domain: [0, 100], ticks: undefined, formatTick: undefined };
    return getAxisConfig(
      Math.max(...allVals),
      "auto",
      "auto",
      Math.min(...allVals),
    );
  }, [chartData, scatterData, seriesIds]);

  const resolvedTooltip = tooltipContent ? (
    tooltipContent
  ) : (
    <DefaultTooltip series={series} categoryLabels={categoryLabels} />
  );

  return (
    <div style={{ width: "100%", height }}>
      <ResponsiveContainer>
        <ComposedChart
          data={chartData}
          margin={{ top: 20, right: 20, bottom: 20, left: -20 }}
          barCategoryGap="40%"
          barGap={barGapPx}
        >
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="label"
            tickFormatter={(v) => categoryLabels[v] ?? v}
            tick={{ fill: "var(--bs-body-color)", fontSize: 13 }}
            interval={0}
          />
          <YAxis
            domain={yAxisConfig.domain}
            ticks={yAxisConfig.ticks}
            tick={{ fill: "var(--bs-body-color)" }}
            tickFormatter={yAxisConfig.formatTick}
          />
          <Tooltip
            content={resolvedTooltip}
            cursor={{ fill: "rgba(0,0,0,0.05)" }}
          />

          {series.map(({ id }) => (
            <React.Fragment key={id}>
              <Bar
                stackId={`stack_${id}`}
                dataKey={`min_invisible_${id}`}
                fill="transparent"
                shape={withSeries(BottomCapShape, id)}
                maxBarSize={maxBarSize}
                isAnimationActive={false}
              />
              <Bar
                stackId={`stack_${id}`}
                dataKey={`whisker_bottom_${id}`}
                shape={withSeries(WhiskerShape, id)}
                maxBarSize={maxBarSize}
                isAnimationActive={false}
              />
              <Bar
                stackId={`stack_${id}`}
                dataKey={`box_bottom_${id}`}
                shape={withSeries(BoxBottomShape, id)}
                maxBarSize={maxBarSize}
                isAnimationActive={false}
              />
              <Bar
                stackId={`stack_${id}`}
                dataKey={`box_top_${id}`}
                shape={withSeries(BoxTopShape, id)}
                maxBarSize={maxBarSize}
                isAnimationActive={false}
              />
              <Bar
                stackId={`stack_${id}`}
                dataKey={`whisker_top_${id}`}
                shape={withSeries(TopWhiskerWithCapShape, id)}
                maxBarSize={maxBarSize}
                isAnimationActive={false}
              />
            </React.Fragment>
          ))}

          <Customized
            component={(props) => (
              <OutliersLayer
                {...props}
                scatterData={scatterData}
                seriesIds={seriesIds}
              />
            )}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
}

export default StyledBoxplot;
