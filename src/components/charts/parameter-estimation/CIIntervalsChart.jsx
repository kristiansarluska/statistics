import React, { useState, useEffect, useRef, useMemo } from "react";
import { POP_MEAN, POP_STD } from "../../../utils/ciMath";

function CIIntervalsChart({ samples, n, t }) {
  if (!samples.length) {
    return (
      <div
        className="text-center text-muted py-5"
        style={{
          fontSize: "0.9rem",
          border: "1px solid var(--bs-border-color)",
          borderRadius: 4,
        }}
      >
        {t(
          "parameterEstimation.intervalEstimation.simulation.charts.emptyState",
        )}
      </div>
    );
  }

  const [tooltip, setTooltip] = useState(null);

  const popSE = POP_STD / Math.sqrt(n);
  const CLAMP_MIN = POP_MEAN - 4 * popSE;
  const CLAMP_MAX = POP_MEAN + 4 * popSE;

  const X_TICKS = useMemo(() => {
    return [
      POP_MEAN - 4 * popSE,
      POP_MEAN - 2 * popSE,
      POP_MEAN,
      POP_MEAN + 2 * popSE,
      POP_MEAN + 4 * popSE,
    ];
  }, [popSE]);

  const ROW_H = 20;
  const ML = 65;
  const MR = 30;
  const MT = 24;
  const MB = 36;
  const MAX_H = 240;

  const svgH = MT + samples.length * ROW_H + MB;

  const svgRef = useRef(null);
  const [svgW, setSvgW] = useState(600);

  useEffect(() => {
    if (!svgRef.current) return;
    const ro = new ResizeObserver(() => {
      setSvgW(svgRef.current?.clientWidth || 600);
    });
    ro.observe(svgRef.current);
    setSvgW(svgRef.current.clientWidth || 600);
    return () => ro.disconnect();
  }, []);

  const plotW = svgW - ML - MR;
  const plotH = samples.length * ROW_H;
  const toX = (v) =>
    ML +
    ((Math.max(CLAMP_MIN, Math.min(CLAMP_MAX, v)) - CLAMP_MIN) /
      (CLAMP_MAX - CLAMP_MIN)) *
      plotW;
  const rowCY = (i) => MT + (i + 0.5) * ROW_H;

  const handleMouseEnter = (e, s, i) => {
    const rect = svgRef.current?.getBoundingClientRect();
    if (!rect) return;
    setTooltip({ s, i, mx: e.clientX - rect.left, my: e.clientY - rect.top });
  };

  return (
    <div
      style={{
        background: "var(--bs-body-bg)",
        overflowX: "hidden",
        overflowY: svgH > MAX_H ? "auto" : "visible",
        maxHeight: svgH > MAX_H ? MAX_H : undefined,
      }}
    >
      <svg
        ref={svgRef}
        width="100%"
        height={svgH}
        style={{ display: "block", overflow: "visible" }}
        onMouseLeave={() => setTooltip(null)}
      >
        {/* Grid vertical lines */}
        {X_TICKS.map((v) => (
          <line
            key={v}
            x1={toX(v)}
            y1={MT}
            x2={toX(v)}
            y2={MT + plotH}
            stroke="var(--bs-border-color)"
            strokeWidth={1}
            strokeDasharray="3 3"
          />
        ))}

        {/* X axis line */}
        <line
          x1={ML}
          y1={MT + plotH}
          x2={svgW - MR}
          y2={MT + plotH}
          stroke="var(--bs-border-color)"
          strokeWidth={1}
        />

        {/* X axis ticks + labels */}
        {X_TICKS.map((v) => (
          <g key={v}>
            <line
              x1={toX(v)}
              y1={MT + plotH}
              x2={toX(v)}
              y2={MT + plotH + 4}
              stroke="var(--bs-body-color)"
              strokeWidth={1}
            />
            <text
              x={toX(v)}
              y={MT + plotH + 16}
              textAnchor="middle"
              fontSize={10}
              fill="var(--bs-body-color)"
              opacity={0.7}
            >
              {v.toFixed(2)}
            </text>
          </g>
        ))}

        {/* X axis label */}
        <text
          x={ML + plotW / 2}
          y={svgH - 4}
          textAnchor="middle"
          fontSize={11}
          fill="var(--bs-body-color)"
          opacity={0.8}
        >
          {t(
            "parameterEstimation.intervalEstimation.simulation.charts.xAxisLabel",
          )}
        </text>

        {/* Y axis labels */}
        {samples.map((_, i) => {
          const num = samples.length - i;
          if (
            samples.length > 20 &&
            num % 5 !== 0 &&
            num !== 1 &&
            num !== samples.length
          )
            return null;
          return (
            <text
              key={i}
              x={ML - 4}
              y={rowCY(i) + 4}
              textAnchor="end"
              fontSize={9}
              fill="var(--bs-body-color)"
              opacity={0.6}
            >
              {num}
            </text>
          );
        })}

        {/* μ reference line */}
        <line
          x1={toX(POP_MEAN)}
          y1={MT - 10}
          x2={toX(POP_MEAN)}
          y2={MT + plotH}
          stroke="var(--bs-primary)"
          strokeWidth={1.5}
          strokeDasharray="5 3"
        />
        <text
          x={toX(POP_MEAN)}
          y={MT - 12}
          textAnchor="middle"
          fontSize={9}
          fill="var(--bs-primary)"
          fontWeight="bold"
        >
          μ={POP_MEAN}
        </text>

        {/* Interval lines */}
        {samples.map((s, i) => {
          const px1 = toX(s.lower === -Infinity ? CLAMP_MIN : s.lower);
          const px2 = toX(s.upper === Infinity ? CLAMP_MAX : s.upper);
          const pxMean = toX(s.mean);
          const cy = rowCY(i);
          const col = s.hit ? "var(--bs-success)" : "var(--bs-danger)";
          const capH = 5;
          const sw = i === 0 ? 2.5 : 1.5;
          return (
            <g
              key={i}
              style={{ cursor: "default" }}
              onMouseEnter={(e) => handleMouseEnter(e, s, i)}
              onMouseMove={(e) => handleMouseEnter(e, s, i)}
            >
              <rect
                x={px1}
                y={cy - 8}
                width={Math.max(1, px2 - px1)}
                height={16}
                fill="transparent"
              />
              <line
                x1={px1}
                y1={cy}
                x2={px2}
                y2={cy}
                stroke={col}
                strokeWidth={sw}
                strokeDasharray={
                  s.lower === -Infinity || s.upper === Infinity
                    ? "5 3"
                    : undefined
                }
              />
              {s.lower !== -Infinity && (
                <line
                  x1={px1}
                  y1={cy - capH / 2}
                  x2={px1}
                  y2={cy + capH / 2}
                  stroke={col}
                  strokeWidth={sw}
                />
              )}
              {s.upper !== Infinity && (
                <line
                  x1={px2}
                  y1={cy - capH / 2}
                  x2={px2}
                  y2={cy + capH / 2}
                  stroke={col}
                  strokeWidth={sw}
                />
              )}
              <circle cx={pxMean} cy={cy} r={i === 0 ? 3.5 : 2.5} fill={col} />
            </g>
          );
        })}

        {/* SVG tooltip */}
        {tooltip &&
          (() => {
            const { s, i, mx, my } = tooltip;
            const col = s.hit ? "var(--bs-success)" : "var(--bs-danger)";
            const lines = [
              t(
                "parameterEstimation.intervalEstimation.simulation.charts.tooltipSelection",
                { num: samples.length - i },
              ),
              `x̄ = ${s.mean.toFixed(3)}`,
              ...(s.lower !== -Infinity
                ? [
                    t(
                      "parameterEstimation.intervalEstimation.simulation.charts.tooltipLower",
                      { val: s.lower.toFixed(3) },
                    ),
                  ]
                : []),
              ...(s.upper !== Infinity
                ? [
                    t(
                      "parameterEstimation.intervalEstimation.simulation.charts.tooltipUpper",
                      { val: s.upper.toFixed(3) },
                    ),
                  ]
                : []),
              s.hit
                ? t(
                    "parameterEstimation.intervalEstimation.simulation.charts.tooltipContains",
                  )
                : t(
                    "parameterEstimation.intervalEstimation.simulation.charts.tooltipNotContains",
                  ),
            ];
            const tw = 148,
              th = lines.length * 16 + 10;
            const tx = mx + tw + 8 > svgW ? mx - tw - 4 : mx + 8;
            const ty = Math.min(my - 4, svgH - th - 4);
            return (
              <g style={{ pointerEvents: "none" }}>
                <rect
                  x={tx}
                  y={ty}
                  width={tw}
                  height={th}
                  rx={4}
                  fill="var(--bs-body-bg)"
                  stroke="var(--bs-border-color)"
                  strokeWidth={1}
                  filter="drop-shadow(0 2px 4px rgba(0,0,0,0.3))"
                />
                {lines.map((ln, li) => (
                  <text
                    key={li}
                    x={tx + 8}
                    y={ty + 14 + li * 16}
                    fontSize={10}
                    fill={
                      li === 0
                        ? "var(--bs-secondary-color)"
                        : li === lines.length - 1
                          ? col
                          : "var(--bs-body-color)"
                    }
                    fontWeight={
                      li === 0 || li === lines.length - 1 ? "bold" : "normal"
                    }
                  >
                    {ln}
                  </text>
                ))}
              </g>
            );
          })()}
      </svg>
    </div>
  );
}

export default CIIntervalsChart;
