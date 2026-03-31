// src/components/charts/helpers/StyledBoxplot.jsx
import React, { useMemo, useRef, useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import {
  ComposedChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { formatNumberSmart } from "./CustomTooltip";
import { getAxisConfig } from "../../../utils/distributions";

// ─── Internal constants ───────────────────────────────────────────────────────
const barCatGapRatio = 0.4;
const barGapPx = 3;
const CHART_MARGIN = { top: 20, right: 20, bottom: 20, left: -20 };

// ─── Shape primitives ─────────────────────────────────────────────────────────
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

const withSeries = (Shape, seriesId) => (props) => {
  const color = props.payload?.[`color_${seriesId}`] || "var(--bs-primary)";
  return <Shape {...props} resolvedColor={color} />;
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
  const { t } = useTranslation();

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
              {t("components.styledBoxplot.tooltip.max")}:{" "}
              <strong>{fmt(s.max)}</strong>
            </div>
            <div className="text-muted" style={{ fontSize: "0.78rem" }}>
              {t("components.styledBoxplot.tooltip.upperWhisker")}:{" "}
              {fmt(s.whiskerMax)}
            </div>
            <div style={{ color }}>
              {t("components.styledBoxplot.tooltip.q3")}:{" "}
              <strong>{fmt(s.q3)}</strong>
            </div>
            <div className="text-danger">
              {t("components.styledBoxplot.tooltip.median")}:{" "}
              <strong>{fmt(s.median)}</strong>
            </div>
            <div style={{ color }}>
              {t("components.styledBoxplot.tooltip.q1")}:{" "}
              <strong>{fmt(s.q1)}</strong>
            </div>
            <div className="text-muted" style={{ fontSize: "0.78rem" }}>
              {t("components.styledBoxplot.tooltip.lowerWhisker")}:{" "}
              {fmt(s.whiskerMin)}
            </div>
            <div>
              {t("components.styledBoxplot.tooltip.min")}:{" "}
              <strong>{fmt(s.min)}</strong>
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
 * chartData      — recharts-ready array; each entry has stacked bar keys
 * e.g. min_invisible_<id>, whisker_bottom_<id>, ...
 * and stats_<id> object for the tooltip
 * scatterData    — outlier points: [{ label, outlierValue, seriesId, color }]
 * series         — [{ id: "2012", color: "var(--bs-info)" }]
 * categoryLabels — { low: "Nízka", ... }  – X axis tick formatter
 * tooltipContent — optional custom tooltip component
 * height         — CSS height string (default "clamp(260px, 50vw, 400px)")
 * maxBarSize     — max bar width in px (default 60)
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
  const wrapperRef = useRef(null);
  const [wrapperSize, setWrapperSize] = useState({
    width: 0,
    height: 0,
    plotLeft: 0,
    plotTop: 0,
    plotBottom: 0,
  });

  // Measure actual plot area bounds from rendered DOM elements
  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const measure = () => {
      const svg = el.querySelector(".recharts-surface");
      const yAxisEl = el.querySelector(".recharts-yAxis");
      const gridEl = el.querySelector(".recharts-cartesian-grid");
      // Measure actual rendered bar width
      const barEl = el.querySelector(
        ".recharts-bar-rectangle path, .recharts-bar-rectangle rect",
      );
      if (!svg || !yAxisEl || !gridEl) return;
      const svgRect = svg.getBoundingClientRect();
      const yAxisRect = yAxisEl.getBoundingClientRect();
      const gridRect = gridEl.getBoundingClientRect();

      setWrapperSize({
        width: svgRect.width,
        height: svgRect.height,
        plotLeft: yAxisRect.right - svgRect.left,
        plotTop: gridRect.top - svgRect.top,
        plotBottom: gridRect.bottom - svgRect.top,
      });
    };
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    // Also run after a tick to catch first render
    const t = setTimeout(measure, 50);
    return () => {
      ro.disconnect();
      clearTimeout(t);
    };
  }, []);

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

  // Compute pixel positions for outlier dots from measured plot area
  const outlierDots = useMemo(() => {
    const { width: W, plotLeft, plotTop, plotBottom } = wrapperSize;
    if (!W || !plotLeft || !scatterData.length || !chartData.length) return [];

    const xStart = plotLeft;
    const xEnd = W - CHART_MARGIN.right;
    const plotW = xEnd - xStart;
    const plotH = plotBottom - plotTop;

    const categories = chartData.map((d) => d.label);
    const nCats = categories.length;
    const nSeries = seriesIds.length;

    const [yMin, yMax] = yAxisConfig.domain;
    const yScale = (val) =>
      plotTop + plotH - ((val - yMin) / (yMax - yMin)) * plotH;

    const bandW = plotW / nCats;
    const gap = bandW * barCatGapRatio;
    const usable = bandW - gap;
    const barW = nSeries > 1 ? (usable - barGapPx) / 2 : usable;

    return scatterData
      .map((pt) => {
        const catIdx = categories.indexOf(pt.label);
        if (catIdx === -1) return null;
        const bandStart = xStart + catIdx * bandW + gap / 2;
        const seriesIdx = seriesIds.indexOf(pt.seriesId);
        const cx =
          nSeries > 1
            ? bandStart + seriesIdx * (barW + barGapPx) + barW / 2
            : bandStart + barW / 2;
        return { cx, cy: yScale(pt.outlierValue), color: pt.color };
      })
      .filter(Boolean);
  }, [wrapperSize, scatterData, chartData, seriesIds, yAxisConfig]);

  const resolvedTooltip = tooltipContent ? (
    tooltipContent
  ) : (
    <DefaultTooltip series={series} categoryLabels={categoryLabels} />
  );

  return (
    <div
      ref={wrapperRef}
      style={{ width: "100%", height, position: "relative" }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <ComposedChart
          data={chartData}
          margin={CHART_MARGIN}
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
        </ComposedChart>
      </ResponsiveContainer>

      {/* Outlier dots as absolute SVG overlay — avoids Recharts axis interference */}
      {outlierDots.length > 0 && (
        <svg
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
          }}
        >
          {outlierDots.map((dot, i) => (
            <circle key={i} cx={dot.cx} cy={dot.cy} r={4} fill={dot.color} />
          ))}
        </svg>
      )}
    </div>
  );
}

export default StyledBoxplot;
