// src/components/content/parameterEstimation/ConfidenceIntervalSimulation.jsx
import React, { useState, useEffect, useMemo } from "react";
import { BlockMath } from "react-katex";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ReferenceLine,
  ReferenceArea,
  ResponsiveContainer,
} from "recharts";
import StyledLineChart from "../../charts/helpers/StyledLineChart";
import ResetButton from "../../charts/helpers/ResetButton";
import {
  normalCDF,
  studentTCDF,
  normalPDF,
  studentTPDF,
} from "../../../utils/distributions";

const POP_MEAN = 46.2226;
const POP_STD = 3.7576;
const MAX_SAMPLES = 100;
const CLAMP_MIN = 36;
const CLAMP_MAX = 57;
const DIST_STEPS = 300;

// ─── Math helpers ──────────────────────────────────────────────────────────────

const binSearch = (fn, p, lo, hi) => {
  let mid;
  for (let i = 0; i < 80; i++) {
    mid = (lo + hi) / 2;
    fn(mid) < p ? (lo = mid) : (hi = mid);
  }
  return mid;
};

const invNorm = (p) => binSearch((x) => normalCDF(x), p, -6, 6);
const invT = (p, df) => binSearch((x) => studentTCDF(x, df), p, 0, 30);

const getCrit = (cl, type, knowSigma, df) => {
  const alpha = { 90: 0.1, 95: 0.05, 99: 0.01 }[cl];
  const p = type === "two" ? 1 - alpha / 2 : 1 - alpha;
  return knowSigma ? invNorm(p) : invT(p, df);
};

const buildCI = (mean, sd, n, cl, type, knowSigma) => {
  const se = (knowSigma ? POP_STD : sd) / Math.sqrt(n);
  const crit = getCrit(cl, type, knowSigma, n - 1);
  const lower = type === "right" ? -Infinity : mean - crit * se;
  const upper = type === "left" ? Infinity : mean + crit * se;
  const hit =
    (lower === -Infinity || lower <= POP_MEAN) &&
    (upper === Infinity || POP_MEAN <= upper);
  return { lower, upper, hit, crit, se };
};

// ─── Distribution chart — StyledLineChart + children ──────────────────────────

const DistributionChart = ({
  cl,
  type,
  knowSigma,
  n,
  lastZScore,
  allZScores,
  computedSamples,
}) => {
  const [hoverX, setHoverX] = useState(null);
  const df = n - 1;
  const alpha = { 90: 0.1, 95: 0.05, 99: 0.01 }[cl];
  const crit = getCrit(cl, type, knowSigma, df);
  const pdfFn = useMemo(
    () => (knowSigma ? (x) => normalPDF(x) : (x) => studentTPDF(x, df)),
    [knowSigma, df],
  );
  const cdfFn = useMemo(
    () => (knowSigma ? (x) => normalCDF(x) : (x) => studentTCDF(x, df)),
    [knowSigma, df],
  );

  const data = useMemo(() => {
    const pts = [];
    for (let i = 0; i <= DIST_STEPS; i++) {
      const x = -4 + (i / DIST_STEPS) * 8;
      pts.push({ x: parseFloat(x.toFixed(3)), y: pdfFn(x) });
    }
    return pts;
  }, [pdfFn]);

  const alphaLabel =
    type === "two"
      ? `α/2 = ${((alpha / 2) * 100).toFixed(1)} %`
      : `α = ${(alpha * 100).toFixed(0)} %`;

  // Pass F(z) as extra tooltip row
  const extraRows = useMemo(() => {
    if (hoverX === null) return [];
    return [
      {
        label: "F(z)",
        value: `${(cdfFn(hoverX) * 100).toFixed(2)} %`,
        color: "var(--bs-secondary-color)",
      },
    ];
  }, [hoverX, cdfFn]);

  return (
    <StyledLineChart
      data={data}
      xLabel={knowSigma ? "z-skóre  N(0,1)" : `t-skóre  t(${df})`}
      yLabel="f"
      lineClass="chart-line-primary"
      hoverX={hoverX}
      setHoverX={setHoverX}
      minX={-4}
      maxX={4}
      yAxisDomain={[0, "auto"]}
      type="pdf"
      showReferenceArea={false}
      extraRows={extraRows}
    >
      {/* Critical region(s) */}
      {type !== "right" && (
        <ReferenceArea
          x1={-4}
          x2={-crit}
          fill="var(--bs-danger)"
          fillOpacity={0.2}
          label={{
            value: alphaLabel,
            position: "insideTopLeft",
            fontSize: 10,
            fill: "var(--bs-danger)",
          }}
        />
      )}
      {type !== "left" && (
        <ReferenceArea
          x1={crit}
          x2={4}
          fill="var(--bs-danger)"
          fillOpacity={0.2}
          label={{
            value: alphaLabel,
            position: "insideTopRight",
            fontSize: 10,
            fill: "var(--bs-danger)",
          }}
        />
      )}

      {/* Critical value dashed lines */}
      {type !== "right" && (
        <ReferenceLine
          x={-crit}
          stroke="var(--bs-danger)"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          label={{
            value: `-${crit.toFixed(2)}`,
            position: "top",
            fontSize: 10,
            fill: "var(--bs-danger)",
          }}
        />
      )}
      {type !== "left" && (
        <ReferenceLine
          x={crit}
          stroke="var(--bs-danger)"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          label={{
            value: `+${crit.toFixed(2)}`,
            position: "top",
            fontSize: 10,
            fill: "var(--bs-danger)",
          }}
        />
      )}

      {/* Ghost z-scores from previous samples — colored by hit/miss */}
      {allZScores &&
        allZScores.slice(1).map((z, i) => {
          if (z < -4 || z > 4) return null;
          const hit = computedSamples[i + 1]?.hit;
          return (
            <ReferenceLine
              key={i}
              x={z}
              stroke={hit ? "var(--bs-success)" : "var(--bs-danger)"}
              strokeWidth={1.5}
              opacity={0.35}
            />
          );
        })}

      {/* Last sample z/t-score */}
      {lastZScore !== null && lastZScore >= -4 && lastZScore <= 4 && (
        <ReferenceLine
          x={lastZScore}
          stroke="var(--bs-success)"
          strokeWidth={2}
          label={{
            value: `${knowSigma ? "z" : "t"}=${lastZScore.toFixed(2)}`,
            position: lastZScore > 1.5 ? "insideTopLeft" : "insideTopRight",
            fontSize: 10,
            fill: "var(--bs-success)",
            fontWeight: "bold",
          }}
        />
      )}
    </StyledLineChart>
  );
};

// ─── CI chart — pure SVG ───────────────────────────────────────────────────────

const CIChart = ({ samples }) => {
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
        Zatiaľ žiadne výbery. Kliknite na „+ výber".
      </div>
    );
  }

  const [tooltip, setTooltip] = React.useState(null);

  const ROW_H = 20;
  const ML = 36;
  const MR = 16;
  const MT = 24;
  const MB = 36;
  const X_TICKS = [38, 40, 42, 44, 46, 48, 50, 52, 54, 56];
  const MAX_H = 300; // matches StyledLineChart fixed height

  const svgH = MT + samples.length * ROW_H + MB;

  const svgRef = React.useRef(null);
  const [svgW, setSvgW] = React.useState(600);

  React.useEffect(() => {
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
        border: "1px solid var(--bs-border-color)",
        borderRadius: 4,
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
              {v}
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
          medián veku (r.)
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
              `Výber #${samples.length - i}`,
              `x̄ = ${s.mean.toFixed(3)}`,
              ...(s.lower !== -Infinity
                ? [`dolná = ${s.lower.toFixed(3)}`]
                : []),
              ...(s.upper !== Infinity
                ? [`horná = ${s.upper.toFixed(3)}`]
                : []),
              s.hit ? "Obsahuje μ" : "Neobsahuje μ",
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
};

// ─── Formula panel ─────────────────────────────────────────────────────────────

const FormulaPanel = ({ cl, type, knowSigma, lastSample }) => {
  const sigStr = knowSigma ? "\\sigma" : "s";
  const critSub = type === "two" ? "1-\\alpha/2" : "1-\\alpha";
  const critStr = knowSigma ? `z_{${critSub}}` : `t_{n-1,\\,${critSub}}`;

  let formulaLatex;
  if (type === "two") {
    formulaLatex = `\\bar{x} \\pm ${critStr} \\cdot \\frac{${sigStr}}{\\sqrt{n}}`;
  } else if (type === "left") {
    formulaLatex = `\\left(\\bar{x} - ${critStr} \\cdot \\frac{${sigStr}}{\\sqrt{n}},\\;+\\infty\\right)`;
  } else {
    formulaLatex = `\\left(-\\infty,\\;\\bar{x} + ${critStr} \\cdot \\frac{${sigStr}}{\\sqrt{n}}\\right)`;
  }

  let calcLatex = null;
  if (lastSample) {
    const { mean, sd, n, lower, upper, crit, se } = lastSample;
    const sigVal = (knowSigma ? POP_STD : sd).toFixed(4);
    const lStr = lower === -Infinity ? "-\\infty" : lower.toFixed(3);
    const uStr = upper === Infinity ? "+\\infty" : upper.toFixed(3);
    const critLbl = knowSigma ? "z" : `t_{${n - 1}}`;
    if (type === "two") {
      calcLatex = `\\begin{aligned}
        \\bar{x} &= ${mean.toFixed(3)},\\quad ${knowSigma ? "\\sigma" : "s"} = ${sigVal},\\quad n = ${n} \\\\
        SE &= \\frac{${sigVal}}{\\sqrt{${n}}} = ${se.toFixed(4)} \\\\
        ${critLbl} &= ${crit.toFixed(4)} \\\\
        CI &= ${mean.toFixed(3)} \\pm ${crit.toFixed(4)} \\cdot ${se.toFixed(4)} = (${lStr},\\;${uStr})
      \\end{aligned}`;
    } else if (type === "left") {
      calcLatex = `\\begin{aligned}
        SE &= ${se.toFixed(4)},\\quad ${critLbl} = ${crit.toFixed(4)} \\\\
        CI &= (${mean.toFixed(3)} - ${crit.toFixed(4)} \\cdot ${se.toFixed(4)},\\;+\\infty) = (${lStr},\\;+\\infty)
      \\end{aligned}`;
    } else {
      calcLatex = `\\begin{aligned}
        SE &= ${se.toFixed(4)},\\quad ${critLbl} = ${crit.toFixed(4)} \\\\
        CI &= (-\\infty,\\;${mean.toFixed(3)} + ${crit.toFixed(4)} \\cdot ${se.toFixed(4)}) = (-\\infty,\\;${uStr})
      \\end{aligned}`;
    }
  }

  const typeLabel = {
    two: "obojstranný",
    left: "ľavostranný",
    right: "pravostranný",
  }[type];

  return (
    <div className="p-3 border rounded-3 bg-body-tertiary shadow-sm mt-1">
      <p className="fw-bold text-muted mb-2" style={{ fontSize: "0.85rem" }}>
        Vzorec ({cl} %, {typeLabel},{" "}
        {knowSigma ? "σ známe — Z-skóre" : "σ neznáme — t-skóre"}):
      </p>
      <div className="text-center overflow-auto">
        <BlockMath math={formulaLatex} />
      </div>
      {lastSample && (
        <>
          <hr className="my-2" />
          <p
            className="fw-bold text-muted mb-1"
            style={{ fontSize: "0.85rem" }}
          >
            Výpočet pre posledný výber (n = {lastSample.n}):
          </p>
          <div className="text-center overflow-auto">
            <BlockMath math={calcLatex} />
          </div>
          <p className="text-center mb-0 mt-1" style={{ fontSize: "0.85rem" }}>
            Interval{" "}
            {lastSample.hit ? (
              <strong className="text-success">obsahuje</strong>
            ) : (
              <strong className="text-danger">neobsahuje</strong>
            )}{" "}
            populačnú strednú hodnotu μ = {POP_MEAN}.
          </p>
        </>
      )}
    </div>
  );
};

// ─── Main component ─────────────────────────────────────────────────────────────

function ConfidenceIntervalSimulation() {
  const [geoJson, setGeoJson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cl, setCl] = useState(95);
  const [type, setType] = useState("two");
  const [knowSigma, setKnowSigma] = useState(true);
  const [n, setN] = useState(30);
  const [rawSamples, setRawSamples] = useState([]);
  const [showFormula, setShowFormula] = useState(false);

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}data/NUTS3_median_age_EU.geojson`)
      .then((r) => r.json())
      .then((data) => {
        setGeoJson(data);
        setLoading(false);
        const initRaw = [];
        for (let i = 0; i < 3; i++) {
          const vals = [...data.features]
            .sort(() => Math.random() - 0.5)
            .slice(0, 30)
            .map((f) => f.properties.median_age);
          const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
          const sd = Math.sqrt(
            vals.reduce((a, v) => a + (v - mean) ** 2, 0) / (vals.length - 1),
          );
          initRaw.push({ mean, sd, n: vals.length });
        }
        setRawSamples(initRaw.reverse());
      })
      .catch(() => setLoading(false));
  }, []);

  const computedSamples = useMemo(
    () =>
      rawSamples.map((s) => ({
        ...s,
        ...buildCI(s.mean, s.sd, s.n, cl, type, knowSigma),
      })),
    [rawSamples, cl, type, knowSigma],
  );

  const draw = (count) => {
    if (!geoJson) return;
    const newRaw = [];
    for (let i = 0; i < count; i++) {
      const vals = [...geoJson.features]
        .sort(() => Math.random() - 0.5)
        .slice(0, n)
        .map((f) => f.properties.median_age);
      const mean = vals.reduce((a, b) => a + b, 0) / vals.length;
      const sd = Math.sqrt(
        vals.reduce((a, v) => a + (v - mean) ** 2, 0) / (vals.length - 1),
      );
      newRaw.push({ mean, sd, n: vals.length });
    }
    setRawSamples((prev) =>
      [...newRaw.reverse(), ...prev].slice(0, MAX_SAMPLES),
    );
  };

  const total = computedSamples.length;
  const hits = computedSamples.filter((s) => s.hit).length;
  const lastSample = computedSamples[0] ?? null;

  const lastZScore = useMemo(() => {
    if (!lastSample) return null;
    const se = (knowSigma ? POP_STD : lastSample.sd) / Math.sqrt(lastSample.n);
    return (lastSample.mean - POP_MEAN) / se;
  }, [lastSample, knowSigma]);

  // All z/t-scores for ghost lines in distribution chart (capped at 40 for performance)
  const allZScores = useMemo(
    () =>
      computedSamples.slice(0, 40).map((s) => {
        const se = (knowSigma ? POP_STD : s.sd) / Math.sqrt(s.n);
        return (s.mean - POP_MEAN) / se;
      }),
    [computedSamples, knowSigma],
  );

  if (loading) {
    return (
      <div className="text-center py-4">
        <div className="spinner-border text-primary" />
      </div>
    );
  }

  return (
    <div className="chart-with-controls-container d-flex flex-column align-items-center mb-5 w-100">
      {/* ── Controls ── */}
      <div
        className="controls mb-4 d-flex flex-wrap justify-content-center gap-4 w-100"
        style={{ maxWidth: 820 }}
      >
        <div className="d-flex flex-column align-items-center">
          <label className="form-label fw-bold mb-2 small text-center">
            Hladina spoľahlivosti (1 − α):
          </label>
          <div className="btn-group">
            {[90, 95, 99].map((v, i, arr) => (
              <button
                key={v}
                type="button"
                className={`btn btn-sm btn-outline-primary px-3 ${cl === v ? "active" : ""}
                  ${i === 0 ? "rounded-start-pill" : i === arr.length - 1 ? "rounded-end-pill" : ""}`}
                onClick={() => setCl(v)}
              >
                {v} %
              </button>
            ))}
          </div>
        </div>

        <div className="d-flex flex-column align-items-center">
          <label className="form-label fw-bold mb-2 small text-center">
            Typ intervalu:
          </label>
          <div className="btn-group">
            {[
              ["left", "Ľavostranný"],
              ["two", "Obojstranný"],
              ["right", "Pravostranný"],
            ].map(([v, label], i, arr) => (
              <button
                key={v}
                type="button"
                className={`btn btn-sm btn-outline-primary px-3 ${type === v ? "active" : ""}
                  ${i === 0 ? "rounded-start-pill" : i === arr.length - 1 ? "rounded-end-pill" : ""}`}
                onClick={() => setType(v)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <div className="d-flex flex-column align-items-center">
          <label className="form-label fw-bold mb-2 small text-center">
            Rozptyl populácie:
          </label>
          <div className="btn-group">
            {[
              [true, "σ známe (Z)"],
              [false, "σ neznáme (t)"],
            ].map(([v, label], i) => (
              <button
                key={String(v)}
                type="button"
                className={`btn btn-sm btn-outline-primary px-3 ${knowSigma === v ? "active" : ""}
                  ${i === 0 ? "rounded-start-pill" : "rounded-end-pill"}`}
                onClick={() => setKnowSigma(v)}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Draw buttons + slider in one row ── */}
      <div className="d-flex flex-wrap align-items-center justify-content-center gap-3 mb-4">
        <div className="d-flex align-items-center gap-2">
          <label className="fw-bold small mb-0 text-nowrap">
            n = <span className="text-primary">{n}</span>
          </label>
          <input
            type="range"
            className="form-range mb-0"
            min={5}
            max={200}
            step={5}
            value={n}
            onChange={(e) => setN(Number(e.target.value))}
            style={{ width: 130 }}
          />
        </div>
        <div className="btn-group rounded-pill overflow-hidden">
          {[1, 5, 10].map((cnt, i, arr) => (
            <button
              key={cnt}
              type="button"
              className="btn btn-primary btn-sm px-3"
              style={
                i < arr.length - 1
                  ? { borderRight: "1px solid rgba(255,255,255,0.3)" }
                  : {}
              }
              onClick={() => draw(cnt)}
            >
              + {cnt}
            </button>
          ))}
        </div>
        <span
          className="fw-bold text-success bg-success-subtle px-3 py-1 rounded-pill"
          style={{ fontSize: "0.9rem" }}
        >
          {total} výberov
        </span>
        <ResetButton
          onClick={() => setRawSamples([])}
          disabled={total === 0}
          title="Vymazať všetky výbery"
        />
      </div>

      {/* ── Coverage — StatsBadge style ── */}
      {total > 0 && (
        <div
          className="bg-body-tertiary border shadow-sm rounded-4 px-3 py-2 mb-4"
          style={{ fontSize: "0.88rem", display: "inline-block" }}
        >
          <div className="d-flex flex-wrap justify-content-center align-items-stretch gap-0">
            <div className="d-flex align-items-baseline gap-1 px-2 py-1">
              <span className="text-muted">Obsahuje μ:</span>
              <strong className="text-success">
                {hits} ({((hits / total) * 100).toFixed(1)} %)
              </strong>
            </div>
            <div className="d-none d-sm-block mx-2 border-start align-self-stretch" />
            <div className="d-flex align-items-baseline gap-1 px-2 py-1">
              <span className="text-muted">Neobsahuje μ:</span>
              <strong className="text-danger">
                {total - hits} ({(((total - hits) / total) * 100).toFixed(1)} %)
              </strong>
            </div>
            <div className="d-none d-sm-block mx-2 border-start align-self-stretch" />
            <div className="d-flex align-items-baseline gap-1 px-2 py-1">
              <span className="text-muted">Teoretická pokryvnosť:</span>
              <strong className="text-body">{cl} %</strong>
            </div>
          </div>
        </div>
      )}

      {/* ── Charts: side-by-side on md+, stacked on mobile ── */}
      <div className="charts-wrapper w-100" style={{ maxWidth: 1100 }}>
        {/* Distribution chart */}
        <div>
          <h6 className="text-center mb-1" style={{ fontSize: "0.88rem" }}>
            {knowSigma ? "N(0,1)" : `t(${n - 1})`} — kritické oblasti a{" "}
            {knowSigma ? "z" : "t"}-skóre výberov
          </h6>
          <div
            className="d-flex gap-3 justify-content-center mb-1"
            style={{ fontSize: "0.8rem" }}
          >
            <span style={{ color: "var(--bs-danger)" }}>
              ■ kritická oblasť (α)
            </span>
            <span style={{ color: "var(--bs-success)" }}>
              │ {knowSigma ? "z" : "t"}-skóre posl. výberu
            </span>
          </div>
          <DistributionChart
            cl={cl}
            type={type}
            knowSigma={knowSigma}
            n={n}
            lastZScore={lastZScore}
            allZScores={allZScores}
            computedSamples={computedSamples}
          />
        </div>

        {/* CI chart */}
        <div>
          <h6 className="text-center mb-2" style={{ fontSize: "0.88rem" }}>
            Intervaly spoľahlivosti ({cl} %) — μ = {POP_MEAN} r.
          </h6>
          <div
            className="d-flex gap-3 justify-content-center mb-2"
            style={{ fontSize: "0.8rem" }}
          >
            <span style={{ color: "var(--bs-success)" }}>— obsahuje μ</span>
            <span style={{ color: "var(--bs-danger)" }}>— neobsahuje μ</span>
            <span style={{ color: "var(--bs-body-color)", opacity: 0.6 }}>
              ● x̄
            </span>
          </div>
          <CIChart samples={computedSamples} />
        </div>
      </div>

      {/* ── Formula toggle ── */}
      <div className="w-100 mt-4" style={{ maxWidth: 1100 }}>
        <button
          type="button"
          className="btn btn-outline-secondary btn-sm rounded-pill px-4 d-block mx-auto mb-1"
          onClick={() => setShowFormula((v) => !v)}
        >
          {showFormula ? "Skryť vzorec ▲" : "Zobraziť vzorec a výpočet ▼"}
        </button>
        <div
          style={{
            display: "grid",
            gridTemplateRows: showFormula ? "1fr" : "0fr",
            transition: "grid-template-rows 0.3s ease",
          }}
        >
          <div style={{ overflow: "hidden" }}>
            <FormulaPanel
              cl={cl}
              type={type}
              knowSigma={knowSigma}
              lastSample={lastSample}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfidenceIntervalSimulation;
