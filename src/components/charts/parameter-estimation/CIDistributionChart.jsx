import React, { useState, useMemo } from "react";
import { ReferenceArea, ReferenceLine } from "recharts";
import StyledLineChart from "../../charts/helpers/StyledLineChart";
import AnimatedRefLine from "../../charts/helpers/AnimatedRefLine";
import {
  normalPDF,
  studentTPDF,
  normalCDF,
  studentTCDF,
} from "../../../utils/distributions";
import { getCrit } from "../../../utils/ciMath";

const DIST_STEPS = 300;

function CIDistributionChart({
  cl,
  type,
  knowSigma,
  n,
  lastZScore,
  allZScores,
  computedSamples,
  t,
}) {
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

  const extraRows = useMemo(() => {
    if (hoverX === null) return [];
    return [
      {
        label: t(
          "parameterEstimation.intervalEstimation.simulation.charts.tooltipF",
          { score: knowSigma ? "z" : "t" },
        ),
        value: `${(cdfFn(hoverX) * 100).toFixed(2)} %`,
        color: "var(--bs-secondary-color)",
      },
    ];
  }, [hoverX, cdfFn, knowSigma, t]);

  const lastHit = computedSamples[0]?.hit ?? true;
  const lastScoreColor = lastHit ? "var(--bs-success)" : "var(--bs-danger)";

  return (
    <StyledLineChart
      data={data}
      xLabel={t(
        "parameterEstimation.intervalEstimation.simulation.charts.xLabelDist",
        {
          score: knowSigma ? "z" : "t",
          dist: knowSigma ? "N(0,1)" : `t(${df})`,
        },
      )}
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
      height={220}
      margin={{ top: 10, right: 30, left: 20, bottom: 5 }}
    >
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

      {lastZScore !== null && lastZScore >= -4 && lastZScore <= 4 && (
        <ReferenceLine
          x={lastZScore}
          shape={
            <AnimatedRefLine
              lineColor={lastScoreColor}
              labelText={`${knowSigma ? "z" : "t"} = ${lastZScore.toFixed(2)}`}
              labelPosition={lastZScore > 1.5 ? "left" : "right"}
            />
          }
        />
      )}
    </StyledLineChart>
  );
}

export default CIDistributionChart;
