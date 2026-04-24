//src/utils/ciMath.js

/**
 * @file ciMath.js
 * @description Mathematical utility module for Confidence Interval (CI) calculations.
 * It contains tools for finding critical values using numerical methods and
 * logic for simulating the "coverage" of the population mean by sample intervals.
 */

import { normalCDF, studentTCDF } from "./distributions";

/** * Constants defining the population parameters.
 * Derived from demographic data (e.g., median age across EU regions).
 */
export const POP_MEAN = 46.2226;
export const POP_STD = 3.7576;

/**
 * @function binSearch
 * @description Generic implementation of binary search (bisection method)
 * to find the root of a function. Used to calculate inverse distribution
 * functions (quantiles).
 * @param {Function} fn - The Cumulative Distribution Function (CDF) to invert.
 * @param {number} p - The target probability (quantile).
 * @param {number} lo - Lower bound for the search.
 * @param {number} hi - Upper bound for the search.
 * @returns {number} The found value x where fn(x) ≈ p.
 */
const binSearch = (fn, p, lo, hi) => {
  let mid;
  for (let i = 0; i < 80; i++) {
    mid = (lo + hi) / 2;
    fn(mid) < p ? (lo = mid) : (hi = mid);
  }
  return mid;
};

/**
 * @function invNorm
 * @description Inverse function for the Standard Normal Distribution N(0,1).
 * Calculates the critical z-score for a given probability.
 */
export const invNorm = (p) => binSearch((x) => normalCDF(x), p, -6, 6);

/**
 * @function invT
 * @description Inverse function for the Student's t-distribution.
 * Calculates the critical t-score for a given probability and degrees of freedom.
 */
export const invT = (p, df) => binSearch((x) => studentTCDF(x, df), p, 0, 30);

/**
 * @function getCrit
 * @description Determines the critical value (z or t) based on interval parameters.
 * @param {number} cl - Confidence level percentage (90, 95, 99).
 * @param {string} type - Interval type ("two" - two-sided, "left"/"right" - one-sided).
 * @param {boolean} knowSigma - Whether population standard deviation is known (chooses between z and t).
 * @param {number} df - Degrees of freedom (n - 1).
 * @returns {number} The critical value.
 */
export const getCrit = (cl, type, knowSigma, df) => {
  const alpha = { 90: 0.1, 95: 0.05, 99: 0.01 }[cl];
  const p = type === "two" ? 1 - alpha / 2 : 1 - alpha;
  return knowSigma ? invNorm(p) : invT(p, df);
};

/**
 * @function buildCI
 * @description Full constructor for a Confidence Interval of the sample mean.
 * @param {number} mean - Sample mean (x̄).
 * @param {number} sd - Sample standard deviation (s).
 * @param {number} n - Sample size.
 * @param {number} cl - Confidence level (90, 95, 99).
 * @param {string} type - Interval type.
 * @param {boolean} knowSigma - Decides whether to use population (σ) or sample (s) deviation.
 * @returns {Object} Object containing interval bounds, critical value, standard error,
 * and a "hit" boolean indicating if the interval covers the actual population mean.
 */
export const buildCI = (mean, sd, n, cl, type, knowSigma) => {
  // Calculate Standard Error of the mean
  const se = (knowSigma ? POP_STD : sd) / Math.sqrt(n);

  // Get critical value (z-score or t-score)
  const crit = getCrit(cl, type, knowSigma, n - 1);

  // Calculate lower and upper bounds of the interval
  const lower = type === "right" ? -Infinity : mean - crit * se;
  const upper = type === "left" ? Infinity : mean + crit * se;

  // Verify if the interval covers the known population mean (used in simulations)
  const hit =
    (lower === -Infinity || lower <= POP_MEAN) &&
    (upper === Infinity || POP_MEAN <= upper);

  return { lower, upper, hit, crit, se };
};
