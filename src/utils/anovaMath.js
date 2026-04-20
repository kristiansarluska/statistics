// src/utils/anovaMath.js

/**
 * @file anovaMath.js
 * @description A utility library providing mathematical and statistical functions for ANOVA simulations.
 * It includes random number generation using the Box-Muller transform, Gaussian Kernel Density Estimation (KDE)
 * for smoothing histograms, and the complete engine for One-Way ANOVA calculations (Sum of Squares,
 * Mean Squares, F-statistic) and Tukey's Honestly Significant Difference (HSD) post-hoc testing.
 */

/**
 * @function randomNormal
 * @description Generates a random number following a normal distribution.
 * Uses the Box-Muller transform to convert uniform random numbers into normally distributed values.
 * @param {number} mean - The desired average of the distribution.
 * @param {number} std - The standard deviation (spread) of the distribution.
 * @returns {number} A single normally distributed random value.
 */
export const randomNormal = (mean, std) => {
  let u = 0,
    v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num * std + mean;
};

/**
 * Generates an array of n samples from a normal distribution
 */
export const generateSample = (mean, std, n) => {
  return Array.from({ length: n }, () => randomNormal(mean, std));
};

/**
 * Calculates Gaussian Kernel Density Estimation (KDE)
 */
export const calculateKDE = (data, bandwidth, xMin, xMax, steps = 100) => {
  const stepSize = (xMax - xMin) / steps;
  const kdePoints = [];
  const n = data.length;

  const gaussianKernel = (x) =>
    (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * x * x);

  for (let i = 0; i <= steps; i++) {
    const x = xMin + i * stepSize;
    let sum = 0;
    for (let j = 0; j < n; j++) {
      sum += gaussianKernel((x - data[j]) / bandwidth);
    }
    kdePoints.push({ x, y: sum / (n * bandwidth) });
  }
  return kdePoints;
};

/**
 * Calculates One-Way ANOVA statistics
 * @param {Array<Array<number>>} groups Array of arrays containing raw data for each group
 */
export const calculateANOVA = (groups) => {
  let grandSum = 0;
  let totalN = 0;

  const groupStats = groups.map((g) => {
    const n = g.length;
    const sum = g.reduce((a, b) => a + b, 0);
    const mean = sum / n;
    grandSum += sum;
    totalN += n;
    return { n, mean, data: g };
  });

  const grandMean = grandSum / totalN;

  let sst = 0,
    ssw = 0,
    ssb = 0;

  groupStats.forEach((g) => {
    ssb += g.n * Math.pow(g.mean - grandMean, 2);
    g.data.forEach((val) => {
      ssw += Math.pow(val - g.mean, 2);
      sst += Math.pow(val - grandMean, 2);
    });
  });

  const dfB = groups.length - 1;
  const dfW = totalN - groups.length;
  const msB = ssb / dfB;
  const msW = ssw / dfW;
  const fStat = msB / msW;

  return { sst, ssw, ssb, dfB, dfW, msB, msW, fStat, groupStats };
};

/**
 * Calculates Tukey HSD Post-hoc comparisons
 * Note: qCritical is approximated for k=3, df=90 (n=31 per group), alpha=0.05
 */
export const calculateTukeyHSD = (groupStats, msW) => {
  const qCritical = 3.38;
  const results = [];

  for (let i = 0; i < groupStats.length; i++) {
    for (let j = i + 1; j < groupStats.length; j++) {
      const g1 = groupStats[i];
      const g2 = groupStats[j];

      const meanDiff = g1.mean - g2.mean;
      const absMeanDiff = Math.abs(meanDiff);
      const se = Math.sqrt((msW / 2) * (1 / g1.n + 1 / g2.n));
      const hsd = qCritical * se;

      results.push({
        group1: i,
        group2: j,
        meanDiff,
        hsd,
        isSignificant: absMeanDiff > hsd,
        ciLower: meanDiff - hsd,
        ciUpper: meanDiff + hsd,
      });
    }
  }
  return results;
};
