import React, { useState, useMemo } from "react";
import { ReferenceArea, ReferenceLine } from "recharts";
import StyledLineChart from "../../charts/helpers/StyledLineChart";
import AnimatedRefLine from "../../charts/helpers/AnimatedRefLine";
import { normalPDF, studentTPDF } from "../../../utils/distributions";
import { getCrit, POP_MEAN, POP_STD } from "../../../utils/ciMath";

const DIST_STEPS = 300;
const CLAMP_MIN = 41;
const CLAMP_MAX = 51;

/**
 * @component CIDistributionChart
 * @description Visualizes the sampling distribution of the mean for confidence interval simulations.
 * Shows critical regions, previous sample means, and highlights the latest drawn sample.
 * @param {Object} props
 * @param {number} props.cl - Confidence level (e.g., 0.95 for 95%).
 * @param {string} props.type - Interval type ("two-sided", "left", "right").
 * @param {boolean} props.knowSigma - Indicates if population standard deviation is known.
 * @param {number} props.n - Sample size.
 * @param {number|null} props.lastMean - The mean of the most recently generated sample.
 * @param {Array<number>} props.allMeans - Historical array of generated sample means.
 * @param {Array<Object>} props.computedSamples - Data objects for samples, tracking if they hit/contain the population mean.
 * @param {Function} props.t - i18n translation function.
 */
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

  // Calculate degrees of freedom and Standard Error of the Mean (SEM)
  const df = n - 1;
  const sem = POP_STD / Math.sqrt(n);

  // Retrieve the critical value (Z or T) based on distribution type and confidence level
  const critZ = getCrit(cl, type, knowSigma, df);

  // Calculate the bounds for the critical regions
  const critLow = POP_MEAN - critZ * sem;
  const critHigh = POP_MEAN + critZ * sem;

  /**
   * Selects and normalizes the correct Probability Density Function (PDF).
   * Uses Standard Normal if population variance is known, otherwise Student's T.
   */
  const pdfFn = useMemo(() => {
    return (x) => {
      const z = (x - POP_MEAN) / sem;
      const prob = knowSigma ? normalPDF(z) : studentTPDF(z, df);
      return prob / sem; // Scale probability by SEM for correct density height
    };
  }, [knowSigma, df, sem]);

  // Generate data points for the distribution curve within clamped bounds
  const data = useMemo(() => {
    const arr = [];
    const step = (CLAMP_MAX - CLAMP_MIN) / DIST_STEPS;
    for (let i = 0; i <= DIST_STEPS; i++) {
      const x = CLAMP_MIN + i * step;
      arr.push({ x, y: pdfFn(x) });
    }
    return arr;
  }, [pdfFn]);

  // Determine dynamic Y-axis maximum to keep the chart scaled nicely
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
      {/* Left critical (rejection) area */}
      {type !== "left" && (
        <ReferenceArea
          x1={CLAMP_MIN}
          x2={critLow}
          fill="var(--bs-danger)"
          fillOpacity={0.15}
        />
      )}
      {/* Right critical (rejection) area */}
      {type !== "right" && (
        <ReferenceArea
          x1={critHigh}
          x2={CLAMP_MAX}
          fill="var(--bs-danger)"
          fillOpacity={0.15}
        />
      )}

      {/* Boundary labels for critical limits */}
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

      {/* Render historical sample means, colored by hit/miss status */}
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

      {/* Animated emphasis line for the most recently generated sample */}
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
