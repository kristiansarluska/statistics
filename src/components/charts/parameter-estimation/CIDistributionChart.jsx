import React, { useState, useMemo } from "react";
import { ReferenceArea, ReferenceLine } from "recharts";
import StyledLineChart from "../../charts/helpers/StyledLineChart";
import AnimatedRefLine from "../../charts/helpers/AnimatedRefLine";
import { normalPDF, studentTPDF } from "../../../utils/distributions";
import { getCrit, POP_MEAN, POP_STD } from "../../../utils/ciMath";

const DIST_STEPS = 300;
const CLAMP_MIN = 41;
const CLAMP_MAX = 51;

function CIDistributionChart({
  cl,
  type,
  knowSigma,
  n,
  lastMean,
  allMeans,
  computedSamples,
  t,
}) {
  const [hoverX, setHoverX] = useState(null);
  const df = n - 1;
  const sem = POP_STD / Math.sqrt(n);
  const critZ = getCrit(cl, type, knowSigma, df);

  const critLow = POP_MEAN - critZ * sem;
  const critHigh = POP_MEAN + critZ * sem;

  const pdfFn = useMemo(() => {
    return (x) => {
      const z = (x - POP_MEAN) / sem;
      const prob = knowSigma ? normalPDF(z) : studentTPDF(z, df);
      return prob / sem;
    };
  }, [knowSigma, df, sem]);

  const data = useMemo(() => {
    const arr = [];
    const step = (CLAMP_MAX - CLAMP_MIN) / DIST_STEPS;
    for (let i = 0; i <= DIST_STEPS; i++) {
      const x = CLAMP_MIN + i * step;
      arr.push({ x, y: pdfFn(x) });
    }
    return arr;
  }, [pdfFn]);

  const maxY = useMemo(() => {
    const peak = knowSigma ? normalPDF(0) : studentTPDF(0, df);
    return (peak / sem) * 1.15;
  }, [sem, knowSigma, df]);

  return (
    <StyledLineChart
      data={data}
      minX={CLAMP_MIN}
      maxX={CLAMP_MAX}
      yAxisDomain={[0, maxY]}
      hoverX={hoverX}
      setHoverX={setHoverX}
      xLabel={t(
        "parameterEstimation.intervalEstimation.simulation.charts.xAxisLabel",
      )}
    >
      {type !== "left" && (
        <ReferenceArea
          x1={CLAMP_MIN}
          x2={critLow}
          fill="var(--bs-danger)"
          fillOpacity={0.15}
        />
      )}
      {type !== "right" && (
        <ReferenceArea
          x1={critHigh}
          x2={CLAMP_MAX}
          fill="var(--bs-danger)"
          fillOpacity={0.15}
        />
      )}

      {type !== "left" && (
        <ReferenceLine
          x={critLow}
          stroke="var(--bs-danger)"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          label={{
            value: `-${critZ.toFixed(2)}`,
            position: "top",
            fontSize: 10,
            fill: "var(--bs-danger)",
          }}
        />
      )}
      {type !== "right" && (
        <ReferenceLine
          x={critHigh}
          stroke="var(--bs-danger)"
          strokeWidth={1.5}
          strokeDasharray="4 3"
          label={{
            value: `+${critZ.toFixed(2)}`,
            position: "top",
            fontSize: 10,
            fill: "var(--bs-danger)",
          }}
        />
      )}

      {allMeans &&
        allMeans.slice(1).map((m, i) => {
          if (m < CLAMP_MIN || m > CLAMP_MAX) return null;
          const hit = computedSamples[i + 1]?.hit;
          return (
            <ReferenceLine
              key={i}
              x={m}
              stroke={hit ? "var(--bs-success)" : "var(--bs-danger)"}
              strokeWidth={1.5}
              opacity={0.35}
            />
          );
        })}

      {lastMean !== null && lastMean >= CLAMP_MIN && lastMean <= CLAMP_MAX && (
        <ReferenceLine
          x={lastMean}
          stroke={
            computedSamples[0]?.hit ? "var(--bs-success)" : "var(--bs-danger)"
          }
          shape={
            <AnimatedRefLine
              color={
                computedSamples[0]?.hit
                  ? "var(--bs-success)"
                  : "var(--bs-danger)"
              }
            />
          }
        />
      )}
    </StyledLineChart>
  );
}

export default CIDistributionChart;
