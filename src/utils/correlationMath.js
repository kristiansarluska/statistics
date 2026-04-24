//src/utils/correlationMath.js

/**
 * @file correlationMath.js
 * @description Utility module for correlation analysis. Provides functions for
 * generating synthetic correlated datasets, calculating Pearson and Spearman
 * coefficients, and performing significance testing.
 */

/**
 * @function normalCDF
 * @description Numerical approximation of the Standard Normal Cumulative Distribution Function.
 * Used here for p-value estimation in correlation significance testing.
 */
const normalCDF = (x) => {
  const t = 1 / (1 + 0.2316419 * Math.abs(x));
  const d = 0.3989423 * Math.exp((-x * x) / 2);
  const p =
    d *
    t *
    (0.3193815 +
      t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
  return x > 0 ? 1 - p : p;
};

/**
 * @function generateCorrelatedData
 * @description Generates a set of (x, y) points with a specific correlation coefficient.
 * Uses the Box-Muller transform to generate independent normal variables, then
 * applies a linear transformation to introduce the target correlation (r).
 * @param {number} n - Number of data points to generate.
 * @param {number} targetR - The desired Pearson correlation coefficient (-1 to 1).
 * @returns {Array<{x: number, y: number}>} Array of generated coordinate objects.
 */
export const generateCorrelatedData = (n, targetR) => {
  const data = [];
  for (let i = 0; i < n; i++) {
    let u1 = Math.random();
    let u2 = Math.random();
    while (u1 === 0) u1 = Math.random();

    // Box-Muller transform for independent standard normal variables z1, z2
    const z1 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    const z2 = Math.sqrt(-2.0 * Math.log(u1)) * Math.sin(2.0 * Math.PI * u2);

    // Correlate variables: y depends on z1 via targetR and introduces noise via z2
    const x = z1;
    const y = targetR * z1 + Math.sqrt(1 - targetR * targetR) * z2;

    // Scale and shift for visualization (centered around 50, spread of 15)
    data.push({
      x: x * 15 + 50,
      y: y * 15 + 50,
    });
  }
  return data;
};

/**
 * @function calculatePearson
 * @description Calculates the Pearson product-moment correlation coefficient (r).
 * Measures the linear relationship between two quantitative variables.
 * @param {Array<{x: number, y: number}>} data - The dataset to analyze.
 * @returns {number} Pearson's r, ranging from -1 to 1.
 */
export const calculatePearson = (data) => {
  const n = data.length;
  if (n === 0) return 0;

  const sumX = data.reduce((acc, val) => acc + val.x, 0);
  const sumY = data.reduce((acc, val) => acc + val.y, 0);
  const meanX = sumX / n;
  const meanY = sumY / n;

  let num = 0,
    denX = 0,
    denY = 0;
  for (let i = 0; i < n; i++) {
    const dx = data[i].x - meanX;
    const dy = data[i].y - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }

  if (denX === 0 || denY === 0) return 0;
  return num / Math.sqrt(denX * denY);
};

/**
 * @function calculateCorrelationSignificance
 * @description Tests the null hypothesis that the true correlation is zero.
 * Calculates a t-statistic and approximates the p-value using the Normal distribution.
 * @param {number} r - The calculated correlation coefficient.
 * @param {number} n - The sample size.
 * @returns {Object} { tStat, pValue }
 */
export const calculateCorrelationSignificance = (r, n) => {
  if (n <= 2) return { tStat: 0, pValue: 1 };

  // Avoid division by zero at perfect correlation
  const safeR = Math.max(Math.min(r, 0.9999), -0.9999);
  const tStat = (safeR * Math.sqrt(n - 2)) / Math.sqrt(1 - safeR * safeR);

  // Approximation of p-value via normal distribution (two-tailed)
  const pValue = 2 * (1 - normalCDF(Math.abs(tStat)));

  return { tStat, pValue };
};

/**
 * @function calculateSpearman
 * @description Calculates the Spearman rank correlation coefficient (rho).
 * Measures the monotonic relationship by calculating Pearson correlation on the ranks of the data.
 * Useful for non-linear relationships and data with outliers.
 * @param {Array<{x: number, y: number}>} data - The dataset to analyze.
 * @returns {number} Spearman's rho, ranging from -1 to 1.
 */
export const calculateSpearman = (data) => {
  const n = data.length;
  if (n <= 1) return 0;

  /**
   * Helper function to assign ranks to values.
   * Ties are handled by assigning the average of the ranks that would have been assigned.
   */
  const assignRanks = (arr, key) => {
    const sorted = [...arr]
      .map((item, i) => ({ val: item[key], originalIndex: i }))
      .sort((a, b) => a.val - b.val);
    const ranks = new Array(n);
    let i = 0;

    while (i < n) {
      let j = i;
      let sum = 0;
      while (j < n && sorted[j].val === sorted[i].val) {
        sum += j + 1; // 1-based rank
        j++;
      }
      const avgRank = sum / (j - i);
      for (let k = i; k < j; k++) {
        ranks[sorted[k].originalIndex] = avgRank;
      }
      i = j;
    }
    return ranks;
  };

  const xRanks = assignRanks(data, "x");
  const yRanks = assignRanks(data, "y");

  let sumDSquared = 0;
  for (let i = 0; i < n; i++) {
    const d = xRanks[i] - yRanks[i];
    sumDSquared += d * d;
  }

  // Spearman formula: 1 - (6 * Σd²) / (n * (n² - 1))
  return 1 - (6 * sumDSquared) / (n * (n * n - 1));
};
